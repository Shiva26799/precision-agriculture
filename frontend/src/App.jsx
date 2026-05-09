import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from './components/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const REGION_DISTRICTS = {
  'Konkan':               ['mumbai','mumbai_suburban','thane','raigad','ratnagiri','sindhudurg','palghar'],
  'Western Maharashtra':  ['pune','satara','sangli','solapur','kolhapur','ahmednagar'],
  'Northern Maharashtra': ['nashik','dhule','nandurbar','jalgaon'],
  'Marathwada':           ['aurangabad','jalna','beed','osmanabad','latur','nanded','parbhani','hingoli'],
  'Vidarbha':             ['amravati','akola','washim','buldhana','yavatmal','nagpur','wardha','chandrapur','gadchiroli','gondia','bhandara'],
};

const REGION_INFO = {
  'Konkan': { icon: '🌊', color: '#185FA5', desc: 'Coastal — high rainfall, laterite soil, tropical crops' },
  'Western Maharashtra': { icon: '🌿', color: '#3B6D11', desc: 'Plateau — black cotton soil, sugarcane & onion belt' },
  'Northern Maharashtra': { icon: '🍇', color: '#854F0B', desc: 'Mixed soil — grapes, banana, onion zone' },
  'Marathwada': { icon: '☀️', color: '#993C1D', desc: 'Drought-prone — black cotton, pulses & cotton' },
  'Vidarbha': { icon: '🍊', color: '#534AB7', desc: 'Eastern — cotton, orange & soybean belt' },
};

