import React, { createContext, useContext, useState } from 'react';
import { getTranslation } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('jana_lang') || 'en');
  const [highContrast, setHighContrast] = useState(localStorage.getItem('jana_hc') === 'true');
  const [largeText, setLargeText] = useState(localStorage.getItem('jana_lt') === 'true');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('jana_lang', lang);
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem('jana_hc', String(next));
  };

  const toggleLargeText = () => {
    const next = !largeText;
    setLargeText(next);
    localStorage.setItem('jana_lt', String(next));
  };

  const t = (key) => getTranslation(language, key);

  return (
    <LanguageContext.Provider value={{
      language, changeLanguage, t,
      highContrast, toggleHighContrast,
      largeText, toggleLargeText
    }}>
      <div className={`${highContrast ? 'high-contrast' : ''} ${largeText ? 'large-text' : ''}`}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);