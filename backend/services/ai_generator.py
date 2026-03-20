import os

import anthropic

from backend.api.models import Vacancy

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")


def _get_client() -> anthropic.AsyncAnthropic:
    return anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)


async def generate_cover_letter(cv_text: str, vacancy: Vacancy) -> tuple[str, str]:
    """Generate a tailored cover letter. Returns (content, model_used)."""
    client = _get_client()
    model = "claude-sonnet-4-20250514"

    message = await client.messages.create(
        model=model,
        max_tokens=2000,
        messages=[
            {
                "role": "user",
                "content": f"""Write a professional cover letter for the following vacancy based on the candidate's CV.

VACANCY:
Title: {vacancy.title}
Organization: {vacancy.organization}
Location: {vacancy.location or 'Not specified'}
Description: {vacancy.description or 'Not provided'}

CANDIDATE CV:
{cv_text[:4000]}

INSTRUCTIONS:
- Write a concise, compelling cover letter (max 400 words)
- Highlight relevant experience that matches the vacancy requirements
- Use a professional EU/international organization tone
- Include specific examples from the CV that demonstrate fit
- Address why the candidate is interested in this specific organization
- Do NOT fabricate qualifications not present in the CV""",
            }
        ],
    )

    return message.content[0].text, model


async def generate_cv_optimization(cv_text: str, vacancy: Vacancy) -> tuple[str, str]:
    """Generate CV optimization recommendations. Returns (content, model_used)."""
    client = _get_client()
    model = "claude-sonnet-4-20250514"

    message = await client.messages.create(
        model=model,
        max_tokens=2000,
        messages=[
            {
                "role": "user",
                "content": f"""Analyze the candidate's CV against this vacancy and provide optimization recommendations.

VACANCY:
Title: {vacancy.title}
Organization: {vacancy.organization}
Description: {vacancy.description or 'Not provided'}

CANDIDATE CV:
{cv_text[:4000]}

Provide:
1. MATCH ANALYSIS: Key strengths and gaps
2. MISSING KEYWORDS: Important terms from the vacancy missing in the CV
3. SECTION-BY-SECTION RECOMMENDATIONS: Specific changes to improve match
4. PRIORITY ACTIONS: Top 3 changes that would most improve the application

Be specific and actionable. Reference exact phrases from both the CV and vacancy.""",
            }
        ],
    )

    return message.content[0].text, model
