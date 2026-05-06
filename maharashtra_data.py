"""
maharashtra_data.py
Complete district-level data for all 36 Maharashtra districts.
Used for: auto-fill defaults, region-wise crop suggestions, map display.
"""

MAHARASHTRA_DISTRICTS = {

    # ── KONKAN DIVISION (coastal, high rainfall, laterite soil) ──────────────
    "mumbai": {
        "region": "Konkan",
        "soil_type": "laterite",
        "default_N": 50, "default_P": 40, "default_K": 40,
        "default_ph": 6.0, "default_temp": 28, "default_humidity": 85,
        "default_rainfall": 250,
        "dominant_crops": ["rice", "coconut", "banana", "papaya"],
        "season": "kharif",
        "lat": 19.076, "lng": 72.877,
    },
    "mumbai_suburban": {
        "region": "Konkan",
        "soil_type": "laterite",
        "default_N": 52, "default_P": 42, "default_K": 42,
        "default_ph": 6.1, "default_temp": 28, "default_humidity": 84,
        "default_rainfall": 240,
        "dominant_crops": ["rice", "coconut", "banana"],
        "season": "kharif",
        "lat": 19.200, "lng": 72.970,
    },
    "thane": {
        "region": "Konkan",
        "soil_type": "laterite",
        "default_N": 55, "default_P": 45, "default_K": 40,
        "default_ph": 6.2, "default_temp": 27, "default_humidity": 82,
        "default_rainfall": 230,
        "dominant_crops": ["rice", "banana", "papaya", "coconut"],
        "season": "kharif",
        "lat": 19.218, "lng": 72.978,
    },
    "raigad": {
        "region": "Konkan",
        "soil_type": "laterite",
        "default_N": 58, "default_P": 48, "default_K": 42,
        "default_ph": 6.0, "default_temp": 27, "default_humidity": 83,
        "default_rainfall": 260,
        "dominant_crops": ["rice", "mango", "coconut", "cashew"],
        "season": "kharif",
        "lat": 18.513, "lng": 73.183,
    },
    "ratnagiri": {
        "region": "Konkan",
        "soil_type": "laterite",
        "default_N": 60, "default_P": 50, "default_K": 45,
        "default_ph": 6.1, "default_temp": 27, "default_humidity": 80,
        "default_rainfall": 270,
        "dominant_crops": ["alphonso_mango", "cashew", "coconut", "rice"],
        "season": "kharif",
        "lat": 16.994, "lng": 73.300,
    },
    "sindhudurg": {
        "region": "Konkan",
        "soil_type": "laterite",
        "default_N": 62, "default_P": 52, "default_K": 46,
        "default_ph": 6.0, "default_temp": 26, "default_humidity": 80,
        "default_rainfall": 280,
        "dominant_crops": ["mango", "cashew", "coconut", "rice"],
        "season": "kharif",
        "lat": 16.351, "lng": 73.753,
    },
    "palghar": {
        "region": "Konkan",
        "soil_type": "laterite",
        "default_N": 55, "default_P": 44, "default_K": 40,
        "default_ph": 6.2, "default_temp": 28, "default_humidity": 82,
        "default_rainfall": 235,
        "dominant_crops": ["rice", "banana", "chickpea", "mungbean"],
        "season": "kharif",
        "lat": 19.696, "lng": 72.765,
    },

    # ── PUNE DIVISION (western Maharashtra, black cotton + laterite) ─────────
    "pune": {
        "region": "Western Maharashtra",
        "soil_type": "black_cotton",
        "default_N": 90, "default_P": 60, "default_K": 40,
        "default_ph": 6.5, "default_temp": 25, "default_humidity": 72,
        "default_rainfall": 120,
        "dominant_crops": ["jowar", "sugarcane", "wheat", "onion", "chickpea"],
        "season": "kharif",
        "lat": 18.520, "lng": 73.856,
    },
    "satara": {
        "region": "Western Maharashtra",
        "soil_type": "black_cotton",
        "default_N": 85, "default_P": 55, "default_K": 38,
        "default_ph": 6.6, "default_temp": 24, "default_humidity": 70,
        "default_rainfall": 110,
        "dominant_crops": ["jowar", "sugarcane", "groundnut", "soybean"],
        "season": "kharif",
        "lat": 17.686, "lng": 73.999,
    },
    "sangli": {
        "region": "Western Maharashtra",
        "soil_type": "black_cotton",
        "default_N": 80, "default_P": 50, "default_K": 35,
        "default_ph": 7.0, "default_temp": 26, "default_humidity": 65,
        "default_rainfall": 90,
        "dominant_crops": ["grapes", "sugarcane", "jowar", "onion"],
        "season": "kharif",
        "lat": 16.856, "lng": 74.571,
    },
    "solapur": {
        "region": "Western Maharashtra",
        "soil_type": "black_cotton",
        "default_N": 75, "default_P": 45, "default_K": 35,
        "default_ph": 7.2, "default_temp": 28, "default_humidity": 60,
        "default_rainfall": 75,
        "dominant_crops": ["jowar", "chickpea", "sugarcane", "pomegranate"],
        "season": "rabi",
        "lat": 17.686, "lng": 75.907,
    },
    "kolhapur": {
        "region": "Western Maharashtra",
        "soil_type": "laterite",
        "default_N": 88, "default_P": 58, "default_K": 42,
        "default_ph": 6.3, "default_temp": 24, "default_humidity": 75,
        "default_rainfall": 140,
        "dominant_crops": ["sugarcane", "rice", "groundnut", "soybean"],
        "season": "kharif",
        "lat": 16.705, "lng": 74.243,
    },

    # ── NASHIK DIVISION (northern Maharashtra, mixed soil) ───────────────────
    "nashik": {
        "region": "Northern Maharashtra",
        "soil_type": "red_loamy",
        "default_N": 82, "default_P": 52, "default_K": 38,
        "default_ph": 6.8, "default_temp": 24, "default_humidity": 68,
        "default_rainfall": 100,
        "dominant_crops": ["grapes", "onion", "wheat", "tomato", "maize"],
        "season": "rabi",
        "lat": 19.997, "lng": 73.791,
    },
    "dhule": {
        "region": "Northern Maharashtra",
        "soil_type": "black_cotton",
        "default_N": 78, "default_P": 48, "default_K": 34,
        "default_ph": 7.0, "default_temp": 27, "default_humidity": 62,
        "default_rainfall": 80,
        "dominant_crops": ["jowar", "maize", "wheat", "chickpea", "cotton"],
        "season": "kharif",
        "lat": 20.901, "lng": 74.777,
    },
    "nandurbar": {
        "region": "Northern Maharashtra",
        "soil_type": "black_cotton",
        "default_N": 76, "default_P": 46, "default_K": 32,
        "default_ph": 7.1, "default_temp": 28, "default_humidity": 64,
        "default_rainfall": 85,
        "dominant_crops": ["maize", "jowar", "cotton", "mungbean", "rice"],
        "season": "kharif",
        "lat": 21.365, "lng": 74.236,
    },
    "jalgaon": {
        "region": "Northern Maharashtra",
        "soil_type": "black_cotton",
        "default_N": 80, "default_P": 50, "default_K": 36,
        "default_ph": 7.0, "default_temp": 28, "default_humidity": 63,
        "default_rainfall": 85,
        "dominant_crops": ["banana", "cotton", "jowar", "wheat", "maize"],
        "season": "kharif",
        "lat": 21.004, "lng": 75.563,
    },
    "ahmednagar": {
        "region": "Western Maharashtra",
        "soil_type": "black_cotton",
        "default_N": 82, "default_P": 52, "default_K": 37,
        "default_ph": 6.9, "default_temp": 26, "default_humidity": 65,
        "default_rainfall": 95,
        "dominant_crops": ["sugarcane", "onion", "jowar", "wheat", "chickpea"],
        "season": "kharif",
        "lat": 19.095, "lng": 74.738,
    },

    # ── AURANGABAD DIVISION (Marathwada, black cotton soil) ──────────────────
    "aurangabad": {
        "region": "Marathwada",
        "soil_type": "black_cotton",
        "default_N": 70, "default_P": 40, "default_K": 30,
        "default_ph": 7.5, "default_temp": 28, "default_humidity": 58,
        "default_rainfall": 70,
        "dominant_crops": ["jowar", "cotton", "soybean", "chickpea", "wheat"],
        "season": "kharif",
        "lat": 19.876, "lng": 75.343,
    },
    "jalna": {
        "region": "Marathwada",
        "soil_type": "black_cotton",
        "default_N": 68, "default_P": 38, "default_K": 28,
        "default_ph": 7.6, "default_temp": 28, "default_humidity": 56,
        "default_rainfall": 68,
        "dominant_crops": ["jowar", "cotton", "soybean", "pigeon_peas"],
        "season": "kharif",
        "lat": 19.835, "lng": 75.888,
    },
    "beed": {
        "region": "Marathwada",
        "soil_type": "black_cotton",
        "default_N": 65, "default_P": 35, "default_K": 28,
        "default_ph": 7.7, "default_temp": 29, "default_humidity": 55,
        "default_rainfall": 65,
        "dominant_crops": ["cotton", "jowar", "soybean", "pomegranate", "chickpea"],
        "season": "kharif",
        "lat": 18.989, "lng": 75.760,
    },
    "osmanabad": {
        "region": "Marathwada",
        "soil_type": "black_cotton",
        "default_N": 65, "default_P": 35, "default_K": 27,
        "default_ph": 7.6, "default_temp": 29, "default_humidity": 56,
        "default_rainfall": 67,
        "dominant_crops": ["jowar", "chickpea", "cotton", "soybean", "tur"],
        "season": "rabi",
        "lat": 18.186, "lng": 76.040,
    },
    "latur": {
        "region": "Marathwada",
        "soil_type": "black_cotton",
        "default_N": 67, "default_P": 36, "default_K": 28,
        "default_ph": 7.5, "default_temp": 29, "default_humidity": 57,
        "default_rainfall": 68,
        "dominant_crops": ["jowar", "chickpea", "soybean", "cotton", "tur"],
        "season": "rabi",
        "lat": 18.400, "lng": 76.560,
    },
    "nanded": {
        "region": "Marathwada",
        "soil_type": "black_cotton",
        "default_N": 70, "default_P": 40, "default_K": 30,
        "default_ph": 7.4, "default_temp": 28, "default_humidity": 60,
        "default_rainfall": 72,
        "dominant_crops": ["jowar", "cotton", "soybean", "sugarcane", "chickpea"],
        "season": "kharif",
        "lat": 19.096, "lng": 77.307,
    },
    "parbhani": {
        "region": "Marathwada",
        "soil_type": "black_cotton",
        "default_N": 68, "default_P": 38, "default_K": 29,
        "default_ph": 7.5, "default_temp": 29, "default_humidity": 58,
        "default_rainfall": 70,
        "dominant_crops": ["jowar", "cotton", "soybean", "tur", "wheat"],
        "season": "kharif",
        "lat": 19.272, "lng": 76.773,
    },
    "hingoli": {
        "region": "Marathwada",
        "soil_type": "black_cotton",
        "default_N": 67, "default_P": 37, "default_K": 28,
        "default_ph": 7.5, "default_temp": 29, "default_humidity": 58,
        "default_rainfall": 69,
        "dominant_crops": ["jowar", "soybean", "cotton", "tur", "chickpea"],
        "season": "kharif",
        "lat": 19.718, "lng": 77.149,
    },

    # ── AMRAVATI DIVISION (Vidarbha region) ──────────────────────────────────
    "amravati": {
        "region": "Vidarbha",
        "soil_type": "black_cotton",
        "default_N": 72, "default_P": 42, "default_K": 32,
        "default_ph": 7.3, "default_temp": 30, "default_humidity": 62,
        "default_rainfall": 78,
        "dominant_crops": ["cotton", "soybean", "jowar", "wheat", "oranges"],
        "season": "kharif",
        "lat": 20.933, "lng": 77.750,
    },
    "akola": {
        "region": "Vidarbha",
        "soil_type": "black_cotton",
        "default_N": 70, "default_P": 40, "default_K": 30,
        "default_ph": 7.4, "default_temp": 31, "default_humidity": 60,
        "default_rainfall": 75,
        "dominant_crops": ["cotton", "soybean", "jowar", "wheat", "tur"],
        "season": "kharif",
        "lat": 20.706, "lng": 77.007,
    },
    "washim": {
        "region": "Vidarbha",
        "soil_type": "black_cotton",
        "default_N": 68, "default_P": 38, "default_K": 29,
        "default_ph": 7.5, "default_temp": 30, "default_humidity": 60,
        "default_rainfall": 74,
        "dominant_crops": ["cotton", "soybean", "jowar", "tur", "chickpea"],
        "season": "kharif",
        "lat": 20.113, "lng": 77.133,
    },
    "buldhana": {
        "region": "Vidarbha",
        "soil_type": "black_cotton",
        "default_N": 72, "default_P": 42, "default_K": 31,
        "default_ph": 7.3, "default_temp": 29, "default_humidity": 61,
        "default_rainfall": 76,
        "dominant_crops": ["cotton", "soybean", "jowar", "wheat", "oranges"],
        "season": "kharif",
        "lat": 20.529, "lng": 76.184,
    },
    "yavatmal": {
        "region": "Vidarbha",
        "soil_type": "black_cotton",
        "default_N": 71, "default_P": 41, "default_K": 31,
        "default_ph": 7.4, "default_temp": 30, "default_humidity": 62,
        "default_rainfall": 76,
        "dominant_crops": ["cotton", "soybean", "jowar", "tur", "wheat"],
        "season": "kharif",
        "lat": 20.389, "lng": 78.119,
    },

    # ── NAGPUR DIVISION (eastern Vidarbha) ───────────────────────────────────
    "nagpur": {
        "region": "Vidarbha",
        "soil_type": "black_cotton",
        "default_N": 73, "default_P": 43, "default_K": 33,
        "default_ph": 7.2, "default_temp": 30, "default_humidity": 63,
        "default_rainfall": 80,
        "dominant_crops": ["oranges", "cotton", "soybean", "rice", "wheat"],
        "season": "kharif",
        "lat": 21.145, "lng": 79.088,
    },
    "wardha": {
        "region": "Vidarbha",
        "soil_type": "black_cotton",
        "default_N": 70, "default_P": 40, "default_K": 31,
        "default_ph": 7.3, "default_temp": 30, "default_humidity": 62,
        "default_rainfall": 77,
        "dominant_crops": ["cotton", "soybean", "oranges", "jowar", "wheat"],
        "season": "kharif",
        "lat": 20.745, "lng": 78.601,
    },
    "chandrapur": {
        "region": "Vidarbha",
        "soil_type": "black_cotton",
        "default_N": 75, "default_P": 45, "default_K": 35,
        "default_ph": 7.0, "default_temp": 31, "default_humidity": 65,
        "default_rainfall": 85,
        "dominant_crops": ["rice", "cotton", "soybean", "jowar", "maize"],
        "season": "kharif",
        "lat": 19.960, "lng": 79.296,
    },
    "gadchiroli": {
        "region": "Vidarbha",
        "soil_type": "laterite",
        "default_N": 78, "default_P": 48, "default_K": 38,
        "default_ph": 6.5, "default_temp": 29, "default_humidity": 72,
        "default_rainfall": 120,
        "dominant_crops": ["rice", "maize", "jowar", "mungbean", "blackgram"],
        "season": "kharif",
        "lat": 20.180, "lng": 80.000,
    },
    "gondia": {
        "region": "Vidarbha",
        "soil_type": "alluvial",
        "default_N": 76, "default_P": 46, "default_K": 36,
        "default_ph": 6.7, "default_temp": 28, "default_humidity": 70,
        "default_rainfall": 115,
        "dominant_crops": ["rice", "wheat", "soybean", "maize", "lentil"],
        "season": "kharif",
        "lat": 21.462, "lng": 80.197,
    },
    "bhandara": {
        "region": "Vidarbha",
        "soil_type": "alluvial",
        "default_N": 75, "default_P": 45, "default_K": 35,
        "default_ph": 6.8, "default_temp": 28, "default_humidity": 70,
        "default_rainfall": 112,
        "dominant_crops": ["rice", "wheat", "maize", "lentil", "mungbean"],
        "season": "kharif",
        "lat": 21.169, "lng": 79.652,
    },
}

