import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  const translateCrop = (c) => {
    if (!c) return c;
    const key = 'crop_' + c.toLowerCase().replace(/\s+/g, '');
    return t(key);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translateCrop }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
