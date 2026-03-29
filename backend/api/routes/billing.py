import os
import logging
from datetime import datetime, timedelta

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_db
from backend.api.models import User
from backend.api.routes.auth import get_current_user

logger = logging.getLogger("profilo")
router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

PRICE_IDS = {
    "starter": os.getenv("STRIPE_PRICE_STARTER", ""),
    "pro":     os.getenv("STRIPE_PRICE_PRO", ""),
    "expert":  os.getenv("STRIPE_PRICE_EXPERT", ""),
}

PLAN_LIMITS = {
    "starter": 10,
    "pro":     None,
    "expert":  None,
}


async def _get_or_create_stripe_customer(user: User, db: AsyncSession) -> str:
    if user.stripe_customer_id:
        return user.stripe_customer_id
    customer = stripe.Customer.create(email=user.email, name=user.name or user.email)
    user.stripe_customer_id = customer.id
    await db.commit()
    return customer.id


@router.post("/checkout")
async def create_checkout(
    body: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    plan = body.get("plan", "pro").lower()
    price_id = PRICE_IDS.get(plan)
    if not price_id:
        raise HTTPException(400, f"Unknown plan: {plan}")

    customer_id = await _get_or_create_stripe_customer(current_user, db)
    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        subscription_data={"trial_period_days": 7},
        success_url=f"{FRONTEND_URL}/dashboard?upgraded=1",
        cancel_url=f"{FRONTEND_URL}/pricing",
        metadata={"user_id": str(current_user.id), "plan": plan},
    )
    return {"checkout_url": session.url}


@router.get("/portal")
async def billing_portal(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.stripe_customer_id:
        raise HTTPException(400, "No billing account found")
    session = stripe.billing_portal.Session.create(
        customer=current_user.stripe_customer_id,
        return_url=f"{FRONTEND_URL}/settings",
    )
    return {"portal_url": session.url}


@router.get("/status")
async def billing_status(current_user: User = Depends(get_current_user)):
    return {
        "plan": current_user.plan,
        "weekly_limit": PLAN_LIMITS.get(current_user.plan),
        "plan_expires_at": current_user.plan_expires_at,
    }


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig, WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, "Invalid webhook signature")

    data = event["data"]["object"]

    if event["type"] in ("checkout.session.completed", "invoice.paid"):
        customer_id = data.get("customer")
        plan = None
        if event["type"] == "checkout.session.completed":
            plan = data.get("metadata", {}).get("plan", "pro")
        else:
            # invoice.paid — derive plan from subscription
            sub_id = data.get("subscription")
            if sub_id:
                sub = stripe.Subscription.retrieve(sub_id)
                price_id = sub["items"]["data"][0]["price"]["id"]
                plan = next((k for k, v in PRICE_IDS.items() if v == price_id), "pro")

        result = await db.execute(select(User).where(User.stripe_customer_id == customer_id))
        user = result.scalar_one_or_none()
        if user and plan:
            user.plan = plan
            user.stripe_subscription_id = data.get("subscription")
            user.plan_expires_at = datetime.utcnow() + timedelta(days=35)
            await db.commit()

    elif event["type"] in ("customer.subscription.deleted", "invoice.payment_failed"):
        customer_id = data.get("customer")
        result = await db.execute(select(User).where(User.stripe_customer_id == customer_id))
        user = result.scalar_one_or_none()
        if user:
            user.plan = "free"
            user.stripe_subscription_id = None
            user.plan_expires_at = None
            await db.commit()

    return {"status": "ok"}
