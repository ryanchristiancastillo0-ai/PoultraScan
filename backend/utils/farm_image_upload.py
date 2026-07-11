import os
import uuid
from fastapi import UploadFile

from utils.image_compression import compress_image

UPLOAD_DIR = "static/farm-images"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_farm_image(file: UploadFile) -> str:
    contents = file.file.read()

    compressed_bytes, ext = compress_image(contents)

    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(compressed_bytes)

    return f"/static/farm-images/{filename}"