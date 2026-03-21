"""
AI Humanizer — generates application-question answers that read as genuinely
human-written, defeating AI detectors (Turnitin, GPTZero, Copyleaks, etc.).

Detection signals we actively counter:

1. **Low perplexity** – AI picks the most-probable next token, producing
   smooth, predictable prose.  We inject unexpected but natural word choices,
   idioms, and occasional colloquialisms.

2. **Low burstiness** – AI sentences cluster around the same length.  We
   deliberately vary sentence length: short punchy fragments, medium
   statements, and longer multi-clause constructions.

3. **Uniform paragraph structure** – AI loves intro→body→conclusion in every
   paragraph.  We break that pattern by opening with examples, questions, or
   anecdotes.

4. **Transition-word spam** – "Furthermore", "Moreover", "Additionally"
   repeating in predictable patterns.  We ban these and use conversational
   connectors or no connectors at all.

5. **Over-hedging / politeness** – "It is important to note that…", "It
   should be highlighted that…".  We strip these filler constructions.

6. **Passive voice overuse** – AI defaults to passive.  We prefer active,
   first-person statements.

7. **Perfect grammar** – Humans occasionally use sentence fragments, start
   with "And" or "But", use contractions, and bend rules.  We do the same.

8. **Homogeneous vocabulary** – AI reuses the same register.  We mix
   registers: some sentences slightly formal, others conversational.

9. **Lack of specificity** – AI is vague.  We anchor answers in concrete
   details from the candidate's CV and the vacancy.

10. **Missing personal voice** – AI has no "I".  We write in first person
    with genuine-sounding reflections.
"""

import os
import random

import anthropic

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")


def _get_client() -> anthropic.AsyncAnthropic:
    return anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)


# ── Banned patterns that scream "AI-generated" ──────────────────────────
BANNED_TRANSITIONS = [
    "furthermore",
    "moreover",
    "additionally",
    "in addition",
    "it is important to note",
    "it should be noted",
    "it is worth mentioning",
    "in conclusion",
    "to summarize",
    "in summary",
    "it is crucial",
    "it is essential",
    "delve",
    "delving",
    "in today's world",
    "in today's rapidly",
    "leveraging",
    "utilize",
    "utilizing",
    "multifaceted",
    "holistic",
    "synergy",
    "paradigm",
    "facilitate",
    "endeavor",
    "aforementioned",
    "comprehensive",
    "underscore",
    "underscores",
    "pivotal",
    "navigate",
    "navigating",
    "landscape",
    "tapestry",
    "realm",
    "foster",
    "fostering",
    "embark",
    "embarking",
    "commendable",
    "noteworthy",
    "aligns with",
    "resonates with",
    "shed light",
]

# ── Sentence-length targets for burstiness ──────────────────────────────
# Human writing has high variance.  We aim for a mix:
SENTENCE_LENGTH_GUIDANCE = """
Mix sentence lengths aggressively:
- Some sentences should be very short (3-8 words). "That changed everything."
- Some medium (10-18 words).
- Occasional long ones (20-35 words) with natural subordinate clauses.
- NEVER write 3+ consecutive sentences of similar length.
"""

# ── The system prompt that encodes all anti-detection rules ─────────────
HUMANIZER_SYSTEM_PROMPT = """You are a human applicant writing answers to job
application questions. You write EXACTLY as a real, educated professional would
— not as an AI assistant.

CRITICAL RULES — violating any of these makes the text detectable:

1. PERPLEXITY: Use unexpected but natural word choices. Don't always pick the
   most obvious word. A human might say "I got thrown into" instead of
   "I was assigned to". Surprise the reader occasionally.

2. BURSTINESS: Vary sentence lengths dramatically. Short sentences. Then a
   longer one that winds through a couple of clauses before landing on the
   point. Then medium. Never three similar-length sentences in a row.

3. NO AI TRANSITIONS: NEVER use: Furthermore, Moreover, Additionally, In
   addition, It is important to note, It should be noted, In conclusion, To
   summarize, Delve/delving, Utilize/utilizing, Leverage/leveraging,
   Multifaceted, Holistic, Synergy, Paradigm, Facilitate, Endeavor,
   Aforementioned, Comprehensive, Underscore, Pivotal, Navigate/navigating,
   Landscape, Tapestry, Realm, Foster/fostering, Embark, Commendable,
   Noteworthy, Aligns with, Resonates with.
   Instead use natural connectors: "And", "But", "So", "That said", "Still",
   "Thing is", "The way I see it", "On top of that", or just start a new
   sentence with no connector at all.

4. ACTIVE VOICE + FIRST PERSON: Write "I managed a team of 12" not "A team
   of 12 was managed". Use "I", "my", "we", "our" naturally.

5. CONTRACTIONS: Use them. "I've", "didn't", "wasn't", "can't", "it's".
   Humans use contractions in professional writing. Not every sentence, but
   regularly.

6. IMPERFECT GRAMMAR (subtle): Occasionally start sentences with "And" or
   "But". Use a sentence fragment for emphasis. End a sentence with a
   preposition if it sounds more natural. This isn't a school essay.

7. CONCRETE DETAILS: Always anchor claims in specific examples, numbers,
   project names, or situations from the candidate's experience. Vagueness
   is an AI tell.

8. PERSONAL VOICE: Include brief genuine-sounding reflections. "Looking back,
   that project taught me more about stakeholder management than any training
   course." or "Honestly, the hardest part was convincing the finance team."

9. PARAGRAPH STRUCTURE: Do NOT follow intro→body→conclusion in every
   paragraph. Start some paragraphs with an example or anecdote. Some with a
   question. Some with a direct statement.

10. REGISTER MIXING: Most sentences should be professional but natural.
    Occasionally drop in a slightly informal phrase: "it was a steep learning
    curve", "that was a game-changer", "I hit the ground running".

11. NO OVER-HEDGING: Don't write "It is essential to emphasize that..." or
    "One could argue that...". Just say it directly.

12. WORD CHOICE VARIETY: Don't repeat the same adjective or adverb within 3
    sentences. If you said "significant", use "major" or "big" next time, or
    just drop the adjective entirely.

13. NATURAL FLOW: Don't number your points unless the question explicitly asks
    for a list. Write in flowing prose paragraphs.

FORMATTING:
- Write in paragraphs, not bullet points (unless explicitly asked).
- No headers or markdown formatting.
- Length should match what a real human would write: usually 150-400 words per
  question answer, unless specified otherwise.
"""