# ── Region groupings ──────────────────────────────────────────────────────────
MAHARASHTRA_REGIONS = {
    "Konkan": {
        "description": "Coastal region — high rainfall, laterite soil, tropical crops",
        "districts": ["mumbai", "mumbai_suburban", "thane", "raigad",
                      "ratnagiri", "sindhudurg", "palghar"],
        "color": "#185FA5",
        "typical_crops": ["rice", "coconut", "mango", "banana", "cashew"],
    },
    "Western Maharashtra": {
        "description": "Plateau region — black cotton soil, sugarcane & onion belt",
        "districts": ["pune", "satara", "sangli", "solapur", "kolhapur",
                      "ahmednagar"],
        "color": "#3B6D11",
        "typical_crops": ["sugarcane", "jowar", "onion", "grapes", "wheat"],
    },
    "Northern Maharashtra": {
        "description": "Mixed soil — grapes, onion, banana growing zone",
        "districts": ["nashik", "dhule", "nandurbar", "jalgaon"],
        "color": "#854F0B",
        "typical_crops": ["grapes", "banana", "onion", "cotton", "maize"],
    },
    "Marathwada": {
        "description": "Drought-prone — black cotton soil, low rainfall, pulses & cotton",
        "districts": ["aurangabad", "jalna", "beed", "osmanabad", "latur",
                      "nanded", "parbhani", "hingoli"],
        "color": "#993C1D",
        "typical_crops": ["jowar", "cotton", "soybean", "chickpea", "tur"],
    },
    "Vidarbha": {
        "description": "Eastern region — cotton & orange belt, forest-rich",
        "districts": ["amravati", "akola", "washim", "buldhana", "yavatmal",
                      "nagpur", "wardha", "chandrapur", "gadchiroli",
                      "gondia", "bhandara"],
        "color": "#534AB7",
        "typical_crops": ["cotton", "soybean", "oranges", "rice", "wheat"],
    },
}

