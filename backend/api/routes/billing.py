"""
Stripe billing routes for Profilo.

Endpoints:
  POST /billing/checkout          → create Stripe Checkout session (redirect to Stripe)
  POST /billing/webhook           → handle Stripe webhook events
  GET  /billing/portal            → create Stripe Customer Portal session
  GET  /billing/status            → return current plan + expiry for logged-in user
"""

import os
from datetime import datetime

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.deps import get_current_user, get_db
from backend.api.models import User

router = APIRouter()

# ---------------------------------------------------------------------------
# Stripe config (set via environment variables)
# ---------------------------------------------------------------------------
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Price IDs from your Stripe dashboard — set in .env
PRICE_IDS = {
    "pro": os.getenv("STRIPE_PRICE_PRO", "price_pro_placeholder"),
    "team": os.getenv("STRIPE_PRICE_TEAM", "price_team_placeholder"),
}

PLAN_LIMITS = {
    "free": 3,   # matches per week
    "pro": None, # unlimited
    "team": None,
}


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class CheckoutRequest(BaseModel):
    plan: str  # "pro" | "team"


class CheckoutResponse(BaseModel):
    checkout_url: str


class BillingStatus(BaseModel):
    plan: str
    weekly_matches_used: int
    weekly_matches_limit: int | None
    plan_expires_at: str | None


# ---------------------------------------------------------------------------
# Helper: get or create Stripe customer
# ---------------------------------------------------------------------------
async def _get_or_create_stripe_customer(user: User, db: AsyncSession) -> str:
    if user.stripe_customer_id:
        return user.stripe_customer_id

    customer = stripe.Customer.create(
        email=user.email,
        name=user.name or user.email,
        metadata={"user_id": str(user.id)},
    )
    user.stripe_customer_id = customer.id
    db.add(user)
    await db.commit()
    return customer.id


# ---------------------------------------------------------------------------
# POST /billing/checkout
# ---------------------------------------------------------------------------
@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout_session(
    body: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if body.plan not in PRICE_IDS:
        raise HTTPException(status_code=400, detail="Invalid plan. Choose 'pro' or 'team'.")

    price_id = PRICE_IDS[body.plan]
    if price_id.endswith("_placeholder"):
        raise HTTPException(
            status_code=503,
            detail="Stripe price IDs not configured. Set STRIPE_PRICE_PRO / STRIPE_PRICE_TEAM in .env",
        )

    customer_id = await _get_or_create_stripe_customer(current_user, db)

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=f"{FRONTEND_URL}/dashboard?upgrade=success",
        cancel_url=f"{FRONTEND_URL}/pricing?upgrade=cancelled",
        metadata={"user_id": str(current_user.id), "plan": body.plan},
        subscription_data={
            "metadata": {"user_id": str(current_user.id), "plan": body.plan}
        },
    )

    return CheckoutResponse(checkout_url=session.url)


# ---------------------------------------------------------------------------
# GET /billing/portal
# ---------------------------------------------------------------------------
@router.get("/portal")
async def create_billing_portal(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No active subscription found.")

    session = stripe.billing_portal.Session.create(
        customer=current_user.stripe_customer_id,
        return_url=f"{FRONTEND_URL}/settings",
    )
    return {"portal_url": session.url}


# ---------------------------------------------------------------------------
# GET /billing/status
# ---------------------------------------------------------------------------
@router.get("/status", response_model=BillingStatus)
async def get_billing_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from datetime import timedelta
    from sqlalchemy import func

    # Count matches created this week (Monday 00:00 to now)
    now = datetime.utcnow()
    week_start = now - timedelta(days=now.weekday())
    week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)

    from backend.api.models import Match

    result = await db.execute(
        select(func.count()).where(
            Match.user_id == current_user.id,
            Match.created_at >= week_start,
        )
    )
    weekly_used = result.scalar() or 0

    return BillingStatus(
        plan=current_user.plan,
        weekly_matches_used=weekly_used,
        weekly_matches_limit=PLAN_LIMITS.get(current_user.plan),
        plan_expires_at=(
            current_user.plan_expires_at.isoformat()
            if current_user.plan_expires_at
            else None
        ),
    )


# ---------------------------------------------------------------------------
# POST /billing/webhook  (called by Stripe, NOT the user browser)
# ---------------------------------------------------------------------------
@router.post("/webhook", include_in_schema=False)
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: AsyncSession = Depends(get_db),
):
    payload = await request.body()

    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    try:
        event = stripe.Webhook.construct_event(payload, stripe_signature, STRIPE_WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")

    event_type = event["type"]
    data = event["data"]["object"]

    # ------------------------------------------------------------------
    # Subscription activated / renewed → upgrade user plan
    # ------------------------------------------------------------------
    if event_type in ("checkout.session.completed", "invoice.paid"):
        if event_type == "checkout.session.completed":
            customer_id = data.get("customer")
            plan = data.get("metadata", {}).get("plan", "pro")
            subscription_id = data.get("subscription")
        else:  # invoice.paid
            customer_id = data.get("customer")
            subscription_id = data.get("subscription")
            # Fetch plan from subscription metadata
            sub = stripe.Subscription.retrieve(subscription_id)
            plan = sub.get("metadata", {}).get("plan", "pro")

        if customer_id:
            result = await db.execute(
                select(User).where(User.stripe_customer_id == customer_id)
            )
            user = result.scalar_one_or_none()
            if user:
                user.plan = plan
                user.stripe_subscription_id = subscription_id
                user.plan_expires_at = None  # subscription auto-renews
                db.add(user)
                await db.commit()

    # ------------------------------------------------------------------
    # Subscription cancelled / payment failed → downgrade to free
    # ------------------------------------------------------------------
    elif event_type in ("customer.subscription.deleted", "invoice.payment_failed"):
        customer_id = data.get("customer")
        if customer_id:
            result = await db.execute(
                select(User).where(User.stripe_customer_id == customer_id)
            )
            user = result.scalar_one_or_none()
            if user:
                user.plan = "free"
                user.stripe_subscription_id = None
                db.add(user)
                await db.commit()

    return {"received": True}
