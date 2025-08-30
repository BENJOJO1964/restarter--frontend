import React, { useState, useEffect, useRef, useCallback } from 'react';

const ScrollTest: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // 智能檢測滾動容器的函數
  const findScrollContainer = useCallback(() => {
    // 首先檢查是否有特定的滾動容器
    const scrollContainer = document.querySelector('.scroll-container, [data-scroll-container], .overflow-auto, .overflow-scroll');
    
    if (scrollContainer) {
      console.log('找到滾動容器:', scrollContainer);
      return scrollContainer as HTMLElement;
    }
    
    // 檢查是否有可滾動的元素
    const scrollableElements = document.querySelectorAll('*');
    for (const element of scrollableElements) {
      const style = window.getComputedStyle(element);
      if (style.overflow === 'auto' || style.overflow === 'scroll' || 
          style.overflowY === 'auto' || style.overflowY === 'scroll') {
        // 檢查是否真的有滾動條
        if (element.scrollHeight > element.clientHeight) {
          console.log('找到可滾動元素:', element.tagName, element.className);
          return element as HTMLElement;
        }
      }
    }
    
    // 如果沒有找到特定容器，使用 window
    console.log('使用 window 作為滾動容器');
    return null;
  }, []);

  // 滾動處理函數
  const handleScroll = useCallback(() => {
    console.log('scroll triggered'); // 日誌驗證
    
    const container = scrollContainerRef.current;
    let scrollTop = 0;
    
    if (container) {
      // 使用容器的滾動位置
      scrollTop = container.scrollTop;
      console.log('容器滾動位置:', scrollTop);
    } else {
      // 使用 window 的滾動位置
      scrollTop = window.scrollY;
      console.log('window 滾動位置:', scrollTop);
    }
    
    // 當滾動超過100px時顯示回到頂部按鈕
    const shouldShow = scrollTop > 100;
    setShowScrollTop(shouldShow);
    console.log('滾動位置:', scrollTop, '顯示箭頭:', shouldShow, 'showScrollTop狀態:', shouldShow);
  }, []);

  // 回到頂部函數
  const scrollToTop = useCallback(() => {
    console.log('回到頂部按鈕被點擊');
    const container = scrollContainerRef.current;
    
    if (container) {
      // 滾動容器到頂部
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // 滾動 window 到頂部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    // 檢測滾動容器
    scrollContainerRef.current = findScrollContainer();
    
    // 綁定滾動事件監聽器
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      console.log('綁定滾動事件到容器:', container);
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      console.log('綁定滾動事件到 window');
    }
    
    // 立即檢查初始滾動位置
    handleScroll();
    
    // 清理函數
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
        console.log('移除容器滾動事件監聽器');
      } else {
        window.removeEventListener('scroll', handleScroll);
        console.log('移除 window 滾動事件監聽器');
      }
    };
  }, [findScrollContainer, handleScroll]);

  return (
    <div style={{ 
      minHeight: '200vh', 
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1>滾動測試頁面</h1>
      <p>向下滾動超過100px會顯示回到頂部按鈕</p>
      
      {/* 創建一些內容來產生滾動 */}
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} style={{ 
          margin: '20px 0', 
          padding: '20px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '8px' 
        }}>
          <h3>區塊 {i + 1}</h3>
          <p>這是第 {i + 1} 個區塊，用來測試滾動功能。</p>
          <p>當你滾動到這裡時，應該能看到回到頂部的按鈕。</p>
        </div>
      ))}

      {/* 回到頂部按鈕 */}
      {showScrollTop && (
        <div 
          className="scroll-to-top-button"
          onClick={scrollToTop}
          title="回到頂部"
        >
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ScrollTest;