# ── Region-wise crop suggestions ─────────────────────────────────────────────
REGION_CROP_SUGGESTIONS = {
    "Konkan": {
        "kharif":  ["rice", "banana", "papaya", "mungbean", "blackgram"],
        "rabi":    ["rice", "coconut", "mango", "cashew"],
        "zaid":    ["watermelon", "muskmelon", "mango"],
        "annual":  ["coconut", "mango", "banana", "cashew", "pomegranate"],
    },
    "Western Maharashtra": {
        "kharif":  ["sugarcane", "jowar", "maize", "soybean", "mungbean"],
        "rabi":    ["wheat", "chickpea", "onion", "lentil"],
        "zaid":    ["watermelon", "grapes", "muskmelon"],
        "annual":  ["sugarcane", "pomegranate", "banana"],
    },
    "Northern Maharashtra": {
        "kharif":  ["maize", "cotton", "jowar", "mungbean", "banana"],
        "rabi":    ["wheat", "chickpea", "onion"],
        "zaid":    ["grapes", "watermelon", "muskmelon"],
        "annual":  ["banana", "pomegranate", "sugarcane"],
    },
    "Marathwada": {
        "kharif":  ["jowar", "cotton", "soybean", "mungbean", "pigeonpeas"],
        "rabi":    ["chickpea", "lentil", "wheat", "jowar"],
        "zaid":    ["watermelon", "mungbean"],
        "annual":  ["pomegranate", "sugarcane"],
    },
    "Vidarbha": {
        "kharif":  ["cotton", "soybean", "rice", "jowar", "pigeonpeas"],
        "rabi":    ["wheat", "chickpea", "lentil"],
        "zaid":    ["watermelon", "mungbean"],
        "annual":  ["orange", "banana", "pomegranate"],
    },
}


