"""
Loads the TensorFlow model exactly once when the FastAPI app starts.
Never import load_model() directly in a route/service — always go through
ModelLoader.get_model() so the .h5 file isn't reloaded on every request.
"""

from tensorflow.keras.models import load_model
import os


class ModelLoader:
    _model = None

    MODEL_PATH = os.path.join("models", "chicken_disease_model.h5")

    @classmethod
    def load(cls):
        if cls._model is None:
            print("Loading AI model into memory...")
            cls._model = load_model(cls.MODEL_PATH)
            print("AI model loaded successfully.")
        return cls._model

    @classmethod
    def get_model(cls):
        if cls._model is None:
            raise RuntimeError("Model not loaded yet. Call ModelLoader.load() at app startup.")
        return cls._model