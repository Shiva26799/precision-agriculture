import React from 'react';
import axios from 'axios';
import { useTranslation } from './LanguageContext';
import { API_BASE } from '../constants';

/**
 * RescueTab Component
 * This component provides suggestions for "Recovery Crops" in case the primary crop fails
 * due to weather events (drought, flood) or pests.
 */
export default function RescueTab({ rescueSeason, setRescueSeason, rescueReason, setRescueReason, rescueResults, setRescueResults, rescueLoading, setRescueLoading }) {
  const { t, translateCrop } = useTranslation();

  // Fetch rescue suggestions from the backend
  const findRescue = async () => {
    setRescueLoading(true); setRescueResults(null);
    try {
      const r = await axios.post(`${API_BASE}/rescue`, { failure_reason: rescueReason, season: rescueSeason });
      if (r.data.success) setRescueResults(r.data.suggestions);
    } catch (err) { console.error("Error finding rescue crops:", err); }
    finally { setRescueLoading(false); }
  };

  return (
    <div className="tab-panel active">
      <div className="card">
        <div className="card-head"><div className="card-icon icon-red">🚨</div><div className="card-title">{t('tab_rescue')}</div></div>
        <div className="card-body">
          <p style={{fontSize:'13px', color:'var(--muted)', marginBottom:'1rem'}}>{t('rescue_subtitle')}</p>
          
          <label>{t('lbl_failure_cause')}</label>
          <div className="rescue-reason-grid" style={{marginTop:'0.5rem'}}>
             {['drought','flood','frost','pest','water_shortage'].map(r => (
               <button 
                 key={r} 
                 className={`reason-btn ${rescueReason === r ? 'selected' : ''}`} 
                 onClick={() => setRescueReason(r)}
               >
                 {t('res_'+r)}
               </button>
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

          <button className="btn-predict" onClick={findRescue} disabled={rescueLoading}>
            {rescueLoading ? 'Finding...' : t('btn_find_rescue')}
          </button>

          {/* ── RESCUE RESULTS ── */}
          {rescueResults && (
            <div style={{marginTop:'1rem'}}>
              {rescueResults.map((s, i) => (
                <div key={s.crop} className="rescue-card">
                  <div className="rescue-rank-badge" style={{background:'rgba(24,95,165,0.1)', color:'#185FA5'}}>{i+1}</div>
                  <div className="rescue-body">
                    <div className="rescue-crop-name">{s.emoji} {translateCrop(s.crop)}</div>
                    <div className="rescue-pills">
                      <span className={`r-pill ${s.cost_per_acre < 8000 ? 'pill-low' : 'pill-med'}`}>
                        {s.cost_per_acre < 8000 ? 'Low' : 'Medium'} {t('lbl_investment')}
                      </span>
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
  );
}
