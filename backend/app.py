from flask import Flask, request, jsonify, render_template, Blueprint
from flask_cors import CORS
import joblib, numpy as np, os, sys

app = Flask(__name__)
CORS(app)
sys.path.insert(0, os.path.dirname(__file__))
from maharashtra_data import (MAHARASHTRA_DISTRICTS, MAHARASHTRA_REGIONS,
    REGION_CROP_SUGGESTIONS, get_district_defaults, get_districts_by_region)

BASE = os.path.join(os.path.dirname(__file__), 'model_files')
model     = joblib.load(os.path.join(BASE, 'maha_crop_model.pkl'))
le_crop   = joblib.load(os.path.join(BASE, 'maha_label_encoder.pkl'))
le_soil   = joblib.load(os.path.join(BASE, 'maha_soil_encoder.pkl'))
le_season = joblib.load(os.path.join(BASE, 'maha_season_encoder.pkl'))
le_dist   = joblib.load(os.path.join(BASE, 'maha_district_encoder.pkl'))
le_region = joblib.load(os.path.join(BASE, 'maha_region_encoder.pkl'))
feat_cols = joblib.load(os.path.join(BASE, 'maha_feature_cols.pkl'))

CROP_INFO = {
    'rice':        {'emoji':'🌾','season':'Kharif','water':'High',  'duration':120,'yield_q':20,'market_rate':2183,'cost_seed':2500,'cost_fert':4000,'cost_labour':6000,'tip':'Best in waterlogged fields. Sow in June–July.'},
    'wheat':       {'emoji':'🌾','season':'Rabi',  'water':'Medium','duration':120,'yield_q':16,'market_rate':2275,'cost_seed':3000,'cost_fert':3500,'cost_labour':5000,'tip':'Cool winters essential. Sow November–December.'},
    'maize':       {'emoji':'🌽','season':'Kharif','water':'Medium','duration':90, 'yield_q':20,'market_rate':1962,'cost_seed':2000,'cost_fert':3000,'cost_labour':4500,'tip':'High demand. Good for Pune plateau.'},
    'chickpea':    {'emoji':'🫘','season':'Rabi',  'water':'Low',   'duration':100,'yield_q':8, 'market_rate':5440,'cost_seed':4000,'cost_fert':2000,'cost_labour':3500,'tip':'Drought tolerant. Fixes nitrogen naturally.'},
    'pigeonpeas':  {'emoji':'🫘','season':'Kharif','water':'Low',   'duration':150,'yield_q':6, 'market_rate':7000,'cost_seed':3000,'cost_fert':2000,'cost_labour':3000,'tip':'Deep roots. Drought resistant for Marathwada.'},
    'mungbean':    {'emoji':'🫘','season':'Kharif','water':'Low',   'duration':70, 'yield_q':4, 'market_rate':8558,'cost_seed':3500,'cost_fert':1500,'cost_labour':2500,'tip':'Quick 70-day crop. Excellent cash option.'},
    'blackgram':   {'emoji':'🫘','season':'Kharif','water':'Low',   'duration':75, 'yield_q':4, 'market_rate':6950,'cost_seed':3200,'cost_fert':1500,'cost_labour':2500,'tip':'Low rainfall crop. Common in Vidarbha.'},
    'lentil':      {'emoji':'🫘','season':'Rabi',  'water':'Low',   'duration':110,'yield_q':5, 'market_rate':6000,'cost_seed':4000,'cost_fert':2000,'cost_labour':3000,'tip':'Well-drained soil essential.'},
    'mothbeans':   {'emoji':'🫘','season':'Kharif','water':'Low',   'duration':75, 'yield_q':3, 'market_rate':6645,'cost_seed':2800,'cost_fert':1200,'cost_labour':2000,'tip':'Extremely drought tolerant.'},
    'cotton':      {'emoji':'🌿','season':'Kharif','water':'Medium','duration':180,'yield_q':8, 'market_rate':6620,'cost_seed':5000,'cost_fert':6000,'cost_labour':8000,'tip':'King of Vidarbha. Best on black cotton soil.'},
    'banana':      {'emoji':'🍌','season':'Annual','water':'High',  'duration':300,'yield_q':120,'market_rate':1500,'cost_seed':8000,'cost_fert':7000,'cost_labour':10000,'tip':'Year-round. Jalgaon is India\'s banana capital.'},
    'mango':       {'emoji':'🥭','season':'Annual','water':'Low',   'duration':365,'yield_q':40,'market_rate':4000,'cost_seed':5000,'cost_fert':4000,'cost_labour':5000,'tip':'Ratnagiri Alphonso is world-famous.'},
    'grapes':      {'emoji':'🍇','season':'Zaid',  'water':'Medium','duration':180,'yield_q':60,'market_rate':6000,'cost_seed':10000,'cost_fert':8000,'cost_labour':12000,'tip':'Maharashtra produces 80% of India\'s grapes.'},
    'coconut':     {'emoji':'🥥','season':'Annual','water':'High',  'duration':365,'yield_q':60,'market_rate':3000,'cost_seed':6000,'cost_fert':4000,'cost_labour':5000,'tip':'Konkan coast specialty. Perennial crop.'},
    'papaya':      {'emoji':'🍈','season':'Annual','water':'Medium','duration':280,'yield_q':100,'market_rate':1500,'cost_seed':4000,'cost_fert':4000,'cost_labour':6000,'tip':'Fast growing. Fruits in 9–10 months.'},
    'pomegranate': {'emoji':'🍎','season':'Annual','water':'Low',   'duration':365,'yield_q':40,'market_rate':8000,'cost_seed':8000,'cost_fert':5000,'cost_labour':7000,'tip':'Drought tolerant. Premium export crop.'},
}

