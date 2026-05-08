import joblib
import os

base = 'c:/Users/Nityananda/Downloads/precision_farming_v3_final/precision_farming_v3/api/model_files'
maha_path = os.path.join(base, 'maha_crop_model.pkl')
compressed_path = os.path.join(base, 'maha_crop_model_compressed.pkl')

print(f"Loading {maha_path}...")
model = joblib.load(maha_path)
print("Saving with compression level 9...")
joblib.dump(model, compressed_path, compress=9)

original_size = os.path.getsize(maha_path) / (1024*1024)
compressed_size = os.path.getsize(compressed_path) / (1024*1024)

print(f"Original size: {original_size:.2f} MB")
print(f"Compressed size: {compressed_size:.2f} MB")
