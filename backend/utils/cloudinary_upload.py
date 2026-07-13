import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def upload_farm_image(file) -> str | None:
    """
    Uploads a FastAPI UploadFile to Cloudinary and returns the public URL
    to store in Farm.image_url. Returns None if no file was given.

    file: a FastAPI UploadFile (has .file, the underlying SpooledTemporaryFile)
    """
    if file is None:
        return None

    result = cloudinary.uploader.upload(
        file.file,
        folder="poultrascan/farm-images",
        resource_type="image",
    )
    return result["secure_url"]