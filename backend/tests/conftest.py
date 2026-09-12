import os

from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("JWT_SECRET", "test-secret")