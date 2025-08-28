import React from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import ScrollToTopButton from '../components/ScrollToTopButton';

const ScrollTestPage: React.FC = () => {
  // 使用滾動檢測 Hook
  const { showScrollTop, scrollToTop } = useScrollToTop({ threshold: 100 });

  return (
    <div style={{ 
      minHeight: '300vh', 
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>滾動測試頁面</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        向下滾動超過100px會顯示回到頂部按鈕
      </p>
      
      {/* 創建一些內容來產生滾動 */}
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} style={{ 
          margin: '20px 0', 
          padding: '30px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>區塊 {i + 1}</h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            這是第 {i + 1} 個區塊，用來測試滾動功能。
          </p>
          <p style={{ fontSize: '1rem', opacity: 0.8 }}>
            當你滾動到這裡時，應該能看到回到頂部的按鈕。
          </p>
          <div style={{ 
            marginTop: '1rem', 
            padding: '10px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontFamily: 'monospace'
          }}>
            滾動位置: {Math.max(0, window.scrollY)}px
          </div>
        </div>
      ))}

      {/* 回到頂部按鈕 */}
      <ScrollToTopButton 
        show={showScrollTop}
        onClick={scrollToTop}
        size="large"
        position="bottom-right"
      />

      {/* 測試不同位置的按鈕 */}
      <ScrollToTopButton 
        show={showScrollTop}
        onClick={scrollToTop}
        size="medium"
        position="bottom-left"
        className="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
};

export default ScrollTestPage;
