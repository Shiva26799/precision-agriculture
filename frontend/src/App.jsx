import React, { useState } from 'react';
import { useTranslation } from './components/LanguageContext';

// Import our new modular components
import PredictTab from './components/PredictTab';
import ProfitTab from './components/ProfitTab';
import RescueTab from './components/RescueTab';
import MapTab from './components/MapTab';

/**
 * Main App Component
 * This is the entry point of our frontend. It manages:
 * 1. Global state (Active Tab, Navigation)
 * 2. Feature-specific states (passed down to components as props)
 * 3. Layout (Navbar, Hero, Main Content Area, Footer)
 */
export default function App() {
  const { lang, setLang, t, translateCrop } = useTranslation();
  
  // Navigation State: Controls which feature is currently visible
  const [activeTab, setActiveTab] = useState('predict');
  
  // --- 1. Advisor (Predict) State ---
  const [formData, setFormData] = useState({
    region: '', district: '', N: 90, P: 42, K: 43, ph: 6.5,
    soil_type: 'black_cotton', temperature: 25, humidity: 72, rainfall: 120, season: 'kharif'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // --- 2. Profit Calculator State ---
  const [profitData, setProfitData] = useState({
    crop: 'rice', land_acres: 1, seed_cost: '', fert_cost: '', labour_cost: '', irrig_cost: '', other_cost: '', crop_rate: ''
  });
  const [profitResult, setProfitResult] = useState(null);
  const [profitLoading, setProfitLoading] = useState(false);
  const [profitError, setProfitError] = useState(null);

  // --- 3. Rescue (Recovery) State ---
  const [rescueSeason, setRescueSeason] = useState('kharif');
  const [rescueReason, setRescueReason] = useState('drought');
  const [rescueResults, setRescueResults] = useState(null);
  const [rescueLoading, setRescueLoading] = useState(false);

  // --- 4. Map State ---
  const [selectedMapRegion, setSelectedMapRegion] = useState(null);

  return (
    <div>
      {/* ── NAVBAR ── */}
      <nav>
        <div className="nav-brand">
          <div className="nav-logo">🌾</div>
          <div className="nav-name" dangerouslySetInnerHTML={{ __html: t('nav_brand') }}></div>
        </div>
        
        {/* Navigation Pills (Mobile/Desktop friendly) */}
        <div className="nav-pills">
          <button className={`nav-pill ${activeTab === 'predict' ? 'active' : ''}`} onClick={() => setActiveTab('predict')}>{t('tab_predict')}</button>
          <button className={`nav-pill ${activeTab === 'profit' ? 'active' : ''}`} onClick={() => setActiveTab('profit')}>{t('tab_profit')}</button>
          <button className={`nav-pill ${activeTab === 'rescue' ? 'active' : ''}`} onClick={() => setActiveTab('rescue')}>{t('tab_rescue')}</button>
          <button className={`nav-pill ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>{t('tab_map')}</button>
        </div>

        {/* Language Switcher (i18n) */}
        <div className="lang-row">
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
          <button className={`lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिं</button>
          <button className={`lang-btn ${lang === 'mr' ? 'active' : ''}`} onClick={() => setLang('mr')}>म</button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
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

      {/* ── MAIN CONTENT AREA ── */}
      <div className="main">
        {/* Secondary Tab Bar (for better UX) */}
        <div className="tab-bar">
          <button className={`tab ${activeTab === 'predict' ? 'active' : ''}`} onClick={() => setActiveTab('predict')}>{t('tab_predict')}</button>
          <button className={`tab ${activeTab === 'profit' ? 'active' : ''}`} onClick={() => setActiveTab('profit')}>{t('tab_profit')}</button>
          <button className={`tab ${activeTab === 'rescue' ? 'active' : ''}`} onClick={() => setActiveTab('rescue')}>{t('tab_rescue')}</button>
          <button className={`tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>{t('tab_map')}</button>
        </div>

        {/* 
          CONDITIONAL RENDERING: 
          We render the component corresponding to the active tab.
          State and handlers are passed as props.
        */}
        {activeTab === 'predict' && (
          <PredictTab 
            formData={formData} setFormData={setFormData}
            result={result} setResult={setResult}
            loading={loading} setLoading={setLoading}
            error={error} setError={setError}
          />
        )}

        {activeTab === 'profit' && (
          <ProfitTab 
            profitData={profitData} setProfitData={setProfitData}
            profitResult={profitResult} setProfitResult={setProfitResult}
            profitLoading={profitLoading} setProfitLoading={setProfitLoading}
            profitError={profitError} setProfitError={setProfitError}
          />
        )}

        {activeTab === 'rescue' && (
          <RescueTab 
            rescueSeason={rescueSeason} setRescueSeason={setRescueSeason}
            rescueReason={rescueReason} setRescueReason={setRescueReason}
            rescueResults={rescueResults} setRescueResults={setRescueResults}
            rescueLoading={rescueLoading} setRescueLoading={setRescueLoading}
          />
        )}

        {activeTab === 'map' && (
          <MapTab 
            selectedMapRegion={selectedMapRegion} 
            setSelectedMapRegion={setSelectedMapRegion} 
          />
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer dangerouslySetInnerHTML={{ __html: t('footer_text') }}></footer>
    </div>
  );
}
