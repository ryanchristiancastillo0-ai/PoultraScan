import pytest
import requests
from fastapi import HTTPException

from services.abstract_email_service import AbstractEmailService
from services.user_service import UserService
from schemas.user_schema import RegisterUserSchema, UpdateUserSchema
from models.user import User


class FakeResponse:
    def __init__(self, data, status_code=200):
        self._data = data
        self.status_code = status_code

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.exceptions.HTTPError(
                f"{self.status_code} error", response=self
            )

    def json(self):
        return self._data


class FakeDB:
    def __init__(self):
        self.added = []

    def add(self, obj):
        self.added.append(obj)

    def commit(self):
        pass

    def refresh(self, obj):
        pass


def _verbose_email():
    return {
        "email_address": "user@example.com",
        "email_deliverability": {
            "status": "deliverable",
            "status_detail": "valid_email",
            "is_smtp_valid": True,
            "is_mx_valid": True,
        },
        "email_quality": {
            "is_disposable": False,
            "is_username_suspicious": False,
            "is_role": False,
            "is_catchall": False,
        },
        "email_domain": {"is_risky_tld": False},
        "email_risk": {"address_risk_status": "low"},
    }


# ---------------------------------------------------------------------------
# Env gating
# ---------------------------------------------------------------------------

def test_check_disabled_in_development_without_api_call(monkeypatch):
    monkeypatch.delenv("APP_ENV", raising=False)
    monkeypatch.delenv("ABSTRACT_API_KEY", raising=False)
    calls = []

    def fake_get(*args, **kwargs):
        calls.append(args)
        return FakeResponse(_verbose_email())

    monkeypatch.setattr("services.abstract_email_service.requests.get", fake_get)

    result = AbstractEmailService.check("user@example.com")

    assert result["allowed"] is True
    assert result["checked"] is False
    assert calls == []


def test_check_disabled_when_app_env_is_development(monkeypatch):
    monkeypatch.setenv("APP_ENV", "DEVELOPMENT")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")
    calls = []

    def fake_get(*args, **kwargs):
        calls.append(args)
        return FakeResponse(_verbose_email())

    monkeypatch.setattr("services.abstract_email_service.requests.get", fake_get)

    result = AbstractEmailService.check("user@example.com")

    assert result["allowed"] is True
    assert result["checked"] is False
    assert calls == []


def test_check_skipped_when_api_key_missing_in_production(monkeypatch):
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.delenv("ABSTRACT_API_KEY", raising=False)
    calls = []

    def fake_get(*args, **kwargs):
        calls.append(args)
        return FakeResponse(_verbose_email())

    monkeypatch.setattr("services.abstract_email_service.requests.get", fake_get)

    result = AbstractEmailService.check("user@example.com")

    assert result["allowed"] is True
    assert result["checked"] is False
    assert calls == []


# ---------------------------------------------------------------------------
# Verdicts from API responses
# ---------------------------------------------------------------------------

def test_low_risk_email_allowed(monkeypatch):
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")
    monkeypatch.setattr(
        "services.abstract_email_service.requests.get",
        lambda *a, **k: FakeResponse(_verbose_email()),
    )

    result = AbstractEmailService.check("user@example.com")

    assert result["allowed"] is True
    assert result["checked"] is True
    assert result["risk_level"] == "low"


def test_disposable_email_rejected(monkeypatch):
    payload = _verbose_email()
    payload["email_quality"]["is_disposable"] = True
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")
    monkeypatch.setattr(
        "services.abstract_email_service.requests.get",
        lambda *a, **k: FakeResponse(payload),
    )

    result = AbstractEmailService.check("temp@mailinator.com")

    assert result["allowed"] is False
    assert result["risk_level"] == "high"
    assert result["reason"] == "Disposable email addresses are not allowed."


def test_undeliverable_invalid_mailbox_rejected(monkeypatch):
    payload = _verbose_email()
    payload["email_deliverability"] = {
        "status": "undeliverable",
        "status_detail": "invalid_mailbox",
        "is_smtp_valid": False,
        "is_mx_valid": False,
    }
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")
    monkeypatch.setattr(
        "services.abstract_email_service.requests.get",
        lambda *a, **k: FakeResponse(payload),
    )

    result = AbstractEmailService.check("ghost@example.com")

    assert result["allowed"] is False
    assert result["risk_level"] == "high"


def test_transient_undeliverable_allowed(monkeypatch):
    payload = _verbose_email()
    payload["email_deliverability"] = {
        "status": "undeliverable",
        "status_detail": "full_mailbox",
        "is_smtp_valid": True,
        "is_mx_valid": True,
    }
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")
    monkeypatch.setattr(
        "services.abstract_email_service.requests.get",
        lambda *a, **k: FakeResponse(payload),
    )

    result = AbstractEmailService.check("full@example.com")

    assert result["allowed"] is True


