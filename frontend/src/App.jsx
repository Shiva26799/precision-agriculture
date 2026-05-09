import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from './components/LanguageContext';

const API_BASE = 'https://precision-agriculture-0fal.onrender.com/api';

/**
 * DATA CONSTANTS
 * These describe the 5 regions of Maharashtra and their districts.
 */
const REGION_DISTRICTS = {
  'Konkan':               ['mumbai','mumbai_suburban','thane','raigad','ratnagiri','sindhudurg','palghar'],
  'Western Maharashtra':  ['pune','satara','sangli','solapur','kolhapur','ahmednagar'],
  'Northern Maharashtra': ['nashik','dhule','nandurbar','jalgaon'],
  'Marathwada':           ['aurangabad','jalna','beed','osmanabad','latur','nanded','parbhani','hingoli'],
  'Vidarbha':             ['amravati','akola','washim','buldhana','yavatmal','nagpur','wardha','chandrapur','gadchiroli','gondia','bhandara'],
};

const REGION_INFO = {
  'Konkan': { icon: '🌊', color: '#185FA5', desc: 'Coastal region with high rainfall and tropical crops.' },
  'Western Maharashtra': { icon: '🌿', color: '#3B6D11', desc: 'Plateau region known for sugarcane and onions.' },
  'Northern Maharashtra': { icon: '🍇', color: '#854F0B', desc: 'Famous for grapes, bananas, and onions.' },
  'Marathwada': { icon: '☀️', color: '#993C1D', desc: 'Drought-prone area focused on pulses and cotton.' },
  'Vidarbha': { icon: '🍊', color: '#534AB7', desc: 'Eastern region known for oranges and soybeans.' },
};

