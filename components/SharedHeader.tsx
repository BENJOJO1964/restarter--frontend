import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../src/firebaseConfig';
import { useLanguage } from '../contexts/LanguageContext';

// 從 Home.tsx 複製的常量
const LOGOUT_TEXT = {
  'zh-TW': '登出',
  'zh-CN': '登出',
  'en': 'Logout',
  'ja': 'ログアウト',
  'ko': '로그아웃',
  'th': 'ออกจากระบบ',
  'vi': 'Đăng xuất',
  'ms': 'Log keluar',
  'la': 'Exire'
};

const FOOTER_TEXT = {
  'zh-TW': {
    privacy: '隱私權政策',
    terms: '條款/聲明',
    deletion: '資料刪除說明'
  },
  'zh-CN': {
    privacy: '隐私政策',
    terms: '条款/声明',
    deletion: '数据删除说明'
  },
  'en': {
    privacy: 'Privacy Policy',
    terms: 'Terms/Statement',
    deletion: 'Data Deletion'
  },
  'ja': {
    privacy: 'プライバシーポリシー',
    terms: '利用規約/声明',
    deletion: 'データ削除について'
  },
  'ko': {
    privacy: '개인정보보호정책',
    terms: '약관/성명',
    deletion: '데이터 삭제 설명'
  },
  'th': {
    privacy: 'นโยบายความเป็นส่วนตัว',
    terms: 'ข้อกำหนด/คำแถลง',
    deletion: 'คำอธิบายการลบข้อมูล'
  },
  'vi': {
    privacy: 'Chính sách bảo mật',
    terms: 'Điều khoản/Tuyên bố',
    deletion: 'Giải thích xóa dữ liệu'
  },
  'ms': {
    privacy: 'Dasar Privasi',
    terms: 'Terma/Penyata',
    deletion: 'Penerangan Pemadaman Data'
  },
  'la': {
    privacy: 'Consilium de Privata',
    terms: 'Termini/Declaratio',
    deletion: 'Explicatio Deletionis Datae'
  }
};

