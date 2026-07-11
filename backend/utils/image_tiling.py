"""
Splits large images into overlapping tiles so dense scenes (many small,
closely-packed objects) can be detected at closer to full resolution per
tile, instead of the whole image getting downscaled by Roboflow and
losing small/distant objects.
"""

from PIL import Image
import io


def split_into_tiles(image_bytes: bytes, tile_size: int = 1024, overlap: int = 200) -> list[dict]:
    """
    Splits an image into overlapping tiles.

    Returns a list of dicts: [{"bytes": jpeg_bytes, "offset_x": int, "offset_y": int}, ...]
    offset_x/offset_y are the pixel coordinates of the tile's top-left corner
    in the ORIGINAL image — used later to translate each tile's detections
    back into full-image coordinates.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    width, height = image.size

    step = tile_size - overlap
    tiles = []

    y = 0
    while True:
        x = 0
        while True:
            box = (x, y, min(x + tile_size, width), min(y + tile_size, height))
            tile = image.crop(box)

            buffer = io.BytesIO()
            tile.save(buffer, format="JPEG", quality=90)

            tiles.append({
                "bytes": buffer.getvalue(),
                "offset_x": x,
                "offset_y": y
            })

            if x + tile_size >= width:
                break
            x += step

        if y + tile_size >= height:
            break
        y += step

    return tiles


def should_tile(image_bytes: bytes, min_dimension_to_tile: int = 1500) -> bool:
    """
    Only worth tiling if the image is meaningfully larger than a single
    tile — otherwise tiling just burns extra Roboflow API calls for
    no benefit (e.g. a photo of one chicken up close).
    """
    image = Image.open(io.BytesIO(image_bytes))
    return max(image.size) > min_dimension_to_tile