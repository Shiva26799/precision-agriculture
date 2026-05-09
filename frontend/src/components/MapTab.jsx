import React from 'react';
import { useTranslation } from './LanguageContext';
import { REGION_DISTRICTS, REGION_INFO } from '../constants';

/**
 * MapTab Component
 * This component visualizes the different agricultural regions of Maharashtra.
 * It allows users to explore district distributions and regional characteristics.
 */
export default function MapTab({ selectedMapRegion, setSelectedMapRegion }) {
  const { t } = useTranslation();

  return (
    <div className="tab-panel active">
       <div className="card">
          <div className="card-head">
            <div className="card-icon icon-blue">🗺️</div>
            <div className="card-title">{t('tab_map')}</div>
          </div>
          <div className="card-body">
             <p style={{fontSize:'13px', color:'var(--muted)', marginBottom:'1.25rem'}}>{t('map_subtitle')}</p>
             
             {/* ── INTERACTIVE REGION GRID ── */}
             <div className="maha-map">
                {Object.entries(REGION_INFO).map(([name, info]) => (
                  <div 
                    key={name} 
                    className={`map-region ${selectedMapRegion === name ? 'active' : ''}`} 
                    onClick={() => setSelectedMapRegion(name)}
                  >
                     <div className="map-region-icon">{info.icon}</div>
                     <div className="map-region-name">{name}</div>
                     <div className="map-region-dist">{(REGION_DISTRICTS[name] || []).length} districts</div>
                  </div>
                ))}
             </div>

             {/* ── REGION DETAILS (CONDITIONAL) ── */}
             {selectedMapRegion && (
               <div className="region-detail show">
                  <div className="region-detail-name">
                    {REGION_INFO[selectedMapRegion].icon} {selectedMapRegion}
                  </div>
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
  );
}