async def generate_application_answer(
    question: str,
    cv_text: str,
    vacancy_title: str,
    vacancy_org: str,
    vacancy_description: str = "",
    word_limit: int | None = None,
    language: str = "en",
) -> tuple[str, str]:
    """
    Generate a human-sounding answer to an application question.

    Returns (answer_text, model_used).
    """
    client = _get_client()
    model = "claude-sonnet-4-20250514"

    word_target = word_limit or random.randint(200, 350)

    lang_instruction = ""
    if language != "en":
        lang_instruction = f"\n\nIMPORTANT: Write the answer in {language}. All humanization rules still apply."

    user_prompt = f"""Write an answer to this application question as if YOU are the candidate.

APPLICATION QUESTION:
{question}

VACANCY:
Title: {vacancy_title}
Organization: {vacancy_org}
Description: {vacancy_description[:2000] if vacancy_description else 'Not provided'}

YOUR CV/BACKGROUND:
{cv_text[:3500]}

TARGET LENGTH: approximately {word_target} words (can be slightly more or less — a human wouldn't count exactly).
{lang_instruction}

Remember: Write as a REAL PERSON, not an AI. Use your actual experience from the CV.
No AI-sounding phrases. Vary your sentences. Be specific and concrete.
Sound like someone who actually lived these experiences."""

    message = await client.messages.create(
        model=model,
        max_tokens=2000,
        system=HUMANIZER_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
        temperature=0.9,
    )

    answer = message.content[0].text

    # Post-process: check for any banned patterns that slipped through
    answer = _post_process(answer)

    return answer, model


def _post_process(text: str) -> str:
    """
    Post-processing pass to catch any AI-isms that slipped through the prompt.
    """
    import re

    # Replace common AI transitions that might have slipped through
    replacements = {
        r"\bFurthermore\b": "And",
        r"\bMoreover\b": "On top of that",
        r"\bAdditionally\b": "Also",
        r"\bIn addition\b": "Also",
        r"\bIt is important to note that\b": "",
        r"\bIt should be noted that\b": "",
        r"\bIt is worth mentioning that\b": "",
        r"\bIn conclusion\b": "Looking back",
        r"\bTo summarize\b": "All in all",
        r"\bIn summary\b": "All in all",
        r"\butilize\b": "use",
        r"\butilizing\b": "using",
        r"\bUtilize\b": "Use",
        r"\bUtilizing\b": "Using",
        r"\bleverage\b": "use",
        r"\bleveraging\b": "using",
        r"\bLeverage\b": "Use",
        r"\bLeveraging\b": "Using",
        r"\bdelve\b": "dig",
        r"\bdelving\b": "digging",
        r"\bDelve\b": "Dig",
        r"\bDelving\b": "Digging",
        r"\bmultifaceted\b": "complex",
        r"\bholistic\b": "full",
        r"\bparadigm\b": "approach",
        r"\bfacilitate\b": "help with",
        r"\bendeavor\b": "effort",
        r"\baforementioned\b": "earlier",
        r"\bpivotal\b": "key",
        r"\bcommendable\b": "impressive",
        r"\bnoteworthy\b": "worth noting",
    }

    for pattern, replacement in replacements.items():
        text = re.sub(pattern, replacement, text)

    # Clean up any double spaces from removals
    text = re.sub(r"  +", " ", text)
    text = re.sub(r"\n +", "\n", text)
    # Remove empty sentences (just a period after removal)
    text = re.sub(r"\.\s*\.", ".", text)

    return text.strip()


async def humanize_text(text: str) -> tuple[str, str]:
    """
    Take existing AI-generated text and rewrite it to sound human.
    Useful for re-processing cover letters or other generated content.

    Returns (humanized_text, model_used).
    """
    client = _get_client()
    model = "claude-sonnet-4-20250514"

    user_prompt = f"""Rewrite the following text so it sounds like a real human wrote it.
Apply ALL the humanization rules from your instructions.

The meaning and key information must stay the same, but the writing style must
change completely — as if a real person sat down and wrote this from scratch
based on the same information.

TEXT TO HUMANIZE:
{text}

Rewrite it now. Do NOT add any commentary or meta-text — just output the
rewritten version."""

    message = await client.messages.create(
        model=model,
        max_tokens=2000,
        system=HUMANIZER_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
        temperature=0.9,
    )

    result = message.content[0].text
    result = _post_process(result)
    return result, model
