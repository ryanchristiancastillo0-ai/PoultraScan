import logging
import os

import requests

# Email Reputation API — see https://docs.abstractapi.com/api/email-reputation
ABSTRACT_API_URL = "https://emailreputation.abstractapi.com/v1/"
ABSTRACT_TIMEOUT = 10

# status_detail values that mean the mailbox itself does not exist / cannot
# receive mail (transient states like "full_mailbox" or "unavailable_server"
# are NOT treated as clearly risky).
UNDELIVERABLE_HARD_FAILURES = {"invalid_mailbox", "invalid_format", "dns_record_not_found"}

logger = logging.getLogger(__name__)


class AbstractEmailService:

    @staticmethod
    def is_enabled() -> bool:
        """Only perform reputation checks in production.

        APP_ENV must equal exactly PRODUCTION. Anything else (including an
        unset variable) is treated as DEVELOPMENT and skips the check, so the
        app keeps working with any email locally.
        """
        return os.getenv("APP_ENV", "DEVELOPMENT").strip().upper() == "PRODUCTION"

    @classmethod
    def check(cls, email: str) -> dict:
        """Query the Abstract Email Reputation API and return a verdict.

        Never raises: if the API is unreachable, misconfigured, or the env
        gate is off, it falls back to allowing the email so registration and
        profile updates keep working.

        Return shape: {
            "checked": bool,      # True when the Abstract API was actually consulted
            "allowed": bool,
            "risk_level": str,    # "low" | "medium" | "high" | "unknown"
            "reason": str | None, # human-readable message when blocked
        }
        """
        if not cls.is_enabled():
            return {
                "checked": False,
                "allowed": True,
                "risk_level": "unknown",
                "reason": "Email reputation check is disabled outside of production.",
            }

        api_key = os.getenv("ABSTRACT_API_KEY")
        if not api_key:
            logger.warning("ABSTRACT_API_KEY is not set; skipping email reputation check")
            return {
                "checked": False,
                "allowed": True,
                "risk_level": "unknown",
                "reason": "Email reputation check is not configured.",
            }

        try:
            resp = requests.get(
                ABSTRACT_API_URL,
                params={"email": email},
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=ABSTRACT_TIMEOUT,
            )
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as exc:
            logger.warning("Abstract email reputation check failed for %.80s: %s", email, exc)
            return {
                "checked": False,
                "allowed": True,
                "risk_level": "unknown",
                "reason": "Email reputation check is temporarily unavailable.",
            }
        except ValueError:
            logger.warning("Abstract email reputation returned invalid JSON for %.80s", email)
            return {
                "checked": False,
                "allowed": True,
                "risk_level": "unknown",
                "reason": "Email reputation check is temporarily unavailable.",
            }

        result = cls._evaluate(data)
        result["checked"] = True
        return result

    @classmethod
    def _evaluate(cls, data: dict) -> dict:
        """Decide whether an email is clearly risky based on the response fields."""
        deliverability = data.get("email_deliverability") or {}
        quality = data.get("email_quality") or {}
        risk = data.get("email_risk") or {}
        domain = data.get("email_domain") or {}

        if quality.get("is_disposable") is True:
            return cls._blocked("high", "Disposable email addresses are not allowed.")

        if domain.get("is_risky_tld") is True:
            return cls._blocked("high", "This email uses a risky domain.")

        if deliverability.get("status") == "undeliverable" and (
            deliverability.get("status_detail") in UNDELIVERABLE_HARD_FAILURES
        ):
            return cls._blocked("high", "This email address appears to be invalid.")

        if risk.get("address_risk_status") == "high":
            return cls._blocked("high", "This email address is flagged as high-risk.")

        if risk.get("address_risk_status") == "medium" or quality.get("is_username_suspicious") is True:
            return {
                "allowed": True,
                "risk_level": "medium",
                "reason": None,
            }

        return {
            "allowed": True,
            "risk_level": "low",
            "reason": None,
        }

    @staticmethod
    def _blocked(risk_level: str, reason: str) -> dict:
        return {
            "allowed": False,
            "risk_level": risk_level,
            "reason": reason,
        }