RESCUE_MAP = {
    'drought':       {'kharif':['mungbean','mothbeans','blackgram','pigeonpeas','chickpea'],'rabi':['chickpea','lentil','wheat'],'zaid':['mungbean'],'annual':['pomegranate','mango']},
    'flood':         {'kharif':['rice','maize','banana'],'rabi':['wheat','lentil'],'zaid':[],'annual':['banana','coconut']},
    'frost':         {'kharif':['maize','mungbean'],'rabi':['wheat','chickpea','lentil'],'zaid':['mungbean'],'annual':['papaya']},
    'pest':          {'kharif':['mungbean','mothbeans','pigeonpeas'],'rabi':['lentil','chickpea','wheat'],'zaid':['mungbean'],'annual':['pomegranate','mango']},
    'water_shortage':{'kharif':['mungbean','mothbeans','blackgram','pigeonpeas'],'rabi':['chickpea','lentil'],'zaid':['mungbean'],'annual':['pomegranate','mango']},
}

def build_input(data):
    def enc(le, val, default=0.0):
        try: return float(le.transform([val])[0])
        except: return default
    row = {
        'N':float(data['N']),'P':float(data['P']),'K':float(data['K']),
        'temperature':float(data['temperature']),'humidity':float(data['humidity']),
        'ph':float(data['ph']),'rainfall':float(data['rainfall']),
        'soil_enc':   enc(le_soil,   data.get('soil_type','black_cotton')),
        'season_enc': enc(le_season, data.get('season','kharif')),
        'district_enc': enc(le_dist, data.get('district','pune')),
        'region_enc':   enc(le_region, data.get('region','Western Maharashtra')),
    }
    return np.array([[row[f] for f in feat_cols]])

api_bp = Blueprint('api', __name__)

@api_bp.route('/district_defaults/<district>')
def district_defaults(district):
    d = get_district_defaults(district)
    if not d: return jsonify({'success':False,'error':'Not found'}), 404
    return jsonify({'success':True,'data':d})