def get_district_defaults(district_name):
    """Return default values for a given district name."""
    key = district_name.lower().replace(" ", "_").replace("-", "_")
    return MAHARASHTRA_DISTRICTS.get(key)


def get_region_crops(region, season):
    """Return crop suggestions for a region and season."""
    return REGION_CROP_SUGGESTIONS.get(region, {}).get(season, [])


def get_all_districts():
    """Return sorted list of all district names for dropdown."""
    return sorted([
        d.replace("_", " ").title()
        for d in MAHARASHTRA_DISTRICTS.keys()
    ])


def get_districts_by_region():
    """Return districts grouped by region for the map."""
    result = {}
    for region, data in MAHARASHTRA_REGIONS.items():
        result[region] = {
            "districts": data["districts"],
            "color": data["color"],
            "typical_crops": data["typical_crops"],
            "description": data["description"],
        }
    return result


if __name__ == "__main__":
    print(f"Total districts: {len(MAHARASHTRA_DISTRICTS)}")
    print(f"Total regions  : {len(MAHARASHTRA_REGIONS)}")
    print()
    for region, data in MAHARASHTRA_REGIONS.items():
        print(f"{region:25s}: {len(data['districts'])} districts — {', '.join(data['typical_crops'][:3])}")
    print()
    print("Sample — Pune district defaults:")
    import json
    print(json.dumps(get_district_defaults("pune"), indent=2))
