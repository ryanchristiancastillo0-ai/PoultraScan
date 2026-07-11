"""
Converts any supported image format (PNG, JPG, JPEG) into JPEG bytes.
Kept separate from compression so conversion and compression can be
reused independently elsewhere in the project if needed.
"""

from PIL import Image
import io


def convert_to_jpeg(contents: bytes) -> bytes:
    image = Image.open(io.BytesIO(contents))
    image = image.convert("RGB")  # JPEG has no alpha channel, PNG transparency gets flattened

    output_buffer = io.BytesIO()
    image.save(output_buffer, format="JPEG")

    return output_buffer.getvalue()