export default function App() {
  const { lang, setLang, t, translateCrop } = useTranslation();
  const [activeTab, setActiveTab] = useState('predict');
  
  // Advisor State
  const [formData, setFormData] = useState({
    region: '', district: '', N: 90, P: 42, K: 43, ph: 6.5,
    soil_type: 'black_cotton', temperature: 25, humidity: 72, rainfall: 120, season: 'kharif'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Profit State
  const [profitData, setProfitData] = useState({
    crop: 'rice', land_acres: 1, seed_cost: '', fert_cost: '', labour_cost: '', irrig_cost: '', other_cost: '', crop_rate: ''
  });
  const [profitResult, setProfitResult] = useState(null);
  const [profitLoading, setProfitLoading] = useState(false);
  const [profitError, setProfitError] = useState(null);

  // Rescue State
  const [rescueSeason, setRescueSeason] = useState('kharif');
  const [rescueReason, setRescueReason] = useState('drought');
  const [rescueResults, setRescueResults] = useState(null);
  const [rescueLoading, setRescueLoading] = useState(false);

  // Map State
  const [selectedMapRegion, setSelectedMapRegion] = useState(null);

  // Handlers
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFormData(prev => ({ ...prev, region, district: '' }));
  };

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setFormData(prev => ({ ...prev, district }));
    if (!district) return;
    try {
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
    } catch (err) { console.error(err); }
  };

  const predict = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const r = await axios.post(`${API_BASE}/predict`, formData);
      if (r.data.success) {
        setResult(r.data);
        setProfitData(prev => ({ ...prev, crop: r.data.crop.toLowerCase() }));
      } else setError(r.data.error);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const calcProfit = async () => {
    setProfitLoading(true); setProfitError(null); setProfitResult(null);
    const payload = {
      ...profitData,
      land_acres: +profitData.land_acres || 1,
      seed_cost: +profitData.seed_cost || 0,
      fert_cost: +profitData.fert_cost || 0,
      labour_cost: +profitData.labour_cost || 0,
      irrig_cost: +profitData.irrig_cost || 0,
      other_cost: +profitData.other_cost || 0,
      crop_rate: +profitData.crop_rate || 0,
    };
    try {
      const r = await axios.post(`${API_BASE}/profit`, payload);
      if (r.data.success) setProfitResult(r.data);
      else setProfitError(r.data.error);
    } catch (err) { setProfitError(err.message); }
    finally { setProfitLoading(false); }
  };

  const findRescue = async () => {
    setRescueLoading(true); setRescueResults(null);
    try {
      const r = await axios.post(`${API_BASE}/rescue`, { failure_reason: rescueReason, season: rescueSeason });
      if (r.data.success) setRescueResults(r.data.suggestions);
    } catch (err) { console.error(err); }
    finally { setRescueLoading(false); }
  };

  const fmt = n => '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN');

  return (
    <div>
      {/* ── NAV ── */}
      <nav>
        <div className="nav-brand">
          <div className="nav-logo">🌾</div>
          <div className="nav-name" dangerouslySetInnerHTML={{ __html: t('nav_brand') }}></div>
        </div>
        <div className="nav-pills">
          <button className={`nav-pill ${activeTab === 'predict' ? 'active' : ''}`} onClick={() => setActiveTab('predict')}>{t('tab_predict')}</button>
          <button className={`nav-pill ${activeTab === 'profit' ? 'active' : ''}`} onClick={() => setActiveTab('profit')}>{t('tab_profit')}</button>
          <button className={`nav-pill ${activeTab === 'rescue' ? 'active' : ''}`} onClick={() => setActiveTab('rescue')}>{t('tab_rescue')}</button>
          <button className={`nav-pill ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>{t('tab_map')}</button>
        </div>
        <div className="lang-row">
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिं</button>
          <button className={`lang-btn ${lang === 'mr' ? 'active' : ''}`} onClick={() => setLang('mr')}>म</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-tag">{t('hero_tag')}</div>
        <h1 dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
        <p>{t('hero_subtitle')}</p>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">36</div>
            <div className="stat-lbl">{t('stat_districts')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5</div>
            <div className="stat-lbl">{t('stat_regions')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">95%</div>
            <div className="stat-lbl">{t('stat_accuracy')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">22</div>
            <div className="stat-lbl">{t('stat_crops')}</div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="main">
        {/* TABS */}
        <div className="tab-bar">
          <button className={`tab ${activeTab === 'predict' ? 'active' : ''}`} onClick={() => setActiveTab('predict')}>{t('tab_predict')}</button>
          <button className={`tab ${activeTab === 'profit' ? 'active' : ''}`} onClick={() => setActiveTab('profit')}>{t('tab_profit')}</button>
          <button className={`tab ${activeTab === 'rescue' ? 'active' : ''}`} onClick={() => setActiveTab('rescue')}>{t('tab_rescue')}</button>
          <button className={`tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>{t('tab_map')}</button>
        </div>

        {/* ══ ADVISOR PANEL ══ */}
        {activeTab === 'predict' && (
          <div className="tab-panel active">
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

            <button className="btn-predict" onClick={predict} disabled={loading}>{loading ? 'Processing...' : t('btn_predict')}</button>
            {error && <div className="err" style={{display:'block'}}>{error}</div>}

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
        )}

        {/* ══ PROFIT PANEL ══ */}
        {activeTab === 'profit' && (
          <div className="tab-panel active">
            <div className="card">
              <div className="card-head"><div className="card-icon icon-gold">💰</div><div className="card-title">{t('tab_profit')}</div></div>
              <div className="card-body">
                <p style={{fontSize:'13px', color:'var(--muted)', marginBottom:'1rem'}}>{t('profit_subtitle')}</p>
                <div className="district-row">
                  <div className="field">
                    <label>{t('lbl_select_crop')}</label>
                    <select value={profitData.crop} onChange={(e) => setProfitData({...profitData, crop: e.target.value})}>
                      {['rice','wheat','maize','chickpea','pigeonpeas','mungbean','blackgram','lentil','mothbeans','cotton','banana','mango','grapes','coconut','papaya','pomegranate'].map(c => (
                        <option key={c} value={c}>{translateCrop(c)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>{t('lbl_land_area')}</label>
                    <input type="number" value={profitData.land_acres} onChange={(e) => setProfitData({...profitData, land_acres: e.target.value})} step="0.1" />
                  </div>
                </div>
                <div className="expense-grid">
                   {['seed','fert','labour','irrig','other'].map(k => (
                     <div key={k} className="expense-field">
                        <label>{t('lbl_'+k+'_cost')}</label>
                        <div className="prefix-wrap"><input type="number" value={profitData[k+'_cost']} onChange={(e) => setProfitData({...profitData, [k+'_cost']: e.target.value})} placeholder="e.g. 3000" /></div>
                     </div>
                   ))}
                   <div className="expense-field">
                      <label>{t('lbl_selling_rate')}</label>
                      <div className="prefix-wrap"><input type="number" value={profitData.crop_rate} onChange={(e) => setProfitData({...profitData, crop_rate: e.target.value})} placeholder="Leave blank = MSP" /></div>
                   </div>
                </div>
                <button className="btn-predict btn-gold" onClick={calcProfit} disabled={profitLoading}>{profitLoading ? 'Calculating...' : t('btn_calc_profit')}</button>
                {profitResult && (
                  <div style={{marginTop:'1.25rem'}}>
                    <div className="profit-result">
                      <div className="p-card normal"><div className="p-label">Yield</div><div className="p-val">{profitResult.yield_quintals} qtl</div></div>
                      <div className="p-card normal"><div className="p-label">Rate</div><div className="p-val">₹{profitResult.price_per_quintal}/qtl</div></div>
                      <div className="p-card normal"><div className="p-label">Revenue</div><div className="p-val">{fmt(profitResult.total_revenue)}</div></div>
                      <div className="p-card danger"><div className="p-label">Total Cost</div><div className="p-val" style={{color:'var(--red)'}}>{fmt(profitResult.total_cost)}</div></div>
                      <div className="p-card highlight"><div className="p-label">Net Profit</div><div className="p-val">{profitResult.net_profit < 0 ? '-' : ''}{fmt(profitResult.net_profit)}</div><div style={{fontSize:'11px', opacity:0.6}}>ROI: {profitResult.roi_percent}%</div></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ RESCUE PANEL ══ */}
        {activeTab === 'rescue' && (
          <div className="tab-panel active">
            <div className="card">
              <div className="card-head"><div className="card-icon icon-red">🚨</div><div className="card-title">{t('tab_rescue')}</div></div>
              <div className="card-body">
                <p style={{fontSize:'13px', color:'var(--muted)', marginBottom:'1rem'}}>{t('rescue_subtitle')}</p>
                <label>{t('lbl_failure_cause')}</label>
                <div className="rescue-reason-grid" style={{marginTop:'0.5rem'}}>
                   {['drought','flood','frost','pest','water_shortage'].map(r => (
                     <button key={r} className={`reason-btn ${rescueReason === r ? 'selected' : ''}`} onClick={() => setRescueReason(r)}>{t('res_'+r)}</button>
                   ))}
                </div>
                <div className="district-row" style={{marginTop:'0.75rem'}}>
                   <div className="field">
                      <label>{t('lbl_current_season')}</label>
                      <select value={rescueSeason} onChange={(e) => setRescueSeason(e.target.value)}>
                        <option value="kharif">{t('sea_kharif')}</option>
                        <option value="rabi">{t('sea_rabi')}</option>
                        <option value="zaid">{t('sea_zaid')}</option>
                      </select>
                   </div>
                </div>
                <button className="btn-predict" onClick={findRescue} disabled={rescueLoading}>{rescueLoading ? 'Finding...' : t('btn_find_rescue')}</button>
                {rescueResults && (
                  <div style={{marginTop:'1rem'}}>
                    {rescueResults.map((s, i) => (
                      <div key={s.crop} className="rescue-card">
                        <div className="rescue-rank-badge" style={{background:'rgba(24,95,165,0.1)', color:'#185FA5'}}>{i+1}</div>
                        <div className="rescue-body">
                          <div className="rescue-crop-name">{s.emoji} {translateCrop(s.crop)}</div>
                          <div className="rescue-pills">
                            <span className={`r-pill ${s.cost_per_acre < 8000 ? 'pill-low' : 'pill-med'}`}>{s.cost_per_acre < 8000 ? 'Low' : 'Medium'} {t('lbl_investment')}</span>
                            <span className="r-pill pill-info">₹{s.cost_per_acre.toLocaleString('en-IN')}/{t('lbl_acre')}</span>
                            <span className="r-pill pill-info">{s.duration_days} {t('lbl_days')}</span>
                          </div>
                          <div className="rescue-tip">{s.tip}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ MAP PANEL ══ */}
        {activeTab === 'map' && (
          <div className="tab-panel active">
             <div className="card">
                <div className="card-head"><div className="card-icon icon-blue">🗺️</div><div className="card-title">{t('tab_map')}</div></div>
                <div className="card-body">
                   <p style={{fontSize:'13px', color:'var(--muted)', marginBottom:'1.25rem'}}>{t('map_subtitle')}</p>
                   <div className="maha-map">
                      {Object.entries(REGION_INFO).map(([name, info]) => (
                        <div key={name} className={`map-region ${selectedMapRegion === name ? 'active' : ''}`} onClick={() => setSelectedMapRegion(name)}>
                           <div className="map-region-icon">{info.icon}</div>
                           <div className="map-region-name">{name}</div>
                           <div className="map-region-dist">{(REGION_DISTRICTS[name] || []).length} districts</div>
                        </div>
                      ))}
                   </div>
                   {selectedMapRegion && (
                     <div className="region-detail show">
                        <div className="region-detail-name">{REGION_INFO[selectedMapRegion].icon} {selectedMapRegion}</div>
                        <div className="region-detail-desc">{REGION_INFO[selectedMapRegion].desc}</div>
                        <div className="region-dist-list">
                           {(REGION_DISTRICTS[selectedMapRegion] || []).map(d => (
                             <span key={d} className="dist-chip">{d.replace(/_/g, ' ')}</span>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      <footer dangerouslySetInnerHTML={{ __html: t('footer_text') }}></footer>
    </div>
  );
}
