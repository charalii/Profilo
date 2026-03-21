import os
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import aiosmtplib
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.models import AlertPreference, Match, User, Vacancy

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "alerts@hirescope.app")


async def send_application_status_email(
    user_email: str,
    user_name: str | None,
    job_title: str,
    organization: str,
    old_status: str,
    new_status: str,
) -> None:
    """Notify a candidate when their application status changes."""
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP not configured, skipping application email to %s", user_email)
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"HireScope: Application update — {job_title}"
    msg["From"] = FROM_EMAIL
    msg["To"] = user_email

    text_content = (
        f"Hi {user_name or 'there'},\n\n"
        f"Your application status for {job_title} at {organization} changed "
        f"from {old_status} to {new_status}.\n\n"
        "Log in to HireScope to view details.\n"
    )
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a56db;">Application updated</h2>
        <p>Hi {user_name or 'there'},</p>
        <p>Your application for <strong>{job_title}</strong> at {organization} is now
        <strong>{new_status}</strong> (was {old_status}).</p>
        <p><a href="https://hirescope.app/tracker" style="color: #1a56db;">Open tracker</a></p>
    </body></html>
    """

    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    await aiosmtplib.send(
        msg,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
        use_tls=True,
    )


async def notify_application_status_change(
    *,
    to_email: str,
    candidate_name: str | None,
    job_title: str,
    organization: str,
    old_status: str,
    new_status: str,
) -> None:
    try:
        await send_application_status_email(
            to_email,
            candidate_name,
            job_title,
            organization,
            old_status,
            new_status,
        )
    except Exception as e:
        logger.error("Application status email failed for %s: %s", to_email, e)


async def send_alert_email(user_email: str, user_name: str, matches: list[dict]) -> None:
    """Send a match alert email to a user."""
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP not configured, skipping email to %s", user_email)
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"HireScope: {len(matches)} new job matches for you"
    msg["From"] = FROM_EMAIL
    msg["To"] = user_email

    text_content = f"Hi {user_name or 'there'},\n\n"
    text_content += f"We found {len(matches)} new matches for your profile:\n\n"
    for m in matches[:10]:
        text_content += f"- {m['title']} at {m['organization']} (Score: {m['score']}%)\n"
        text_content += f"  {m['url']}\n\n"
    text_content += "Log in to HireScope to see full details and generate cover letters.\n"

    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a56db;">HireScope Match Alert</h2>
        <p>Hi {user_name or 'there'},</p>
        <p>We found <strong>{len(matches)}</strong> new matches for your profile:</p>
    """
    for m in matches[:10]:
        html_content += f"""
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin: 8px 0;">
            <strong>{m['title']}</strong><br>
            <span style="color: #6b7280;">{m['organization']}</span>
            <span style="background: #dbeafe; color: #1a56db; padding: 2px 8px; border-radius: 12px; margin-left: 8px;">
                {m['score']}% match
            </span><br>
            <a href="{m['url']}" style="color: #1a56db;">View vacancy</a>
        </div>
        """
    html_content += """
        <p><a href="https://hirescope.app/dashboard" style="background: #1a56db; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Go to Dashboard</a></p>
    </body></html>
    """

    msg.attach(MIMEText(text_content, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    await aiosmtplib.send(msg, hostname=SMTP_HOST, port=SMTP_PORT,
                           username=SMTP_USER, password=SMTP_PASSWORD, use_tls=True)


async def send_alerts_for_frequency(frequency: str, db: AsyncSession) -> int:
    """Send alerts for all users with matching frequency. Returns count sent."""
    result = await db.execute(
        select(AlertPreference).where(
            AlertPreference.is_active == True,
            AlertPreference.frequency == frequency,
        )
    )
    prefs = result.scalars().all()
    sent = 0

    for pref in prefs:
        user = await db.get(User, pref.user_id)
        if not user:
            continue

        match_query = select(Match).where(
            Match.user_id == user.id,
            Match.match_score >= pref.min_match_score,
        ).order_by(Match.match_score.desc()).limit(20)

        match_result = await db.execute(match_query)
        user_matches = match_result.scalars().all()
        if not user_matches:
            continue

        match_data = []
        for m in user_matches:
            vacancy = await db.get(Vacancy, m.vacancy_id)
            if vacancy and vacancy.is_active:
                match_data.append({
                    "title": vacancy.title,
                    "organization": vacancy.organization,
                    "url": vacancy.url,
                    "score": m.match_score,
                })

        if match_data:
            try:
                await send_alert_email(user.email, user.name, match_data)
                sent += 1
            except Exception as e:
                logger.error("Failed to send alert to %s: %s", user.email, e)

    return sent
