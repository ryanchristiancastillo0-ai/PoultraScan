import os
import json
import threading
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

print(f"[GROQ DEBUG] GROQ_API_KEY loaded: {'YES (' + GROQ_API_KEY[:6] + '...)' if GROQ_API_KEY else 'NO — key is None/empty!'}")

# Groq Client (OpenAI-compatible, free tier)
client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

CACHE_FILE = os.path.join("static", "cache", "disease_recommendations.json")
os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)

_cache_lock = threading.Lock()

FALLBACK_RECOMMENDATION = (
    "AI-generated recommendations are temporarily unavailable. "
    "Please consult a poultry veterinarian for guidance on this condition."
)
FALLBACK_PREVENTION_TIPS = (
    "Maintain good coop hygiene, proper ventilation, and a balanced diet "
    "as general best practices while this feature is unavailable."
)


class RecommendationError(Exception):
    pass


def _load_cache() -> dict:
    if not os.path.exists(CACHE_FILE):
        return {}

    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}


def _save_cache(cache: dict):
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, indent=2)
    except OSError as e:
        print(f"[CACHE WARNING] Failed to write recommendation cache: {e}")


def get_disease_recommendation(disease_name: str, confidence_score: float) -> dict:
    """
    Uses Groq (free tier, Llama models) to generate poultry health
    recommendations.

    Returns:
    {
        "breed": "...",
        "recommendation": "...",
        "prevention_tips": "...",
        "severity": "LOW|MEDIUM|HIGH|NONE"
    }

    Results are cached per disease to avoid repeated API calls. If the
    Groq API call fails for any reason, returns a graceful fallback dict
    instead of raising — this fallback is NOT cached, so the next scan
    will retry the real API.
    """

    cache_key = disease_name.strip().upper()

    print(f"[GROQ DEBUG] get_disease_recommendation called for disease='{cache_key}', confidence={confidence_score}")

    with _cache_lock:
        cache = _load_cache()

        if cache_key in cache:
            print(f"[RECOMMENDATION CACHE] Hit for '{cache_key}' — skipping Groq API.")
            return cache[cache_key]

    if cache_key == "HEALTHY":
        prompt = f"""
A chicken was classified as HEALTHY.

Return ONLY valid JSON with these exact keys:

{{
    "breed": "",
    "recommendation": "",
    "prevention_tips": "",
    "severity": "NONE"
}}

Rules:
- recommendation: 2-3 sentences.
- prevention_tips: 2-3 sentences.
- breed: Best guess or "Unknown".
- No markdown.
- No code fences.
- JSON only.
"""
    else:
        prompt = f"""
A chicken was diagnosed with {disease_name} with {confidence_score}% confidence.

Return ONLY valid JSON:

{{
    "breed": "",
    "recommendation": "",
    "prevention_tips": "",
    "severity": ""
}}

Rules:
- recommendation:
    Explain immediate treatment,
    isolation,
    medication if commonly used,
    and farm management.

- prevention_tips:
    Explain how to prevent future outbreaks.

- severity:
    Must be exactly one of:
    LOW
    MEDIUM
    HIGH

- breed:
    Best guess or "Unknown".

Return JSON ONLY.
"""

    try:
        print("[GROQ DEBUG] Sending request to Groq API...")

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert poultry veterinarian. "
                        "Always return valid JSON only."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.4,
            max_tokens=500,
            response_format={"type": "json_object"},
        )

        print("[GROQ DEBUG] Raw API response object received.")

        raw_content = response.choices[0].message.content.strip()

        print(f"[GROQ DEBUG] Raw content from Groq: {raw_content}")

        parsed = json.loads(raw_content)

        print(f"[GROQ DEBUG] Parsed JSON: {parsed}")

        result = {
            "breed": parsed.get("breed", "Unknown"),
            "recommendation": parsed.get("recommendation", ""),
            "prevention_tips": parsed.get("prevention_tips", ""),
            "severity": parsed.get("severity", "UNKNOWN"),
        }

        with _cache_lock:
            cache = _load_cache()
            cache[cache_key] = result
            _save_cache(cache)

        print(f"[RECOMMENDATION CACHE] Stored '{cache_key}'.")

        return result

    except json.JSONDecodeError as e:
        print(f"[GROQ DEBUG] JSONDecodeError: {e}")
        return {
            "breed": "Unknown",
            "recommendation": FALLBACK_RECOMMENDATION,
            "prevention_tips": FALLBACK_PREVENTION_TIPS,
            "severity": "UNKNOWN",
        }

    except Exception as e:
        print(f"[GROQ DEBUG] Exception type: {type(e).__name__}")
        print(f"[GROQ DEBUG] Exception details: {e}")
        return {
            "breed": "Unknown",
            "recommendation": FALLBACK_RECOMMENDATION,
            "prevention_tips": FALLBACK_PREVENTION_TIPS,
            "severity": "UNKNOWN",
        }