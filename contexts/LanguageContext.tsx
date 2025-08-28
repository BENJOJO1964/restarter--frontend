import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'th' | 'vi' | 'ms' | 'la';

export const LANGS: { code: LanguageCode; label: string }[] = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'la', label: 'Latīna' },
];

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  LANGS: typeof LANGS;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // 使用更安全的初始化方式
  const [lang, setLangState] = useState<LanguageCode>(() => {
    // 嘗試從 localStorage 讀取，如果失敗則使用預設值
    try {
      const savedLang = localStorage.getItem('lang') as LanguageCode;
      if (savedLang && LANGS.some(l => l.code === savedLang)) {
        return savedLang;
      }
    } catch (error) {
      console.warn('Failed to read language from localStorage:', error);
    }
    return 'zh-TW';
  });

  // 初始化時自動偵測瀏覽器語言
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('lang') as LanguageCode;
      if (savedLang && LANGS.some(l => l.code === savedLang)) {
        return; // 已經有保存的語言設定
      }
      
      // 更精準的語言對應表
      const langMap: Record<string, LanguageCode> = {
        'en': 'en',
        'en-US': 'en',
        'en-GB': 'en',
        'zh-TW': 'zh-TW',
        'zh-HK': 'zh-TW',
        'zh-Hant': 'zh-TW',
        'zh-CN': 'zh-CN',
        'zh-Hans': 'zh-CN',
        'ja': 'ja',
        'ko': 'ko',
        'vi': 'vi',
        'th': 'th',
        'ms': 'ms',
        'la': 'la',
      };
      
      const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || '';
      let detected: LanguageCode = 'en';
      
      if (langMap[browserLang]) {
        detected = langMap[browserLang];
      } else if (langMap[browserLang.split('-')[0]]) {
        detected = langMap[browserLang.split('-')[0]];
      }
      
      if (detected !== lang) {
        setLangState(detected);
        localStorage.setItem('lang', detected);
      }
    } catch (error) {
      console.warn('Failed to detect browser language:', error);
    }
  }, []); // 只在組件掛載時執行一次

  // 語言切換函數
  const setLang = (newLang: LanguageCode) => {
    try {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
    }
  };

  const value = {
    lang,
    setLang,
    LANGS,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 