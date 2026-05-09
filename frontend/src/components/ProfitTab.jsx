import React from 'react';
import axios from 'axios';
import { useTranslation } from './LanguageContext';
import { API_BASE } from '../constants';

/**
 * ProfitTab Component
 * This component calculates the estimated profit and Return on Investment (ROI)
 * for a specific crop based on user-provided expense and selling rate data.
 */
export default function ProfitTab({ profitData, setProfitData, profitResult, setProfitResult, profitLoading, setProfitLoading, profitError, setProfitError }) {
  const { t, translateCrop } = useTranslation();

  // Trigger the profit calculation API
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

  // Utility to format numbers as Indian Currency (INR)
  const fmt = n => '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN');

  return (
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
                  <div className="prefix-wrap">
                    <input 
                      type="number" 
                      value={profitData[k+'_cost']} 
                      onChange={(e) => setProfitData({...profitData, [k+'_cost']: e.target.value})} 
                      placeholder="e.g. 3000" 
                    />
                  </div>
               </div>
             ))}
             <div className="expense-field">
                <label>{t('lbl_selling_rate')}</label>
                <div className="prefix-wrap">
                  <input 
                    type="number" 
                    value={profitData.crop_rate} 
                    onChange={(e) => setProfitData({...profitData, crop_rate: e.target.value})} 
                    placeholder="Leave blank = MSP" 
                  />
                </div>
             </div>
          </div>

          <button className="btn-predict btn-gold" onClick={calcProfit} disabled={profitLoading}>
            {profitLoading ? 'Calculating...' : t('btn_calc_profit')}
          </button>

          {/* ── PROFIT RESULTS ── */}
          {profitResult && (
            <div style={{marginTop:'1.25rem'}}>
              <div className="profit-result">
                <div className="p-card normal"><div className="p-label">Yield</div><div className="p-val">{profitResult.yield_quintals} qtl</div></div>
                <div className="p-card normal"><div className="p-label">Rate</div><div className="p-val">₹{profitResult.price_per_quintal}/qtl</div></div>
                <div className="p-card normal"><div className="p-label">Revenue</div><div className="p-val">{fmt(profitResult.total_revenue)}</div></div>
                <div className="p-card danger"><div className="p-label">Total Cost</div><div className="p-val" style={{color:'var(--red)'}}>{fmt(profitResult.total_cost)}</div></div>
                <div className="p-card highlight">
                  <div className="p-label">Net Profit</div>
                  <div className="p-val">{profitResult.net_profit < 0 ? '-' : ''}{fmt(profitResult.net_profit)}</div>
                  <div style={{fontSize:'11px', opacity:0.6}}>ROI: {profitResult.roi_percent}%</div>
                </div>
              </div>
            </div>
          )}
          {profitError && <div className="err" style={{display:'block', marginTop:'1rem'}}>{profitError}</div>}
        </div>
      </div>
    </div>
  );
}
