from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
DATABASE_URL = "mysql+pymysql://root:@localhost/chicken_ai"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)




def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()