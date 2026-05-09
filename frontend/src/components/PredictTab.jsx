import React from 'react';
import axios from 'axios';
import { useTranslation } from './LanguageContext';
import { REGION_DISTRICTS, REGION_INFO, API_BASE } from '../constants';

/**
 * PredictTab Component
 * This component handles the "Crop Advisor" feature.
 * It takes soil and weather data and predicts the best crop using a Machine Learning model.
 */
export default function PredictTab({ formData, setFormData, result, setResult, loading, setLoading, error, setError }) {
  const { t, translateCrop } = useTranslation();

  // Handle input changes for standard fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handle region selection change
  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFormData(prev => ({ ...prev, region, district: '' }));
  };

  // Handle district selection change and fetch default values from backend
  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setFormData(prev => ({ ...prev, district }));
    if (!district) return;
    
    try {
      // API call to get typical soil/weather data for the selected district
      const r = await axios.get(`${API_BASE}/district_defaults/${district}`);
      if (r.data.success) {
        const d = r.data.data;
        setFormData(prev => ({
          ...prev,
          N: d.default_N, P: d.default_P, K: d.default_K,
          ph: d.default_ph, soil_type: d.soil_type,
          temperature: d.default_temp, humidity: d.default_humidity,
          rainfall: d.default_rainfall, season: d.season || prev.season
        }));
      }
    } catch (err) { console.error("Error fetching district defaults:", err); }
  };

  // Trigger the ML prediction
  const predict = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const r = await axios.post(`${API_BASE}/predict`, formData);
      if (r.data.success) {
        setResult(r.data);
      } else setError(r.data.error);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="tab-panel active">
      {/* ── LOCATION SECTION ── */}
      <div className="card">
        <div className="card-head">
          <div className="card-icon icon-blue">📍</div>
          <div className="card-title">{t('sec_location')}</div>
        </div>
        <div className="card-body">
          <div className="district-row">
            <div className="field">
              <label>{t('lbl_region')}</label>
              <select value={formData.region} onChange={handleRegionChange}>
                <option value="">{t('opt_select_region')}</option>
                {Object.keys(REGION_DISTRICTS).map(r => (
                  <option key={r} value={r}>{t('reg_' + r.toLowerCase().split(' ')[0]) || r}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t('lbl_district')}</label>
              <select value={formData.district} onChange={handleDistrictChange}>
                <option value="">{t('opt_select_district')}</option>
                {(REGION_DISTRICTS[formData.region] || []).map(d => (
                  <option key={d} value={d}>{d.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
              <div className="hint">{t('hint_district')}</div>
            </div>
          </div>
          <div className="region-map">
            {Object.entries(REGION_INFO).map(([name, info]) => (
              <div key={name} className={`region-chip ${formData.region === name ? 'selected' : ''}`} onClick={() => handleRegionChange({target:{value:name}})}>
                <div className="r-dot" style={{background:info.color}}></div>
                <div className="r-name">{name}</div>
                <div className="r-count">{(REGION_DISTRICTS[name] || []).length} dist.</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOIL SECTION ── */}
      <div className="card">
        <div className="card-head"><div className="card-icon icon-green">🧪</div><div className="card-title">{t('sec_soil')}</div></div>
        <div className="card-body">
          <div className="npk-grid">
            {['N','P','K'].map(k => (
              <div key={k} className="npk-card">
                <div className="npk-label">{k === 'N' ? 'Nitrogen' : k === 'P' ? 'Phosphorus' : 'Potassium'}</div>
                <input type="number" id={k} value={formData[k]} onChange={handleChange} />
                <div className="npk-unit">kg/ha</div>
              </div>
            ))}
          </div>
          <div className="slider-row">
            <div className="slider-field">
              <label>Soil pH <span className="slider-val">{formData.ph}</span></label>
              <input type="range" id="ph" min="3.5" max="9" step="0.1" value={formData.ph} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t('lbl_soil')}</label>
              <select id="soil_type" value={formData.soil_type} onChange={handleChange}>
                <option value="black_cotton">{t('soil_black')}</option>
                <option value="laterite">{t('soil_laterite')}</option>
                <option value="red_loamy">{t('soil_red')}</option>
                <option value="alluvial">{t('soil_alluvial')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── WEATHER SECTION ── */}
      <div className="card">
        <div className="card-head"><div className="card-icon icon-gold">⛅</div><div className="card-title">{t('sec_weather')}</div></div>
        <div className="card-body">
          <div className="slider-row">
            <div className="slider-field"><label>Temp <span className="slider-val">{formData.temperature}°C</span></label>
              <input type="range" id="temperature" min="8" max="45" value={formData.temperature} onChange={handleChange} />
            </div>
            <div className="slider-field"><label>Humidity <span className="slider-val">{formData.humidity}%</span></label>
              <input type="range" id="humidity" min="15" max="100" value={formData.humidity} onChange={handleChange} />
            </div>
          </div>
          <div className="slider-row">
            <div className="slider-field"><label>Rainfall <span className="slider-val">{formData.rainfall}mm</span></label>
              <input type="range" id="rainfall" min="20" max="350" value={formData.rainfall} onChange={handleChange} />
            </div>
            <div className="field">
              <label>{t('lbl_season')}</label>
              <select id="season" value={formData.season} onChange={handleChange}>
                <option value="kharif">{t('sea_kharif')}</option>
                <option value="rabi">{t('sea_rabi')}</option>
                <option value="zaid">{t('sea_zaid')}</option>
                <option value="annual">{t('sea_annual')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTION BUTTON ── */}
      <button className="btn-predict" onClick={predict} disabled={loading}>{loading ? 'Processing...' : t('btn_predict')}</button>
      {error && <div className="err" style={{display:'block'}}>{error}</div>}

      {/* ── PREDICTION RESULTS ── */}
      {result && (
        <div style={{marginTop:'1.5rem'}}>
          <div className="result-hero">
            <div className="result-emoji-big">{result.info.emoji}</div>
            <div className="result-meta">
              <div className="result-tag">{t('res_recommended')}</div>
              <div className="result-crop-name">{translateCrop(result.crop)}</div>
              <div className="result-conf">{t('res_conf_prefix')}: {result.confidence}%</div>
              <div className="result-badges">
                <span className="badge badge-blue">📅 {result.info.season}</span>
                <span className="badge badge-gold">💧 {result.info.water} {t('lbl_water')}</span>
                <span className="badge badge-green">⏱ {result.info.duration} {t('lbl_days')}</span>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><div className="card-icon icon-blue">📊</div><div className="card-title">All predictions</div></div>
            <div className="card-body">
              {result.top5.map(item => (
                <div key={item.crop} className="confidence-bar-wrap" style={{padding:'.6rem .8rem', marginBottom:'.4rem'}}>
                  <div className="conf-bar-label"><span style={{textTransform:'capitalize', fontWeight:500}}>{translateCrop(item.crop)}</span><span>{item.confidence}%</span></div>
                  <div className="conf-track"><div className="conf-fill" style={{width:`${item.confidence}%`}}></div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="tip-card">
            <div className="tip-label">{t('lbl_farming_tip')}</div>
            <div className="tip-text">{result.info.tip}</div>
          </div>
        </div>
      )}
    </div>
  );
}