export default function App() {
  const { lang, setLang, t, translateCrop } = useTranslation();
  const [activeTab, setActiveTab] = useState('predict');
  
  // -------------------------------------------------------------------------
  // 1. AI ADVISOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    region: '', district: '', N: 90, P: 42, K: 43, ph: 6.5,
    soil_type: 'black_cotton', temperature: 25, humidity: 72, rainfall: 120, season: 'kharif'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setFormData(prev => ({ ...prev, district }));
    if (!district) return;
    
    // PRESENTATION TIP: "We fetch default soil/weather values for each district 
    // to make it easier for farmers who might not know their exact NPK values."
    try {
      const response = await axios.get(`${API_BASE}/district_defaults/${district}`);
      if (response.data.success) {
        const d = response.data.data;
        setFormData(prev => ({
          ...prev,
          N: d.default_N, P: d.default_P, K: d.default_K,
          ph: d.default_ph, soil_type: d.soil_type,
          temperature: d.default_temp, humidity: d.default_humidity,
          rainfall: d.default_rainfall
        }));
      }
    } catch (err) { console.error("Error fetching defaults:", err); }
  };

  const predictCrop = async () => {
    setLoading(true); setError(null);
    try {
      // PRESENTATION TIP: "This sends the NPK, soil, and weather data to our 
      // Flask backend, where the Random Forest model processes it."
      const r = await axios.post(`${API_BASE}/predict`, formData);
      if (r.data.success) {
        setResult(r.data);
        // Automatically set the suggested crop in the profit calculator
        setProfitData(prev => ({ ...prev, crop: r.data.crop.toLowerCase() }));
      } else setError(r.data.error);
    } catch (err) { setError("Failed to connect to AI engine."); }
    finally { setLoading(false); }
  };

  // -------------------------------------------------------------------------
  // 2. PROFIT CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [profitData, setProfitData] = useState({
    crop: 'rice', land_acres: 1, seed_cost: '', fert_cost: '', labour_cost: '', irrig_cost: '', other_cost: '', crop_rate: ''
  });
  const [profitResult, setProfitResult] = useState(null);
  const [profitLoading, setProfitLoading] = useState(false);

  const calculateProfit = async () => {
    setProfitLoading(true);
    try {
      // PRESENTATION TIP: "We use current market rates (MSP) and typical yields 
      // to estimate the revenue and net profit for the chosen crop."
      const r = await axios.post(`${API_BASE}/profit`, profitData);
      if (r.data.success) setProfitResult(r.data);
    } catch (err) { console.error(err); }
    finally { setProfitLoading(false); }
  };

  // -------------------------------------------------------------------------
  // 3. RESCUE SYSTEM STATE & LOGIC
  // -------------------------------------------------------------------------
  const [rescueSeason, setRescueSeason] = useState('kharif');
  const [rescueReason, setRescueReason] = useState('drought');
  const [rescueResults, setRescueResults] = useState(null);
  const [rescueLoading, setRescueLoading] = useState(false);

  const findRescueCrops = async () => {
    setRescueLoading(true);
    try {
      // PRESENTATION TIP: "If a crop fails due to drought or flood, this system 
      // suggests alternative 'short-duration' crops to save the season."
      const r = await axios.post(`${API_BASE}/rescue`, { failure_reason: rescueReason, season: rescueSeason });
      if (r.data.success) setRescueResults(r.data.suggestions);
    } catch (err) { console.error(err); }
    finally { setRescueLoading(false); }
  };

  // -------------------------------------------------------------------------
  // MAIN RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="app-container">
      {/* NAVIGATION BAR */}
      <nav>
        <div className="nav-brand">
          <div className="nav-logo">🌾</div>
          <div className="nav-name" dangerouslySetInnerHTML={{ __html: t('nav_brand') }}></div>
        </div>
        <div className="nav-pills">
          {['predict', 'profit', 'rescue', 'map'].map(tab => (
            <button 
              key={tab} 
              className={`nav-pill ${activeTab === tab ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab)}
            >
              {t('tab_' + tab)}
            </button>
          ))}
        </div>
        <div className="lang-row">
          {['en', 'hi', 'mr'].map(l => (
            <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="hero">
        <div className="hero-tag">{t('hero_tag')}</div>
        <h1 dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
        <p>{t('hero_subtitle')}</p>
      </header>

      <main className="main-content">
        {/* TAB SWITCHER */}
        <div className="tab-bar">
          {['predict', 'profit', 'rescue', 'map'].map(tab => (
            <button 
              key={tab} 
              className={`tab ${activeTab === tab ? 'active' : ''}`} 
              onClick={() => setActiveTab(tab)}
            >
              {t('tab_' + tab)}
            </button>
          ))}
        </div>

        {/* 1. ADVISOR PANEL */}
        {activeTab === 'predict' && (
          <div className="tab-panel">
            <AdvisorSection 
              formData={formData} setFormData={setFormData}
              handleDistrictChange={handleDistrictChange}
              predictCrop={predictCrop} loading={loading}
              result={result} error={error} t={t} translateCrop={translateCrop}
            />
          </div>
        )}

        {/* 2. PROFIT PANEL */}
        {activeTab === 'profit' && (
          <div className="tab-panel">
            <ProfitSection 
              profitData={profitData} setProfitData={setProfitData}
              calculateProfit={calculateProfit} loading={profitLoading}
              result={profitResult} t={t} translateCrop={translateCrop}
            />
          </div>
        )}

        {/* 3. RESCUE PANEL */}
        {activeTab === 'rescue' && (
          <div className="tab-panel">
            <RescueSection 
              rescueReason={rescueReason} setRescueReason={setRescueReason}
              rescueSeason={rescueSeason} setRescueSeason={setRescueSeason}
              findRescueCrops={findRescueCrops} loading={rescueLoading}
              results={rescueResults} t={t} translateCrop={translateCrop}
            />
          </div>
        )}

        {/* 4. MAP PANEL */}
        {activeTab === 'map' && (
          <div className="tab-panel">
            <MapSection t={t} />
          </div>
        )}
      </main>

      <footer dangerouslySetInnerHTML={{ __html: t('footer_text') }}></footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS (Simplified for presentation)
// ---------------------------------------------------------------------------

function AdvisorSection({ formData, setFormData, handleDistrictChange, predictCrop, loading, result, error, t, translateCrop }) {
  return (
    <>
      <div className="card">
        <div className="card-head"><div className="card-icon icon-blue">📍</div><div className="card-title">{t('sec_location')}</div></div>
        <div className="card-body">
          <div className="district-row">
            <div className="field">
              <label>{t('lbl_region')}</label>
              <select value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value, district: ''})}>
                <option value="">Select Region</option>
                {Object.keys(REGION_DISTRICTS).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="field">
              <label>{t('lbl_district')}</label>
              <select value={formData.district} onChange={handleDistrictChange}>
                <option value="">Select District</option>
                {(REGION_DISTRICTS[formData.region] || []).map(d => (
                  <option key={d} value={d}>{d.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><div className="card-icon icon-green">🧪</div><div className="card-title">{t('sec_soil')}</div></div>
        <div className="card-body">
          <div className="npk-grid">
            {['N','P','K'].map(k => (
              <div key={k} className="npk-card">
                <div className="npk-label">{k === 'N' ? 'Nitrogen' : k === 'P' ? 'Phosphorus' : 'Potassium'}</div>
                <input type="number" value={formData[k]} onChange={(e) => setFormData({...formData, [k]: e.target.value})} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className="btn-predict" onClick={predictCrop} disabled={loading}>
        {loading ? 'Analyzing...' : t('btn_predict')}
      </button>

      {result && (
        <div className="result-display">
          <div className="result-hero">
            <div className="result-emoji-big">{result.info.emoji}</div>
            <div className="result-meta">
              <div className="result-tag">BEST CROP SUGGESTED</div>
              <div className="result-crop-name">{translateCrop(result.crop)}</div>
              <div className="result-conf">Confidence: {result.confidence}%</div>
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-label">💡 Farming Tip:</div>
            <div className="tip-text">{result.info.tip}</div>
          </div>
        </div>
      )}
    </>
  );
}

function ProfitSection({ profitData, setProfitData, calculateProfit, loading, result, t, translateCrop }) {
  const fmt = n => '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN');
  return (
    <div className="card">
      <div className="card-head"><div className="card-icon icon-gold">💰</div><div className="card-title">Economic Analysis</div></div>
      <div className="card-body">
        <div className="district-row">
          <div className="field">
            <label>Select Crop</label>
            <select value={profitData.crop} onChange={(e) => setProfitData({...profitData, crop: e.target.value})}>
              {['rice','wheat','maize','cotton','banana'].map(c => <option key={c} value={c}>{translateCrop(c)}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Land Area (Acres)</label>
            <input type="number" value={profitData.land_acres} onChange={(e) => setProfitData({...profitData, land_acres: e.target.value})} />
          </div>
        </div>
        <button className="btn-predict btn-gold" onClick={calculateProfit} disabled={loading}>Calculate</button>
        {result && (
          <div className="profit-result">
            <div className="p-card normal"><div className="p-label">Revenue</div><div className="p-val">{fmt(result.total_revenue)}</div></div>
            <div className="p-card danger"><div className="p-label">Expenses</div><div className="p-val">{fmt(result.total_cost)}</div></div>
            <div className="p-card highlight"><div className="p-label">Net Profit</div><div className="p-val">{fmt(result.net_profit)}</div></div>
          </div>
        )}
      </div>
    </div>
  );
}

function RescueSection({ rescueReason, setRescueReason, rescueSeason, setRescueSeason, findRescueCrops, loading, results, t, translateCrop }) {
  return (
    <div className="card">
      <div className="card-head"><div className="card-icon icon-red">🚨</div><div className="card-title">Crop Rescue System</div></div>
      <div className="card-body">
        <label>Reason for Failure</label>
        <select value={rescueReason} onChange={(e) => setRescueReason(e.target.value)}>
          <option value="drought">Drought</option>
          <option value="flood">Flood</option>
          <option value="pest">Pest Attack</option>
        </select>
        <button className="btn-predict" onClick={findRescueCrops} disabled={loading}>Find Alternative Crops</button>
        {results && results.map(s => (
          <div key={s.crop} className="rescue-card">
            <div className="rescue-body">
              <div className="rescue-crop-name">{s.emoji} {translateCrop(s.crop)}</div>
              <div className="rescue-tip">{s.tip}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapSection({ t }) {
  const [selected, setSelected] = useState(null);
  return (
    <div className="card">
      <div className="card-head"><div className="card-icon icon-blue">🗺️</div><div className="card-title">Agricultural Zones</div></div>
      <div className="card-body">
        <div className="maha-map">
          {Object.entries(REGION_INFO).map(([name, info]) => (
            <div key={name} className={`map-region ${selected === name ? 'active' : ''}`} onClick={() => setSelected(name)}>
              <div className="map-region-icon">{info.icon}</div>
              <div className="map-region-name">{name}</div>
            </div>
          ))}
        </div>
        {selected && (
          <div className="region-detail show">
            <div className="region-detail-name">{REGION_INFO[selected].icon} {selected}</div>
            <div className="region-detail-desc">{REGION_INFO[selected].desc}</div>
          </div>
        )}
      </div>
    </div>
  );
}