def test_high_risk_address_rejected(monkeypatch):
    payload = _verbose_email()
    payload["email_risk"]["address_risk_status"] = "high"
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")
    monkeypatch.setattr(
        "services.abstract_email_service.requests.get",
        lambda *a, **k: FakeResponse(payload),
    )

    result = AbstractEmailService.check("suspicious@example.com")

    assert result["allowed"] is False
    assert result["risk_level"] == "high"


def test_risky_tld_rejected(monkeypatch):
    payload = _verbose_email()
    payload["email_domain"]["is_risky_tld"] = True
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")
    monkeypatch.setattr(
        "services.abstract_email_service.requests.get",
        lambda *a, **k: FakeResponse(payload),
    )

    result = AbstractEmailService.check("user@example.xyz")

    assert result["allowed"] is False


def test_medium_risk_allowed(monkeypatch):
    payload = _verbose_email()
    payload["email_risk"]["address_risk_status"] = "medium"
    payload["email_quality"]["is_username_suspicious"] = True
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")
    monkeypatch.setattr(
        "services.abstract_email_service.requests.get",
        lambda *a, **k: FakeResponse(payload),
    )

    result = AbstractEmailService.check("a1b2c3@example.com")

    assert result["allowed"] is True
    assert result["risk_level"] == "medium"


# ---------------------------------------------------------------------------
# Graceful fallback when the API is unavailable
# ---------------------------------------------------------------------------

def test_timeout_falls_back_to_allowed(monkeypatch):
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")

    def timeout(*args, **kwargs):
        raise requests.exceptions.Timeout("slow")

    monkeypatch.setattr("services.abstract_email_service.requests.get", timeout)

    result = AbstractEmailService.check("user@example.com")

    assert result["allowed"] is True
    assert result["checked"] is False


def test_connection_error_falls_back_to_allowed(monkeypatch):
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")

    def connection_error(*args, **kwargs):
        raise requests.exceptions.ConnectionError("down")

    monkeypatch.setattr("services.abstract_email_service.requests.get", connection_error)

    result = AbstractEmailService.check("user@example.com")

    assert result["allowed"] is True
    assert result["checked"] is False


def test_http_error_falls_back_to_allowed(monkeypatch):
    monkeypatch.setenv("APP_ENV", "PRODUCTION")
    monkeypatch.setenv("ABSTRACT_API_KEY", "test-key")
    monkeypatch.setattr(
        "services.abstract_email_service.requests.get",
        lambda *a, **k: FakeResponse({"error": "quota"}, status_code=422),
    )

    result = AbstractEmailService.check("user@example.com")

    assert result["allowed"] is True
    assert result["checked"] is False


# ---------------------------------------------------------------------------
# Integration through UserService
# ---------------------------------------------------------------------------

def test_register_rejects_risky_email(monkeypatch):
    monkeypatch.setattr(UserService, "find_by_email", staticmethod(lambda db, email: None))
    monkeypatch.setattr(UserService, "find_by_username", staticmethod(lambda db, username: None))

    def blocked(email):
        assert email == "temp@mailinator.com"
        return {"allowed": False, "risk_level": "high", "reason": "Disposable email addresses are not allowed."}

    monkeypatch.setattr(AbstractEmailService, "check", blocked)

    user = RegisterUserSchema(
        fullname="Test User",
        username="tester",
        email="temp@mailinator.com",
        password="strongpassword123",
    )

    with pytest.raises(HTTPException) as exc:
        UserService.register(FakeDB(), user)

    assert exc.value.status_code == 422
    assert "Disposable" in exc.value.detail


def test_register_allows_valid_email(monkeypatch):
    monkeypatch.setattr(UserService, "find_by_email", staticmethod(lambda db, email: None))
    monkeypatch.setattr(UserService, "find_by_username", staticmethod(lambda db, username: None))
    monkeypatch.setattr(
        "services.user_service.hash_password", lambda p: "hashed"
    )
    monkeypatch.setattr(
        AbstractEmailService,
        "check",
        lambda email: {"allowed": True, "risk_level": "low", "reason": None},
    )

    user = RegisterUserSchema(
        fullname="Test User",
        username="tester",
        email="user@example.com",
        password="strongpassword123",
    )
    db = FakeDB()

    created = UserService.register(db, user)

    assert created.email == "user@example.com"
    assert created in db.added


def test_update_email_change_checks_new_email(monkeypatch):
    existing_user = User(
        fullname="Test User",
        username="tester",
        email="old@example.com",
        password="hashed",
    )
    monkeypatch.setattr(
        UserService, "find_by_id", staticmethod(lambda db, user_id: existing_user)
    )
    monkeypatch.setattr(UserService, "find_by_email", staticmethod(lambda db, email: None))

    def blocked(email):
        assert email == "temp@mailinator.com"
        return {"allowed": False, "risk_level": "high", "reason": "Disposable email addresses are not allowed."}

    monkeypatch.setattr(AbstractEmailService, "check", blocked)

    data = UpdateUserSchema(email="temp@mailinator.com")

    with pytest.raises(HTTPException) as exc:
        UserService.update(FakeDB(), user_id=1, data=data)

    assert exc.value.status_code == 422
    assert existing_user.email == "old@example.com"