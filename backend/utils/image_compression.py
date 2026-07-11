"""
Compresses uploaded images before saving to disk.
Resizes if the image exceeds MAX_DIMENSION and re-encodes as JPEG
at reduced quality to shrink file size. Does not affect the AI model's
own preprocessing (that happens separately in image_preprocessing.py).
"""

from PIL import Image
import io

from utils.image_converter import convert_to_jpeg

MAX_DIMENSION = 1280   # longest side capped at this many pixels
JPEG_QUALITY = 80       # 0-100, lower = smaller file, slightly lower visual quality


def compress_image(contents: bytes) -> tuple[bytes, str]:
    """
    Returns (compressed_bytes, new_extension).
    Always outputs JPEG regardless of input format (jpg/jpeg/png).
    """
    jpeg_bytes = convert_to_jpeg(contents)

    image = Image.open(io.BytesIO(jpeg_bytes))

    if max(image.size) > MAX_DIMENSION:
        image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

    output_buffer = io.BytesIO()
    image.save(output_buffer, format="JPEG", quality=JPEG_QUALITY, optimize=True)

    return output_buffer.getvalue(), "jpg"