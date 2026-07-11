"""
Preprocessing must exactly match how the model was trained:
resize to 224x224, force RGB (3 channels), normalize pixels to 0-1, add batch dimension.
"""

import numpy as np
from PIL import Image
import io

IMG_SIZE = (224, 224)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert("RGB")          # ensures 3 channels, matches (224, 224, 3)
    image = image.resize(IMG_SIZE)        # matches model input shape

    array = np.array(image, dtype=np.float32) / 255.0   # normalize to 0-1
    array = np.expand_dims(array, axis=0)                 # add batch dimension -> (1, 224, 224, 3)

    return array