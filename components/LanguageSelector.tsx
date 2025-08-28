import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  style = {} 
}) => {
  const { lang, setLang, LANGS } = useLanguage();

  const defaultStyle: React.CSSProperties = {
    padding: '3px 6px',
    borderRadius: 4,
    fontWeight: 600,
    fontSize: 11,
    border: '1px solid #6B5BFF',
    color: '#6B5BFF',
    background: '#fff',
    cursor: 'pointer',
    transition: 'background 0.18s, color 0.18s, border 0.18s',
    minWidth: style.minWidth !== undefined ? style.minWidth : 50,
    ...style
  };

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      className={className}
      style={defaultStyle}
    >
      {LANGS.map(l => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}; 