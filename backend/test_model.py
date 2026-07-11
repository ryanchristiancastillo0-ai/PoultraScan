import os
import tensorflow as tf

# Path to your local model file
MODEL_PATH = "models/chicken_disease_model.h5"  # Replace with your actual file name

def inspect_model(model_path):
    if not os.path.exists(model_path):
        print(f"Error: File '{model_path}' not found.")
        return

    print("=" * 60)
    print(f"Loading model from: {model_path}")
    print("=" * 60)
    
    # Load the Keras model
    try:
        model = tf.keras.models.load_model(model_path)
    except Exception as e:
        print(f"Failed to load model: {e}")
        return

    # 1. Model Summary
    print("\n[1] Model Summary:")
    model.summary()
    print("-" * 60)

    # 2. Output Shape
    print(f"\n[2] Model Output Shape:\n{model.output_shape}")
    print("-" * 60)

    # Get the final layer for activation and neuron counts
    final_layer = model.layers[-1]

    # 3. Activation function of the final layer
    activation = getattr(final_layer, 'activation', None)
    activation_name = activation.__name__ if activation else "No explicit activation (or not a standard layer)"
    print(f"\n[3] Final Layer Activation Function:\n{activation_name}")
    print("-" * 60)

    # 4. Number of output neurons
    units = getattr(final_layer, 'units', None)
    if units is None:
        # Fallback if the final layer is an Activation layer or Flatten rather than Dense
        if hasattr(model, 'output_shape') and model.output_shape:
            units = model.output_shape[-1]
    print(f"\n[4] Number of Output Neurons:\n{units}")
    print("-" * 60)

    # 5 & 6. Class names and training class order checks
    print("\n[5 & 6] Checking for Class Names and Training Metadata:")
    
    # Keras models can store metadata inside 'model.training_config' or custom attributes
    has_custom_metadata = False
    
    # Check common places where developers or custom export tools inject class lists
    metadata_keys = ['class_names', 'classes', 'labels', 'target_names']
    found_metadata = {}

    for key in metadata_keys:
        if hasattr(model, key):
            found_metadata[key] = getattr(model, key)
            has_custom_metadata = True
        
    # Check if compiled metrics or loss configurations hint at class configuration
    if hasattr(model, 'loss') and model.loss:
        print(f"- Model Loss Function: {model.loss}")

    if has_custom_metadata:
        print("\n-> Success! Found embedded class metadata directly on the model object:")
        for k, v in found_metadata.items():
            print(f"   * model.{k}: {v}")
    else:
        print("\n-> Notice: No default 'class_names' or 'labels' attributes found directly on the model object.")
        print("   Standard TensorFlow/Keras models do not automatically save the human-readable text labels")
        print("   or the alphabetical folder order used during training inside the HDF5 (.h5) structure.")
        print("   They only learn to map inputs to index positions (e.g., 0, 1, 2, 3).")

    print("=" * 60)

if __name__ == "__main__":
    inspect_model(MODEL_PATH)