interface SharedHeaderProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function SharedHeader({ className, style }: SharedHeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { lang } = useLanguage();
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const legalMenuRef = useRef<HTMLDivElement>(null);

  // 監聽用戶認證狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (legalMenuRef.current && !legalMenuRef.current.contains(event.target as Node)) {
        setShowLegalMenu(false);
      }
    };

    if (showLegalMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLegalMenu]);

  return (
    <div 
      className={className}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 100, 
        background: 'rgba(255,255,255,0.95)', 
        padding: '8px 16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: '0 2px 8px #0001',
        ...style 
      }}
    >
      {/* 左側：LOGO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img 
          src="/ctx-logo.png" 
          alt="logo" 
          style={{ width: 72, height: 72, cursor: 'pointer' }} 
          onClick={() => navigate('/')} 
        />
      </div>
      
      {/* 右側：用戶資訊和按鈕 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? (
          <>
            <img 
              src={user.photoURL || '/ctx-logo.png'} 
              alt="avatar" 
              style={{ 
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                objectFit: 'cover', 
                border: '2px solid #6B5BFF' 
              }} 
            />
            <span style={{ 
              color: '#6B5BFF', 
              fontWeight: 600, 
              fontSize: 12, 
              maxWidth: 60, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {user.displayName || user.email || '用戶'}
            </span>
            <button 
              className="topbar-btn" 
              onClick={async () => { await signOut(auth); }} 
              style={{ 
                width: '80px', 
                fontSize: 14, 
                padding: '6px 10px', 
                height: '28px',
                borderRadius: 4,
                fontWeight: 600,
                border: '1px solid #ff6347',
                color: '#ff6347',
                background: '#fff',
                cursor: 'pointer',
                transition: 'background 0.18s, color 0.18s, border 0.18s'
              }}
            >
              {LOGOUT_TEXT[lang]}
            </button>
          </>
        ) : (
          <button 
            className="topbar-btn" 
            onClick={() => navigate('/register')} 
            style={{ 
              background: '#fff', 
              color: '#1976d2', 
              border: '1px solid #1976d2', 
              borderRadius: 6, 
              fontWeight: 600, 
              fontSize: 12, 
              padding: '4px 8px' 
            }}
          >
            {lang==='zh-TW'?'註冊':'zh-CN'===lang?'注册':'en'===lang?'Register':'ja'===lang?'登録':'ko'===lang?'가입':'th'===lang?'สมัคร':'vi'===lang?'Đăng ký':'ms'===lang?'Daftar':'Registrare'}
          </button>
        )}
        
        {/* 手機版漢堡選單 - 法律文件 */}
        <div style={{ position: 'relative', display: 'inline-block' }} ref={legalMenuRef}>
          <button
            className="topbar-btn"
            style={{
              background: '#6B5BFF',
              color: '#fff',
              border: '2px solid #6B5BFF',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 12,
              padding: '8px 10px',
              minWidth: 44,
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setShowLegalMenu(v => !v)}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#5a4fd9';
              e.currentTarget.style.borderColor = '#5a4fd9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#6B5BFF';
              e.currentTarget.style.borderColor = '#6B5BFF';
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ width: '16px', height: '2px', background: 'currentColor', borderRadius: '1px' }}></div>
              <div style={{ width: '16px', height: '2px', background: 'currentColor', borderRadius: '1px' }}></div>
              <div style={{ width: '16px', height: '2px', background: 'currentColor', borderRadius: '1px' }}></div>
            </div>
          </button>
          {showLegalMenu && (
            <div style={{ 
              position: 'absolute', 
              right: 0, 
              top: '110%', 
              background: '#fff', 
              border: '1.5px solid #6B5BFF', 
              borderRadius: 8, 
              boxShadow: '0 4px 16px #0002', 
              zIndex: 9999, 
              minWidth: 180,
              maxWidth: 220,
              padding: '8px 0'
            }}>
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B5BFF' }}>
                  {lang === 'zh-TW' ? '法律文件' : 
                   lang === 'zh-CN' ? '法律文件' : 
                   lang === 'en' ? 'Legal Documents' : 
                   lang === 'ja' ? '法的文書' : 
                   lang === 'ko' ? '법적 문서' : 
                   lang === 'th' ? 'เอกสารทางกฎหมาย' : 
                   lang === 'vi' ? 'Tài liệu pháp lý' : 
                   lang === 'ms' ? 'Dokumen Undang-undang' : 
                   'Documenta Iuridica'}
                </span>
              </div>
              {[
                // Footer原有的法律文件
                { key: 'privacy', title: FOOTER_TEXT, titleKey: 'privacy', path: '/privacy-policy' },
                { key: 'terms', title: FOOTER_TEXT, titleKey: 'terms', path: '/terms' },
                { key: 'data', title: FOOTER_TEXT, titleKey: 'deletion', path: '/data-deletion' },
                // 漢堡選單原有的其他法律文件
                { key: 'ai', title: { 'zh-TW': 'AI使用聲明', 'zh-CN': 'AI使用声明', 'en': 'AI Usage Statement', 'ja': 'AI利用声明', 'ko': 'AI 사용 성명', 'th': 'คำแถลงการใช้ AI', 'vi': 'Tuyên bố sử dụng AI', 'ms': 'Penyata Penggunaan AI', 'la': 'Declaratio Usus AI' }, path: '/ai-statement' },
                { key: 'mental', title: { 'zh-TW': '心理健康免責聲明', 'zh-CN': '心理健康免责声明', 'en': 'Mental Health Disclaimer', 'ja': 'メンタルヘルス免責事項', 'ko': '정신건강 면책조항', 'th': 'ข้อจำกัดความรับผิดชอบด้านสุขภาพจิต', 'vi': 'Tuyên bố miễn trừ sức khỏe tâm thần', 'ms': 'Penafian Kesihatan Mental', 'la': 'Renuntiatio Salutis Mentalis' }, path: '/mental-health-disclaimer' },
                { key: 'cookie', title: { 'zh-TW': 'Cookie政策', 'zh-CN': 'Cookie政策', 'en': 'Cookie Policy', 'ja': 'Cookieポリシー', 'ko': '쿠키 정책', 'th': 'นโยบายคุกกี้', 'vi': 'Chính sách Cookie', 'ms': 'Dasar Cookie', 'la': 'Politica Cookie' }, path: '/cookie-policy' },
                { key: 'children', title: { 'zh-TW': '兒童隱私保護', 'zh-CN': '儿童隐私保护', 'en': 'Children\'s Privacy', 'ja': '児童プライバシー保護', 'ko': '아동 개인정보 보호', 'th': 'การคุ้มครองความเป็นส่วนตัวของเด็ก', 'vi': 'Bảo vệ quyền riêng tư trẻ em', 'ms': 'Privasi Kanak-kanak', 'la': 'Privata Puerorum' }, path: '/children-privacy' },
                { key: 'international', title: { 'zh-TW': '國際用戶聲明', 'zh-CN': '国际用户声明', 'en': 'International Users', 'ja': '国際ユーザー声明', 'ko': '국제 사용자 성명', 'th': 'คำแถลงสำหรับผู้ใช้ระหว่างประเทศ', 'vi': 'Tuyên bố người dùng quốc tế', 'ms': 'Penyata Pengguna Antarabangsa', 'la': 'Declaratio Usuarii Internationalis' }, path: '/international-users' },
                { key: 'security', title: { 'zh-TW': '安全聲明', 'zh-CN': '安全声明', 'en': 'Security Statement', 'ja': 'セキュリティ声明', 'ko': '보안 성명', 'th': 'คำแถลงความปลอดภัย', 'vi': 'Tuyên bố bảo mật', 'ms': 'Penyata Keselamatan', 'la': 'Declaratio Securitatis' }, path: '/security-statement' },
                { key: 'update', title: { 'zh-TW': '更新通知機制', 'zh-CN': '更新通知机制', 'en': 'Update Notification', 'ja': '更新通知メカニズム', 'ko': '업데이트 알림 메커니즘', 'th': 'กลไกการแจ้งเตือนการอัปเดต', 'vi': 'Cơ chế thông báo cập nhật', 'ms': 'Mekanisme Pemberitahuan Kemas Kini', 'la': 'Mechanismus Notificationis Renovationis' }, path: '/update-notification' }
              ].map(item => (
                <div 
                  key={item.key}
                  style={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer', 
                    color: '#232946', 
                    fontWeight: 500, 
                    background: '#fff',
                    fontSize: '11px',
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'all 0.2s ease'
                  }} 
                  onClick={() => {
                    navigate(item.path);
                    setShowLegalMenu(false);
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f3f0ff';
                    e.currentTarget.style.color = '#6B5BFF';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.color = '#232946';
                  }}
                >
                  {item.titleKey ? (item.title[lang]?.[item.titleKey] || item.title['zh-TW'][item.titleKey]) : (item.title[lang] || item.title['zh-TW'])}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
