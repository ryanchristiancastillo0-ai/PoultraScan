from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from routes.user_route import router as user_router
from routes.auth_route import router as auth_router
from routes.scan_summary_route import router as scan_summary_router
from routes.scan_session_route import router as scan_session_router
from routes.notification_route import router as notification_router
from routes.farm_route import router as farm_router
from routes.activity_log_route import router as activity_log_router
from routes.ai_prediction_route import router as ai_prediction_router
from routes.chicken_image_route import router as chicken_image_router

from routes.detection_route import router as detection_router
from routes.journal_entry_route import router as journal_entry_router
from fastapi.middleware.cors import CORSMiddleware
from routes.user_route import router as user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://poultra-scan.vercel.app"],  # exact Vite dev origin, no trailing slash
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.mount("/static", StaticFiles(directory="static"), name="static")


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(scan_summary_router)
app.include_router(scan_session_router)
app.include_router(notification_router)
app.include_router(farm_router)
app.include_router(activity_log_router)
app.include_router(ai_prediction_router)
app.include_router(chicken_image_router)
app.include_router(detection_router)
app.include_router(journal_entry_router)
app.include_router(user_router)