@api_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data  = request.get_json()
        inp   = build_input(data)
        pred  = model.predict(inp)[0]
        crop  = le_crop.inverse_transform([pred])[0]
        proba = model.predict_proba(inp)[0]
        top5  = [{'crop':le_crop.classes_[i],'confidence':round(float(proba[i])*100,1)}
                 for i in np.argsort(proba)[::-1][:5]]
        info  = CROP_INFO.get(crop,{'emoji':'🌱','season':'Varies','water':'Medium',
                'duration':120,'yield_q':10,'market_rate':3000,
                'cost_seed':3000,'cost_fert':3000,'cost_labour':4000,'tip':'Consult local officer.'})
        return jsonify({'success':True,'crop':crop,'confidence':round(float(proba[pred])*100,1),
                        'top5':top5,'info':info})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)}), 400

@api_bp.route('/profit', methods=['POST'])
def profit():
    try:
        d           = request.get_json()
        crop        = d['crop'].lower()
        land        = float(d['land_acres'])
        seed_cost   = float(d.get('seed_cost',0))
        fert_cost   = float(d.get('fert_cost',0))
        labour_cost = float(d.get('labour_cost',0))
        irrig_cost  = float(d.get('irrig_cost',0))
        other_cost  = float(d.get('other_cost',0))
        crop_rate   = float(d.get('crop_rate',0))
        info        = CROP_INFO.get(crop)
        if not info: return jsonify({'success':False,'error':'Crop not found'}), 400
        total_yield = round(info['yield_q'] * land, 1)
        price       = crop_rate if crop_rate > 0 else info['market_rate']
        revenue     = round(total_yield * price)
        user_costs  = seed_cost + fert_cost + labour_cost + irrig_cost + other_cost
        if user_costs > 0:
            total_cost = round(user_costs * land)
            breakdown  = {'seed':round(seed_cost*land),'fert':round(fert_cost*land),
                          'labour':round(labour_cost*land),'irrig':round(irrig_cost*land),'other':round(other_cost*land)}
        else:
            total_cost = round((info['cost_seed']+info['cost_fert']+info['cost_labour'])*land)
            breakdown  = {'seed':round(info['cost_seed']*land),'fert':round(info['cost_fert']*land),
                          'labour':round(info['cost_labour']*land),'irrig':0,'other':0}
        net    = revenue - total_cost
        roi    = round((net/total_cost)*100,1) if total_cost else 0
        return jsonify({'success':True,'crop':crop,'land_acres':land,
                        'yield_quintals':total_yield,'price_per_quintal':price,
                        'total_revenue':revenue,'total_cost':total_cost,
                        'net_profit':net,'roi_percent':roi,
                        'duration_days':info['duration'],'breakdown':breakdown})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)}), 400

@api_bp.route('/rescue', methods=['POST'])
def rescue():
    try:
        d      = request.get_json()
        reason = d.get('failure_reason','drought')
        season = d.get('season','kharif')
        crops  = RESCUE_MAP.get(reason,{}).get(season,['mungbean','chickpea'])
        sugg   = []
        for crop in crops[:5]:
            info = CROP_INFO.get(crop)
            if info:
                sugg.append({'crop':crop,'emoji':info['emoji'],
                    'cost_per_acre':info['cost_seed']+info['cost_fert']+info['cost_labour'],
                    'duration_days':info['duration'],'water':info['water'],
                    'tip':info['tip'],'market_rate':info['market_rate'],'yield_q':info['yield_q']})
        sugg.sort(key=lambda x: x['cost_per_acre'])
        return jsonify({'success':True,'suggestions':sugg})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)}), 400

@app.route('/')
def home():
    return render_template('index.html',
        districts=MAHARASHTRA_DISTRICTS,
        regions=MAHARASHTRA_REGIONS)

app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(api_bp, url_prefix='/')

if __name__ == '__main__':

    app.run(debug=True, host='0.0.0.0', port=5000)

