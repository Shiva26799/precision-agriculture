import joblib
import os

base = 'c:/Users/Nityananda/Downloads/precision_farming_v3_final/precision_farming_v3/api/model_files'
try:
    cols = joblib.load(os.path.join(base, 'feature_cols.pkl'))
    print(f"Small model cols: {cols}")
    cols_maha = joblib.load(os.path.join(base, 'maha_feature_cols.pkl'))
    print(f"Maha model cols: {cols_maha}")
except Exception as e:
    print(f"Error: {e}")
