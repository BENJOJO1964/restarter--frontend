import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const location = useLocation();
  const navigate = useNavigate();
  const t = FOOTER_TEXT[lang] || FOOTER_TEXT['zh-TW'];
  const [footerPosition, setFooterPosition] = useState(20);

  // 檢查是否在特定頁面
  const isFeedbackPage = location.pathname === '/feedback';
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    // 如果在 Feedback 頁面，使用固定位置
    if (isFeedbackPage) {
      setFooterPosition(20);
      return;
    }

    // 首頁使用固定的較小間距，與挑戰任務頁面保持一致
    if (isHomePage) {
      setFooterPosition(24); // 使用與挑戰任務頁面相同的間距
      return;
    }

    // 其他頁面使用預設位置
    setFooterPosition(20);
  }, [lang, isFeedbackPage, isHomePage]);

  // 如果是首頁桌面版，不顯示Footer（因為按鈕已經直接放在頁面中）
  if (isHomePage && typeof window !== 'undefined' && window.innerWidth > 768) {
    return null;
  }

  return (
    <footer
      style={{
        width: '100%',
        margin: '0 auto',
        marginTop: isHomePage ? 0 : 0,
        background: isHomePage ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.92)',
        borderRadius: isHomePage ? 16 : 0,
        padding: isHomePage ? '16px' : '8px 0',
        boxShadow: isHomePage ? '0 2px 12px #6B5BFF22' : '0 -2px 8px #0001',
        borderTop: isHomePage ? 'none' : '1px solid #eee',
        position: isFeedbackPage ? 'fixed' : (isHomePage ? 'relative' : 'static'),
        bottom: isFeedbackPage ? 0 : 'auto',
        top: isFeedbackPage ? 'auto' : (isHomePage ? `${footerPosition}px` : 'auto'),
        zIndex: 10,
        transition: isFeedbackPage ? 'none' : (isHomePage ? 'top 0.3s ease' : 'none'),
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isHomePage ? 20 : 40,
          flexWrap: 'wrap',
          padding: isHomePage ? '0' : '0 20px'
        }}
      >
        {/* 所有按鈕一行排列 */}
        <span onClick={() => navigate('/privacy-policy')} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: isHomePage ? '4px 8px' : '4px 8px', fontSize: isHomePage ? 12 : 14, cursor: 'pointer' }}>{t.privacy}</span>
        <span onClick={() => navigate('/terms')} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: isHomePage ? '4px 8px' : '4px 8px', fontSize: isHomePage ? 12 : 14, cursor: 'pointer' }}>{t.terms}</span>
        <span onClick={() => navigate('/data-deletion')} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: isHomePage ? '4px 8px' : '4px 8px', fontSize: isHomePage ? 12 : 14, cursor: 'pointer' }}>{t.deletion}</span>
        <span onClick={() => navigate('/about')} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: isHomePage ? '4px 8px' : '4px 8px', fontSize: isHomePage ? 12 : 14, cursor: 'pointer' }}>{ABOUT_TEXT[lang] || ABOUT_TEXT['zh-TW']}</span>
        <span onClick={() => navigate('/feedback')} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: isHomePage ? '4px 8px' : '4px 8px', fontSize: isHomePage ? 12 : 14, cursor: 'pointer' }}>{FEEDBACK_TEXT[lang] || FEEDBACK_TEXT['zh-TW']}</span>
      </div>
      <style>{`
        @media (max-width: 768px) {
          footer {
            padding: 4px 16px 24px 16px !important;
            marginTop: 0 !important;
            position: relative !important;
            bottom: auto !important;
            top: auto !important;
          }
          footer > div {
            gap: 12px !important;
            flex-direction: row !important;
            justify-content: flex-start !important;
            flex-wrap: wrap !important;
            padding-left: 20px !important;
          }
          footer > div > a {
            padding: 4px 6px !important;
            fontSize: 12px !important;
          }
        }
        @media (min-width: 700px) {
          footer {
            padding: 8px !important;
          }
          footer > div {
            flex-direction: row !important;
            gap: 40px !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
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