import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScrollToTopOptions {
  threshold?: number; // 顯示回到頂部按鈕的滾動距離閾值
  selector?: string; // 自定義滾動容器選擇器
}

export const useScrollToTop = (options: UseScrollToTopOptions = {}) => {
  const { threshold = 100, selector } = options;
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // 智能檢測滾動容器的函數
  const findScrollContainer = useCallback(() => {
    // 如果提供了自定義選擇器，優先使用
    if (selector) {
      const customContainer = document.querySelector(selector);
      if (customContainer) {
        console.log('使用自定義滾動容器:', customContainer);
        return customContainer as HTMLElement;
      }
    }

    // 檢查是否有特定的滾動容器
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
  }, [selector]);

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
    
    // 當滾動超過閾值時顯示回到頂部按鈕
    const shouldShow = scrollTop > threshold;
    setShowScrollTop(shouldShow);
    console.log('滾動位置:', scrollTop, '顯示箭頭:', shouldShow, '閾值:', threshold);
  }, [threshold]);

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
  }, [selector, threshold]); // 只依賴 options 參數

  return {
    showScrollTop,
    scrollToTop,
    scrollContainer: scrollContainerRef.current
  };
};
