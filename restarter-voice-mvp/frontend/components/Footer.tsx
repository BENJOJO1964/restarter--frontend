import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FOOTER_TEXT = {
  'zh-TW': {
    privacy: '隱私權政策',
    terms: '條款/聲明',
    deletion: '資料刪除說明',
  },
  'zh-CN': {
    privacy: '隐私政策',
    terms: '条款/声明',
    deletion: '数据删除说明',
  },
  'en': {
    privacy: 'Privacy Policy',
    terms: 'Terms/Statement',
    deletion: 'Data Deletion',
  },
  'ja': {
    privacy: 'プライバシーポリシー',
    terms: '規約/声明',
    deletion: 'データ削除について',
  },
  'ko': {
    privacy: '개인정보 처리방침',
    terms: '약관/성명',
    deletion: '데이터 삭제 안내',
  },
  'th': {
    privacy: 'นโยบายความเป็นส่วนตัว',
    terms: 'ข้อกำหนด/แถลงการณ์',
    deletion: 'คำอธิบายการลบข้อมูล',
  },
  'vi': {
    privacy: 'Chính sách bảo mật',
    terms: 'Điều khoản/Tuyên bố',
    deletion: 'Giải thích xóa dữ liệu',
  },
  'ms': {
    privacy: 'Dasar Privasi',
    terms: 'Terma/Pernyataan',
    deletion: 'Penjelasan Penghapusan Data',
  },
  'la': {
    privacy: 'Consilium de Privata',
    terms: 'Termini/Declaratio',
    deletion: 'Explicatio Deletionis Datae',
  },
};

const ABOUT_TEXT = {
  'zh-TW': '🧬 Restarter™｜我們是誰',
  'zh-CN': '🧬 Restarter™｜我们是谁',
  'en': '🧬 Restarter™｜Who We Are',
  'ja': '🧬 Restarter™｜私たちについて',
  'ko': '🧬 Restarter™｜우리는 누구인가',
  'th': '🧬 Restarter™｜เราเป็นใคร',
  'vi': '🧬 Restarter™｜Chúng tôi là ai',
  'ms': '🧬 Restarter™｜Siapa Kami',
  'la': '🧬 Restarter™｜Quis sumus',
};
const FEEDBACK_TEXT = {
  'zh-TW': '💬 意見箱｜我們想聽你說',
  'zh-CN': '💬 意见箱｜我们想听你说',
  'en': '💬 Feedback｜We Want to Hear You',
  'ja': '💬 ご意見箱｜あなたの声を聞かせて',
  'ko': '💬 피드백｜여러분의 의견을 듣고 싶어요',
  'th': '💬 กล่องความคิดเห็น｜เราอยากฟังคุณ',
  'vi': '💬 Hộp góp ý｜Chúng tôi muốn lắng nghe bạn',
  'ms': '💬 Kotak Maklum Balas｜Kami ingin mendengar anda',
  'la': '💬 Arca Consilii｜Te audire volumus',
};

const Footer: React.FC = () => {
  const { lang } = useLanguage();
  const t = FOOTER_TEXT[lang] || FOOTER_TEXT['zh-TW'];
  const [footerPosition, setFooterPosition] = useState(20);

  useEffect(() => {
    const adjustFooterPosition = () => {
      // 獲取所有功能按鈕
      const featureButtons = document.querySelectorAll('.feature-btn');
      const chatButton = document.querySelector('.home-chat-btn');
      
      if (featureButtons.length > 0 || chatButton) {
        // 計算所有按鈕的底部位置
        let maxBottom = 0;
        
        // 檢查功能按鈕
        featureButtons.forEach(button => {
          const rect = button.getBoundingClientRect();
          maxBottom = Math.max(maxBottom, rect.bottom);
        });
        
        // 檢查聊天按鈕
        if (chatButton) {
          const rect = chatButton.getBoundingClientRect();
          maxBottom = Math.max(maxBottom, rect.bottom);
        }
        
        // 計算視窗高度
        const windowHeight = window.innerHeight;
        
        // 計算需要的額外空間（確保footer不被遮住）
        const requiredSpace = 180; // footer高度 + 緩衝空間
        const availableSpace = windowHeight - maxBottom;
        
        // 如果空間不足，調整footer位置
        if (availableSpace < requiredSpace) {
          const additionalSpace = requiredSpace - availableSpace;
          setFooterPosition(20 + additionalSpace);
        } else {
          setFooterPosition(20);
        }
      }
    };

    // 初始調整
    adjustFooterPosition();
    
    // 監聽視窗大小變化
    window.addEventListener('resize', adjustFooterPosition);
    
    // 監聽語言變化
    const handleLanguageChange = () => {
      setTimeout(adjustFooterPosition, 200); // 延遲執行，確保DOM已更新
    };
    
    // 監聽DOM變化
    const observer = new MutationObserver(() => {
      setTimeout(adjustFooterPosition, 100);
    });
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    return () => {
      window.removeEventListener('resize', adjustFooterPosition);
      observer.disconnect();
    };
  }, [lang]);

  return (
    <footer
      style={{
        width: '100%',
        textAlign: 'center',
        fontSize: 14,
        color: '#888',
        marginTop: 0,
        padding: '16px 0',
        background: 'rgba(255,255,255,0.92)',
        borderTop: '1px solid #eee',
        boxShadow: '0 -2px 8px #0001',
        position: 'relative',
        top: `${footerPosition}px`,
        zIndex: 10,
        transition: 'top 0.3s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          padding: '0 20px'
        }}
      >
        {/* 第一行：隱私權政策、條款/聲明、資料刪除說明 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40,
          flexWrap: 'wrap'
        }}>
          <a href="/privacy-policy" style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px' }}>{t.privacy}</a>
          <a href="/terms" style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px' }}>{t.terms}</a>
          <a href="/data-deletion" style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px' }}>{t.deletion}</a>
        </div>
        {/* 第二行：我們是誰、意見箱 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 40,
          flexWrap: 'wrap'
        }}>
          <a href="/about" style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px' }}>{ABOUT_TEXT[lang] || ABOUT_TEXT['zh-TW']}</a>
          <a href="/feedback" style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px' }}>{FEEDBACK_TEXT[lang] || FEEDBACK_TEXT['zh-TW']}</a>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          footer {
            padding: 8px 16px 40px 16px !important;
            marginTop: 0 !important;
            top: 0 !important;
          }
          footer > div {
            gap: 12px !important;
            flex-direction: column !important;
            justify-content: center !important;
          }
          footer > div > div {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            gap: 20px !important;
            flex-wrap: wrap !important;
          }
          footer > div > a {
            padding: 4px 6px !important;
            fontSize: 12px !important;
          }
        }
        @media (min-width: 700px) {
          footer {
            padding: 16px !important;
          }
          footer > div {
            flex-direction: row !important;
            gap: 40px !important;
            justify-content: space-between !important;
          }
          footer > div > a {
            padding: 4px 8px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer; 