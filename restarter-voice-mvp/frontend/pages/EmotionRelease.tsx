import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth';
import app from '../src/firebaseConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import Footer from '../components/Footer';
import SharedHeader from '../components/SharedHeader';

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

// 本地存儲工具函數
const saveGameProgress = (gameId: string, data: any) => {
  try {
    localStorage.setItem(`emotionRelease_${gameId}`, JSON.stringify(data));
  } catch (error) {
    console.log('無法保存遊戲進度到本地存儲');
  }
};

const loadGameProgress = (gameId: string) => {
  try {
    const saved = localStorage.getItem(`emotionRelease_${gameId}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.log('無法從本地存儲載入遊戲進度');
    return null;
  }
};

export default function EmotionRelease() {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const [showLangBox, setShowLangBox] = useState(false);
  const legalMenuRef = useRef<HTMLDivElement>(null);
  const langBoxRef = useRef<HTMLDivElement>(null);
  const auth = getAuth(app);

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
      if (langBoxRef.current && !langBoxRef.current.contains(event.target as Node)) {
        setShowLangBox(false);
      }
    };

    if (showLegalMenu || showLangBox) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLegalMenu, showLangBox]);

  // 預載入背景圖片
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // 即使載入失敗也繼續顯示
    
    // 設定超時，避免無限載入
    const timeout = setTimeout(() => {
      setImageLoaded(true);
    }, 3000); // 3秒後強制顯示
    
    img.src = '/stress.png';
    
    return () => clearTimeout(timeout);
  }, []);

  // 翻譯系統
  const getText = (key: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      'zh-TW': {
        title: '情緒發洩區',
        subtitle: '簡單遊戲，不複雜，輕鬆釋放你的情緒。',
        farm: '生活農場',
        farmDesc: '點擊種植，感受成長的喜悅',
        whackAMole: '打地鼠',
        whackAMoleDesc: '快速點擊，釋放壓力',
        fruitPicking: '採水果',
        fruitPickingDesc: '點擊收集，享受豐收',
        targetShooting: '情緒泡泡爆破',
        targetShootingDesc: '戳破情緒泡泡，釋放內心壓力',
        racing: '極速賽車',
        racingDesc: '駕駛賽車，體驗速度與激情',
        rhythm: '音樂節奏',
        rhythmDesc: '跟隨節奏，釋放音樂能量',
        rules: '遊戲規則',
        back: '返回',
        start: '開始遊戲',
        close: '關閉'
      },
      'zh-CN': {
        title: '情绪发泄区',
        subtitle: '简单游戏，不复杂，轻松释放你的情绪。',
        farm: '生活农场',
        farmDesc: '点击种植，感受成长的喜悦',
        whackAMole: '打地鼠',
        whackAMoleDesc: '快速点击，释放压力',
        fruitPicking: '采水果',
        fruitPickingDesc: '点击收集，享受丰收',
        targetShooting: '飞靶射击',
        targetShootingDesc: '瞄准射击，提升专注力',
        racing: '极速赛车',
        racingDesc: '驾驶赛车，体验速度与激情',
        rhythm: '音乐节奏',
        rhythmDesc: '跟随节奏，释放音乐能量',
        rules: '游戏规则',
        back: '返回',
        start: '开始游戏',
        close: '关闭'
      },
      'en': {
        title: 'Emotion Release Zone',
        subtitle: 'Simple games, not complicated, easily release your emotions.',
        farm: 'Life Farm',
        farmDesc: 'Click to plant, feel the joy of growth',
        whackAMole: 'Whack-a-Mole',
        whackAMoleDesc: 'Quick clicks to release stress',
        fruitPicking: 'Fruit Picking',
        fruitPickingDesc: 'Click to collect, enjoy the harvest',
        targetShooting: 'Target Shooting',
        targetShootingDesc: 'Aim and shoot, improve focus',
        racing: 'Speed Racing',
        racingDesc: 'Drive racing cars, experience speed and excitement',
        rhythm: 'Music Rhythm',
        rhythmDesc: 'Follow the rhythm, release musical energy',
        rules: 'Game Rules',
        back: 'Back',
        start: 'Start Game',
        close: 'Close'
      },
      'ja': {
        title: '感情発散エリア',
        subtitle: 'シンプルなゲーム、複雑ではなく、簡単に感情を解放。',
        farm: 'ライフファーム',
        farmDesc: 'クリックして植える、成長の喜びを感じる',
        whackAMole: 'モグラたたき',
        whackAMoleDesc: '素早くクリックしてストレスを解放',
        fruitPicking: 'フルーツ収穫',
        fruitPickingDesc: 'クリックして収穫、収穫を楽しむ',
        targetShooting: 'ターゲット射撃',
        targetShootingDesc: '狙って撃つ、集中力を向上',
        racing: 'スピードレーシング',
        racingDesc: 'レーシングカーを運転、スピードと興奮を体験',
        rhythm: '音楽リズム',
        rhythmDesc: 'リズムに合わせて、音楽エネルギーを解放',
        rules: 'ゲームルール',
        back: '戻る',
        start: 'ゲーム開始',
        close: '閉じる'
      },
      'ko': {
        title: '감정 발산 구역',
        subtitle: '간단한 게임, 복잡하지 않고, 쉽게 감정을 해방하세요.',
        farm: '라이프 팜',
        farmDesc: '클릭하여 심고, 성장의 기쁨을 느끼세요',
        whackAMole: '두더지 잡기',
        whackAMoleDesc: '빠르게 클릭하여 스트레스를 해방하세요',
        fruitPicking: '과일 수확',
        fruitPickingDesc: '클릭하여 수확하고, 수확의 기쁨을 누리세요',
        targetShooting: '타겟 사격',
        targetShootingDesc: '조준하고 쏘기, 집중력 향상',
        racing: '스피드 레이싱',
        racingDesc: '레이싱카 운전, 속도와 흥분을 경험',
        rhythm: '음악 리듬',
        rhythmDesc: '리듬에 맞춰 음악 에너지를 해방',
        rules: '게임 규칙',
        back: '돌아가기',
        start: '게임 시작',
        close: '닫기'
      },
      'vi': {
        title: 'Khu Vực Giải Tỏa Cảm Xúc',
        subtitle: 'Trò chơi đơn giản, không phức tạp, dễ dàng giải tỏa cảm xúc của bạn.',
        farm: 'Nông Trại Cuộc Sống',
        farmDesc: 'Nhấp để trồng, cảm nhận niềm vui của sự phát triển',
        whackAMole: 'Đập Chuột',
        whackAMoleDesc: 'Nhấp nhanh để giải tỏa căng thẳng',
        fruitPicking: 'Hái Trái Cây',
        fruitPickingDesc: 'Nhấp để thu hoạch, tận hưởng mùa màng',
        targetShooting: 'Bắn Bia',
        targetShootingDesc: 'Nhắm và bắn, cải thiện sự tập trung',
        racing: 'Đua Xe Tốc Độ',
        racingDesc: 'Lái xe đua, trải nghiệm tốc độ và sự phấn khích',
        rhythm: 'Nhịp Điệu Âm Nhạc',
        rhythmDesc: 'Theo nhịp điệu, giải phóng năng lượng âm nhạc',
        rules: 'Luật Chơi',
        back: 'Quay Lại',
        start: 'Bắt Đầu Trò Chơi',
        close: 'Đóng'
      },
      'th': {
        title: 'พื้นที่ระบายอารมณ์',
        subtitle: 'เกมง่ายๆ ไม่ซับซ้อน ปลดปล่อยอารมณ์ของคุณได้อย่างง่ายดาย',
        farm: 'ฟาร์มชีวิต',
        farmDesc: 'คลิกเพื่อปลูก รู้สึกถึงความสุขของการเติบโต',
        whackAMole: 'ตีตุ่น',
        whackAMoleDesc: 'คลิกเร็วเพื่อระบายความเครียด',
        fruitPicking: 'เก็บผลไม้',
        fruitPickingDesc: 'คลิกเพื่อเก็บเกี่ยว สนุกกับการเก็บเกี่ยว',
        targetShooting: 'ยิงเป้า',
        targetShootingDesc: 'เล็งและยิง ปรับปรุงสมาธิ',
        racing: 'แข่งรถความเร็ว',
        racingDesc: 'ขับรถแข่ง ประสบการณ์ความเร็วและความตื่นเต้น',
        rhythm: 'จังหวะดนตรี',
        rhythmDesc: 'ตามจังหวะ ปลดปล่อยพลังงานดนตรี',
        rules: 'กฎเกม',
        back: 'กลับ',
        start: 'เริ่มเกม',
        close: 'ปิด'
      },
      'la': {
        title: 'Zona Emotio Liberationis',
        subtitle: 'Ludi simplices, non complicati, facile libera emotiones tuas.',
        farm: 'Villa Vitae',
        farmDesc: 'Clicca ad plantandum, senti gaudium incrementi',
        whackAMole: 'Talpa Percutere',
        whackAMoleDesc: 'Clicca celeriter ad liberationem tensionis',
        fruitPicking: 'Fructus Colligere',
        fruitPickingDesc: 'Clicca ad colligendum, fruere messe',
        targetShooting: 'Scopum Iaculare',
        targetShootingDesc: 'Intende et iacula, meliora attentionem',
        racing: 'Cursus Velocitatis',
        racingDesc: 'Guberna currus cursus, experire velocitatem et excitationem',
        rhythm: 'Rhythmus Musicae',
        rhythmDesc: 'Sequere rhythmum, libera energiam musicam',
        rules: 'Regulae Ludi',
        back: 'Regredi',
        start: 'Ludum Incipere',
        close: 'Claudere'
      },
      'ms': {
        title: 'Zon Pelepasan Emosi',
        subtitle: 'Permainan mudah, tidak rumit, mudah melepaskan emosi anda.',
        farm: 'Ladang Kehidupan',
        farmDesc: 'Klik untuk menanam, rasakan kegembiraan pertumbuhan',
        whackAMole: 'Pukul Tikus',
        whackAMoleDesc: 'Klik pantas untuk melepaskan tekanan',
        fruitPicking: 'Kutip Buah',
        fruitPickingDesc: 'Klik untuk mengutip, nikmati hasil tuaian',
        targetShooting: 'Tembak Sasaran',
        targetShootingDesc: 'Arah dan tembak, tingkatkan fokus',
        racing: 'Lumba Kereta Laju',
        racingDesc: 'Pandu kereta lumba, alami kelajuan dan keseronokan',
        rhythm: 'Irama Muzik',
        rhythmDesc: 'Ikut irama, lepaskan tenaga muzik',
        rules: 'Peraturan Permainan',
        back: 'Kembali',
        start: 'Mulakan Permainan',
        close: 'Tutup'
      }
    };
    return translations[lang]?.[key] || translations['zh-TW'][key] || key;
  };

  const games = [
    {
      id: 'farm',
      title: getText('farm'),
      description: getText('farmDesc'),
      icon: '🌱',
      color: '#4CAF50'
    },
    {
      id: 'whackAMole',
      title: getText('whackAMole'),
      description: getText('whackAMoleDesc'),
      icon: '🔨',
      color: '#FF5722'
    },
    {
      id: 'fruitPicking',
      title: getText('fruitPicking'),
      description: getText('fruitPickingDesc'),
      icon: '🍎',
      color: '#FF9800'
    },
    {
      id: 'targetShooting',
      title: getText('targetShooting'),
      description: getText('targetShootingDesc'),
      icon: '🫧',
      color: '#9C27B0'
    },
    {
      id: 'racing',
      title: getText('racing'),
      description: getText('racingDesc'),
      icon: '🏎️',
      color: '#E91E63'
    },
    {
      id: 'rhythm',
      title: getText('rhythm'),
      description: getText('rhythmDesc'),
      icon: '🎵',
      color: '#00BCD4'
    }
  ];

  const renderGame = () => {
    switch (currentGame) {
      case 'farm':
        return <FarmGame onClose={() => setCurrentGame(null)} />;
      case 'whackAMole':
        return <WhackAMoleGame onClose={() => setCurrentGame(null)} />;
      case 'fruitPicking':
        return <FruitPickingGame onClose={() => setCurrentGame(null)} />;
      case 'targetShooting':
        return <BubblePopGame onClose={() => setCurrentGame(null)} />;
      case 'racing':
        return <RacingGame onClose={() => setCurrentGame(null)} />;
      case 'rhythm':
        return <RhythmGame onClose={() => setCurrentGame(null)} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: imageLoaded 
        ? `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%), url('/stress.png')`
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: 'clamp(10px, 2vw, 20px)',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
      position: 'relative'
    }}>

      {/* 手機版頁頭 */}
      {window.innerWidth <= 768 && (
        <SharedHeader />
      )}
      
      {/* 桌面版頁頭 - 完整複製首頁的頁頭 */}
      {window.innerWidth > 768 && (
        <div style={{ position: 'fixed', top: 8, right: 36, zIndex: 9999, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, pointerEvents: 'auto', width: '100%', justifyContent: 'flex-end' }}>
          {/* 左側：LOGO */}
          <div style={{ position: 'fixed', top: 16, left: 42, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10000, paddingTop: 0, marginTop: 0 }}>
            <img src="/ctx-logo.png" style={{ marginBottom: 0, width: 182, height: 182, cursor: 'pointer', marginTop: '-40px' }} onClick={() => navigate('/')} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginRight: 24 }}>
            <button 
              className="topbar-btn" 
              onClick={() => navigate('/about')} 
              style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 80 }}
              aria-label={lang==='zh-TW'?'了解 Restarter 平台':'zh-CN'===lang?'了解 Restarter 平台':'en'===lang?'Learn about Restarter platform':'ja'===lang?'Restarter プラットフォームについて':'ko'===lang?'Restarter 플랫폼에 대해 알아보기':'th'===lang?'เรียนรู้เกี่ยวกับแพลตฟอร์ม Restarter':'vi'===lang?'Tìm hiểu về nền tảng Restarter':'ms'===lang?'Ketahui tentang platform Restarter':'Cognosce de suggestum Restarter'}
              role="button"
            >
              {lang==='zh-TW'?'🧬 Restarter™｜我們是誰':'zh-CN'===lang?'🧬 Restarter™｜我们是谁':'en'===lang?'🧬 Restarter™｜Who We Are':'ja'===lang?'🧬 Restarter™｜私たちについて':'ko'===lang?'🧬 Restarter™｜우리는 누구인가':'th'===lang?'🧬 Restarter™｜เราเป็นใคร':'vi'===lang?'🧬 Restarter™｜Chúng tôi là ai':'ms'===lang?'🧬 Restarter™｜Siapa Kami':'🧬 Restarter™｜Quis sumus'}
            </button>
            <button 
              className="topbar-btn" 
              onClick={() => navigate('/feedback')} 
              style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 100 }}
              aria-label={lang==='zh-TW'?'提供意見和建議':'zh-CN'===lang?'提供意见和建议':'en'===lang?'Provide feedback and suggestions':'ja'===lang?'ご意見やご提案を提供':'ko'===lang?'의견과 제안 제공':'th'===lang?'ให้ข้อเสนอแนะและคำแนะนำ':'vi'===lang?'Cung cấp phản hồi và đề xuất':'ms'===lang?'Berikan maklum balas dan cadangan':'Praebe consilia et suggestiones'}
              role="button"
            >
              {lang==='zh-TW'?'💬 意見箱｜我們想聽你說':'zh-CN'===lang?'💬 意见箱｜我们想听你说':'en'===lang?'💬 Feedback｜We Want to Hear You':'ja'===lang?'💬 ご意見箱｜あなたの声を聞かせて':'ko'===lang?'💬 피드백｜여러분의 의견을 듣고 싶어요':'th'===lang?'💬 กล่องความคิดเห็น｜เราอยากฟังคุณ':'vi'===lang?'💬 Hộp góp ý｜Chúng tôi muốn lắng nghe bạn':'ms'===lang?'💬 Kotak Maklum Balas｜Kami ingin mendengar anda':'💬 Arca Consilii｜Te audire volumus'}
            </button>

            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {user.photoURL ? (
  <img src={user.photoURL} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #90caf9' }} />
) : (
  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#90caf9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', border: '2px solid #90caf9' }}>
    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
  </div>
)}
                  <span style={{ color: '#1976d2', fontWeight: 700, fontSize: 16 }}>{user.displayName || user.email || '用戶'}</span>
                  <button className="topbar-btn" onClick={async () => { await signOut(auth); }} style={{ background: '#fff', color: '#ff6347', border: '2px solid #ffb4a2', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '8px 14px', marginLeft: 6 }}>{LOGOUT_TEXT[lang]}</button>
                </div>
              </>
            ) : (
              <button className="topbar-btn" onClick={() => navigate('/register')} style={{ background: '#fff', color: '#1976d2', border: '2px solid #90caf9', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '8px 10px', minWidth: 90 }}>{lang==='zh-TW'?'註冊/登入':'zh-CN'===lang?'注册/登录':'en'===lang?'Register / Login':'ja'===lang?'登録/ログイン':'ko'===lang?'가입/로그인':'th'===lang?'สมัคร/เข้าสู่ระบบ':'vi'===lang?'Đăng ký/Đăng nhập':'ms'===lang?'Daftar / Log Masuk':'Registrare / Login'}</button>
            )}
          </div>
          {/* 語言選擇按鈕，靠右且寬度縮短，點擊彈出小框 */}
          <div ref={langBoxRef} style={{ position: 'relative', display: 'inline-block' }} className="language-selector">
            <button
              className="topbar-btn"
              style={{
                background: '#6B5BFF',
                color: '#fff',
                border: '2px solid #6B5BFF',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                padding: '8px 10px',
                minWidth: 90,
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setShowLangBox(v => !v)}
            >
              {lang === 'zh-TW' ? '繁中' : lang === 'zh-CN' ? '简中' : lang === 'en' ? 'English' : lang === 'ja' ? '日本語' : lang === 'ko' ? '한국어' : lang === 'th' ? 'ไทย' : lang === 'vi' ? 'Tiếng Việt' : lang === 'ms' ? 'Bahasa Melayu' : 'Latin'}
              <span style={{ marginLeft: 6 }}>▼</span>
            </button>
            {showLangBox && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1.5px solid #6B5BFF', borderRadius: 8, boxShadow: '0 4px 16px #0002', zIndex: 9999, minWidth: 120 }}>
                {['zh-TW', 'zh-CN', 'en', 'ja', 'ko', 'th', 'vi', 'ms', 'la'].map(l => (
                  <div key={l} style={{ padding: '10px 18px', cursor: 'pointer', color: l === lang ? '#6B5BFF' : '#232946', fontWeight: l === lang ? 700 : 500, background: l === lang ? '#f3f0ff' : '#fff' }} onClick={() => { setLang(l as any); setShowLangBox(false); }}>
                    {l === 'zh-TW' ? '繁中' : l === 'zh-CN' ? '简中' : l === 'en' ? 'English' : l === 'ja' ? '日本語' : l === 'ko' ? '한국어' : l === 'th' ? 'ไทย' : l === 'vi' ? 'Tiếng Việt' : l === 'ms' ? 'Bahasa Melayu' : 'Latin'}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 漢堡選單 - 法律文件 */}
          <div ref={legalMenuRef} style={{ position: 'relative', display: 'inline-block' }} className="legal-menu">
            <button
              className="topbar-btn"
              style={{
                background: '#fff',
                color: '#6B5BFF',
                border: '2px solid #6B5BFF',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                padding: '8px 10px',
                minWidth: 44,
                height: '44px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setShowLegalMenu(v => !v)}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f3f0ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#fff';
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
                  { key: 'privacy', title: { 'zh-TW': '隱私權政策', 'zh-CN': '隐私政策', 'en': 'Privacy Policy', 'ja': 'プライバシーポリシー', 'ko': '개인정보보호정책', 'th': 'นโยบายความเป็นส่วนตัว', 'vi': 'Chính sách bảo mật', 'ms': 'Dasar Privasi', 'la': 'Consilium de Privata' }, path: '/privacy-policy' },
                  { key: 'terms', title: { 'zh-TW': '條款/聲明', 'zh-CN': '条款/声明', 'en': 'Terms/Statement', 'ja': '利用規約/声明', 'ko': '약관/성명', 'th': 'ข้อกำหนด/คำแถลง', 'vi': 'Điều khoản/Tuyên bố', 'ms': 'Terma/Penyata', 'la': 'Termini/Declaratio' }, path: '/terms' },
                  { key: 'data', title: { 'zh-TW': '資料刪除說明', 'zh-CN': '数据删除说明', 'en': 'Data Deletion', 'ja': 'データ削除について', 'ko': '데이터 삭제 설명', 'th': 'คำอธิบายการลบข้อมูล', 'vi': 'Giải thích xóa dữ liệu', 'ms': 'Penerangan Pemadaman Data', 'la': 'Explicatio Deletionis Datae' }, path: '/data-deletion' },
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
                    {item.title[lang] || item.title['zh-TW']}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 載入指示器 */}
      {!imageLoaded && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.9)',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 2000,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>載入中...</div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #667eea', 
            borderRadius: '50%', 
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}


      
      {currentGame ? (
        <div style={{ position: 'relative', height: '100vh' }}>
          {renderGame()}
        </div>
      ) : (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* 標題區域 */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 4vw, 40px)', marginTop: window.innerWidth <= 768 ? 'clamp(80px, 12vw, 100px)' : 'clamp(60px, 8vw, 80px)' }}>
            <h1 style={{ 
              color: '#fff', 
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
              fontWeight: 'bold',
              marginBottom: '10px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {getText('title')}
            </h1>
            <p style={{ 
              color: '#fff', 
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              {getText('subtitle')}
            </p>
          </div>

          {/* 遊戲選擇區域 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(15px, 3vw, 30px)',
            padding: 'clamp(10px, 2vw, 20px)'
          }}>
            {games.map((game) => (
              <div 
                key={game.id}
                onClick={() => setCurrentGame(game.id)}
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '20px',
                  padding: 'clamp(20px, 4vw, 30px)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: `3px solid ${game.color}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ 
                  fontSize: 'clamp(3rem, 8vw, 4rem)', 
                  marginBottom: '20px',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
                }}>
                  {game.icon}
                </div>
                <h3 style={{ 
                  color: game.color, 
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>
                  {game.title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  lineHeight: '1.5'
                }}>
                  {game.description}
                </p>
                <button style={{
                  background: game.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '25px',
                  padding: 'clamp(8px, 2vw, 12px) clamp(20px, 4vw, 30px)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  fontWeight: 'bold',
                  marginTop: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {getText('start')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      

    </div>
  );
}

// 生活農場遊戲組件 - 優化版本
function FarmGame({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const [plants, setPlants] = useState<Array<{id: number, type: string, growth: number, planted: number, x: number, y: number}>>([]);
  const [score, setScore] = useState(0);
  const [selectedSeed, setSelectedSeed] = useState('carrot');
  const [showRules, setShowRules] = useState(false);

  // 多語言翻譯函數
  const getGameText = (key: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      'zh-TW': {
        title: '生活農場',
        rules: '遊戲規則',
        hideRules: '隱藏規則',
        seedSelection: '種子選擇：',
        score: '分數',
        gameRules: '遊戲規則',
        plantStage: '種植階段：',
        harvestStage: '收穫階段：',
        plantStep1: '1. 選擇種子（6種作物可選）',
        plantStep2: '2. 點擊空地種植 → 獲得種植分數',
        plantStep3: '3. 作物會自動生長（幼苗→成熟）',
        harvestStep1: '1. 點擊成熟的作物進行收穫',
        harvestStep2: '2. 收穫後獲得更高分數',
        harvestStep3: '3. 空地可以重新種植',
        scoring: '計分系統：',
        scoring1: '• 種植分數：10-25分（根據作物類型）',
        scoring2: '• 收穫分數：50-125分（根據作物類型）',
        scoring3: '• 作物生長時間：3-8秒',
        plant: '種植',
        harvest: '收穫',
        growthTime: '生長時間',
        seconds: '秒',
        carrot: '胡蘿蔔',
        tomato: '番茄',
        corn: '玉米',
        potato: '馬鈴薯',
        strawberry: '草莓',
        watermelon: '西瓜'
      },
      'zh-CN': {
        title: '生活农场',
        rules: '游戏规则',
        hideRules: '隐藏规则',
        seedSelection: '种子选择：',
        score: '分数',
        gameRules: '游戏规则',
        plantStage: '种植阶段：',
        harvestStage: '收获阶段：',
        plantStep1: '1. 选择种子（6种作物可选）',
        plantStep2: '2. 点击空地种植 → 获得种植分数',
        plantStep3: '3. 作物会自动生长（幼苗→成熟）',
        harvestStep1: '1. 点击成熟的作物进行收获',
        harvestStep2: '2. 收获后获得更高分数',
        harvestStep3: '3. 空地可以重新种植',
        scoring: '计分系统：',
        scoring1: '• 种植分数：10-25分（根据作物类型）',
        scoring2: '• 收获分数：50-125分（根据作物类型）',
        scoring3: '• 作物生长时间：3-8秒',
        plant: '种植',
        harvest: '收获',
        growthTime: '生长时间',
        seconds: '秒',
        carrot: '胡萝卜',
        tomato: '番茄',
        corn: '玉米',
        potato: '马铃薯',
        strawberry: '草莓',
        watermelon: '西瓜'
      },
      'en': {
        title: 'Life Farm',
        rules: 'Game Rules',
        hideRules: 'Hide Rules',
        seedSelection: 'Seed Selection:',
        score: 'Score',
        gameRules: 'Game Rules',
        plantStage: 'Planting Stage:',
        harvestStage: 'Harvest Stage:',
        plantStep1: '1. Select seeds (6 crop types available)',
        plantStep2: '2. Click empty plots to plant → Get planting score',
        plantStep3: '3. Crops grow automatically (seedling→mature)',
        harvestStep1: '1. Click mature crops to harvest',
        harvestStep2: '2. Get higher score after harvest',
        harvestStep3: '3. Empty plots can be replanted',
        scoring: 'Scoring System:',
        scoring1: '• Planting score: 10-25 points (by crop type)',
        scoring2: '• Harvest score: 50-125 points (by crop type)',
        scoring3: '• Growth time: 3-8 seconds',
        plant: 'Plant',
        harvest: 'Harvest',
        growthTime: 'Growth Time',
        seconds: 'seconds',
        carrot: 'Carrot',
        tomato: 'Tomato',
        corn: 'Corn',
        potato: 'Potato',
        strawberry: 'Strawberry',
        watermelon: 'Watermelon'
      },
      'ja': {
        title: 'ライフファーム',
        rules: 'ゲームルール',
        hideRules: 'ルールを隠す',
        seedSelection: '種子選択：',
        score: 'スコア',
        gameRules: 'ゲームルール',
        plantStage: '植栽段階：',
        harvestStage: '収穫段階：',
        plantStep1: '1. 種子を選択（6種類の作物）',
        plantStep2: '2. 空き地をクリックして植栽 → 植栽スコア獲得',
        plantStep3: '3. 作物は自動で成長（苗→成熟）',
        harvestStep1: '1. 成熟した作物をクリックして収穫',
        harvestStep2: '2. 収穫後により高いスコア獲得',
        harvestStep3: '3. 空き地は再植栽可能',
        scoring: 'スコアシステム：',
        scoring1: '• 植栽スコア：10-25ポイント（作物タイプ別）',
        scoring2: '• 収穫スコア：50-125ポイント（作物タイプ別）',
        scoring3: '• 成長時間：3-8秒',
        plant: '植栽',
        harvest: '収穫',
        growthTime: '成長時間',
        seconds: '秒',
        carrot: 'ニンジン',
        tomato: 'トマト',
        corn: 'トウモロコシ',
        potato: 'ジャガイモ',
        strawberry: 'イチゴ',
        watermelon: 'スイカ'
      },
      'ko': {
        title: '라이프 팜',
        rules: '게임 규칙',
        hideRules: '규칙 숨기기',
        seedSelection: '씨앗 선택:',
        score: '점수',
        gameRules: '게임 규칙',
        plantStage: '심기 단계:',
        harvestStage: '수확 단계:',
        plantStep1: '1. 씨앗 선택 (6가지 작물)',
        plantStep2: '2. 빈 땅 클릭하여 심기 → 심기 점수 획득',
        plantStep3: '3. 작물 자동 성장 (묘목→성숙)',
        harvestStep1: '1. 성숙한 작물 클릭하여 수확',
        harvestStep2: '2. 수확 후 더 높은 점수 획득',
        harvestStep3: '3. 빈 땅 재심기 가능',
        scoring: '점수 시스템:',
        scoring1: '• 심기 점수: 10-25점 (작물 타입별)',
        scoring2: '• 수확 점수: 50-125점 (작물 타입별)',
        scoring3: '• 성장 시간: 3-8초',
        plant: '심기',
        harvest: '수확',
        growthTime: '성장 시간',
        seconds: '초',
        carrot: '당근',
        tomato: '토마토',
        corn: '옥수수',
        potato: '감자',
        strawberry: '딸기',
        watermelon: '수박'
      },
      'vi': {
        title: 'Nông Trại Cuộc Sống',
        rules: 'Luật Chơi',
        hideRules: 'Ẩn Luật',
        seedSelection: 'Chọn Hạt Giống:',
        score: 'Điểm',
        gameRules: 'Luật Chơi',
        plantStage: 'Giai Đoạn Trồng:',
        harvestStage: 'Giai Đoạn Thu Hoạch:',
        plantStep1: '1. Chọn hạt giống (6 loại cây trồng)',
        plantStep2: '2. Nhấp vào ô trống để trồng → Nhận điểm trồng',
        plantStep3: '3. Cây trồng tự động phát triển (mầm→trưởng thành)',
        harvestStep1: '1. Nhấp vào cây trưởng thành để thu hoạch',
        harvestStep2: '2. Nhận điểm cao hơn sau thu hoạch',
        harvestStep3: '3. Ô trống có thể trồng lại',
        scoring: 'Hệ Thống Điểm:',
        scoring1: '• Điểm trồng: 10-25 điểm (theo loại cây)',
        scoring2: '• Điểm thu hoạch: 50-125 điểm (theo loại cây)',
        scoring3: '• Thời gian phát triển: 3-8 giây',
        plant: 'Trồng',
        harvest: 'Thu hoạch',
        growthTime: 'Thời gian phát triển',
        seconds: 'giây',
        carrot: 'Cà Rốt',
        tomato: 'Cà Chua',
        corn: 'Ngô',
        potato: 'Khoai Tây',
        strawberry: 'Dâu Tây',
        watermelon: 'Dưa Hấu'
      },
      'th': {
        title: 'ฟาร์มชีวิต',
        rules: 'กฎเกม',
        hideRules: 'ซ่อนกฎ',
        seedSelection: 'เลือกเมล็ด:',
        score: 'คะแนน',
        gameRules: 'กฎเกม',
        plantStage: 'ขั้นตอนปลูก:',
        harvestStage: 'ขั้นตอนเก็บเกี่ยว:',
        plantStep1: '1. เลือกเมล็ด (6 ชนิดพืช)',
        plantStep2: '2. คลิกที่แปลงว่างเพื่อปลูก → ได้คะแนนปลูก',
        plantStep3: '3. พืชเติบโตอัตโนมัติ (ต้นกล้า→สุก)',
        harvestStep1: '1. คลิกพืชที่สุกแล้วเพื่อเก็บเกี่ยว',
        harvestStep2: '2. ได้คะแนนสูงขึ้นหลังเก็บเกี่ยว',
        harvestStep3: '3. แปลงว่างสามารถปลูกใหม่ได้',
        scoring: 'ระบบคะแนน:',
        scoring1: '• คะแนนปลูก: 10-25 คะแนน (ตามชนิดพืช)',
        scoring2: '• คะแนนเก็บเกี่ยว: 50-125 คะแนน (ตามชนิดพืช)',
        scoring3: '• เวลาเติบโต: 3-8 วินาที',
        plant: 'ปลูก',
        harvest: 'เก็บเกี่ยว',
        growthTime: 'เวลาเติบโต',
        seconds: 'วินาที',
        carrot: 'แครอท',
        tomato: 'มะเขือเทศ',
        corn: 'ข้าวโพด',
        potato: 'มันฝรั่ง',
        strawberry: 'สตรอเบอร์รี่',
        watermelon: 'แตงโม'
      },
      'la': {
        title: 'Villa Vitae',
        rules: 'Regulae Ludi',
        hideRules: 'Occulta Regulas',
        seedSelection: 'Selectio Seminis:',
        score: 'Puncta',
        gameRules: 'Regulae Ludi',
        plantStage: 'Stadium Plantandi:',
        harvestStage: 'Stadium Messis:',
        plantStep1: '1. Elige semina (6 genera culturarum)',
        plantStep2: '2. Clicca in agros vacuos ad plantandum → Accipe puncta',
        plantStep3: '3. Culturae crescunt automatice (plantula→maturus)',
        harvestStep1: '1. Clicca culturas maturas ad messem',
        harvestStep2: '2. Accipe puncta altiora post messem',
        harvestStep3: '3. Agri vacui possunt replantari',
        scoring: 'Systema Punctorum:',
        scoring1: '• Puncta plantandi: 10-25 (secundum genus)',
        scoring2: '• Puncta messis: 50-125 (secundum genus)',
        scoring3: '• Tempus crescendi: 3-8 secundis',
        plant: 'Planta',
        harvest: 'Messis',
        growthTime: 'Tempus Crescendi',
        seconds: 'secundis',
        carrot: 'Daucus',
        tomato: 'Lycopersicum',
        corn: 'Zea',
        potato: 'Solanum',
        strawberry: 'Fragaria',
        watermelon: 'Citrullus'
      },
      'ms': {
        title: 'Ladang Kehidupan',
        rules: 'Peraturan Permainan',
        hideRules: 'Sembunyikan Peraturan',
        seedSelection: 'Pilihan Benih:',
        score: 'Markah',
        gameRules: 'Peraturan Permainan',
        plantStage: 'Peringkat Menanam:',
        harvestStage: 'Peringkat Menuai:',
        plantStep1: '1. Pilih benih (6 jenis tanaman)',
        plantStep2: '2. Klik plot kosong untuk menanam → Dapat markah menanam',
        plantStep3: '3. Tanaman tumbuh secara automatik (anak benih→matang)',
        harvestStep1: '1. Klik tanaman matang untuk menuai',
        harvestStep2: '2. Dapat markah lebih tinggi selepas menuai',
        harvestStep3: '3. Plot kosong boleh ditanam semula',
        scoring: 'Sistem Markah:',
        scoring1: '• Markah menanam: 10-25 mata (mengikut jenis tanaman)',
        scoring2: '• Markah menuai: 50-125 mata (mengikut jenis tanaman)',
        scoring3: '• Masa tumbuh: 3-8 saat',
        plant: 'Tanam',
        harvest: 'Tuai',
        growthTime: 'Masa Tumbuh',
        seconds: 'saat',
        carrot: 'Lobak Merah',
        tomato: 'Tomato',
        corn: 'Jagung',
        potato: 'Kentang',
        strawberry: 'Strawberi',
        watermelon: 'Tembikai'
      }
    };
    return translations[lang]?.[key] || translations['zh-TW'][key] || key;
  };

  // 載入遊戲進度
  useEffect(() => {
    const saved = loadGameProgress('farm');
    if (saved) {
      setPlants(saved.plants || []);
      setScore(saved.score || 0);
    }
  }, []);

  // 保存遊戲進度
  useEffect(() => {
    const saveData = { plants, score };
    saveGameProgress('farm', saveData);
  }, [plants, score]);

  const seeds = [
    { id: 'carrot', name: '胡蘿蔔', emoji: '🥕', growthTime: 3000, color: '#FF6B35', plantScore: 10, harvestScore: 50 },
    { id: 'tomato', name: '番茄', emoji: '🍅', growthTime: 5000, color: '#FF4444', plantScore: 15, harvestScore: 75 },
    { id: 'corn', name: '玉米', emoji: '🌽', growthTime: 7000, color: '#FFD700', plantScore: 20, harvestScore: 100 },
    { id: 'potato', name: '馬鈴薯', emoji: '🥔', growthTime: 4000, color: '#8B4513', plantScore: 12, harvestScore: 60 },
    { id: 'strawberry', name: '草莓', emoji: '🍓', growthTime: 6000, color: '#FF69B4', plantScore: 18, harvestScore: 90 },
    { id: 'watermelon', name: '西瓜', emoji: '🍉', growthTime: 8000, color: '#FF6347', plantScore: 25, harvestScore: 125 }
  ];

  const plantSeed = (x: number, y: number) => {
    // 檢查該位置是否已有植物
    const existingPlant = plants.find(p => p.x === x && p.y === y);
    if (existingPlant) return;

    const seed = seeds.find(s => s.id === selectedSeed);
    if (!seed) return;

    const newPlant = {
      id: Date.now(),
      type: selectedSeed,
      growth: 0,
      planted: Date.now(),
      x,
      y
    };

    setPlants(prev => [...prev, newPlant]);
    setScore(prev => prev + seed.plantScore);

    // 生長邏輯 - 分兩個階段
    setTimeout(() => {
      setPlants(prev => prev.map(p => 
        p.id === newPlant.id ? { ...p, growth: 50 } : p
      ));
    }, seed.growthTime / 2);

    setTimeout(() => {
      setPlants(prev => prev.map(p => 
        p.id === newPlant.id ? { ...p, growth: 100 } : p
      ));
    }, seed.growthTime);
  };

  const harvestPlant = (plantId: number) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant && plant.growth >= 100) {
      const seed = seeds.find(s => s.id === plant.type);
      setPlants(prev => prev.filter(p => p.id !== plantId));
      setScore(prev => prev + (seed?.harvestScore || 50));
    }
  };

  const getPlantAtPosition = (x: number, y: number) => {
    return plants.find(p => p.x === x && p.y === y);
  };

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(180deg, #87CEEB 0%, #90EE90 100%)',
      padding: 'clamp(10px, 2vw, 20px)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>


      {/* 遊戲界面 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'clamp(200px, 25vw, 250px) 1fr',
        gap: 'clamp(10px, 2vw, 20px)',
        height: 'calc(100% - 60px)',
        marginTop: '60px',
        overflow: 'visible',
        minHeight: '0',
        width: '100%'
      }}>
        {/* 左側控制面板 */}
        <div style={{ 
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '15px',
          padding: 'clamp(15px, 3vw, 20px)',
          height: 'fit-content',
          maxHeight: window.innerWidth <= 768 ? '200px' : '100%',
          overflow: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          alignSelf: 'start',
          display: window.innerWidth <= 768 ? 'none' : 'block'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center', 
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              color: '#333'
            }}>
              🌱 {getGameText('title')}
            </div>
            <button 
              onClick={() => setShowRules(!showRules)}
              style={{
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: '4px 12px',
                fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
                cursor: 'pointer'
              }}
            >
              {showRules ? getGameText('hideRules') : getGameText('rules')}
            </button>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              marginBottom: '10px', 
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: '#333',
              fontWeight: 'bold'
            }}>{getGameText('seedSelection')}</h4>
            {seeds.map(seed => (
              <div 
                key={seed.id}
                onClick={() => setSelectedSeed(seed.id)}
                style={{
                  padding: 'clamp(8px, 2vw, 10px)',
                  margin: '5px 0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedSeed === seed.id ? '#e8f5e8' : '#f5f5f5',
                  border: selectedSeed === seed.id ? '2px solid #4CAF50' : '2px solid transparent',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '1.2em' }}>{seed.emoji}</span>
                <span>{getGameText(seed.id)}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: '#333',
              fontWeight: 'bold'
            }}>{getGameText('score')}：{score}</h4>
          </div>

          {showRules && (
            <div style={{ 
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '15px',
              textAlign: 'left',
              fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
              lineHeight: '1.3'
            }}>
              <h4 style={{ marginBottom: '8px', color: '#333' }}>🎯 {getGameText('gameRules')}：</h4>
              <p style={{ marginBottom: '6px' }}><strong>{getGameText('plantStage')}</strong></p>
              <p style={{ marginBottom: '6px' }}>{getGameText('plantStep1')}</p>
              <p style={{ marginBottom: '6px' }}>{getGameText('plantStep2')}</p>
              <p style={{ marginBottom: '6px' }}>{getGameText('plantStep3')}</p>
              
              <p style={{ marginBottom: '6px', marginTop: '8px' }}><strong>{getGameText('harvestStage')}</strong></p>
              <p style={{ marginBottom: '6px' }}>{getGameText('harvestStep1')}</p>
              <p style={{ marginBottom: '6px' }}>{getGameText('harvestStep2')}</p>
              <p style={{ marginBottom: '6px' }}>{getGameText('harvestStep3')}</p>
              
              <p style={{ marginBottom: '6px', marginTop: '8px' }}><strong>{getGameText('scoring')}</strong></p>
              <p style={{ marginBottom: '4px' }}>🥕 {getGameText('carrot')}：{getGameText('plant')}+10 {getGameText('harvest')}+50</p>
              <p style={{ marginBottom: '4px' }}>🍅 {getGameText('tomato')}：{getGameText('plant')}+15 {getGameText('harvest')}+75</p>
              <p style={{ marginBottom: '4px' }}>🌽 {getGameText('corn')}：{getGameText('plant')}+20 {getGameText('harvest')}+100</p>
              <p style={{ marginBottom: '4px' }}>🥔 {getGameText('potato')}：{getGameText('plant')}+12 {getGameText('harvest')}+60</p>
              <p style={{ marginBottom: '4px' }}>🍓 {getGameText('strawberry')}：{getGameText('plant')}+18 {getGameText('harvest')}+90</p>
              <p style={{ marginBottom: '4px' }}>🍉 {getGameText('watermelon')}：{getGameText('plant')}+25 {getGameText('harvest')}+125</p>
              
              <p style={{ marginBottom: '6px', marginTop: '8px' }}><strong>{getGameText('growthTime')}：</strong></p>
              <p style={{ marginBottom: '4px' }}>🥕 {getGameText('carrot')}：3{getGameText('seconds')}</p>
              <p style={{ marginBottom: '4px' }}>🍅 {getGameText('tomato')}：5{getGameText('seconds')}</p>
              <p style={{ marginBottom: '4px' }}>🌽 {getGameText('corn')}：7{getGameText('seconds')}</p>
              <p style={{ marginBottom: '4px' }}>🥔 {getGameText('potato')}：4{getGameText('seconds')}</p>
              <p style={{ marginBottom: '4px' }}>🍓 {getGameText('strawberry')}：6{getGameText('seconds')}</p>
              <p style={{ marginBottom: '4px' }}>🍉 {getGameText('watermelon')}：8{getGameText('seconds')}</p>
            </div>
          )}
        </div>

        {/* 右側農場區域 */}
        <div style={{ 
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '15px',
          padding: window.innerWidth <= 768 ? 'clamp(5px, 1vw, 10px)' : 'clamp(10px, 2vw, 20px)',
          position: 'relative',
          overflow: 'visible',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          minHeight: '0',
          width: '100%'
        }}>
          {/* 手機版簡化控制面板 */}
          {window.innerWidth <= 768 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '15px'
            }}>
              {/* 分數和種子選擇 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '10px',
                fontSize: '14px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ fontWeight: 'bold' }}>{getGameText('score')}：{score}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {seeds.map(seed => (
                    <button
                      key={seed.id}
                      onClick={() => setSelectedSeed(seed.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: selectedSeed === seed.id ? '2px solid #4CAF50' : '1px solid #ddd',
                        background: selectedSeed === seed.id ? '#e8f5e8' : '#fff',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {seed.emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 規則按鈕 */}
              <div style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <button 
                  onClick={() => setShowRules(!showRules)}
                  style={{
                    background: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '6px 16px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {showRules ? getGameText('hideRules') : getGameText('rules')}
                </button>
              </div>
              
              {/* 規則說明 */}
              {showRules && (
                <div style={{
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '11px',
                  lineHeight: '1.3',
                  textAlign: 'left'
                }}>
                  <h4 style={{ marginBottom: '6px', color: '#333' }}>🎯 {getGameText('gameRules')}：</h4>
                  <p style={{ marginBottom: '4px' }}><strong>種植：</strong>選擇種子 → 點擊空地種植</p>
                  <p style={{ marginBottom: '4px' }}><strong>收穫：</strong>點擊成熟作物收穫</p>
                  <p style={{ marginBottom: '4px' }}><strong>分數：</strong>種植+10~25分，收穫+50~125分</p>
                  <p style={{ marginBottom: '4px' }}><strong>時間：</strong>3~8秒成熟</p>
                </div>
              )}
            </div>
          )}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(10, 1fr)',
            gridTemplateRows: 'repeat(7, 1fr)',
            gap: 'clamp(5px, 1vw, 10px)',
            width: '100%',
            height: 'fit-content',
            minHeight: '0',
            overflow: 'visible'
          }}>
            {Array.from({ length: 70 }, (_, i) => {
              const x = i % 10;
              const y = Math.floor(i / 10);
              const plant = getPlantAtPosition(x, y);
              const seed = plant ? seeds.find(s => s.id === plant.type) : null;
              const isMature = plant && plant.growth >= 100;
              
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (plant && isMature) {
                      harvestPlant(plant.id);
                    } else if (!plant) {
                      plantSeed(x, y);
                    }
                  }}
                  style={{
                    background: plant ? (isMature ? '#4CAF50' : '#8BC34A') : '#DEB887',
                    border: '2px solid #A0522D',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: plant && !isMature ? 'not-allowed' : 'pointer',
                    fontSize: plant ? 'clamp(1.5rem, 4vw, 2rem)' : 'clamp(0.8rem, 2vw, 1rem)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    aspectRatio: '1',
                    boxShadow: plant ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                    opacity: plant && !isMature ? 0.7 : 1
                  }}
                >
                  {plant ? (
                    <div style={{ 
                      fontSize: isMature ? 'clamp(1.5rem, 4vw, 2rem)' : 'clamp(0.8rem, 2vw, 1rem)',
                      opacity: plant.growth / 100
                    }}>
                      {seed?.emoji}
                    </div>
                  ) : (
                    <span style={{ color: '#8B4513', fontSize: '1.5em' }}>+</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// 打地鼠遊戲組件 - 簡化版本
function WhackAMoleGame({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeHole, setActiveHole] = useState<number | null>(null);
  const moleTimers = useRef<{ [key: number]: NodeJS.Timeout | null }>({});

  // 多語言翻譯函數
  const getText = (key: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      'zh-TW': {
        start: '開始遊戲',
        restart: '重新開始',
        score: '分數',
        time: '時間',
        level: '等級',
        hits: '擊中',
        accuracy: '準確率',
        combo: '連擊',
        highScore: '最高分',
        highCombo: '最高連擊',
        title: '打地鼠',
        rules: '遊戲規則',
        close: '關閉',
        gameOver: '遊戲結束',
        finalScore: '最終分數',
        basicGameplay: '基本玩法',
        scoreSystem: '分數系統',
        levelSystem: '等級系統',
        clickMole: '點擊出現的地鼠',
        getScore: '獲得分數',
        gameTime: '遊戲時間',
        seconds: '秒',
        moleSpeed: '地鼠出現時間會隨等級縮短',
        baseScore: '基礎分數',
        points: '分',
        levelBonus: '等級獎勵',
        perLevel: '每級',
        comboBonus: '連擊獎勵',
        per3Combo: '每3連擊',
        level1: '1級',
        level2: '2級',
        level3: '3級',
        level4: '4級',
        molesFaster: '地鼠更快',
        moreFrequent: '更頻繁',
        extremeSpeed: '極限速度'
      },
      'zh-CN': {
        start: '开始游戏',
        restart: '重新开始',
        score: '分数',
        time: '时间',
        level: '等级',
        hits: '击中',
        accuracy: '准确率',
        combo: '连击',
        highScore: '最高分',
        highCombo: '最高连击',
        title: '打地鼠',
        rules: '游戏规则',
        close: '关闭',
        basicGameplay: '基本玩法',
        scoreSystem: '分数系统',
        levelSystem: '等级系统',
        clickMole: '点击出现的地鼠',
        getScore: '获得分数',
        gameTime: '游戏时间',
        seconds: '秒',
        moleSpeed: '地鼠出现时间会随等级缩短',
        baseScore: '基础分数',
        points: '分',
        levelBonus: '等级奖励',
        perLevel: '每级',
        comboBonus: '连击奖励',
        per3Combo: '每3连击',
        level1: '1级',
        level2: '2级',
        level3: '3级',
        level4: '4级',
        molesFaster: '地鼠更快',
        moreFrequent: '更频繁',
        extremeSpeed: '极限速度'
      },
      'en': {
        start: 'Start Game',
        restart: 'Restart',
        score: 'Score',
        time: 'Time',
        level: 'Level',
        hits: 'Hits',
        accuracy: 'Accuracy',
        combo: 'Combo',
        highScore: 'High Score',
        highCombo: 'High Combo',
        title: 'Whack-a-Mole',
        rules: 'Game Rules',
        close: 'Close',
        basicGameplay: 'Basic Gameplay',
        scoreSystem: 'Score System',
        levelSystem: 'Level System',
        clickMole: 'Click appearing moles',
        getScore: 'to get points',
        gameTime: 'Game Time',
        seconds: 'seconds',
        moleSpeed: 'Mole appearance time shortens with level',
        baseScore: 'Base Score',
        points: 'points',
        levelBonus: 'Level Bonus',
        perLevel: 'per level',
        comboBonus: 'Combo Bonus',
        per3Combo: 'per 3 combos',
        level1: 'Level 1',
        level2: 'Level 2',
        level3: 'Level 3',
        level4: 'Level 4',
        molesFaster: 'moles faster',
        moreFrequent: 'more frequent',
        extremeSpeed: 'extreme speed'
      },
      'ja': {
        start: 'ゲーム開始',
        restart: '再開',
        score: 'スコア',
        time: '時間',
        level: 'レベル',
        hits: 'ヒット',
        accuracy: '精度',
        combo: 'コンボ',
        highScore: 'ハイスコア',
        highCombo: 'ハイコンボ',
        title: 'モグラたたき',
        rules: 'ゲームルール',
        close: '閉じる',
        basicGameplay: '基本プレイ',
        scoreSystem: 'スコアシステム',
        levelSystem: 'レベルシステム',
        clickMole: '現れるモグラをクリック',
        getScore: 'してポイントを獲得',
        gameTime: 'ゲーム時間',
        seconds: '秒',
        moleSpeed: 'モグラの出現時間はレベルに応じて短縮',
        baseScore: 'ベーススコア',
        points: 'ポイント',
        levelBonus: 'レベルボーナス',
        perLevel: 'レベルごと',
        comboBonus: 'コンボボーナス',
        per3Combo: '3コンボごと',
        level1: 'レベル1',
        level2: 'レベル2',
        level3: 'レベル3',
        level4: 'レベル4',
        molesFaster: 'モグラがより速く',
        moreFrequent: 'より頻繁に',
        extremeSpeed: '極限速度'
      },
      'ko': {
        start: '게임 시작',
        restart: '다시 시작',
        score: '점수',
        time: '시간',
        level: '레벨',
        hits: '타격',
        accuracy: '정확도',
        combo: '콤보',
        highScore: '최고 점수',
        highCombo: '최고 콤보',
        title: '두더지 잡기',
        rules: '게임 규칙',
        close: '닫기',
        basicGameplay: '기본 플레이',
        scoreSystem: '점수 시스템',
        levelSystem: '레벨 시스템',
        clickMole: '나타나는 두더지를 클릭',
        getScore: '하여 점수 획득',
        gameTime: '게임 시간',
        seconds: '초',
        moleSpeed: '두더지 출현 시간은 레벨에 따라 단축',
        baseScore: '기본 점수',
        points: '점',
        levelBonus: '레벨 보너스',
        perLevel: '레벨당',
        comboBonus: '콤보 보너스',
        per3Combo: '3콤보당',
        level1: '레벨 1',
        level2: '레벨 2',
        level3: '레벨 3',
        level4: '레벨 4',
        molesFaster: '두더지가 더 빠르게',
        moreFrequent: '더 자주',
        extremeSpeed: '극한 속도'
      },
      'vi': {
        start: 'Bắt Đầu Trò Chơi',
        restart: 'Chơi Lại',
        score: 'Điểm',
        time: 'Thời Gian',
        level: 'Cấp Độ',
        hits: 'Trúng',
        accuracy: 'Độ Chính Xác',
        combo: 'Combo',
        highScore: 'Điểm Cao Nhất',
        highCombo: 'Combo Cao Nhất',
        title: 'Đập Chuột',
        rules: 'Luật Chơi',
        close: 'Đóng',
        basicGameplay: 'Cách Chơi Cơ Bản',
        scoreSystem: 'Hệ Thống Điểm',
        levelSystem: 'Hệ Thống Cấp Độ',
        clickMole: 'Nhấp vào chuột xuất hiện',
        getScore: 'để nhận điểm',
        gameTime: 'Thời Gian Chơi',
        seconds: 'giây',
        moleSpeed: 'Thời gian xuất hiện chuột rút ngắn theo cấp độ',
        baseScore: 'Điểm Cơ Bản',
        points: 'điểm',
        levelBonus: 'Thưởng Cấp Độ',
        perLevel: 'mỗi cấp',
        comboBonus: 'Thưởng Combo',
        per3Combo: 'mỗi 3 combo',
        level1: 'Cấp 1',
        level2: 'Cấp 2',
        level3: 'Cấp 3',
        level4: 'Cấp 4',
        molesFaster: 'chuột nhanh hơn',
        moreFrequent: 'thường xuyên hơn',
        extremeSpeed: 'tốc độ cực hạn'
      },
      'th': {
        start: 'เริ่มเกม',
        restart: 'เริ่มใหม่',
        score: 'คะแนน',
        time: 'เวลา',
        level: 'ระดับ',
        hits: 'ตีถูก',
        accuracy: 'ความแม่นยำ',
        combo: 'คอมโบ',
        highScore: 'คะแนนสูงสุด',
        highCombo: 'คอมโบสูงสุด',
        title: 'ตีตุ่น',
        rules: 'กฎเกม',
        close: 'ปิด',
        basicGameplay: 'วิธีเล่นพื้นฐาน',
        scoreSystem: 'ระบบคะแนน',
        levelSystem: 'ระบบระดับ',
        clickMole: 'คลิกตุ่นที่ปรากฏ',
        getScore: 'เพื่อได้คะแนน',
        gameTime: 'เวลาเกม',
        seconds: 'วินาที',
        moleSpeed: 'เวลาปรากฏของตุ่นจะสั้นลงตามระดับ',
        baseScore: 'คะแนนพื้นฐาน',
        points: 'คะแนน',
        levelBonus: 'โบนัสระดับ',
        perLevel: 'ต่อระดับ',
        comboBonus: 'โบนัสคอมโบ',
        per3Combo: 'ต่อ 3 คอมโบ',
        level1: 'ระดับ 1',
        level2: 'ระดับ 2',
        level3: 'ระดับ 3',
        level4: 'ระดับ 4',
        molesFaster: 'ตุ่นเร็วขึ้น',
        moreFrequent: 'บ่อยขึ้น',
        extremeSpeed: 'ความเร็วสุดขีด'
      },
      'la': {
        start: 'Ludum Incipere',
        restart: 'Iterum Incipere',
        score: 'Puncta',
        time: 'Tempus',
        level: 'Gradus',
        hits: 'Ictus',
        accuracy: 'Accuratio',
        combo: 'Combo',
        highScore: 'Puncta Maxima',
        highCombo: 'Combo Maxima',
        title: 'Talpa Percutere',
        rules: 'Regulae Ludi',
        close: 'Claudere',
        basicGameplay: 'Ludus Basicus',
        scoreSystem: 'Systema Punctorum',
        levelSystem: 'Systema Gradus',
        clickMole: 'Clicca talpam apparentem',
        getScore: 'ut puncta accipias',
        gameTime: 'Tempus Ludi',
        seconds: 'secundis',
        moleSpeed: 'Tempus apparentiae talpae cum gradu brevior fit',
        baseScore: 'Puncta Basica',
        points: 'puncta',
        levelBonus: 'Bonus Gradus',
        perLevel: 'per gradum',
        comboBonus: 'Bonus Combo',
        per3Combo: 'per 3 combos',
        level1: 'Gradus 1',
        level2: 'Gradus 2',
        level3: 'Gradus 3',
        level4: 'Gradus 4',
        molesFaster: 'talpae velociores',
        moreFrequent: 'frequentiores',
        extremeSpeed: 'velocitas extrema'
      },
      'ms': {
        start: 'Mulakan Permainan',
        restart: 'Mulakan Semula',
        score: 'Markah',
        time: 'Masa',
        level: 'Tahap',
        hits: 'Pukulan',
        accuracy: 'Ketepatan',
        combo: 'Combo',
        highScore: 'Markah Tertinggi',
        highCombo: 'Combo Tertinggi',
        title: 'Pukul Tikus',
        rules: 'Peraturan Permainan',
        close: 'Tutup',
        basicGameplay: 'Cara Bermain Asas',
        scoreSystem: 'Sistem Markah',
        levelSystem: 'Sistem Tahap',
        clickMole: 'Klik tikus yang muncul',
        getScore: 'untuk dapat markah',
        gameTime: 'Masa Permainan',
        seconds: 'saat',
        moleSpeed: 'Masa kemunculan tikus memendek dengan tahap',
        baseScore: 'Markah Asas',
        points: 'markah',
        levelBonus: 'Bonus Tahap',
        perLevel: 'setiap tahap',
        comboBonus: 'Bonus Combo',
        per3Combo: 'setiap 3 combo',
        level1: 'Tahap 1',
        level2: 'Tahap 2',
        level3: 'Tahap 3',
        level4: 'Tahap 4',
        molesFaster: 'tikus lebih cepat',
        moreFrequent: 'lebih kerap',
        extremeSpeed: 'kelajuan melampau'
      }
    };
    return translations[lang]?.[key] || translations['zh-TW'][key] || key;
  };
  const [highScore, setHighScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [molesWhacked, setMolesWhacked] = useState(0);
  const [missedMoles, setMissedMoles] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  // 載入遊戲進度
  useEffect(() => {
    const saved = loadGameProgress('whackAMole');
    if (saved) {
      setHighScore(saved.highScore || 0);
    }
  }, []);

  // 保存遊戲進度
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      saveGameProgress('whackAMole', { highScore: score });
    }
  }, [score, highScore]);

  // 等級系統 - 基於30秒內的成功率
  useEffect(() => {
    const totalAttempts = molesWhacked + missedMoles;
    if (totalAttempts > 0) {
      const accuracy = molesWhacked / totalAttempts;
      
      if (gameLevel === 1 && accuracy >= 0.7) {
        setGameLevel(2);
      } else if (gameLevel === 2 && accuracy >= 0.6) {
        setGameLevel(3);
      } else if (gameLevel === 3 && accuracy >= 0.5) {
        setGameLevel(4);
      }
    }
  }, [molesWhacked, missedMoles, gameLevel]);

  // 幽默提示語
  const getHumorousMessage = () => {
    if (score < 0) return "😅 負分？地鼠在笑你！";
    if (score < 50) return "🐹 新手地鼠獵人！";
    if (score < 100) return "🎯 有點手感了！";
    if (score < 200) return "⚡ 地鼠殺手！";
    if (score < 300) return "🔥 地鼠剋星！";
    if (score < 500) return "💪 地鼠終結者！";
    return "👑 地鼠之王！";
  };

  // 根據等級調整遊戲難度
  useEffect(() => {
    // 等級系統已經在上面處理了
  }, [gameLevel]);

  // 計算準確率
  useEffect(() => {
    const totalAttempts = molesWhacked + missedMoles;
    if (totalAttempts > 0) {
      setAccuracy(Math.round((molesWhacked / totalAttempts) * 100));
    }
  }, [molesWhacked, missedMoles]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setGameLevel(1);
    setMolesWhacked(0);
    setMissedMoles(0);
    setCombo(0);
    setMaxCombo(0);
    setAccuracy(0);
    setActiveHole(null);
    
    let gameInterval: NodeJS.Timeout;
    let moleInterval: NodeJS.Timeout;
    
    gameInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameInterval);
          clearInterval(moleInterval);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 立即出現第一個地鼠
    setTimeout(() => {
      const holeIndex = Math.floor(Math.random() * 9);
      setActiveHole(holeIndex);
      // 調快地鼠出現時間
      const showTime = gameLevel === 1 ? 900 : gameLevel === 2 ? 700 : gameLevel === 3 ? 500 : 350;
      const timer = setTimeout(() => {
        setActiveHole(null);
        setMissedMoles(prev => prev + 1);
        // 地鼠消失時沒有點擊 - 失敗扣1分
        setScore(prev => prev - 1);
        setCombo(0);
      }, showTime);
      moleTimers.current[holeIndex] = timer;
    }, 300);

    // 根據等級調整地鼠出現頻率（調快）
    moleInterval = setInterval(() => {
      const holeIndex = Math.floor(Math.random() * 9);
      setActiveHole(holeIndex);
      const showTime = gameLevel === 1 ? 900 : gameLevel === 2 ? 700 : gameLevel === 3 ? 500 : 350;
      const timer = setTimeout(() => {
        setActiveHole(null);
        setMissedMoles(prev => prev + 1);
        // 地鼠消失時沒有點擊 - 失敗扣1分
        setScore(prev => prev - 1);
        setCombo(0);
      }, showTime);
      moleTimers.current[holeIndex] = timer;
    }, gameLevel === 1 ? 1100 : gameLevel === 2 ? 900 : gameLevel === 3 ? 700 : 500);
  };

  const whackMole = (holeIndex: number) => {
    if (activeHole === holeIndex) {
      // 打成功得1分
      setScore(prev => prev + 1);
      setMolesWhacked(prev => prev + 1);
      setCombo(prev => {
        const newCombo = prev + 1;
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        return newCombo;
      });
      // 立即清除地鼠，防止重複計分
      setActiveHole(null);
      // 清除該地鼠的消失計時器
      if (moleTimers.current[holeIndex]) {
        clearTimeout(moleTimers.current[holeIndex]);
        moleTimers.current[holeIndex] = null;
      }
    } else {
      // 沒打到地鼠扣1分
      setScore(prev => prev - 1);
      setCombo(0);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(180deg, #8B4513 0%, #A0522D 100%)',
      padding: 'clamp(10px, 2vw, 20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* 返回按鈕 */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'clamp(20px, 4vw, 40px)',
          left: 'clamp(20px, 4vw, 40px)',
          background: '#fff',
          border: '2px solid #6B5BFF',
          borderRadius: '50%',
          width: 'clamp(40px, 8vw, 50px)',
          height: 'clamp(40px, 8vw, 50px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          color: '#6B5BFF'
        }}
      >
        ←
      </button>

      {/* 遊戲信息 */}
      <div style={{ 
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '15px',
        padding: 'clamp(10px, 2vw, 15px)',
        marginTop: 'clamp(60px, 12vw, 80px)',
        marginBottom: 'clamp(8px, 1.5vw, 15px)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '300px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: 0 }}>🔨 {getText('title')}</h2>
          <button 
            onClick={() => setShowRules(!showRules)}
            style={{
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '5px 15px',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              cursor: 'pointer'
            }}
          >
            {showRules ? getText('close') : getText('rules')}
          </button>
        </div>
        
        {showRules && (
          <div style={{ 
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '10px',
            textAlign: 'left',
            fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
            lineHeight: '1.3'
          }}>
            <h4 style={{ marginBottom: '8px', color: '#333' }}>🎯 {getText('rules')}：</h4>
            <p style={{ marginBottom: '6px' }}><strong>{getText('basicGameplay')}：</strong></p>
            <p style={{ marginBottom: '6px' }}>• {getText('clickMole')} 🐹 {getText('getScore')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('gameTime')}：30{getText('seconds')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('moleSpeed')}</p>
            
            <p style={{ marginBottom: '6px', marginTop: '8px' }}><strong>{getText('scoreSystem')}：</strong></p>
            <p style={{ marginBottom: '6px' }}>• 點擊到地鼠身上 → +1分</p>
            <p style={{ marginBottom: '6px' }}>• 地鼠消失時沒有點擊 → -1分</p>
            <p style={{ marginBottom: '6px' }}>• 地鼠消失後才點擊 → -1分</p>
            <p style={{ marginBottom: '6px' }}>• 點擊地鼠坑但沒點擊到地鼠 → -1分</p>
            <p style={{ marginBottom: '6px' }}>• 從0分開始，無正負限制</p>
            
            <p style={{ marginBottom: '6px', marginTop: '8px' }}><strong>{getText('levelSystem')}：</strong></p>
            <p style={{ marginBottom: '6px' }}>• 1級：70%成功 → 2級（地鼠更快）</p>
            <p style={{ marginBottom: '6px' }}>• 2級：60%成功 → 3級（更頻繁）</p>
            <p style={{ marginBottom: '6px' }}>• 3級：50%成功 → 4級（極限速度）</p>
            <p style={{ marginBottom: '6px' }}>• 成功率基於30秒內的成功比率計算</p>
          </div>
        )}
        
        {!showRules && (
          <>
            <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 12px)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
              <div style={{ fontSize: 'clamp(0.8rem, 2.2vw, 1rem)' }}>{getText('score')}：{score}</div>
              <div style={{ fontSize: 'clamp(0.8rem, 2.2vw, 1rem)' }}>{getText('time')}：{timeLeft}秒</div>
              <div style={{ fontSize: 'clamp(0.8rem, 2.2vw, 1rem)' }}>{getText('level')}：{gameLevel}</div>
            </div>
            
            <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 12px)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)' }}>{getText('hits')}：{molesWhacked}</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)' }}>{getText('accuracy')}：{accuracy}%</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)' }}>{getText('combo')}：{combo}</div>
            </div>
            
            <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 12px)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)' }}>{getText('highScore')}：{highScore}</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)' }}>{getText('highCombo')}：{maxCombo}</div>
            </div>
            
            <div style={{ 
              fontSize: 'clamp(0.8rem, 2vw, 1rem)', 
              color: '#FF5722', 
              fontWeight: 'bold',
              marginTop: '8px',
              textAlign: 'center'
            }}>
              {getHumorousMessage()}
            </div>
            
            {!isPlaying && (
              <button 
                onClick={startGame}
                style={{
                  background: '#FF5722',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '25px',
                  padding: 'clamp(6px, 1.5vw, 8px) clamp(16px, 3vw, 24px)',
                  fontSize: 'clamp(0.9rem, 2.2vw, 1rem)',
                  fontWeight: 'bold',
                  marginTop: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {timeLeft === 30 ? getText('start') : getText('restart')}
              </button>
            )}
          </>
        )}
      </div>

      {!showRules && (
        /* 遊戲區域 */
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'clamp(8px, 1.5vw, 15px)',
          maxWidth: '300px',
          width: '100%',
          marginTop: '10px',
          padding: 'clamp(10px, 2vw, 15px)',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '15px',
          boxSizing: 'border-box'
        }}>
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              onClick={() => whackMole(i)}
              style={{
                width: 'clamp(60px, 10vw, 80px)',
                height: 'clamp(60px, 10vw, 80px)',
                background: '#654321',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '3px solid #8B4513',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {activeHole === i && (
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  width: '100%',
                  height: '60%',
                  background: '#8B4513',
                  borderRadius: '50% 50% 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  animation: 'molePop 0.3s ease-out',
                  cursor: 'pointer'
                }}>
                🐹
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes molePop {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        
        @keyframes whack {
          0% { transform: scale(1); }
          50% { transform: scale(0.8); }
          100% { transform: scale(1); }
        }
        
        @keyframes scorePop {
          0% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-20px); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
      `}</style>
    </div>
  );
}

// 採水果遊戲組件 - 升級版本
function FruitPickingGame({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const [score, setScore] = useState(0);
  const [fruits, setFruits] = useState<Array<{id: number, x: number, y: number, type: string, emoji: string, speed: number, direction: number}>>([]);

  // 多語言翻譯函數
  const getText = (key: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      'zh-TW': {
        title: '採水果',
        start: '開始遊戲',
        restart: '重新開始',
        score: '分數',
        time: '時間',
        level: '等級',
        collected: '收集',
        highScore: '最高分',
        rules: '遊戲規則',
        close: '關閉',
        hideRules: '隱藏規則',
        basicGameplay: '基本玩法',
        scoreSystem: '分數系統',
        levelSystem: '等級系統',
        tips: '技巧提示',
        newFeatures: '新增功能',
        gameOver: '遊戲結束',
        clickFruit: '點擊掉落的水果收集分數',
        putFruitInBasket: '把採到的水果裝進下面的水果籃裡',
        gameTime: '遊戲時間',
        seconds: '秒',
        fruitSpeed: '水果會不定向掉落且速度加快',
        apple: '蘋果',
        orange: '橘子',
        banana: '香蕉',
        strawberry: '草莓',
        grape: '葡萄',
        peach: '桃子',
        points: '分',
        level1: '1級',
        level2: '2級',
        level3: '3級',
        level4: '4級',
        fruitFaster: '水果更快',
        moreFrequent: '更頻繁',
        extremeSpeed: '極限速度',
        prioritizeHighScore: '優先收集高分水果',
        stayFocused: '保持專注，快速反應',
        buildHighScore: '建立高分記錄',
        fruitFromFourDirections: '水果會從四個方向隨機出現',
        curvedTrajectory: '水果掉落時會呈現彎曲動線',
        realTimeFeedback: '遊戲中會顯示即時收集反饋',
        detailedStats: '遊戲結束時顯示詳細統計',
        fixedBasketPosition: '籃子位置完全固定不震動',
        increasedFrequency: '水果出現頻率大幅提升'
      },
      'zh-CN': {
        title: '采水果',
        start: '开始游戏',
        restart: '重新开始',
        score: '分数',
        time: '时间',
        level: '等级',
        collected: '收集',
        highScore: '最高分',
        rules: '游戏规则',
        close: '关闭',
        hideRules: '隐藏规则',
        basicGameplay: '基本玩法',
        scoreSystem: '分数系统',
        levelSystem: '等级系统',
        tips: '技巧提示',
        newFeatures: '新增功能',
        clickFruit: '点击掉落的水果收集分数',
        putFruitInBasket: '把采到的水果装进下面的水果篮里',
        gameTime: '游戏时间',
        seconds: '秒',
        fruitSpeed: '水果会不定向掉落且速度加快',
        apple: '苹果',
        orange: '橘子',
        banana: '香蕉',
        strawberry: '草莓',
        grape: '葡萄',
        peach: '桃子',
        points: '分',
        level1: '1级',
        level2: '2级',
        level3: '3级',
        level4: '4级',
        fruitFaster: '水果更快',
        moreFrequent: '更频繁',
        extremeSpeed: '极限速度',
        prioritizeHighScore: '优先收集高分水果',
        stayFocused: '保持专注，快速反应',
        buildHighScore: '建立高分记录',
        fruitFromFourDirections: '水果会从四个方向随机出现',
        curvedTrajectory: '水果掉落时会呈现弯曲动线',
        realTimeFeedback: '游戏中会显示即时收集反馈',
        detailedStats: '游戏结束时显示详细统计',
        fixedBasketPosition: '篮子位置完全固定不震动',
        increasedFrequency: '水果出现频率大幅提升'
      },
      'en': {
        title: 'Fruit Picking',
        start: 'Start Game',
        restart: 'Restart',
        score: 'Score',
        time: 'Time',
        level: 'Level',
        collected: 'Collected',
        highScore: 'High Score',
        rules: 'Game Rules',
        close: 'Close',
        hideRules: 'Hide Rules',
        basicGameplay: 'Basic Gameplay',
        scoreSystem: 'Score System',
        levelSystem: 'Level System',
        tips: 'Tips',
        newFeatures: 'New Features',
        clickFruit: 'Click falling fruit to collect points',
        putFruitInBasket: 'Put collected fruit into the basket below',
        gameTime: 'Game Time',
        seconds: 'seconds',
        fruitSpeed: 'Fruit will fall randomly and speed up',
        apple: 'Apple',
        orange: 'Orange',
        banana: 'Banana',
        strawberry: 'Strawberry',
        grape: 'Grape',
        peach: 'Peach',
        points: 'points',
        level1: 'Level 1',
        level2: 'Level 2',
        level3: 'Level 3',
        level4: 'Level 4',
        fruitFaster: 'fruit faster',
        moreFrequent: 'more frequent',
        extremeSpeed: 'extreme speed',
        prioritizeHighScore: 'Prioritize high-score fruits',
        stayFocused: 'Stay focused, react quickly',
        buildHighScore: 'Build high score records',
        fruitFromFourDirections: 'Fruit appears from four directions randomly',
        curvedTrajectory: 'Fruit falls with curved trajectories',
        realTimeFeedback: 'Real-time collection feedback during game',
        detailedStats: 'Detailed statistics when game ends',
        fixedBasketPosition: 'Basket position completely fixed without vibration',
        increasedFrequency: 'Significantly increased fruit appearance frequency'
      },
      'ja': {
        title: 'フルーツ収穫',
        start: 'ゲーム開始',
        restart: '再開',
        score: 'スコア',
        time: '時間',
        level: 'レベル',
        collected: '収穫',
        highScore: 'ハイスコア',
        rules: 'ゲームルール',
        close: '閉じる',
        hideRules: 'ルール非表示',
        basicGameplay: '基本ゲームプレイ',
        scoreSystem: 'スコアシステム',
        levelSystem: 'レベルシステム',
        tips: 'ヒント',
        newFeatures: '新機能',
        clickFruit: '落ちる果物をクリックしてポイントを獲得',
        putFruitInBasket: '収穫した果物を下のバスケットに入れる',
        gameTime: 'ゲーム時間',
        seconds: '秒',
        fruitSpeed: '果物はランダムに落ちて速度が上がる',
        apple: 'りんご',
        orange: 'みかん',
        banana: 'バナナ',
        strawberry: 'いちご',
        grape: 'ぶどう',
        peach: 'もも',
        points: 'ポイント',
        level1: 'レベル1',
        level2: 'レベル2',
        level3: 'レベル3',
        level4: 'レベル4',
        fruitFaster: '果物がより速く',
        moreFrequent: 'より頻繁に',
        extremeSpeed: '極限速度',
        prioritizeHighScore: '高得点の果物を優先',
        stayFocused: '集中して素早く反応',
        buildHighScore: '高得点記録を築く',
        fruitFromFourDirections: '果物は4方向からランダムに出現',
        curvedTrajectory: '果物は曲線軌道で落下',
        realTimeFeedback: 'ゲーム中のリアルタイム収穫フィードバック',
        detailedStats: 'ゲーム終了時の詳細統計',
        fixedBasketPosition: 'バスケット位置は完全固定で震動なし',
        increasedFrequency: '果物出現頻度が大幅に向上'
      },
      'ko': {
        title: '과일 수확',
        start: '게임 시작',
        restart: '다시 시작',
        score: '점수',
        time: '시간',
        level: '레벨',
        collected: '수확',
        highScore: '최고 점수',
        rules: '게임 규칙',
        close: '닫기',
        hideRules: '규칙 숨기기',
        basicGameplay: '기본 게임플레이',
        scoreSystem: '점수 시스템',
        levelSystem: '레벨 시스템',
        tips: '팁',
        newFeatures: '새 기능',
        clickFruit: '떨어지는 과일을 클릭하여 점수 획득',
        putFruitInBasket: '수확한 과일을 아래 바구니에 넣기',
        gameTime: '게임 시간',
        seconds: '초',
        fruitSpeed: '과일이 무작위로 떨어지고 속도가 빨라짐',
        apple: '사과',
        orange: '귤',
        banana: '바나나',
        strawberry: '딸기',
        grape: '포도',
        peach: '복숭아',
        points: '점',
        level1: '레벨 1',
        level2: '레벨 2',
        level3: '레벨 3',
        level4: '레벨 4',
        fruitFaster: '과일이 더 빠르게',
        moreFrequent: '더 자주',
        extremeSpeed: '극한 속도',
        prioritizeHighScore: '고점수 과일 우선 수집',
        stayFocused: '집중하고 빠르게 반응',
        buildHighScore: '고점수 기록 구축',
        fruitFromFourDirections: '과일이 네 방향에서 무작위로 나타남',
        curvedTrajectory: '과일이 곡선 궤적으로 떨어짐',
        realTimeFeedback: '게임 중 실시간 수확 피드백',
        detailedStats: '게임 종료 시 상세 통계',
        fixedBasketPosition: '바구니 위치 완전 고정으로 진동 없음',
        increasedFrequency: '과일 출현 빈도 대폭 증가'
      },
      'vi': {
        title: 'Hái Trái Cây',
        start: 'Bắt Đầu Trò Chơi',
        restart: 'Chơi Lại',
        score: 'Điểm',
        time: 'Thời Gian',
        level: 'Cấp Độ',
        collected: 'Thu Hoạch',
        highScore: 'Điểm Cao Nhất',
        rules: 'Luật Chơi',
        close: 'Đóng',
        hideRules: 'Ẩn Luật',
        basicGameplay: 'Cách Chơi Cơ Bản',
        scoreSystem: 'Hệ Thống Điểm',
        levelSystem: 'Hệ Thống Cấp Độ',
        tips: 'Mẹo',
        newFeatures: 'Tính Năng Mới',
        clickFruit: 'Nhấp vào trái cây rơi để nhận điểm',
        putFruitInBasket: 'Đặt trái cây thu hoạch vào giỏ bên dưới',
        gameTime: 'Thời Gian Chơi',
        seconds: 'giây',
        fruitSpeed: 'Trái cây sẽ rơi ngẫu nhiên và tăng tốc',
        apple: 'Táo',
        orange: 'Cam',
        banana: 'Chuối',
        strawberry: 'Dâu tây',
        grape: 'Nho',
        peach: 'Đào',
        points: 'điểm',
        level1: 'Cấp 1',
        level2: 'Cấp 2',
        level3: 'Cấp 3',
        level4: 'Cấp 4',
        fruitFaster: 'trái cây nhanh hơn',
        moreFrequent: 'thường xuyên hơn',
        extremeSpeed: 'tốc độ cực hạn',
        prioritizeHighScore: 'Ưu tiên trái cây điểm cao',
        stayFocused: 'Tập trung, phản ứng nhanh',
        buildHighScore: 'Xây dựng kỷ lục điểm cao',
        fruitFromFourDirections: 'Trái cây xuất hiện từ bốn hướng ngẫu nhiên',
        curvedTrajectory: 'Trái cây rơi theo quỹ đạo cong',
        realTimeFeedback: 'Phản hồi thu hoạch thời gian thực trong game',
        detailedStats: 'Thống kê chi tiết khi kết thúc game',
        fixedBasketPosition: 'Vị trí giỏ hoàn toàn cố định không rung',
        increasedFrequency: 'Tần suất xuất hiện trái cây tăng đáng kể'
      },
      'th': {
        title: 'เก็บผลไม้',
        start: 'เริ่มเกม',
        restart: 'เริ่มใหม่',
        score: 'คะแนน',
        time: 'เวลา',
        level: 'ระดับ',
        collected: 'เก็บ',
        highScore: 'คะแนนสูงสุด',
        rules: 'กฎเกม',
        close: 'ปิด',
        hideRules: 'ซ่อนกฎ',
        basicGameplay: 'การเล่นพื้นฐาน',
        scoreSystem: 'ระบบคะแนน',
        levelSystem: 'ระบบระดับ',
        tips: 'เคล็ดลับ',
        newFeatures: 'คุณสมบัติใหม่',
        clickFruit: 'คลิกผลไม้ที่ตกลงมาเพื่อได้คะแนน',
        putFruitInBasket: 'ใส่ผลไม้ที่เก็บได้ลงในตะกร้าข้างล่าง',
        gameTime: 'เวลาเกม',
        seconds: 'วินาที',
        fruitSpeed: 'ผลไม้จะตกลงมาแบบสุ่มและเร็วขึ้น',
        apple: 'แอปเปิ้ล',
        orange: 'ส้ม',
        banana: 'กล้วย',
        strawberry: 'สตรอเบอร์รี่',
        grape: 'องุ่น',
        peach: 'พีช',
        points: 'คะแนน',
        level1: 'ระดับ 1',
        level2: 'ระดับ 2',
        level3: 'ระดับ 3',
        level4: 'ระดับ 4',
        fruitFaster: 'ผลไม้เร็วขึ้น',
        moreFrequent: 'บ่อยขึ้น',
        extremeSpeed: 'ความเร็วสุดขีด',
        prioritizeHighScore: 'ให้ความสำคัญกับผลไม้คะแนนสูง',
        stayFocused: 'มีสมาธิและตอบสนองเร็ว',
        buildHighScore: 'สร้างสถิติคะแนนสูง',
        fruitFromFourDirections: 'ผลไม้ปรากฏจากสี่ทิศทางแบบสุ่ม',
        curvedTrajectory: 'ผลไม้ตกลงมาด้วยวิถีโค้ง',
        realTimeFeedback: 'การตอบสนองการเก็บเกี่ยวแบบเรียลไทม์ในเกม',
        detailedStats: 'สถิติรายละเอียดเมื่อเกมจบ',
        fixedBasketPosition: 'ตำแหน่งตะกร้าคงที่โดยไม่สั่น',
        increasedFrequency: 'ความถี่การปรากฏของผลไม้เพิ่มขึ้นอย่างมาก'
      },
      'la': {
        title: 'Fructus Colligere',
        start: 'Ludum Incipere',
        restart: 'Iterum Incipere',
        score: 'Puncta',
        time: 'Tempus',
        level: 'Gradus',
        collected: 'Collecta',
        highScore: 'Puncta Maxima',
        rules: 'Regulae Ludi',
        close: 'Claudere',
        hideRules: 'Regulae Occultare',
        basicGameplay: 'Ludus Basicus',
        scoreSystem: 'Systema Punctorum',
        levelSystem: 'Systema Graduum',
        tips: 'Consilia',
        newFeatures: 'Facultates Novae',
        clickFruit: 'Clicca fructus cadentes ut puncta accipias',
        putFruitInBasket: 'Pone fructus collectos in corbem infra',
        gameTime: 'Tempus Ludi',
        seconds: 'secundis',
        fruitSpeed: 'Fructus cadent temere et velocitate crescente',
        apple: 'Malum',
        orange: 'Aurantium',
        banana: 'Musa',
        strawberry: 'Fragum',
        grape: 'Uva',
        peach: 'Persicum',
        points: 'puncta',
        level1: 'Gradus 1',
        level2: 'Gradus 2',
        level3: 'Gradus 3',
        level4: 'Gradus 4',
        fruitFaster: 'fructus velociores',
        moreFrequent: 'frequentiores',
        extremeSpeed: 'velocitas extrema',
        prioritizeHighScore: 'Prioritiza fructus punctis altis',
        stayFocused: 'Mane attentus, reage celeriter',
        buildHighScore: 'Aedifica puncta alta',
        fruitFromFourDirections: 'Fructus apparent ex quattuor directionibus temere',
        curvedTrajectory: 'Fructus cadunt cum trajectoriis curvis',
        realTimeFeedback: 'Feedback collectionis tempore reali in ludo',
        detailedStats: 'Statisticae detaillatae cum ludus finitur',
        fixedBasketPosition: 'Positio corbis omnino fixa sine vibratione',
        increasedFrequency: 'Frequentia fructuum apparendi multum aucta'
      },
      'ms': {
        title: 'Kutip Buah',
        start: 'Mulakan Permainan',
        restart: 'Mulakan Semula',
        score: 'Markah',
        time: 'Masa',
        level: 'Tahap',
        collected: 'Kutip',
        highScore: 'Markah Tertinggi',
        rules: 'Peraturan Permainan',
        close: 'Tutup',
        hideRules: 'Sembunyikan Peraturan',
        basicGameplay: 'Permainan Asas',
        scoreSystem: 'Sistem Markah',
        levelSystem: 'Sistem Tahap',
        tips: 'Petua',
        newFeatures: 'Ciri Baharu',
        clickFruit: 'Klik buah yang jatuh untuk dapat markah',
        putFruitInBasket: 'Letakkan buah yang dikutip ke dalam bakul di bawah',
        gameTime: 'Masa Permainan',
        seconds: 'saat',
        fruitSpeed: 'Buah akan jatuh secara rawak dan laju bertambah',
        apple: 'Epal',
        orange: 'Oren',
        banana: 'Pisang',
        strawberry: 'Strawberi',
        grape: 'Anggur',
        peach: 'Pic',
        points: 'markah',
        level1: 'Tahap 1',
        level2: 'Tahap 2',
        level3: 'Tahap 3',
        level4: 'Tahap 4',
        fruitFaster: 'buah lebih cepat',
        moreFrequent: 'lebih kerap',
        extremeSpeed: 'kelajuan melampau',
        prioritizeHighScore: 'Utamakan buah markah tinggi',
        stayFocused: 'Kekal fokus, bertindak pantas',
        buildHighScore: 'Bina rekod markah tinggi',
        fruitFromFourDirections: 'Buah muncul dari empat arah secara rawak',
        curvedTrajectory: 'Buah jatuh dengan trajektori melengkung',
        realTimeFeedback: 'Maklum balas kutipan masa nyata semasa permainan',
        detailedStats: 'Statistik terperinci apabila permainan tamat',
        fixedBasketPosition: 'Kedudukan bakul tetap sepenuhnya tanpa getaran',
        increasedFrequency: 'Kekerapan kemunculan buah meningkat dengan ketara'
      }
    };
    return translations[lang]?.[key] || translations['zh-TW'][key] || key;
  };
  const [basket, setBasket] = useState<Array<{type: string, emoji: string}>>([]);
  const [fruitCounts, setFruitCounts] = useState<{[key: string]: number}>({});
  const [recentFruits, setRecentFruits] = useState<Array<{type: string, emoji: string, count: number}>>([]);
  const [highScore, setHighScore] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameLevel, setGameLevel] = useState(1);
  const [collectedFruits, setCollectedFruits] = useState(0);

  // 載入遊戲進度
  useEffect(() => {
    const saved = loadGameProgress('fruitPicking');
    if (saved) {
      setHighScore(saved.highScore || 0);
    }
  }, []);

  // 全局水果下落動畫
  useEffect(() => {
    if (!isPlaying || fruits.length === 0) return;
    
    const fallInterval = setInterval(() => {
      setFruits(prev => {
        const updated = prev.map(fruit => {
          const curveOffset = (fruit as any).curveOffset || 0;
          const curveSpeed = (fruit as any).curveSpeed || 0.05;
          const time = Date.now() * 0.001; // 當前時間
          
          // 計算多層彎曲動線（蛇行效果）
          const curveX1 = Math.sin(time * curveSpeed + curveOffset) * 4;
          const curveY1 = Math.cos(time * curveSpeed + curveOffset) * 2;
          const curveX2 = Math.sin(time * curveSpeed * 2 + curveOffset) * 2;
          const curveY2 = Math.cos(time * curveSpeed * 1.5 + curveOffset) * 1;
          const curveX3 = Math.sin(time * curveSpeed * 0.5 + curveOffset) * 3;
          
          // 組合多層彎曲
          const totalCurveX = curveX1 + curveX2 + curveX3;
          const totalCurveY = curveY1 + curveY2;
          
          return {
            ...fruit,
            y: fruit.y + ((fruit as any).directionY || fruit.speed || 1) + totalCurveY,
            x: fruit.x + ((fruit as any).directionX || fruit.direction || 0) + totalCurveX
          };
        }).filter(fruit => 
          fruit.y > -20 && fruit.y < 120 && 
          fruit.x > -20 && fruit.x < 120
        ); // 移除掉出螢幕的水果
        
        return updated as any; // 臨時類型轉換
      });
    }, 100);

    return () => clearInterval(fallInterval);
  }, [isPlaying, fruits.length]);

  // 保存遊戲進度
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      saveGameProgress('fruitPicking', { highScore: score });
    }
  }, [score, highScore]);

  // 等級系統
  useEffect(() => {
    if (score >= 100 && gameLevel === 1) {
      setGameLevel(2);
    } else if (score >= 250 && gameLevel === 2) {
      setGameLevel(3);
    } else if (score >= 500 && gameLevel === 3) {
      setGameLevel(4);
    }
  }, [score, gameLevel]);

  const fruitTypes = [
    { type: 'apple', emoji: '🍎', points: 10 },
    { type: 'orange', emoji: '🍊', points: 15 },
    { type: 'banana', emoji: '🍌', points: 20 },
    { type: 'strawberry', emoji: '🍓', points: 25 },
    { type: 'grape', emoji: '🍇', points: 30 },
    { type: 'peach', emoji: '🍑', points: 35 }
  ];

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setGameLevel(1);
    setCollectedFruits(0);
    setBasket([]);
    setFruits([]);
    setFruitCounts({});
    setRecentFruits([]);
    
    let gameInterval: NodeJS.Timeout;
    let fruitInterval: NodeJS.Timeout;
    
    gameInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameInterval);
          clearInterval(fruitInterval);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 立即生成第一個水果
    setTimeout(() => {
      spawnFruit();
      // 根據等級調整水果生成頻率 - 增加水果數量
      const spawnTime = gameLevel === 1 ? 1200 : gameLevel === 2 ? 800 : gameLevel === 3 ? 600 : 400;
      fruitInterval = setInterval(() => {
        spawnFruit();
        // 高等級時同時生成多個水果
        if (gameLevel >= 3) {
          setTimeout(() => spawnFruit(), 200);
        }
        if (gameLevel >= 4) {
          setTimeout(() => spawnFruit(), 400);
        }
      }, spawnTime);
    }, 100); // 縮短延遲時間
  };

  const spawnFruit = () => {
    const fruitType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
    const speed = gameLevel === 1 ? 1 : gameLevel === 2 ? 1.5 : gameLevel === 3 ? 2 : 2.5;
    
          // 隨機選擇出現方向：0=上, 1=下, 2=左, 3=右
      // 增加更多水果生成機率
      const spawnDirection = Math.floor(Math.random() * 4);
      const extraSpawn = Math.random() < 0.3; // 30%機率額外生成水果
    
    let x, y, directionX, directionY;
    
    switch (spawnDirection) {
      case 0: // 從上方出現
        x = Math.random() * 80 + 10;
        y = -10;
        directionX = (Math.random() - 0.5) * 0.3; // 隨機水平移動
        directionY = speed;
        break;
      case 1: // 從下方出現
        x = Math.random() * 80 + 10;
        y = 110;
        directionX = (Math.random() - 0.5) * 0.3;
        directionY = -speed;
        break;
      case 2: // 從左方出現
        x = -10;
        y = Math.random() * 80 + 10;
        directionX = speed;
        directionY = (Math.random() - 0.5) * 0.3;
        break;
      case 3: // 從右方出現
        x = 110;
        y = Math.random() * 80 + 10;
        directionX = -speed;
        directionY = (Math.random() - 0.5) * 0.3;
        break;
      default:
        x = Math.random() * 80 + 10;
        y = -10;
        directionX = (Math.random() - 0.5) * 0.3;
        directionY = speed;
    }
    
    const newFruit = {
      id: Date.now() + Math.random(),
      x: x,
      y: y,
      type: fruitType.type,
      emoji: fruitType.emoji,
      speed: speed,
      direction: 0, // 保持兼容性
      directionX: directionX,
      directionY: directionY,
      curveOffset: Math.random() * Math.PI * 2, // 彎曲偏移
      curveSpeed: Math.random() * 0.15 + 0.08 // 增強彎曲速度
    };
    setFruits(prev => [...prev, newFruit]);
    
    // 30%機率額外生成一個水果
    if (extraSpawn) {
      const extraFruitType = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
      const extraX = Math.random() * 80 + 10;
      const extraY = -10;
      const extraFruit = {
        id: Date.now() + Math.random() + 1,
        x: extraX,
        y: extraY,
        type: extraFruitType.type,
        emoji: extraFruitType.emoji,
        speed: speed,
        direction: 0,
        directionX: (Math.random() - 0.5) * 0.3,
        directionY: speed,
        curveOffset: Math.random() * Math.PI * 2,
        curveSpeed: Math.random() * 0.15 + 0.08
      };
      setFruits(prev => [...prev, extraFruit]);
    }
  };

  const catchFruit = (fruitId: number) => {
    const fruit = fruits.find(f => f.id === fruitId);
    if (fruit) {
      const fruitType = fruitTypes.find(ft => ft.type === fruit.type);
      
      // 立即移除水果，防止重複點擊
      setFruits(prev => prev.filter(f => f.id !== fruitId));
      
      // 使用函數式更新確保狀態正確
      setScore(prevScore => {
        const newScore = prevScore + (fruitType?.points || 10);
        // 更新最高分
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        return newScore;
      });
      
      setCollectedFruits(prev => prev + 1);
      setBasket(prev => [...prev, { type: fruit.type, emoji: fruit.emoji }]);
      
      // 更新水果計數
      setFruitCounts(prev => {
        const newCounts = { ...prev };
        newCounts[fruit.type] = (newCounts[fruit.type] || 0) + 1;
        return newCounts;
      });
      
      // 簡化最近採集的水果列表更新
      setRecentFruits(prev => {
        const existing = prev.find(f => f.type === fruit.type);
        if (existing) {
          return prev.map(f => 
            f.type === fruit.type 
              ? { ...f, count: f.count + 1 }
              : f
          );
        } else {
          return [...prev, { type: fruit.type, emoji: fruit.emoji, count: 1 }];
        }
      });
    }
  };

  // 遊戲結束時的幽默提示語
  const getHumorousMessage = () => {
    if (collectedFruits < 5) return "😅 新手採果者！";
    if (collectedFruits < 10) return "🍎 有點手感了！";
    if (collectedFruits < 15) return "🍊 水果獵人！";
    if (collectedFruits < 20) return "🍌 採果高手！";
    if (collectedFruits < 25) return "🍓 水果大師！";
    return "👑 採果之王！";
  };

  // 計算各類水果統計
  const getFruitStats = () => {
    const stats: { [key: string]: number } = {};
    basket.forEach(fruit => {
      stats[fruit.type] = (stats[fruit.type] || 0) + 1;
    });
    return stats;
  };

  // 清除最近採集的水果顯示
  useEffect(() => {
    if (recentFruits.length > 0 && isPlaying) {
      const timer = setTimeout(() => {
        setRecentFruits([]);
      }, 3000); // 3秒後清除
      return () => clearTimeout(timer);
    }
  }, [recentFruits, isPlaying]);

  return (
    <div style={{ 
      height: '100vh', 
      background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)',
      padding: 'clamp(10px, 2vw, 20px)',
      position: 'relative',
      overflow: 'hidden',
      // 確保籃子區域不受影響
      isolation: 'isolate'
    }}>
      {/* 返回按鈕 */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'clamp(20px, 4vw, 40px)',
          left: window.innerWidth >= 768 ? 'clamp(10px, 2vw, 15px)' : 'clamp(20px, 4vw, 40px)',
          background: '#fff',
          border: '2px solid #6B5BFF',
          borderRadius: '50%',
          width: 'clamp(40px, 8vw, 50px)',
          height: 'clamp(40px, 8vw, 50px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          color: '#6B5BFF'
        }}
      >
        ←
      </button>

      {/* 遊戲信息 */}
      <div style={{ 
        position: 'absolute',
        top: 'clamp(20px, 4vw, 40px)',
        left: 'clamp(60px, 12vw, 70px)',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '15px',
        padding: 'clamp(12px, 2.5vw, 16px)',
        zIndex: 10,
        maxWidth: '180px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', margin: 0, lineHeight: '1.2' }}>🍎 {getText('title')}</h3>
          <button 
            onClick={() => setShowRules(!showRules)}
            style={{
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
              cursor: 'pointer'
            }}
          >
            {showRules ? getText('hideRules') : getText('rules')}
          </button>
        </div>
        
        {showRules && (
          <div style={{ 
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '10px',
            padding: '10px',
            marginBottom: '10px',
            textAlign: 'left',
            fontSize: 'clamp(0.7rem, 1.8vw, 0.8rem)',
            lineHeight: '1.3',
            maxHeight: 'clamp(200px, 40vh, 300px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: '#4CAF50 #f0f0f0'
          }}>
            <h4 style={{ marginBottom: '8px', color: '#333' }}>🍎 {getText('rules')}：</h4>
            <p style={{ marginBottom: '6px' }}><strong>{getText('basicGameplay')}：</strong></p>
            <p style={{ marginBottom: '6px' }}>• {getText('clickFruit')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('putFruitInBasket')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('gameTime')}：30{getText('seconds')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('fruitSpeed')}</p>
            
            <p style={{ marginBottom: '6px', marginTop: '8px' }}><strong>{getText('scoreSystem')}：</strong></p>
            <p style={{ marginBottom: '6px' }}>• 🍎 {getText('apple')}：10{getText('points')}</p>
            <p style={{ marginBottom: '6px' }}>• 🍊 {getText('orange')}：15{getText('points')}</p>
            <p style={{ marginBottom: '6px' }}>• 🍌 {getText('banana')}：20{getText('points')}</p>
            <p style={{ marginBottom: '6px' }}>• 🍓 {getText('strawberry')}：25{getText('points')}</p>
            <p style={{ marginBottom: '6px' }}>• 🍇 {getText('grape')}：30{getText('points')}</p>
            <p style={{ marginBottom: '6px' }}>• 🍑 {getText('peach')}：35{getText('points')}</p>
            
            <p style={{ marginBottom: '6px', marginTop: '8px' }}><strong>{getText('levelSystem')}：</strong></p>
            <p style={{ marginBottom: '6px' }}>• {getText('level1')}：100{getText('points')} → {getText('level2')}（{getText('fruitFaster')}）</p>
            <p style={{ marginBottom: '6px' }}>• {getText('level2')}：250{getText('points')} → {getText('level3')}（{getText('moreFrequent')}）</p>
            <p style={{ marginBottom: '6px' }}>• {getText('level3')}：500{getText('points')} → {getText('level4')}（{getText('extremeSpeed')}）</p>
            
            <p style={{ marginBottom: '6px', marginTop: '8px' }}><strong>{getText('tips')}：</strong></p>
            <p style={{ marginBottom: '6px' }}>• {getText('prioritizeHighScore')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('stayFocused')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('buildHighScore')}</p>
            
            <p style={{ marginBottom: '6px', marginTop: '8px' }}><strong>{getText('newFeatures')}：</strong></p>
            <p style={{ marginBottom: '6px' }}>• {getText('fruitFromFourDirections')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('curvedTrajectory')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('realTimeFeedback')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('detailedStats')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('fixedBasketPosition')}</p>
            <p style={{ marginBottom: '6px' }}>• {getText('increasedFrequency')}</p>
          </div>
        )}
        
        {!showRules && (
          <>
            <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 8px)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)' }}>{getText('score')}：{score}</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)' }}>{getText('time')}：{timeLeft}秒</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)' }}>{getText('level')}：{gameLevel}</div>
            </div>
            
            <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 8px)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>{getText('collected')}：{collectedFruits}個</div>
              <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>{getText('highScore')}：{highScore}</div>
            </div>
            
            <div style={{ 
              fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)', 
              color: '#FF5722', 
              fontWeight: 'bold',
              marginTop: '6px',
              textAlign: 'center'
            }}>
              {getHumorousMessage()}
            </div>
            

            
            {!isPlaying && (
              <button 
                onClick={startGame}
                style={{
                  background: '#FF9800',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: 'clamp(5px, 1.2vw, 6px) clamp(12px, 2.5vw, 18px)',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                  fontWeight: 'bold',
                  marginTop: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {timeLeft === 30 ? getText('start') : getText('restart')}
              </button>
            )}
          </>
        )}
      </div>

      {/* 遊戲結束統計 */}
      {!isPlaying && timeLeft === 0 && (
        <div style={{
          position: 'absolute',
          bottom: 'clamp(120px, 20vw, 140px)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          zIndex: 10
        }}>
          {Object.entries(fruitCounts).map(([type, count]) => {
            const fruitType = fruitTypes.find(ft => ft.type === type);
            return (
              <div key={type} style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}>
                <span style={{ 
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}>
                  {fruitType?.emoji}
                </span>
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#FF5722',
                  color: 'white',
                  borderRadius: '50%',
                  width: 'clamp(20px, 4vw, 25px)',
                  height: 'clamp(20px, 4vw, 25px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* 籃子區域 - 絕對固定不動 */}
      <div style={{
        position: 'fixed',
        bottom: 'clamp(10px, 2vw, 20px)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 5, // 降低z-index，讓水果在籃子上方
        width: 'clamp(200px, 30vw, 250px)', // 調整寬度，因為不再需要右側顯示
        pointerEvents: 'none', // 防止籃子區域影響點擊
        userSelect: 'none', // 防止文字選擇
        touchAction: 'none', // 防止觸摸事件
        willChange: 'auto', // 防止瀏覽器優化
        backfaceVisibility: 'hidden', // 防止3D變換
        contain: 'layout style paint', // 強制隔離
        isolation: 'isolate' // 創建新的層疊上下文
      }}>
        {/* 籃子 - 絕對固定不動 */}
        <div style={{
          background: '#8B4513',
          width: 'clamp(150px, 25vw, 200px)',
          height: 'clamp(75px, 12vw, 100px)',
          borderRadius: '50% 50% 0 0',
          border: '4px solid #654321',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 6, // 降低z-index
          pointerEvents: 'none', // 防止籃子影響點擊
          transform: 'translateZ(0)', // 強制硬體加速
          willChange: 'auto', // 防止瀏覽器優化導致移動
          userSelect: 'none', // 防止文字選擇
          touchAction: 'none', // 防止觸摸事件
          backfaceVisibility: 'hidden', // 防止3D變換
          perspective: 'none', // 防止透視變換
          transformStyle: 'flat', // 防止3D渲染
          contain: 'layout style paint', // 強制隔離
          isolation: 'isolate' // 創建新的層疊上下文
        }}>
          {basket.length > 0 ? (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2px',
              maxWidth: '90%',
              maxHeight: '90%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              userSelect: 'none',
              touchAction: 'none',
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}>
              {/* 顯示最近收集的水果 */}
              {recentFruits.slice(-4).map((fruit, index) => (
                <span key={index} style={{ 
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                  position: 'relative'
                }}>
                  {fruit.emoji}
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#FF5722',
                    color: 'white',
                    borderRadius: '50%',
                    width: 'clamp(12px, 2.5vw, 16px)',
                    height: 'clamp(12px, 2.5vw, 16px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(0.5rem, 1.2vw, 0.7rem)',
                    fontWeight: 'bold'
                  }}>
                    {fruit.count}
                  </span>
                </span>
              ))}
              {/* 如果沒有最近的水果，顯示籃子裡的水果 */}
              {recentFruits.length === 0 && basket.slice(-6).map((fruit, index) => (
                <span key={index} style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
                  {fruit.emoji}
                </span>
              ))}
              {basket.length > 6 && recentFruits.length === 0 && (
                <span style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)', color: '#fff' }}>
                  +{basket.length - 6}
                </span>
              )}
            </div>
          ) : (
            <span style={{ color: '#654321' }}>🧺</span>
          )}
        </div>
        

      </div>

      {/* 水果 */}
      {fruits.map(fruit => (
        <div
          key={fruit.id}
          onClick={(e) => {
            e.stopPropagation(); // 防止事件冒泡
            e.preventDefault(); // 防止默認行為
            catchFruit(fruit.id);
          }}
          onTouchStart={(e) => {
            e.stopPropagation(); // 防止事件冒泡
            e.preventDefault(); // 防止默認行為
            catchFruit(fruit.id);
          }}
          style={{
            position: 'absolute',
            left: `${fruit.x}%`,
            top: `${fruit.y}%`,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'all 0.1s ease',
            zIndex: 20, // 提高z-index，確保水果在籃子上方
            touchAction: 'manipulation', // 優化觸摸響應
            willChange: 'transform', // 只允許transform變化
            WebkitUserSelect: 'none', // Safari支持
            MozUserSelect: 'none', // Firefox支持
            msUserSelect: 'none' // IE支持
          }}
        >
          {fruit.emoji}
        </div>
      ))}
      



    </div>
  );
} 

function BubblePopGame({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  // 多語言翻譯函數
  const getText = (key: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      'zh-TW': {
        title: '情緒泡泡爆破',
        start: '開始遊戲',
        restart: '重新開始',
        score: '分數',
        time: '時間',
        combo: '連擊',
        accuracy: '準確率',
        highScore: '最高分',
        rules: '遊戲規則',
        close: '關閉',
        hideRules: '隱藏規則',
        gameOver: '遊戲結束',
        soundOn: '音效開',
        soundOff: '音效關',
        rhythmGame: '音樂節奏',
        gameplay: '遊戲玩法',
        clickStartButton: '點擊「開始遊戲」按鈕',
        preciseBubblePop: '精準戳破泡泡',
        computer: '電腦',
        preciseClickCenter: '精準點擊泡泡中心戳破',
        mobile: '手機',
        preciseTouchCenter: '精準觸摸泡泡中心戳破',
        highAccuracyRequired: '需要高精準度，點擊泡泡邊緣無效',
        fastBubbles: '快速泡泡',
        harderToPop: '更難戳破，需要更高精準度',
        slowBubbles: '慢速泡泡',
        easierToPop: '相對容易戳破',
        emotionBubbleScore: '情緒泡泡分數',
        angryBubble: '憤怒泡泡',
        anxiousBubble: '焦慮泡泡',
        depressedBubble: '憂鬱泡泡',
        stressedBubble: '壓力泡泡',
        irritatedBubble: '暴躁泡泡',
        frustratedBubble: '沮喪泡泡',
        points: '分',
        specialBubbles: '特殊泡泡',
        bombBubble: '炸彈泡泡',
        clearAllNearby: '清除周圍所有泡泡',
        goldenBubble: '金色泡泡',
        doubleScore: '雙倍分數',
        ghostBubble: '幽靈泡泡',
        clickTwice: '需要點擊兩次',
        chainBubble: '連鎖泡泡',
        clearSameType: '清除同類型泡泡',
        timeBubble: '時間泡泡',
        add5Seconds: '增加5秒時間',
        accuracySystem: '精準度系統',
        above: '以上',
        triggerPowerMode: '觸發能量模式',
        goodAccuracy: '良好精準度',
        below: '以下',
        needImproveAccuracy: '需要提高精準度',
        powerMode: '能量模式',
        autoTrigger: '自動觸發',
        powerModeEasier: '能量模式下更容易戳破泡泡',
        last10Seconds: '持續10秒後自動結束',
        comboSystem: '連擊系統',
        continuousPopExtraScore: '連續戳破泡泡可獲得額外分數',
        timeLimit: '時間限制',
        sixtySecondsHighestScore: '60秒內獲得最高分數',
        gameGoal: '遊戲目標',
        precisePopEmotionBubbles: '精準戳破情緒泡泡，釋放內心壓力',
        accuracyChallenge: '精準度挑戰',
        onlyClickCenterToPop: '只有點擊泡泡中心才能戳破',
        fastBubblesNeedHigherAccuracy: '快速泡泡需要更高精準度'
      },
      'zh-CN': {
        title: '情绪泡泡爆破',
        start: '开始游戏',
        restart: '重新开始',
        score: '分数',
        time: '时间',
        combo: '连击',
        accuracy: '准确率',
        highScore: '最高分',
        rules: '游戏规则',
        close: '关闭',
        hideRules: '隐藏规则',
        gameplay: '游戏玩法',
        clickStartButton: '点击「开始游戏」按钮',
        preciseBubblePop: '精准戳破泡泡',
        computer: '电脑',
        preciseClickCenter: '精准点击泡泡中心戳破',
        mobile: '手机',
        preciseTouchCenter: '精准触摸泡泡中心戳破',
        highAccuracyRequired: '需要高精准度，点击泡泡边缘无效',
        fastBubbles: '快速泡泡',
        harderToPop: '更难戳破，需要更高精准度',
        slowBubbles: '慢速泡泡',
        easierToPop: '相对容易戳破',
        emotionBubbleScore: '情绪泡泡分数',
        angryBubble: '愤怒泡泡',
        anxiousBubble: '焦虑泡泡',
        depressedBubble: '忧郁泡泡',
        stressedBubble: '压力泡泡',
        irritatedBubble: '暴躁泡泡',
        frustratedBubble: '沮丧泡泡',
        points: '分',
        specialBubbles: '特殊泡泡',
        bombBubble: '炸弹泡泡',
        clearAllNearby: '清除周围所有泡泡',
        goldenBubble: '金色泡泡',
        doubleScore: '双倍分数',
        ghostBubble: '幽灵泡泡',
        clickTwice: '需要点击两次',
        chainBubble: '连锁泡泡',
        clearSameType: '清除同类型泡泡',
        timeBubble: '时间泡泡',
        add5Seconds: '增加5秒时间',
        accuracySystem: '精准度系统',
        above: '以上',
        triggerPowerMode: '触发能量模式',
        goodAccuracy: '良好精准度',
        below: '以下',
        needImproveAccuracy: '需要提高精准度',
        powerMode: '能量模式',
        autoTrigger: '自动触发',
        powerModeEasier: '能量模式下更容易戳破泡泡',
        last10Seconds: '持续10秒后自动结束',
        comboSystem: '连击系统',
        continuousPopExtraScore: '连续戳破泡泡可获得额外分数',
        timeLimit: '时间限制',
        sixtySecondsHighestScore: '60秒内获得最高分数',
        gameGoal: '游戏目标',
        precisePopEmotionBubbles: '精准戳破情绪泡泡，释放内心压力',
        accuracyChallenge: '精准度挑战',
        onlyClickCenterToPop: '只有点击泡泡中心才能戳破',
        fastBubblesNeedHigherAccuracy: '快速泡泡需要更高精准度'
      },
      'en': {
        title: 'Bubble Pop',
        start: 'Start Game',
        restart: 'Restart',
        score: 'Score',
        time: 'Time',
        combo: 'Combo',
        accuracy: 'Accuracy',
        highScore: 'High Score',
        rules: 'Game Rules',
        close: 'Close',
        hideRules: 'Hide Rules',
        gameplay: 'Gameplay',
        clickStartButton: 'Click "Start Game" button',
        preciseBubblePop: 'Precise Bubble Pop',
        computer: 'Computer',
        preciseClickCenter: 'Precisely click bubble center to pop',
        mobile: 'Mobile',
        preciseTouchCenter: 'Precisely touch bubble center to pop',
        highAccuracyRequired: 'High accuracy required, clicking bubble edge is invalid',
        fastBubbles: 'Fast bubbles',
        harderToPop: 'Harder to pop, requires higher accuracy',
        slowBubbles: 'Slow bubbles',
        easierToPop: 'Relatively easier to pop',
        emotionBubbleScore: 'Emotion Bubble Score',
        angryBubble: 'Angry bubble',
        anxiousBubble: 'Anxious bubble',
        depressedBubble: 'Depressed bubble',
        stressedBubble: 'Stressed bubble',
        irritatedBubble: 'Irritated bubble',
        frustratedBubble: 'Frustrated bubble',
        points: 'points',
        specialBubbles: 'Special Bubbles',
        bombBubble: 'Bomb bubble',
        clearAllNearby: 'Clear all nearby bubbles',
        goldenBubble: 'Golden bubble',
        doubleScore: 'Double score',
        ghostBubble: 'Ghost bubble',
        clickTwice: 'Need to click twice',
        chainBubble: 'Chain bubble',
        clearSameType: 'Clear same type bubbles',
        timeBubble: 'Time bubble',
        add5Seconds: 'Add 5 seconds',
        accuracySystem: 'Accuracy System',
        above: 'above',
        triggerPowerMode: 'Trigger power mode',
        goodAccuracy: 'Good accuracy',
        below: 'below',
        needImproveAccuracy: 'Need to improve accuracy',
        powerMode: 'Power Mode',
        autoTrigger: 'Auto trigger',
        powerModeEasier: 'Easier to pop bubbles in power mode',
        last10Seconds: 'Last 10 seconds then auto end',
        comboSystem: 'Combo System',
        continuousPopExtraScore: 'Continuous pop for extra score',
        timeLimit: 'Time Limit',
        sixtySecondsHighestScore: '60 seconds to get highest score',
        gameGoal: 'Game Goal',
        precisePopEmotionBubbles: 'Precisely pop emotion bubbles, release inner pressure',
        accuracyChallenge: 'Accuracy Challenge',
        onlyClickCenterToPop: 'Only by clicking the center of the bubble can you pop it',
        fastBubblesNeedHigherAccuracy: 'Fast bubbles require higher accuracy'
      },
      'ja': {
        title: 'バブルポップ',
        start: 'ゲーム開始',
        restart: '再開',
        score: 'スコア',
        time: '時間',
        combo: 'コンボ',
        accuracy: '精度',
        highScore: 'ハイスコア',
        rules: 'ゲームルール',
        close: '閉じる',
        hideRules: 'ルール非表示',
        gameplay: 'ゲームプレイ',
        clickStartButton: '「ゲーム開始」ボタンをクリック',
        preciseBubblePop: '精密バブルポップ',
        computer: 'パソコン',
        preciseClickCenter: 'バブルの中心を精密にクリックしてポップ',
        mobile: 'モバイル',
        preciseTouchCenter: 'バブルの中心を精密にタッチしてポップ',
        highAccuracyRequired: '高精度が必要、バブルの端をクリックは無効',
        fastBubbles: '高速バブル',
        harderToPop: 'ポップしにくい、より高い精度が必要',
        slowBubbles: '低速バブル',
        easierToPop: '比較的ポップしやすい',
        emotionBubbleScore: '感情バブルスコア',
        angryBubble: '怒りバブル',
        anxiousBubble: '不安バブル',
        depressedBubble: '憂鬱バブル',
        stressedBubble: 'ストレスバブル',
        irritatedBubble: 'イライラバブル',
        frustratedBubble: 'フラストレーションバブル',
        points: 'ポイント',
        specialBubbles: '特殊バブル',
        bombBubble: '爆弾バブル',
        clearAllNearby: '周辺のすべてのバブルをクリア',
        goldenBubble: 'ゴールデンバブル',
        doubleScore: 'ダブルスコア',
        ghostBubble: 'ゴーストバブル',
        clickTwice: '2回クリックが必要',
        chainBubble: 'チェーンバブル',
        clearSameType: '同じタイプのバブルをクリア',
        timeBubble: 'タイムバブル',
        add5Seconds: '5秒追加',
        accuracySystem: '精度システム',
        above: '以上',
        triggerPowerMode: 'パワーモード発動',
        goodAccuracy: '良好な精度',
        below: '以下',
        needImproveAccuracy: '精度向上が必要',
        powerMode: 'パワーモード',
        autoTrigger: '自動発動',
        powerModeEasier: 'パワーモードでバブルがポップしやすい',
        last10Seconds: '10秒間続いて自動終了',
        comboSystem: 'コンボシステム',
        continuousPopExtraScore: '連続ポップでボーナススコア',
        timeLimit: '時間制限',
        sixtySecondsHighestScore: '60秒で最高スコアを獲得',
        gameGoal: 'ゲーム目標',
        precisePopEmotionBubbles: '感情バブルを精密にポップして、内なる圧力を解放',
        accuracyChallenge: '精度チャレンジ',
        onlyClickCenterToPop: 'バブルの中心をクリックするだけでポップできる',
        fastBubblesNeedHigherAccuracy: '高速バブルはより高い精度が必要'
      },
      'ko': {
        title: '버블 팝',
        start: '게임 시작',
        restart: '다시 시작',
        score: '점수',
        time: '시간',
        combo: '콤보',
        accuracy: '정확도',
        highScore: '최고 점수',
        rules: '게임 규칙',
        close: '닫기',
        hideRules: '규칙 숨기기',
        gameplay: '게임 플레이',
        clickStartButton: '「게임 시작」버튼 클릭',
        preciseBubblePop: '정밀 버블 팝',
        computer: '컴퓨터',
        preciseClickCenter: '버블 중심을 정밀하게 클릭하여 팝',
        mobile: '모바일',
        preciseTouchCenter: '버블 중심을 정밀하게 터치하여 팝',
        highAccuracyRequired: '높은 정확도 필요, 버블 가장자리 클릭은 무효',
        fastBubbles: '빠른 버블',
        harderToPop: '팝하기 어려움, 더 높은 정확도 필요',
        slowBubbles: '느린 버블',
        easierToPop: '상대적으로 팝하기 쉬움',
        emotionBubbleScore: '감정 버블 점수',
        angryBubble: '분노 버블',
        anxiousBubble: '불안 버블',
        depressedBubble: '우울 버블',
        stressedBubble: '스트레스 버블',
        irritatedBubble: '짜증 버블',
        frustratedBubble: '좌절 버블',
        points: '점',
        specialBubbles: '특수 버블',
        bombBubble: '폭탄 버블',
        clearAllNearby: '주변 모든 버블 제거',
        goldenBubble: '골든 버블',
        doubleScore: '더블 점수',
        ghostBubble: '고스트 버블',
        clickTwice: '두 번 클릭 필요',
        chainBubble: '체인 버블',
        clearSameType: '같은 타입 버블 제거',
        timeBubble: '타임 버블',
        add5Seconds: '5초 추가',
        accuracySystem: '정확도 시스템',
        above: '이상',
        triggerPowerMode: '파워 모드 발동',
        goodAccuracy: '좋은 정확도',
        below: '이하',
        needImproveAccuracy: '정확도 향상 필요',
        powerMode: '파워 모드',
        autoTrigger: '자동 발동',
        powerModeEasier: '파워 모드에서 버블이 팝하기 쉬움',
        last10Seconds: '10초간 지속 후 자동 종료',
        comboSystem: '콤보 시스템',
        continuousPopExtraScore: '연속 팝으로 보너스 점수',
        timeLimit: '시간 제한',
        sixtySecondsHighestScore: '60초 내 최고 점수 획득',
        gameGoal: '게임 목표',
        precisePopEmotionBubbles: '감정 버블을 정밀하게 팝하여 내면의 압력을 해방',
        accuracyChallenge: '정확도 챌린지',
        onlyClickCenterToPop: '버블의 중심을 클릭해야만 팝할 수 있다',
        fastBubblesNeedHigherAccuracy: '빠른 버블은 더 높은 정확도가 필요하다'
      },
      'vi': {
        title: 'Bong Bóng Nổ',
        start: 'Bắt Đầu Trò Chơi',
        restart: 'Chơi Lại',
        score: 'Điểm',
        time: 'Thời Gian',
        combo: 'Combo',
        accuracy: 'Độ Chính Xác',
        highScore: 'Điểm Cao Nhất',
        rules: 'Luật Chơi',
        close: 'Đóng',
        hideRules: 'Ẩn Luật',
        gameplay: 'Cách Chơi',
        clickStartButton: 'Nhấp vào nút "Bắt Đầu Trò Chơi"',
        preciseBubblePop: 'Bong Bóng Nổ Chính Xác',
        computer: 'Máy tính',
        preciseClickCenter: 'Nhấp chính xác vào trung tâm bong bóng để nổ',
        mobile: 'Điện thoại',
        preciseTouchCenter: 'Chạm chính xác vào trung tâm bong bóng để nổ',
        highAccuracyRequired: 'Cần độ chính xác cao, nhấp vào cạnh bong bóng không hiệu quả',
        fastBubbles: 'Bong bóng nhanh',
        harderToPop: 'Khó nổ hơn, cần độ chính xác cao hơn',
        slowBubbles: 'Bong bóng chậm',
        easierToPop: 'Tương đối dễ nổ',
        emotionBubbleScore: 'Điểm Bong Bóng Cảm Xúc',
        angryBubble: 'Bong bóng giận dữ',
        anxiousBubble: 'Bong bóng lo lắng',
        depressedBubble: 'Bong bóng trầm cảm',
        stressedBubble: 'Bong bóng căng thẳng',
        irritatedBubble: 'Bong bóng khó chịu',
        frustratedBubble: 'Bong bóng thất vọng',
        points: 'điểm',
        specialBubbles: 'Bong Bóng Đặc Biệt',
        bombBubble: 'Bong bóng bom',
        clearAllNearby: 'Xóa tất cả bong bóng gần đó',
        goldenBubble: 'Bong bóng vàng',
        doubleScore: 'Điểm gấp đôi',
        ghostBubble: 'Bong bóng ma',
        clickTwice: 'Cần nhấp hai lần',
        chainBubble: 'Bong bóng chuỗi',
        clearSameType: 'Xóa bong bóng cùng loại',
        timeBubble: 'Bong bóng thời gian',
        add5Seconds: 'Thêm 5 giây',
        accuracySystem: 'Hệ Thống Chính Xác',
        above: 'trên',
        triggerPowerMode: 'Kích hoạt chế độ năng lượng',
        goodAccuracy: 'Độ chính xác tốt',
        below: 'dưới',
        needImproveAccuracy: 'Cần cải thiện độ chính xác',
        powerMode: 'Chế Độ Năng Lượng',
        autoTrigger: 'Tự động kích hoạt',
        powerModeEasier: 'Dễ nổ bong bóng hơn trong chế độ năng lượng',
        last10Seconds: 'Kéo dài 10 giây rồi tự động kết thúc',
        comboSystem: 'Hệ Thống Combo',
        continuousPopExtraScore: 'Nổ liên tục để có điểm thêm',
        timeLimit: 'Giới Hạn Thời Gian',
        sixtySecondsHighestScore: '60 giây để đạt điểm cao nhất',
        gameGoal: 'Mục Tiêu Trò Chơi',
        precisePopEmotionBubbles: 'Nổ chính xác bong bóng cảm xúc, giải phóng áp lực bên trong',
        accuracyChallenge: 'Thử Thách Độ Chính Xác',
        onlyClickCenterToPop: 'Chỉ bằng cách nhấp vào trung tâm bong bóng mới có thể nổ',
        fastBubblesNeedHigherAccuracy: 'Bong bóng nhanh cần độ chính xác cao hơn'
      },
      'th': {
        title: 'ป๊อปบับเบิล',
        start: 'เริ่มเกม',
        restart: 'เริ่มใหม่',
        score: 'คะแนน',
        time: 'เวลา',
        combo: 'คอมโบ',
        accuracy: 'ความแม่นยำ',
        highScore: 'คะแนนสูงสุด',
        rules: 'กฎเกม',
        close: 'ปิด',
        hideRules: 'ซ่อนกฎ',
        gameplay: 'วิธีเล่น',
        clickStartButton: 'คลิกปุ่ม "เริ่มเกม"',
        preciseBubblePop: 'ป๊อปบับเบิลอย่างแม่นยำ',
        computer: 'คอมพิวเตอร์',
        preciseClickCenter: 'คลิกตรงกลางบับเบิลอย่างแม่นยำเพื่อป๊อป',
        mobile: 'มือถือ',
        preciseTouchCenter: 'แตะตรงกลางบับเบิลอย่างแม่นยำเพื่อป๊อป',
        highAccuracyRequired: 'ต้องการความแม่นยำสูง การคลิกขอบบับเบิลไม่นับ',
        fastBubbles: 'บับเบิลเร็ว',
        harderToPop: 'ป๊อปยากขึ้น ต้องการความแม่นยำสูงขึ้น',
        slowBubbles: 'บับเบิลช้า',
        easierToPop: 'ค่อนข้างป๊อปง่าย',
        emotionBubbleScore: 'คะแนนบับเบิลอารมณ์',
        angryBubble: 'บับเบิลโกรธ',
        anxiousBubble: 'บับเบิลกังวล',
        depressedBubble: 'บับเบิลเศร้า',
        stressedBubble: 'บับเบิลเครียด',
        irritatedBubble: 'บับเบิลหงุดหงิด',
        frustratedBubble: 'บับเบิลหงุดหงิด',
        points: 'คะแนน',
        specialBubbles: 'บับเบิลพิเศษ',
        bombBubble: 'บับเบิลระเบิด',
        clearAllNearby: 'ลบบับเบิลใกล้เคียงทั้งหมด',
        goldenBubble: 'บับเบิลทอง',
        doubleScore: 'คะแนนสองเท่า',
        ghostBubble: 'บับเบิลผี',
        clickTwice: 'ต้องคลิกสองครั้ง',
        chainBubble: 'บับเบิลโซ่',
        clearSameType: 'ลบบับเบิลประเภทเดียวกัน',
        timeBubble: 'บับเบิลเวลา',
        add5Seconds: 'เพิ่ม 5 วินาที',
        accuracySystem: 'ระบบความแม่นยำ',
        above: 'ขึ้นไป',
        triggerPowerMode: 'เปิดโหมดพลัง',
        goodAccuracy: 'ความแม่นยำดี',
        below: 'ลงมา',
        needImproveAccuracy: 'ต้องปรับปรุงความแม่นยำ',
        powerMode: 'โหมดพลัง',
        autoTrigger: 'เปิดอัตโนมัติ',
        powerModeEasier: 'ป๊อปบับเบิลง่ายขึ้นในโหมดพลัง',
        last10Seconds: 'คงอยู่ 10 วินาทีแล้วปิดอัตโนมัติ',
        comboSystem: 'ระบบคอมโบ',
        continuousPopExtraScore: 'ป๊อปต่อเนื่องเพื่อคะแนนเพิ่ม',
        timeLimit: 'จำกัดเวลา',
        sixtySecondsHighestScore: '60 วินาทีเพื่อคะแนนสูงสุด',
        gameGoal: 'เป้าหมายเกม',
        precisePopEmotionBubbles: 'ป๊อปบับเบิลอารมณ์อย่างแม่นยำ ปลดปล่อยแรงกดดันภายใน',
        accuracyChallenge: 'ความท้าทายความแม่นยำ',
        onlyClickCenterToPop: 'เฉพาะการคลิกตรงกลางบับเบิลเท่านั้นที่สามารถป๊อปได้',
        fastBubblesNeedHigherAccuracy: 'บับเบิลเร็วต้องการความแม่นยำสูงขึ้น'
      },
      'la': {
        title: 'Bulla Explodere',
        start: 'Ludum Incipere',
        restart: 'Iterum Incipere',
        score: 'Puncta',
        time: 'Tempus',
        combo: 'Combo',
        accuracy: 'Accuratio',
        highScore: 'Puncta Maxima',
        rules: 'Regulae Ludi',
        close: 'Claudere',
        hideRules: 'Regulae Occultare',
        gameplay: 'Ludus',
        clickStartButton: 'Clicca "Ludum Incipere" pugnum',
        preciseBubblePop: 'Bulla Accurata Explodere',
        computer: 'Computatrum',
        preciseClickCenter: 'Clicca accurate centrum bullae ut explodat',
        mobile: 'Mobile',
        preciseTouchCenter: 'Tange accurate centrum bullae ut explodat',
        highAccuracyRequired: 'Accuratio alta requiritur, cliccare marginem bullae invalidum est',
        fastBubbles: 'Bullae veloces',
        harderToPop: 'Difficilius explodere, accuratio altior requiritur',
        slowBubbles: 'Bullae tardae',
        easierToPop: 'Relativiter facilius explodere',
        emotionBubbleScore: 'Puncta Bullae Emotionis',
        angryBubble: 'Bulla irata',
        anxiousBubble: 'Bulla anxia',
        depressedBubble: 'Bulla depressa',
        stressedBubble: 'Bulla pressa',
        irritatedBubble: 'Bulla irritata',
        frustratedBubble: 'Bulla frustrata',
        points: 'puncta',
        specialBubbles: 'Bullae Speciales',
        bombBubble: 'Bulla bomba',
        clearAllNearby: 'Clara omnes bullas proximas',
        goldenBubble: 'Bulla aurea',
        doubleScore: 'Puncta dupla',
        ghostBubble: 'Bulla phantasma',
        clickTwice: 'Opus est bis cliccare',
        chainBubble: 'Bulla catena',
        clearSameType: 'Clara bullas eiusdem generis',
        timeBubble: 'Bulla temporis',
        add5Seconds: 'Adde 5 secundis',
        accuracySystem: 'Systema Accurationis',
        above: 'supra',
        triggerPowerMode: 'Activa modum potentiae',
        goodAccuracy: 'Accuratio bona',
        below: 'infra',
        needImproveAccuracy: 'Opus est accuratio meliorare',
        powerMode: 'Modus Potentiae',
        autoTrigger: 'Auto activa',
        powerModeEasier: 'Facilius explodere bullas in modo potentiae',
        last10Seconds: 'Dura 10 secundis deinde auto finis',
        comboSystem: 'Systema Combo',
        continuousPopExtraScore: 'Explodere continuum pro punctis extra',
        timeLimit: 'Finis Temporis',
        sixtySecondsHighestScore: '60 secundis pro punctis maximis',
        gameGoal: 'Finis Ludi',
        precisePopEmotionBubbles: 'Explodere accurate bullas emotionis, libera pressionem internam',
        accuracyChallenge: 'Provocatio Accurationis',
        onlyClickCenterToPop: 'Solum cliccare centrum bullae potest explodere',
        fastBubblesNeedHigherAccuracy: 'Bullae veloces accuratio altior requiritur'
      },
      'ms': {
        title: 'Letup Buih',
        start: 'Mulakan Permainan',
        restart: 'Mulakan Semula',
        score: 'Markah',
        time: 'Masa',
        combo: 'Combo',
        accuracy: 'Ketepatan',
        highScore: 'Markah Tertinggi',
        rules: 'Peraturan Permainan',
        close: 'Tutup',
        hideRules: 'Sembunyikan Peraturan',
        gameplay: 'Cara Bermain',
        clickStartButton: 'Klik butang "Mulakan Permainan"',
        preciseBubblePop: 'Letup Buih Tepat',
        computer: 'Komputer',
        preciseClickCenter: 'Klik tepat di tengah buih untuk meletup',
        mobile: 'Mudah alih',
        preciseTouchCenter: 'Sentuh tepat di tengah buih untuk meletup',
        highAccuracyRequired: 'Ketepatan tinggi diperlukan, mengklik tepi buih tidak sah',
        fastBubbles: 'Buih pantas',
        harderToPop: 'Lebih sukar untuk meletup, memerlukan ketepatan lebih tinggi',
        slowBubbles: 'Buih perlahan',
        easierToPop: 'Relatif lebih mudah untuk meletup',
        emotionBubbleScore: 'Markah Buih Emosi',
        angryBubble: 'Buih marah',
        anxiousBubble: 'Buih cemas',
        depressedBubble: 'Buih tertekan',
        stressedBubble: 'Buih tertekan',
        irritatedBubble: 'Buih jengkel',
        frustratedBubble: 'Buih kecewa',
        points: 'markah',
        specialBubbles: 'Buih Khas',
        bombBubble: 'Buih bom',
        clearAllNearby: 'Kosongkan semua buih berdekatan',
        goldenBubble: 'Buih emas',
        doubleScore: 'Markah berganda',
        ghostBubble: 'Buih hantu',
        clickTwice: 'Perlu klik dua kali',
        chainBubble: 'Buih rantai',
        clearSameType: 'Kosongkan buih jenis sama',
        timeBubble: 'Buih masa',
        add5Seconds: 'Tambah 5 saat',
        accuracySystem: 'Sistem Ketepatan',
        above: 'ke atas',
        triggerPowerMode: 'Pencetus mod kuasa',
        goodAccuracy: 'Ketepatan baik',
        below: 'ke bawah',
        needImproveAccuracy: 'Perlu tingkatkan ketepatan',
        powerMode: 'Mod Kuasa',
        autoTrigger: 'Pencetus automatik',
        powerModeEasier: 'Lebih mudah meletup buih dalam mod kuasa',
        last10Seconds: 'Bertahan 10 saat kemudian tamat automatik',
        comboSystem: 'Sistem Combo',
        continuousPopExtraScore: 'Letup berterusan untuk markah tambahan',
        timeLimit: 'Had Masa',
        sixtySecondsHighestScore: '60 saat untuk markah tertinggi',
        gameGoal: 'Matlamat Permainan',
        precisePopEmotionBubbles: 'Letup tepat buih emosi, lepaskan tekanan dalaman',
        accuracyChallenge: 'Cabaran Ketepatan',
        onlyClickCenterToPop: 'Hanya dengan mengklik pusat buih boleh meletup',
        fastBubblesNeedHigherAccuracy: 'Buih pantas memerlukan ketepatan lebih tinggi'
      }
    };
    return translations[lang]?.[key] || translations['zh-TW'][key] || key;
  };
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [comboTimer, setComboTimer] = useState(0);
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [successfulClicks, setSuccessfulClicks] = useState(0);
  const [powerMode, setPowerMode] = useState(false);
  const [powerModeTimer, setPowerModeTimer] = useState(0);
  

  
  const [bubbles, setBubbles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    emotion: string;
    points: number;
    speed: number;
    opacity: number;
    type: 'normal' | 'bomb' | 'golden' | 'ghost' | 'chain' | 'time';
    health?: number;
    chainId?: number;
    timeBonus?: number;
  }>>([]);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
  }>>([]);

  // 載入最高分
  useEffect(() => {
    const saved = localStorage.getItem('bubblePopHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  // 情緒泡泡配置
  const emotionBubbles = [
    { color: '#ff6b6b', emotion: '😠', points: 10, name: '憤怒' },
    { color: '#4ecdc4', emotion: '😰', points: 15, name: '焦慮' },
    { color: '#ffe66d', emotion: '😔', points: 20, name: '憂鬱' },
    { color: '#a8e6cf', emotion: '😤', points: 25, name: '壓力' },
    { color: '#ff8a80', emotion: '😡', points: 30, name: '暴躁' },
    { color: '#9575cd', emotion: '😞', points: 35, name: '沮喪' }
  ];

  // 幽默訊息
  const getHumorousMessage = () => {
    const messages = [
      "戳破煩惱，釋放心情！",
      "泡泡爆破，壓力全消！",
      "情緒泡泡，一戳就爆！",
      "連擊模式，心情舒暢！",
      "泡泡療法，治癒心靈！"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const [humorousMessage] = useState(getHumorousMessage());

  // 開始遊戲
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setBubbles([]);
    setParticles([]);
    setAccuracy(0);
    setTotalClicks(0);
    setSuccessfulClicks(0);
    setPowerMode(false);
    setPowerModeTimer(0);
  };

  // 生成泡泡
  const spawnBubble = () => {
    if (!isPlaying) return;

    const randomBubble = emotionBubbles[Math.floor(Math.random() * emotionBubbles.length)];
    const x = Math.random() * 80 + 10; // 10-90%
    const y = Math.random() * 80 + 10; // 10-90%
    
    // 生成不同大小的泡泡，從最小到最大
    const sizeChance = Math.random();
    let size;
    if (sizeChance < 0.3) {
      size = Math.random() * 10 + 15; // 小泡泡 15-25px (30%)
    } else if (sizeChance < 0.6) {
      size = Math.random() * 15 + 25; // 中泡泡 25-40px (30%)
    } else if (sizeChance < 0.85) {
      size = Math.random() * 20 + 40; // 大泡泡 40-60px (25%)
    } else {
      size = Math.random() * 25 + 60; // 超大泡泡 60-85px (15%)
    }
    
    // 隨機生成特殊泡泡
    const specialChance = Math.random();
    let bubbleType: 'normal' | 'bomb' | 'golden' | 'ghost' | 'chain' | 'time' = 'normal';
    let points = randomBubble.points;
    let color = randomBubble.color;
    let emotion = randomBubble.emotion;
    
    if (specialChance < 0.05) { // 5% 機率生成炸彈泡泡
      bubbleType = 'bomb';
      points = 50;
      color = '#ff4757';
      emotion = '💣';
      size = Math.random() * 15 + 45; // 炸彈泡泡偏大 45-60px
    } else if (specialChance < 0.1) { // 5% 機率生成金色泡泡
      bubbleType = 'golden';
      points = 100;
      color = '#ffa502';
      emotion = '⭐';
      size = Math.random() * 20 + 50; // 金色泡泡最大 50-70px
    } else if (specialChance < 0.15) { // 5% 機率生成幽靈泡泡
      bubbleType = 'ghost';
      points = 30;
      color = '#a4b0be';
      emotion = '👻';
      size = Math.random() * 10 + 20; // 幽靈泡泡偏小 20-30px
      return {
        id: Date.now(),
        x,
        y,
        size,
        color,
        emotion,
        points,
        speed: Math.random() * 3 + 2.0, // 幽靈泡泡速度更快 2.0-5.0
        opacity: 0.8 + Math.random() * 0.2,
        type: bubbleType,
        health: 2 // 幽靈泡泡需要點擊兩次
      };
    } else if (specialChance < 0.2) { // 5% 機率生成連鎖泡泡
      bubbleType = 'chain';
      points = 40;
      color = '#2ed573';
      emotion = '🔗';
      size = Math.random() * 15 + 35; // 連鎖泡泡中等 35-50px
    } else if (specialChance < 0.25) { // 5% 機率生成時間泡泡
      bubbleType = 'time';
      points = 25;
      color = '#3742fa';
      emotion = '⏰';
      size = Math.random() * 12 + 25; // 時間泡泡偏小 25-37px
    }
    
    const bubble = {
      id: Date.now(),
      x,
      y,
      size,
      color,
      emotion,
      points,
      speed: Math.random() * 3 + 1.5, // 提高速度範圍 1.5-4.5，讓泡泡移動更快
      opacity: 0.8 + Math.random() * 0.2,
      type: bubbleType,
      chainId: bubbleType === 'chain' ? Math.floor(Math.random() * 1000) : undefined,
      timeBonus: bubbleType === 'time' ? 5 : undefined
    };

    setBubbles(prev => [...prev, bubble]);
  };

  // 戳破泡泡
  const popBubble = (bubbleId: number) => {
    const bubble = bubbles.find(b => b.id === bubbleId);
    if (!bubble) return;

    // 增加分數和連擊
    const comboBonus = Math.floor(combo / 5) * 5;
    let totalPoints = bubble.points + comboBonus;
    
    // 特殊泡泡效果
    if (bubble.type === 'bomb') {
      // 炸彈泡泡：清除周圍所有泡泡
      const nearbyBubbles = bubbles.filter(b => 
        b.id !== bubbleId && 
        Math.sqrt((b.x - bubble.x) ** 2 + (b.y - bubble.y) ** 2) < 15
      );
      nearbyBubbles.forEach(b => {
        totalPoints += b.points;
        setCombo(prev => prev + 1);
      });
      setBubbles(prev => prev.filter(b => 
        b.id !== bubbleId && 
        !nearbyBubbles.find(nb => nb.id === b.id)
      ));
    } else if (bubble.type === 'golden') {
      // 金色泡泡：雙倍分數
      totalPoints *= 2;
      setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    } else if (bubble.type === 'ghost') {
      // 幽靈泡泡：需要點擊兩次
      if (bubble.health && bubble.health > 1) {
        setBubbles(prev => prev.map(b => 
          b.id === bubbleId ? { ...b, health: b.health! - 1 } : b
        ));
        return; // 不增加分數，等待第二次點擊
      }
      setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    } else if (bubble.type === 'chain') {
      // 連鎖泡泡：清除同類型泡泡
      const chainBubbles = bubbles.filter(b => 
        b.id !== bubbleId && b.chainId === bubble.chainId
      );
      chainBubbles.forEach(b => {
        totalPoints += b.points;
        setCombo(prev => prev + 1);
      });
      setBubbles(prev => prev.filter(b => 
        b.id !== bubbleId && 
        !chainBubbles.find(cb => cb.id === b.id)
      ));
    } else if (bubble.type === 'time') {
      // 時間泡泡：增加時間
      setTimeLeft(prev => prev + (bubble.timeBonus || 5));
      setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    } else {
      // 普通泡泡
      setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    }

    setScore(prev => prev + totalPoints);
    setCombo(prev => prev + 1);
    setComboTimer(3); // 重置連擊計時器
    if (combo >= 4) {
      setShowComboEffect(true);
      playComboSound();
      setTimeout(() => setShowComboEffect(false), 1000);
    }

    // 創建粒子效果
    const particleCount = bubble.type === 'bomb' ? 15 : 8;
    const newParticles: Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
    }> = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      newParticles.push({
        id: Date.now() + i,
        x: bubble.x,
        y: bubble.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: bubble.color,
        life: 1.0
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // 遊戲結束
  const endGame = () => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('bubblePopHighScore', score.toString());
    }
  };

  // 遊戲循環
  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      // 生成泡泡 - 大幅增加生成頻率，讓泡泡更密集
      const baseSpawnRate = 0.03 + (60 - timeLeft) * 0.001; // 基礎生成率
      const increasedSpawnRate = Math.min(0.15, baseSpawnRate * 1.8); // 增加80%的生成率
      if (Math.random() < increasedSpawnRate) {
        spawnBubble();
      }

      // 更新泡泡位置 - 加快移動速度，讓泡泡移動更快
      setBubbles(prev => prev.map(bubble => ({
        ...bubble,
        y: bubble.y - bubble.speed * 1.2, // 加快移動速度，讓泡泡移動更快
        opacity: bubble.opacity - 0.003, // 增加透明度衰減，讓泡泡消失更快
        x: bubble.x + (Math.random() - 0.5) * 0.4 // 增加左右搖擺幅度
      })).filter(bubble => 
        bubble.y > -10 && bubble.opacity > 0.1
      ));

      // 更新粒子效果
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.1, // 重力
        life: particle.life - 0.02
      })).filter(particle => particle.life > 0));

      // 更新連擊計時器
      if (comboTimer > 0) {
        setComboTimer(prev => prev - 0.05);
      } else if (combo > 0) {
        setCombo(0);
      }
      
      // 更新能量模式計時器
      if (powerModeTimer > 0) {
        setPowerModeTimer(prev => prev - 0.05);
      } else if (powerMode) {
        setPowerMode(false);
      }
    }, 30); // 進一步提高更新頻率，讓泡泡生成更頻繁

    return () => clearInterval(gameInterval);
  }, [isPlaying]);

  // 時間倒數計時器
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // 每秒倒數一次

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // 滑鼠和觸摸事件處理
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isPlaying) return;
      
      // 阻止默認行為，防止跳轉到其他頁面
      e.preventDefault();
      e.stopPropagation();
      
      const rect = document.body.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 100;
      const clickY = ((e.clientY - rect.top) / rect.height) * 100;
      
      // 極度寬鬆的點擊檢測：只要點擊在泡泡附近就算成功
      const clickedBubble = bubbles.find(bubble => {
        // 使用固定的寬鬆範圍，不依賴泡泡大小
        const clickRange = 8; // 8% 的點擊範圍
        
        // 檢查點擊位置是否在泡泡範圍內
        const inXRange = Math.abs(clickX - bubble.x) < clickRange;
        const inYRange = Math.abs(clickY - bubble.y) < clickRange;
        
        console.log('點擊檢測:', {
          clickX, clickY,
          bubbleX: bubble.x, bubbleY: bubble.y,
          clickRange,
          inXRange, inYRange,
          bubbleId: bubble.id
        });
        
        return inXRange && inYRange;
      });
      
      setTotalClicks(prev => prev + 1);
      
      if (clickedBubble) {
        console.log('成功點擊泡泡:', clickedBubble.id, '距離:', Math.sqrt(Math.pow(clickX - clickedBubble.x, 2) + Math.pow(clickY - clickedBubble.y, 2)));
        setSuccessfulClicks(prev => prev + 1);
        popBubble(clickedBubble.id);
        
        // 檢查是否觸發能量模式
        if (accuracy >= 80 && !powerMode) {
          setPowerMode(true);
          setPowerModeTimer(10);
        }
      }
      
      // 更新精準度
      setAccuracy(totalClicks > 0 ? (successfulClicks / totalClicks) * 100 : 0);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isPlaying) return;
      e.preventDefault();
      e.stopPropagation();
      
      const touch = e.touches[0];
      const rect = document.body.getBoundingClientRect();
      const touchX = ((touch.clientX - rect.left) / rect.width) * 100;
      const touchY = ((touch.clientY - rect.top) / rect.height) * 100;
      
      console.log('觸摸位置:', touchX, touchY);
      
      // 極度寬鬆的觸摸檢測：手機版更寬鬆的點擊範圍
      const touchedBubble = bubbles.find(bubble => {
        // 手機版使用更寬鬆的固定範圍
        const touchRange = 12; // 12% 的觸摸範圍
        
        // 檢查觸摸位置是否在泡泡範圍內
        const inXRange = Math.abs(touchX - bubble.x) < touchRange;
        const inYRange = Math.abs(touchY - bubble.y) < touchRange;
        
        console.log('觸摸檢測:', {
          touchX, touchY,
          bubbleX: bubble.x, bubbleY: bubble.y,
          touchRange,
          inXRange, inYRange,
          bubbleId: bubble.id
        });
        
        return inXRange && inYRange;
      });
      
      setTotalClicks(prev => prev + 1);
      
      if (touchedBubble) {
        console.log('成功觸摸泡泡:', touchedBubble.id, '距離:', Math.sqrt(Math.pow(touchX - touchedBubble.x, 2) + Math.pow(touchY - touchedBubble.y, 2)));
        setSuccessfulClicks(prev => prev + 1);
        popBubble(touchedBubble.id);
        
        // 檢查是否觸發能量模式
        if (accuracy >= 80 && !powerMode) {
          setPowerMode(true);
          setPowerModeTimer(10);
        }
      } else {
        console.log('未觸摸到泡泡');
      }
      
      // 更新精準度
      setAccuracy(totalClicks > 0 ? (successfulClicks / totalClicks) * 100 : 0);
    };

    // 移除全局點擊事件，因為每個泡泡都有自己的點擊處理器
    // if (isPlaying) {
    //   document.addEventListener('click', handleClick);
    // }

    // return () => {
    //   document.removeEventListener('click', handleClick);
    // };
  }, [isPlaying, bubbles]);

  // 音效系統
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 初始化音效系統
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const context = new AudioContext();
      setAudioContext(context);
    }
  }, []);

  // 播放爆破音效
  const playPopSound = () => {
    if (!audioContext || !soundEnabled) return;
    
    try {
      // 創建振盪器
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // 連接音效節點
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // 設置音效參數
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      
      // 設置音量
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      // 播放音效
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
    } catch (error) {
      console.log('音效播放失敗:', error);
    }
  };

  // 播放連擊音效
  const playComboSound = () => {
    if (!audioContext || !soundEnabled) return;
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      
    } catch (error) {
      console.log('連擊音效播放失敗:', error);
    }
  };

  // 播放能量模式音效
  const playPowerModeSound = () => {
    if (!audioContext || !soundEnabled) return;
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
    } catch (error) {
      console.log('能量模式音效播放失敗:', error);
    }
  };

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'auto',
        cursor: isPlaying ? 'pointer' : 'default',
        touchAction: 'pan-y',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
      onClick={(e) => {
        // 防止任何點擊事件冒泡到其他元素
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-10px); }
          }
          @keyframes comboEffect {
            0% { 
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 0;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 1;
            }
            100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 0;
            }
          }
          @keyframes powerMode {
            0% { 
              opacity: 0.7;
              textShadow: 0 0 5px #FF5722;
            }
            100% { 
              opacity: 1;
              textShadow: 0 0 15px #FF5722, 0 0 25px #FF5722;
            }
          }
          @keyframes popEffect {
            0% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.3);
              opacity: 0.8;
            }
            100% { 
              transform: translate(-50%, -50%) scale(0);
              opacity: 0;
            }
          }
        `}
      </style>
      
      {/* 返回按鈕 */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'clamp(20px, 4vw, 40px)',
          left: 'clamp(20px, 4vw, 40px)',
          background: '#fff',
          border: '2px solid #9C27B0',
          borderRadius: '50%',
          width: 'clamp(40px, 8vw, 50px)',
          height: 'clamp(40px, 8vw, 50px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        ←
      </button>
      {/* 遊戲信息 */}
      <div style={{ 
        position: 'absolute',
        top: 'clamp(20px, 4vw, 40px)',
        left: 'clamp(80px, 16vw, 100px)',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '15px',
        padding: 'clamp(12px, 2.5vw, 16px)',
        zIndex: 5,
        maxWidth: '180px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', margin: 0, lineHeight: '1.2' }}>🫧 {getText('title')}</h3>
          <button 
            onClick={() => setShowRules(!showRules)}
            style={{
              background: '#9C27B0',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)',
              cursor: 'pointer'
            }}
          >
            {showRules ? getText('hideRules') : getText('rules')}
          </button>
        </div>

        {!showRules && (
          <>
            <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 8px)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)' }}>{getText('score')}：{score}</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)' }}>{getText('time')}：{timeLeft}秒</div>
              <div style={{ 
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)', 
                color: combo >= 5 ? '#ff6b6b' : combo >= 3 ? '#ffa502' : '#333',
                fontWeight: combo >= 3 ? 'bold' : 'normal'
              }}>
                {getText('combo')}：{combo}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 8px)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
              <div style={{ 
                fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                color: accuracy >= 80 ? '#4CAF50' : accuracy >= 60 ? '#FF9800' : '#F44336'
              }}>
                {getText('accuracy')}：{accuracy.toFixed(1)}%
              </div>
              {powerMode && (
                <div style={{ 
                  fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
                  color: '#FF5722',
                  fontWeight: 'bold',
                  animation: 'powerMode 0.5s ease-in-out infinite alternate'
                }}>
                  ⚡能量模式
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: 'clamp(4px, 1vw, 8px)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>泡泡：{bubbles.length}</div>
              <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>{getText('highScore')}：{highScore}</div>
              <div style={{ 
                fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                color: bubbles.some(b => b.speed >= 3) ? '#ff6b6b' : bubbles.some(b => b.speed >= 2) ? '#ffa502' : '#4CAF50'
              }}>
                {bubbles.some(b => b.speed >= 3) ? '🚀 快速' : bubbles.some(b => b.speed >= 2) ? '⚡ 中速' : '🐌 慢速'}
              </div>
            </div>
            
            {/* 音效開關 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: 'clamp(4px, 1vw, 8px)',
              gap: 'clamp(4px, 1vw, 8px)'
            }}>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                style={{
                  background: soundEnabled ? '#4CAF50' : '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: 'clamp(2px, 0.5vw, 4px) clamp(6px, 1.5vw, 8px)',
                  fontSize: 'clamp(0.5rem, 1.2vw, 0.6rem)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                {soundEnabled ? '🔊' : '🔇'} {soundEnabled ? getText('soundOn') : getText('soundOff')}
              </button>
            </div>
            
            <div style={{ 
              fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)', 
              color: '#9C27B0', 
              fontWeight: 'bold',
              marginTop: '6px',
              textAlign: 'center'
            }}>
              {humorousMessage}
            </div>

            {!isPlaying && (
              <button 
                onClick={startGame}
                style={{
                  background: '#9C27B0',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: 'clamp(5px, 1.2vw, 6px) clamp(12px, 2.5vw, 18px)',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                  fontWeight: 'bold',
                  marginTop: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {getText('start')}
              </button>
            )}


          </>
        )}

        {showRules && (
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
            lineHeight: '1.4'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#9C27B0' }}>{getText('gameplay')}：</h4>
            <ul style={{ margin: '0', paddingLeft: '15px' }}>
              <li><strong>{getText('start')}</strong>：{getText('clickStartButton')}</li>
              <li><strong>{getText('preciseBubblePop')}</strong>：
                <br/>{getText('computer')}：{getText('preciseClickCenter')}
                <br/>{getText('mobile')}：{getText('preciseTouchCenter')}
                <br/>⚠️ {getText('highAccuracyRequired')}
                <br/>🚀 {getText('fastBubbles')}：{getText('harderToPop')}
                <br/>🐌 {getText('slowBubbles')}：{getText('easierToPop')}
              </li>
              <li><strong>{getText('emotionBubbleScore')}</strong>：
                <br/>😠 {getText('angryBubble')}：10{getText('points')}
                <br/>😰 {getText('anxiousBubble')}：15{getText('points')}
                <br/>😔 {getText('depressedBubble')}：20{getText('points')}
                <br/>😤 {getText('stressedBubble')}：25{getText('points')}
                <br/>😡 {getText('irritatedBubble')}：30{getText('points')}
                <br/>😞 {getText('frustratedBubble')}：35{getText('points')}
              </li>
              <li><strong>{getText('specialBubbles')}</strong>：
                <br/>💣 {getText('bombBubble')}：50{getText('points')}，{getText('clearAllNearby')}
                <br/>⭐ {getText('goldenBubble')}：100{getText('points')}，{getText('doubleScore')}
                <br/>👻 {getText('ghostBubble')}：30{getText('points')}，{getText('clickTwice')}
                <br/>🔗 {getText('chainBubble')}：40{getText('points')}，{getText('clearSameType')}
                <br/>⏰ {getText('timeBubble')}：25{getText('points')}，{getText('add5Seconds')}
              </li>
              <li><strong>{getText('accuracySystem')}</strong>：
                <br/>🟢 80%{getText('above')}：{getText('triggerPowerMode')}
                <br/>🟡 60-79%：{getText('goodAccuracy')}
                <br/>🔴 60%{getText('below')}：{getText('needImproveAccuracy')}
              </li>
              <li><strong>{getText('powerMode')}</strong>：
                <br/>⚡ 80%{getText('above')}{getText('autoTrigger')}
                <br/>🎯 {getText('powerModeEasier')}
                <br/>⏱️ {getText('last10Seconds')}
              </li>
              <li><strong>{getText('comboSystem')}</strong>：{getText('continuousPopExtraScore')}</li>
              <li><strong>{getText('timeLimit')}</strong>：{getText('60SecondsHighestScore')}</li>
              <li><strong>{getText('gameGoal')}</strong>：{getText('precisePopEmotionBubbles')}！</li>
            </ul>
          </div>
        )}
      </div>

      {/* 泡泡 */}
      {bubbles.map(bubble => {
        const specialStyle = bubble.type === 'bomb' ? {
          animation: 'float 2s ease-in-out infinite',
          boxShadow: '0 0 20px #ff4757'
        } : bubble.type === 'golden' ? {
          animation: 'float 1.5s ease-in-out infinite',
          boxShadow: '0 0 25px #ffa502'
        } : bubble.type === 'ghost' ? {
          animation: 'float 1s ease-in-out infinite',
          opacity: 0.6
        } : bubble.type === 'chain' ? {
          animation: 'float 1.8s ease-in-out infinite',
          boxShadow: '0 0 15px #2ed573'
        } : bubble.type === 'time' ? {
          animation: 'float 1.2s ease-in-out infinite',
          boxShadow: '0 0 18px #3742fa'
        } : {};

        return (
          <div
            key={bubble.id}
            style={{
              position: 'absolute',
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              transform: 'translate(-50%, -50%)',
              width: `${bubble.size * 1.8}px`, // 根據泡泡大小調整點擊區域
              height: `${bubble.size * 1.8}px`, // 根據泡泡大小調整點擊區域
              background: `radial-gradient(circle at 30% 30%, ${bubble.color}40, ${bubble.color})`,
              borderRadius: '50%',
              border: `2px solid ${bubble.color}80`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${Math.max(12, bubble.size * 0.4)}px`, // 根據泡泡大小調整字體，最小12px
              opacity: bubble.opacity,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 20,
              ...specialStyle
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('泡泡被點擊:', bubble.id);
              if (isPlaying) {
                // 添加爆破視覺效果
                const bubbleElement = e.currentTarget;
                bubbleElement.style.animation = 'popEffect 0.4s ease-out forwards';
                
                // 創建爆破粒子效果
                const rect = bubbleElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // 添加多個粒子
                for (let i = 0; i < 12; i++) {
                  const particle = document.createElement('div');
                  particle.style.position = 'fixed';
                  particle.style.left = centerX + 'px';
                  particle.style.top = centerY + 'px';
                  particle.style.width = '6px';
                  particle.style.height = '6px';
                  particle.style.background = bubble.color;
                  particle.style.borderRadius = '50%';
                  particle.style.pointerEvents = 'none';
                  particle.style.zIndex = '1000';
                  particle.style.boxShadow = `0 0 8px ${bubble.color}`;
                  particle.style.transition = 'all 0.6s ease';
                  
                  document.body.appendChild(particle);
                  
                  // 隨機方向擴散
                  const angle = (i * 30) * Math.PI / 180;
                  const distance = 60 + Math.random() * 40;
                  const targetX = centerX + Math.cos(angle) * distance;
                  const targetY = centerY + Math.sin(angle) * distance;
                  
                  setTimeout(() => {
                    particle.style.left = targetX + 'px';
                    particle.style.top = targetY + 'px';
                    particle.style.opacity = '0';
                    particle.style.transform = 'scale(0)';
                  }, 10);
                  
                  setTimeout(() => {
                    if (document.body.contains(particle)) {
                      document.body.removeChild(particle);
                    }
                  }, 600);
                }
                
                setTotalClicks(prev => prev + 1);
                setSuccessfulClicks(prev => prev + 1);
                popBubble(bubble.id);
                
                // 播放爆破音效
                playPopSound();
                
                // 檢查是否觸發能量模式
                if (accuracy >= 80 && !powerMode) {
                  setPowerMode(true);
                  setPowerModeTimer(10);
                  playPowerModeSound();
                }
                
                // 更新精準度
                setAccuracy(totalClicks > 0 ? (successfulClicks / totalClicks) * 100 : 0);
              }
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('泡泡被觸摸:', bubble.id);
              
              // 添加觸摸反饋效果
              const bubbleElement = e.currentTarget;
              bubbleElement.style.transform = 'translate(-50%, -50%) scale(1.2)';
              bubbleElement.style.transition = 'transform 0.1s ease';
              
              setTimeout(() => {
                bubbleElement.style.transform = 'translate(-50%, -50%) scale(1)';
              }, 100);
              
              if (isPlaying) {
                // 手機版直接爆破，不需要額外的精準度檢查
                console.log('手機版直接爆破泡泡:', bubble.id);
                
                // 添加爆破視覺效果
                const bubbleElement = e.currentTarget;
                bubbleElement.style.animation = 'popEffect 0.4s ease-out forwards';
                
                // 創建爆破粒子效果
                const rect = bubbleElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // 添加多個粒子
                for (let i = 0; i < 12; i++) {
                  const particle = document.createElement('div');
                  particle.style.position = 'fixed';
                  particle.style.left = centerX + 'px';
                  particle.style.top = centerY + 'px';
                  particle.style.width = '6px';
                  particle.style.height = '6px';
                  particle.style.background = bubble.color;
                  particle.style.borderRadius = '50%';
                  particle.style.pointerEvents = 'none';
                  particle.style.zIndex = '1000';
                  particle.style.boxShadow = `0 0 8px ${bubble.color}`;
                  particle.style.transition = 'all 0.6s ease';
                  
                  document.body.appendChild(particle);
                  
                  // 隨機方向擴散
                  const angle = (i * 30) * Math.PI / 180;
                  const distance = 60 + Math.random() * 40;
                  const targetX = centerX + Math.cos(angle) * distance;
                  const targetY = centerY + Math.sin(angle) * distance;
                  
                  setTimeout(() => {
                    particle.style.left = targetX + 'px';
                    particle.style.top = targetY + 'px';
                    particle.style.opacity = '0';
                    particle.style.transform = 'scale(0)';
                  }, 10);
                  
                  setTimeout(() => {
                    if (document.body.contains(particle)) {
                      document.body.removeChild(particle);
                    }
                  }, 600);
                }
                
                setTotalClicks(prev => prev + 1);
                setSuccessfulClicks(prev => prev + 1);
                popBubble(bubble.id);
                
                // 播放爆破音效
                playPopSound();
                
                // 檢查是否觸發能量模式
                if (accuracy >= 80 && !powerMode) {
                  setPowerMode(true);
                  setPowerModeTimer(10);
                  playPowerModeSound();
                }
                
                // 更新精準度
                setAccuracy(totalClicks > 0 ? (successfulClicks / totalClicks) * 100 : 0);
              }
            }}
          >
            {bubble.emotion}
          </div>
        );
      })}

      {/* 粒子效果 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '4px',
            height: '4px',
            background: particle.color,
            borderRadius: '50%',
            opacity: particle.life,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* 連擊效果 */}
      {showComboEffect && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 'bold',
          color: '#ff6b6b',
          textShadow: '0 0 20px #ff6b6b',
          animation: 'comboEffect 1s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          COMBO x{combo}!
        </div>
      )}

      {/* 精準度提示 */}
      {!isPlaying && (
        <div style={{
          position: 'absolute',
          bottom: 'clamp(20px, 4vw, 40px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: 'clamp(8px, 2vw, 12px)',
          borderRadius: '10px',
          fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)',
          textAlign: 'center',
          zIndex: 100
        }}>
          🎯 {getText('accuracyChallenge')}：{getText('onlyClickCenterToPop')}！
          <br/>🚀 {getText('fastBubblesNeedHigherAccuracy')}！
        </div>
      )}

      {/* 遊戲結束畫面 */}
      {!isPlaying && score > 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 30px)',
          textAlign: 'center',
          zIndex: 1001,
          minWidth: 'clamp(250px, 50vw, 350px)'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', 
            margin: '0 0 15px 0',
            color: '#9C27B0'
          }}>
            遊戲結束！
          </h2>
          <div style={{ 
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
            marginBottom: '10px' 
          }}>
            最終分數：{score}
          </div>
          <div style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
            marginBottom: '20px',
            color: '#666'
          }}>
            最高分數：{highScore}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={startGame}
              style={{
                background: '#9C27B0',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                cursor: 'pointer'
              }}
            >
              再玩一次
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                cursor: 'pointer'
              }}
            >
              返回
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// 極速賽車遊戲組件
function RacingGame({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [carPosition, setCarPosition] = useState(50);
  const [obstacles, setObstacles] = useState<Array<{id: number, x: number, y: number, type: string}>>([]);
  const [speed, setSpeed] = useState(3);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showCollisionEffect, setShowCollisionEffect] = useState(false);
  const [isColliding, setIsColliding] = useState(false);
  const [showExplosionEffect, setShowExplosionEffect] = useState(false);
  const [explosionPosition, setExplosionPosition] = useState({ x: 0, y: 0 });

  // 多語言翻譯函數
  const getText = (key: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      'zh-TW': {
        score: '分數',
        time: '時間',
        level: '等級',
        combo: '連擊',
        title: '極速賽車',
        rules: '遊戲規則',
        close: '關閉',
        gameOver: '遊戲結束',
        controlMethod: '控制方式',
        useArrowKeysOrButtons: '使用方向鍵 ← → 或螢幕按鈕控制賽車',
        moveLeftRightToAvoid: '左右移動避開障礙物',
        gameObjective: '遊戲目標',
        avoidAllObstacles: '避開所有障礙物（石頭、汽車、卡車）',
        successfulAvoidance: '成功避開獲得5分 + 連擊獎勵',
        collisionPenalty: '碰撞障礙物扣10分並重置連擊',
        scoringSystem: '計分系統',
        baseScore: '基礎分數：避開障礙物 +5分',
        comboBonus: '連擊獎勵：每次連擊額外 +1分',
        levelUp: '等級提升：每100分提升一個等級',
        speedIncrease: '速度增加：等級越高，障礙物移動越快',
        gameTime: '遊戲時間',
        sixtySecondsPerGame: '每局遊戲60秒',
        autoScoreWhenTimeUp: '時間結束自動結算分數'
      },
      'zh-CN': {
        score: '分数',
        time: '时间',
        level: '等级',
        combo: '连击',
        title: '极速赛车',
        rules: '游戏规则',
        close: '关闭',
        controlMethod: '控制方式',
        useArrowKeysOrButtons: '使用方向键 ← → 或屏幕按钮控制赛车',
        moveLeftRightToAvoid: '左右移动避开障碍物',
        gameObjective: '游戏目标',
        avoidAllObstacles: '避开所有障碍物（石头、汽车、卡车）',
        successfulAvoidance: '成功避开获得5分 + 连击奖励',
        collisionPenalty: '碰撞障碍物扣10分并重置连击',
        scoringSystem: '计分系统',
        baseScore: '基础分数：避开障碍物 +5分',
        comboBonus: '连击奖励：每次连击额外 +1分',
        levelUp: '等级提升：每100分提升一个等级',
        speedIncrease: '速度增加：等级越高，障碍物移动越快',
        gameTime: '游戏时间',
        sixtySecondsPerGame: '每局游戏60秒',
        autoScoreWhenTimeUp: '时间结束自动结算分数'
      },
      'en': {
        score: 'Score',
        time: 'Time',
        level: 'Level',
        combo: 'Combo',
        title: 'Speed Racing',
        rules: 'Game Rules',
        close: 'Close',
        controlMethod: 'Control Method',
        useArrowKeysOrButtons: 'Use arrow keys ← → or screen buttons to control the race car',
        moveLeftRightToAvoid: 'Move left and right to avoid obstacles',
        gameObjective: 'Game Objective',
        avoidAllObstacles: 'Avoid all obstacles (stones, cars, trucks)',
        successfulAvoidance: 'Successfully avoid to get 5 points + combo bonus',
        collisionPenalty: 'Colliding with obstacles deducts 10 points and resets combo',
        scoringSystem: 'Scoring System',
        baseScore: 'Base score: avoid obstacles +5 points',
        comboBonus: 'Combo bonus: +1 point for each combo',
        levelUp: 'Level up: gain one level every 100 points',
        speedIncrease: 'Speed increase: the higher the level, the faster obstacles move',
        gameTime: 'Game Time',
        sixtySecondsPerGame: '60 seconds per game',
        autoScoreWhenTimeUp: 'Auto score when time is up'
      },
      'ja': {
        score: 'スコア',
        time: '時間',
        level: 'レベル',
        combo: 'コンボ',
        title: 'スピードレーシング',
        rules: 'ゲームルール',
        close: '閉じる',
        controlMethod: '操作方法',
        useArrowKeysOrButtons: '矢印キー ← → または画面ボタンでレーシングカーを操作',
        moveLeftRightToAvoid: '左右に移動して障害物を避ける',
        gameObjective: 'ゲーム目標',
        avoidAllObstacles: 'すべての障害物（石、車、トラック）を避ける',
        successfulAvoidance: '成功して避けると5ポイント + コンボボーナス',
        collisionPenalty: '障害物に衝突すると10ポイント減点しコンボリセット',
        scoringSystem: 'スコアシステム',
        baseScore: '基本スコア：障害物を避けると +5ポイント',
        comboBonus: 'コンボボーナス：各コンボで +1ポイント',
        levelUp: 'レベルアップ：100ポイントごとに1レベルアップ',
        speedIncrease: '速度増加：レベルが高いほど障害物が速く動く',
        gameTime: 'ゲーム時間',
        sixtySecondsPerGame: 'ゲームあたり60秒',
        autoScoreWhenTimeUp: '時間切れで自動スコア'
      },
      'ko': {
        score: '점수',
        time: '시간',
        level: '레벨',
        combo: '콤보',
        title: '스피드 레이싱',
        rules: '게임 규칙',
        close: '닫기',
        controlMethod: '조작 방법',
        useArrowKeysOrButtons: '화살표 키 ← → 또는 화면 버튼으로 레이싱카 조작',
        moveLeftRightToAvoid: '좌우로 이동하여 장애물 피하기',
        gameObjective: '게임 목표',
        avoidAllObstacles: '모든 장애물（돌、자동차、트럭）피하기',
        successfulAvoidance: '성공적으로 피하면 5점 + 콤보 보너스',
        collisionPenalty: '장애물과 충돌하면 10점 감점하고 콤보 리셋',
        scoringSystem: '점수 시스템',
        baseScore: '기본 점수：장애물 피하기 +5점',
        comboBonus: '콤보 보너스：각 콤보마다 +1점',
        levelUp: '레벨 업：100점마다 1레벨 상승',
        speedIncrease: '속도 증가：레벨이 높을수록 장애물이 빨리 움직임',
        gameTime: '게임 시간',
        sixtySecondsPerGame: '게임당 60초',
        autoScoreWhenTimeUp: '시간 종료 시 자동 점수'
      },
      'vi': {
        score: 'Điểm',
        time: 'Thời Gian',
        level: 'Cấp Độ',
        combo: 'Combo',
        title: 'Đua Xe Tốc Độ',
        rules: 'Luật Chơi',
        close: 'Đóng',
        controlMethod: 'Phương Pháp Điều Khiển',
        useArrowKeysOrButtons: 'Sử dụng phím mũi tên ← → hoặc nút màn hình để điều khiển xe đua',
        moveLeftRightToAvoid: 'Di chuyển trái phải để tránh chướng ngại vật',
        gameObjective: 'Mục Tiêu Trò Chơi',
        avoidAllObstacles: 'Tránh tất cả chướng ngại vật (đá, xe hơi, xe tải)',
        successfulAvoidance: 'Tránh thành công được 5 điểm + phần thưởng combo',
        collisionPenalty: 'Va chạm với chướng ngại vật trừ 10 điểm và reset combo',
        scoringSystem: 'Hệ Thống Điểm',
        baseScore: 'Điểm cơ bản: tránh chướng ngại vật +5 điểm',
        comboBonus: 'Phần thưởng combo: +1 điểm cho mỗi combo',
        levelUp: 'Tăng cấp: tăng 1 cấp mỗi 100 điểm',
        speedIncrease: 'Tăng tốc độ: cấp càng cao, chướng ngại vật di chuyển càng nhanh',
        gameTime: 'Thời Gian Trò Chơi',
        sixtySecondsPerGame: '60 giây mỗi trò chơi',
        autoScoreWhenTimeUp: 'Tự động tính điểm khi hết thời gian'
      },
      'th': {
        score: 'คะแนน',
        time: 'เวลา',
        level: 'ระดับ',
        combo: 'คอมโบ',
        title: 'แข่งรถความเร็ว',
        rules: 'กฎเกม',
        close: 'ปิด',
        controlMethod: 'วิธีการควบคุม',
        useArrowKeysOrButtons: 'ใช้ปุ่มลูกศร ← → หรือปุ่มหน้าจอควบคุมรถแข่ง',
        moveLeftRightToAvoid: 'เคลื่อนที่ซ้ายขวาเพื่อหลบหลีกสิ่งกีดขวาง',
        gameObjective: 'เป้าหมายเกม',
        avoidAllObstacles: 'หลบหลีกสิ่งกีดขวางทั้งหมด（หิน、รถยนต์、รถบรรทุก）',
        successfulAvoidance: 'หลบหลีกสำเร็จได้ 5 คะแนน + โบนัสคอมโบ',
        collisionPenalty: 'ชนสิ่งกีดขวางหัก 10 คะแนนและรีเซ็ตคอมโบ',
        scoringSystem: 'ระบบคะแนน',
        baseScore: 'คะแนนพื้นฐาน：หลบหลีกสิ่งกีดขวาง +5 คะแนน',
        comboBonus: 'โบนัสคอมโบ：+1 คะแนนสำหรับแต่ละคอมโบ',
        levelUp: 'เลเวลอัพ：เพิ่ม 1 เลเวลทุก 100 คะแนน',
        speedIncrease: 'เพิ่มความเร็ว：เลเวลสูงขึ้นสิ่งกีดขวางเคลื่อนที่เร็วขึ้น',
        gameTime: 'เวลาเกม',
        sixtySecondsPerGame: '60 วินาทีต่อเกม',
        autoScoreWhenTimeUp: 'คะแนนอัตโนมัติเมื่อหมดเวลา'
      },
      'la': {
        score: 'Puncta',
        time: 'Tempus',
        level: 'Gradus',
        combo: 'Combo',
        title: 'Cursus Velocitatis',
        rules: 'Regulae Ludi',
        close: 'Claudere',
        controlMethod: 'Methodus Controllandi',
        useArrowKeysOrButtons: 'Utere clavis sagittarum ← → vel pugnis scaenae ad currum regendum',
        moveLeftRightToAvoid: 'Move sinistra dextraque ad impedimenta vitanda',
        gameObjective: 'Finis Ludi',
        avoidAllObstacles: 'Vita omnia impedimenta (lapides, currus, plaustra)',
        successfulAvoidance: 'Vitando feliciter accipe 5 puncta + praemium combo',
        collisionPenalty: 'Collidendo cum impedimentis minus 10 puncta et reset combo',
        scoringSystem: 'Systema Punctandi',
        baseScore: 'Puncta fundamentalia: vitando impedimenta +5 puncta',
        comboBonus: 'Praemium combo: +1 punctum pro quaque combo',
        levelUp: 'Gradus sursum: accipe unum gradum pro quaque 100 punctis',
        speedIncrease: 'Auctio velocitatis: altior gradus, velocius impedimenta moventur',
        gameTime: 'Tempus Ludi',
        sixtySecondsPerGame: '60 secundis pro quaque ludo',
        autoScoreWhenTimeUp: 'Auto puncta quando tempus finitum est'
      },
      'ms': {
        score: 'Markah',
        time: 'Masa',
        level: 'Tahap',
        combo: 'Combo',
        title: 'Lumba Kereta Laju',
        rules: 'Peraturan Permainan',
        close: 'Tutup',
        controlMethod: 'Kaedah Kawalan',
        useArrowKeysOrButtons: 'Gunakan kekunci anak panah ← → atau butang skrin untuk mengawal kereta lumba',
        moveLeftRightToAvoid: 'Gerakkan kiri kanan untuk mengelakkan halangan',
        gameObjective: 'Objektif Permainan',
        avoidAllObstacles: 'Elakkan semua halangan (batu, kereta, lori)',
        successfulAvoidance: 'Berjaya elakkan dapat 5 markah + bonus combo',
        collisionPenalty: 'Berlanggar dengan halangan tolak 10 markah dan reset combo',
        scoringSystem: 'Sistem Markah',
        baseScore: 'Markah asas: elakkan halangan +5 markah',
        comboBonus: 'Bonus combo: +1 markah untuk setiap combo',
        levelUp: 'Naik tahap: dapat 1 tahap setiap 100 markah',
        speedIncrease: 'Tambah kelajuan: tahap lebih tinggi, halangan bergerak lebih pantas',
        gameTime: 'Masa Permainan',
        sixtySecondsPerGame: '60 saat setiap permainan',
        autoScoreWhenTimeUp: 'Markah automatik apabila masa habis'
      }
    };
    return translations[lang]?.[key] || translations['zh-TW'][key] || key;
  };

  // 載入遊戲進度
  useEffect(() => {
    const saved = loadGameProgress('racing');
    if (saved) {
      setHighScore(saved.highScore || 0);
    }
  }, []);

  // 保存遊戲進度
  useEffect(() => {
    if (highScore > 0) {
      saveGameProgress('racing', { highScore });
    }
  }, [highScore]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setCarPosition(50);
    setObstacles([]);
    setSpeed(3);
    setLevel(1);
    setCombo(0);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const moveCar = (direction: 'left' | 'right') => {
    if (!isPlaying) return;
    
    setCarPosition(prev => {
      const newPosition = direction === 'left' ? prev - 8 : prev + 8;
      return Math.max(10, Math.min(90, newPosition));
    });
  };

  const spawnObstacle = () => {
    if (!isPlaying) return;
    
    const types = ['rock', 'car', 'truck'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // 平均分散在左、中、右三個區域
    const zones = [15, 50, 85]; // 左、中、右的x座標
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    const x = randomZone + (Math.random() - 0.5) * 20; // 在選定區域內隨機偏移
    
    setObstacles(prev => [...prev, {
      id: Date.now(),
      x,
      y: 0,
      type
    }]);
  };

  const checkCollision = (carX: number, obstacleX: number) => {
    const carWidth = 8;
    const obstacleWidth = 12;
    return Math.abs(carX - obstacleX) < (carWidth + obstacleWidth) / 2;
  };

  // 遊戲主循環
  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          endGame();
          return 0;
        }
        return prev - 0.1;
      });

      // 生成障礙物
      if (Math.random() < 0.9 + level * 0.15) {
        spawnObstacle();
      }

      // 更新障礙物位置
      setObstacles(prev => {
        const updated = prev.map(obstacle => ({
          ...obstacle,
          y: obstacle.y + speed
        })).filter(obstacle => obstacle.y < 100);

        // 檢查碰撞
        let collisionOccurred = false;
        const finalObstacles = updated.filter(obstacle => {
          if (obstacle.y > 70 && obstacle.y < 85) {
            if (checkCollision(carPosition, obstacle.x)) {
              // 碰撞發生
              if (!collisionOccurred) {
                setCombo(0);
                setScore(prev => Math.max(0, prev - 10));
                setIsColliding(true);
                setShowCollisionEffect(true);
                
                // 設置爆炸效果位置
                setExplosionPosition({ x: carPosition, y: 75 });
                setShowExplosionEffect(true);
                
                setTimeout(() => {
                  setIsColliding(false);
                  setShowCollisionEffect(false);
                  setShowExplosionEffect(false);
                }, 800);
                collisionOccurred = true;
              }
              return false; // 移除碰撞的障礙物
            } else {
              // 成功避開
              setCombo(prev => prev + 1);
              setScore(prev => prev + 5 + combo);
              
              if (combo >= 5) {
                setShowComboEffect(true);
                setTimeout(() => setShowComboEffect(false), 1000);
              }
            }
          }
          return true;
        });
        
        return finalObstacles;

        return updated;
      });

      // 提升等級和速度
      if (score > level * 100) {
        setLevel(prev => prev + 1);
        setSpeed(prev => Math.min(8, prev + 0.5));
      }
    }, 100);

    return () => clearInterval(gameInterval);
  }, [isPlaying, speed, level, carPosition, combo]);

  // 鍵盤控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        moveCar('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        moveCar('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const getObstacleStyle = (type: string) => {
    const styles = {
      rock: { background: '#8B4513', borderRadius: '50%' },
      car: { background: '#FF4444', borderRadius: '5px' },
      truck: { background: '#FF8800', borderRadius: '8px' }
    };
    return styles[type as keyof typeof styles] || styles.rock;
  };

  // 觸控事件處理
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPlaying) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const touchX = touch.clientX;
    
    if (touchX < screenWidth / 2) {
      moveCar('left');
    } else {
      moveCar('right');
    }
  };

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 100%)',
        position: 'relative',
        overflow: 'auto',
        fontFamily: 'Arial, sans-serif',
        touchAction: 'pan-y'
      }}
      onTouchStart={handleTouchStart}
    >
      {/* 返回按鈕 */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 'clamp(20px, 4vw, 40px)',
          left: 'clamp(20px, 4vw, 40px)',
          background: '#fff',
          border: '2px solid #9C27B0',
          borderRadius: '50%',
          width: 'clamp(40px, 8vw, 50px)',
          height: 'clamp(40px, 8vw, 50px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        ←
      </button>

      {/* 遊戲資訊 */}
      <div style={{
        position: 'absolute',
        top: 'clamp(20px, 4vw, 40px)',
        left: 'clamp(80px, 16vw, 100px)',
        background: 'rgba(255,255,255,0.9)',
        padding: 'clamp(8px, 1.5vw, 12px)',
        borderRadius: '10px',
        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
        zIndex: 100
      }}>
        <div>{getText('score')}: {score}</div>
        <div>{getText('time')}: {timeLeft}s</div>
        <div>{getText('level')}: {level}</div>
        <div>{getText('combo')}: {combo}</div>
      </div>

      {/* 賽道 */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '0',
        right: '0',
        height: '60%',
        background: 'linear-gradient(90deg, #696969 0%, #A9A9A9 20%, #696969 40%, #A9A9A9 60%, #696969 80%, #A9A9A9 100%)',
        borderTop: '4px solid #FFD700',
        borderBottom: '4px solid #FFD700'
      }} />

      {/* 玩家車輛 */}
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: `${carPosition}%`,
        transform: 'translateX(-50%)',
        width: 'clamp(40px, 8vw, 60px)',
        height: 'clamp(20px, 4vw, 30px)',
        background: isColliding ? 'linear-gradient(45deg, #FF0000, #FF4444)' : 'linear-gradient(45deg, #FF4444, #FF6666)',
        borderRadius: '8px',
        border: isColliding ? '3px solid #FF0000' : '2px solid #CC0000',
        zIndex: 10,
        transition: 'left 0.1s ease',
        animation: isColliding ? 'collisionShake 0.5s ease-in-out' : 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(20px, 4vw, 30px)',
          height: 'clamp(8px, 1.5vw, 12px)',
          background: '#444',
          borderRadius: '4px'
        }} />
      </div>

      {/* 障礙物 */}
      {obstacles.map(obstacle => (
        <div
          key={obstacle.id}
          style={{
            position: 'absolute',
            top: `${obstacle.y}%`,
            left: `${obstacle.x}%`,
            transform: 'translateX(-50%)',
            width: 'clamp(30px, 6vw, 45px)',
            height: 'clamp(15px, 3vw, 22px)',
            ...getObstacleStyle(obstacle.type),
            zIndex: 5
          }}
        />
      ))}

      {/* 連擊效果 */}
      {showComboEffect && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '0 0 20px #FFD700',
          animation: 'comboEffect 1s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          COMBO x{combo}!
        </div>
      )}

      {/* 碰撞效果 */}
      {showCollisionEffect && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 'bold',
          color: '#FF0000',
          textShadow: '0 0 20px #FF0000',
          animation: 'collisionEffect 0.5s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          BOOM!
        </div>
      )}

      {/* 爆炸效果 */}
      {showExplosionEffect && (
        <div style={{
          position: 'absolute',
          left: `${explosionPosition.x}%`,
          top: `${explosionPosition.y}%`,
          transform: 'translate(-50%, -50%)',
          width: 'clamp(60px, 12vw, 80px)',
          height: 'clamp(60px, 12vw, 80px)',
          animation: 'explosionEffect 0.8s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 999
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, #FFD700 0%, #FF8800 30%, #FF4444 60%, #FF0000 100%)',
            borderRadius: '50%',
            boxShadow: '0 0 30px #FFD700, 0 0 60px #FF8800, 0 0 90px #FF4444'
          }} />
        </div>
      )}

      <style>
        {`
          @keyframes collisionShake {
            0%, 100% { transform: translateX(-50%) translateY(0px); }
            25% { transform: translateX(-50%) translateY(-5px) translateX(-3px); }
            50% { transform: translateX(-50%) translateY(0px) translateX(3px); }
            75% { transform: translateX(-50%) translateY(-5px) translateX(-3px); }
          }
          @keyframes collisionEffect {
            0% { 
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 0;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 1;
            }
            100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 0;
            }
          }
          @keyframes explosionEffect {
            0% { 
              transform: translate(-50%, -50%) scale(0.1);
              opacity: 1;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 1;
            }
            100% { 
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        `}
      </style>

      {/* 控制按鈕 */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(10px, 2vw, 20px)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 'clamp(10px, 2vw, 20px)',
        zIndex: 100
      }}>
        <button
          onClick={() => moveCar('left')}
          style={{
            background: '#FF4444',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 'clamp(50px, 10vw, 70px)',
            height: 'clamp(50px, 10vw, 70px)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ←
        </button>
        <button
          onClick={() => moveCar('right')}
          style={{
            background: '#FF4444',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 'clamp(50px, 10vw, 70px)',
            height: 'clamp(50px, 10vw, 70px)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          →
        </button>
      </div>

      {/* 開始遊戲按鈕 */}
      {!isPlaying && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 30px)',
          textAlign: 'center',
          zIndex: 1001
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', 
            margin: '0 0 15px 0',
            color: '#E91E63'
          }}>
            {getText('title')}
          </h2>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
            marginBottom: '20px',
            color: '#666'
          }}>
            使用方向鍵或按鈕控制賽車，避開障礙物！
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={startGame}
              style={{
                background: '#E91E63',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: 'clamp(10px, 2vw, 15px) clamp(20px, 4vw, 30px)',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {getText('start')}
            </button>
            <button
              onClick={() => setShowRules(true)}
              style={{
                background: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: 'clamp(10px, 2vw, 15px) clamp(20px, 4vw, 30px)',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                cursor: 'pointer'
              }}
            >
              {getText('rules')}
            </button>
          </div>
        </div>
      )}

      {/* 規則說明彈窗 */}
      {showRules && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 30px)',
            maxWidth: 'clamp(300px, 80vw, 500px)',
            maxHeight: 'clamp(400px, 80vh, 600px)',
            overflow: 'auto'
          }}>
            <h3 style={{ 
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
              margin: '0 0 15px 0',
              color: '#E91E63',
              textAlign: 'center'
            }}>
              {getText('title')} - {getText('rules')}
            </h3>
            <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: '1.6' }}>
              <p><strong>🎮 {getText('controlMethod')}：</strong></p>
              <ul>
                <li>{getText('useArrowKeysOrButtons')}</li>
                <li>{getText('moveLeftRightToAvoid')}</li>
              </ul>
              
              <p><strong>🎯 {getText('gameObjective')}：</strong></p>
              <ul>
                <li>{getText('avoidAllObstacles')}</li>
                <li>{getText('successfulAvoidance')}</li>
                <li>{getText('collisionPenalty')}</li>
              </ul>
              
              <p><strong>🏆 {getText('scoringSystem')}：</strong></p>
              <ul>
                <li>{getText('baseScore')}</li>
                <li>{getText('comboBonus')}</li>
                <li>{getText('levelUp')}</li>
                <li>{getText('speedIncrease')}</li>
              </ul>
              
              <p><strong>⏰ {getText('gameTime')}：</strong></p>
              <ul>
                <li>{getText('sixtySecondsPerGame')}</li>
                <li>{getText('autoScoreWhenTimeUp')}</li>
              </ul>
            </div>
            <button
              onClick={() => setShowRules(false)}
              style={{
                background: '#E91E63',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                cursor: 'pointer',
                marginTop: '20px',
                width: '100%'
              }}
            >
              {getText('close')}
            </button>
          </div>
        </div>
      )}

      {/* 遊戲結束畫面 */}
      {!isPlaying && score > 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 30px)',
          textAlign: 'center',
          zIndex: 1001
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', 
            margin: '0 0 15px 0',
            color: '#E91E63'
          }}>
            {getText('gameOver')}！
          </h2>
          <div style={{ 
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
            marginBottom: '10px' 
          }}>
            {getText('finalScore')}：{score}
          </div>
          <div style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
            marginBottom: '20px',
            color: '#666'
          }}>
            {getText('highScore')}：{highScore}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button
                onClick={startGame}
                style={{
                  background: '#E91E63',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '15px',
                  padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  cursor: 'pointer'
                }}
              >
                                {getText('restart')}
              </button>
              <button
                onClick={onClose}
                style={{
                  background: '#666',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '15px',
                  padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  cursor: 'pointer'
                }}
              >
                {getText('back')}
              </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 音樂節奏遊戲組件
function RhythmGame({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [beats, setBeats] = useState<Array<{id: number, x: number, y: number, type: string, timing: number}>>([]);
  const [combo, setCombo] = useState(0);
  const [showComboEffect, setShowComboEffect] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRules, setShowRules] = useState(false);

  // 多語言翻譯函數
  const getText = (key: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      'zh-TW': {
        score: '分數',
        time: '時間',
        combo: '連擊',
        title: '音樂節奏',
        rules: '遊戲規則',
        close: '關閉',
        gameOver: '遊戲結束',
        gameplay: '遊戲玩法',
        clickMovingRhythmPoints: '點擊從上往下移動的節奏點',
        fourColorsCorrespondToDifferentAudio: '四種顏色的節奏點對應不同音頻',
        redBlueGreenYellowFrequencies: '紅色(440Hz)、藍色(523Hz)、綠色(659Hz)、黃色(784Hz)',
        accuracyScoring: '精準度計分',
        perfect100ms: 'Perfect (100ms內)：+10分',
        good200ms: 'Good (200ms內)：+5分',
        ok300ms: 'OK (300ms內)：+2分',
        missOver300ms: 'Miss (超過300ms)：0分',
        scoring: '計分',
        eachSuccessfulClickIncreasesCombo: '每次成功點擊增加連擊數',
        combo5TimesTriggersEffect: '連擊5次以上觸發特效',
        missingRhythmPointResetsCombo: '錯過節奏點重置連擊',
        soundControl: '音效控制',
        soundSwitchInTopRight: '右上角音效開關控制',
        clickRhythmPointPlaysAudio: '點擊節奏點會播放對應音頻',
        canTurnSoundOnOffAnytime: '可隨時開啟/關閉音效',
        gameTime: '遊戲時間',
        sixtySecondsPerGame: '每局遊戲60秒',
        autoScoreWhenTimeUp: '時間結束自動結算分數',
        clickRhythmPointsFollowMusic: '點擊節奏點，跟隨音樂節奏！'
      },
      'zh-CN': {
        score: '分数',
        time: '时间',
        combo: '连击',
        title: '音乐节奏',
        rules: '游戏规则',
        close: '关闭',
        gameplay: '游戏玩法',
        clickMovingRhythmPoints: '点击从上往下移动的节奏点',
        fourColorsCorrespondToDifferentAudio: '四种颜色的节奏点对应不同音频',
        redBlueGreenYellowFrequencies: '红色(440Hz)、蓝色(523Hz)、绿色(659Hz)、黄色(784Hz)',
        accuracyScoring: '精准度计分',
        perfect100ms: 'Perfect (100ms内)：+10分',
        good200ms: 'Good (200ms内)：+5分',
        ok300ms: 'OK (300ms内)：+2分',
        missOver300ms: 'Miss (超过300ms)：0分',
        scoring: '计分',
        eachSuccessfulClickIncreasesCombo: '每次成功点击增加连击数',
        combo5TimesTriggersEffect: '连击5次以上触发特效',
        missingRhythmPointResetsCombo: '错过节奏点重置连击',
        soundControl: '音效控制',
        soundSwitchInTopRight: '右上角音效开关控制',
        clickRhythmPointPlaysAudio: '点击节奏点会播放对应音频',
        canTurnSoundOnOffAnytime: '可随时开启/关闭音效',
        gameTime: '游戏时间',
        sixtySecondsPerGame: '每局游戏60秒',
        autoScoreWhenTimeUp: '时间结束自动结算分数',
        clickRhythmPointsFollowMusic: '点击节奏点，跟随音乐节奏！'
      },
      'en': {
        score: 'Score',
        time: 'Time',
        combo: 'Combo',
        title: 'Music Rhythm',
        rules: 'Game Rules',
        close: 'Close',
        gameplay: 'Gameplay',
        clickMovingRhythmPoints: 'Click rhythm points moving from top to bottom',
        fourColorsCorrespondToDifferentAudio: 'Four colors of rhythm points correspond to different audio',
        redBlueGreenYellowFrequencies: 'Red (440Hz), Blue (523Hz), Green (659Hz), Yellow (784Hz)',
        accuracyScoring: 'Accuracy Scoring',
        perfect100ms: 'Perfect (within 100ms): +10 points',
        good200ms: 'Good (within 200ms): +5 points',
        ok300ms: 'OK (within 300ms): +2 points',
        missOver300ms: 'Miss (over 300ms): 0 points',
        scoring: 'Scoring',
        eachSuccessfulClickIncreasesCombo: 'Each successful click increases combo count',
        combo5TimesTriggersEffect: 'Combo 5 times or more triggers special effects',
        missingRhythmPointResetsCombo: 'Missing rhythm point resets combo',
        soundControl: 'Sound Control',
        soundSwitchInTopRight: 'Sound switch control in top right corner',
        clickRhythmPointPlaysAudio: 'Clicking rhythm points plays corresponding audio',
        canTurnSoundOnOffAnytime: 'Can turn sound on/off anytime',
        gameTime: 'Game Time',
        sixtySecondsPerGame: '60 seconds per game',
        autoScoreWhenTimeUp: 'Auto score when time is up',
        clickRhythmPointsFollowMusic: 'Click rhythm points, follow the music rhythm!'
      },
      'ja': {
        score: 'スコア',
        time: '時間',
        combo: 'コンボ',
        title: '音楽リズム',
        rules: 'ゲームルール',
        close: '閉じる',
        gameplay: 'ゲームプレイ',
        clickMovingRhythmPoints: '上から下に移動するリズムポイントをクリック',
        fourColorsCorrespondToDifferentAudio: '4色のリズムポイントが異なる音声に対応',
        redBlueGreenYellowFrequencies: '赤(440Hz)、青(523Hz)、緑(659Hz)、黄(784Hz)',
        accuracyScoring: '精度スコアリング',
        perfect100ms: 'Perfect (100ms以内)：+10ポイント',
        good200ms: 'Good (200ms以内)：+5ポイント',
        ok300ms: 'OK (300ms以内)：+2ポイント',
        missOver300ms: 'Miss (300ms超過)：0ポイント',
        scoring: 'スコアリング',
        eachSuccessfulClickIncreasesCombo: '各成功クリックでコンボ数増加',
        combo5TimesTriggersEffect: 'コンボ5回以上でエフェクト発動',
        missingRhythmPointResetsCombo: 'リズムポイントを逃すとコンボリセット',
        soundControl: 'サウンドコントロール',
        soundSwitchInTopRight: '右上のサウンドスイッチ制御',
        clickRhythmPointPlaysAudio: 'リズムポイントクリックで対応音声再生',
        canTurnSoundOnOffAnytime: 'いつでもサウンドオン/オフ可能',
        gameTime: 'ゲーム時間',
        sixtySecondsPerGame: 'ゲームあたり60秒',
        autoScoreWhenTimeUp: '時間切れで自動スコア',
        clickRhythmPointsFollowMusic: 'リズムポイントをクリックして、音楽のリズムに従ってください！'
      },
      'ko': {
        score: '점수',
        time: '시간',
        combo: '콤보',
        title: '음악 리듬',
        rules: '게임 규칙',
        close: '닫기',
        gameplay: '게임 플레이',
        clickMovingRhythmPoints: '위에서 아래로 이동하는 리듬 포인트 클릭',
        fourColorsCorrespondToDifferentAudio: '4가지 색상의 리듬 포인트가 다른 오디오에 대응',
        redBlueGreenYellowFrequencies: '빨강(440Hz)、파랑(523Hz)、초록(659Hz)、노랑(784Hz)',
        accuracyScoring: '정확도 점수',
        perfect100ms: 'Perfect (100ms 이내)：+10점',
        good200ms: 'Good (200ms 이내)：+5점',
        ok300ms: 'OK (300ms 이내)：+2점',
        missOver300ms: 'Miss (300ms 초과)：0점',
        scoring: '점수',
        eachSuccessfulClickIncreasesCombo: '각 성공 클릭마다 콤보 수 증가',
        combo5TimesTriggersEffect: '콤보 5회 이상 시 특수 효과 발동',
        missingRhythmPointResetsCombo: '리듬 포인트 놓치면 콤보 리셋',
        soundControl: '사운드 제어',
        soundSwitchInTopRight: '우상단 사운드 스위치 제어',
        clickRhythmPointPlaysAudio: '리듬 포인트 클릭 시 해당 오디오 재생',
        canTurnSoundOnOffAnytime: '언제든지 사운드 켜기/끄기 가능',
        gameTime: '게임 시간',
        sixtySecondsPerGame: '게임당 60초',
        autoScoreWhenTimeUp: '시간 종료 시 자동 점수',
        clickRhythmPointsFollowMusic: '리듬 포인트를 클릭하고 음악 리듬을 따라가세요!'
      },
      'vi': {
        score: 'Điểm',
        time: 'Thời Gian',
        combo: 'Combo',
        title: 'Nhịp Điệu Âm Nhạc',
        rules: 'Luật Chơi',
        close: 'Đóng',
        gameplay: 'Cách Chơi',
        clickMovingRhythmPoints: 'Nhấp vào các điểm nhịp điệu di chuyển từ trên xuống dưới',
        fourColorsCorrespondToDifferentAudio: 'Bốn màu của điểm nhịp điệu tương ứng với âm thanh khác nhau',
        redBlueGreenYellowFrequencies: 'Đỏ (440Hz), Xanh dương (523Hz), Xanh lá (659Hz), Vàng (784Hz)',
        accuracyScoring: 'Điểm Độ Chính Xác',
        perfect100ms: 'Perfect (trong 100ms): +10 điểm',
        good200ms: 'Good (trong 200ms): +5 điểm',
        ok300ms: 'OK (trong 300ms): +2 điểm',
        missOver300ms: 'Miss (trên 300ms): 0 điểm',
        scoring: 'Điểm Số',
        eachSuccessfulClickIncreasesCombo: 'Mỗi lần nhấp thành công tăng số combo',
        combo5TimesTriggersEffect: 'Combo 5 lần trở lên kích hoạt hiệu ứng đặc biệt',
        missingRhythmPointResetsCombo: 'Bỏ lỡ điểm nhịp điệu reset combo',
        soundControl: 'Điều Khiển Âm Thanh',
        soundSwitchInTopRight: 'Công tắc âm thanh ở góc trên bên phải',
        clickRhythmPointPlaysAudio: 'Nhấp điểm nhịp điệu phát âm thanh tương ứng',
        canTurnSoundOnOffAnytime: 'Có thể bật/tắt âm thanh bất cứ lúc nào',
        gameTime: 'Thời Gian Trò Chơi',
        sixtySecondsPerGame: '60 giây mỗi trò chơi',
        autoScoreWhenTimeUp: 'Tự động tính điểm khi hết thời gian',
        clickRhythmPointsFollowMusic: 'Nhấp vào điểm nhịp điệu, theo nhịp điệu âm nhạc!'
      },
      'th': {
        score: 'คะแนน',
        time: 'เวลา',
        combo: 'คอมโบ',
        title: 'จังหวะดนตรี',
        rules: 'กฎเกม',
        close: 'ปิด',
        gameplay: 'วิธีเล่น',
        clickMovingRhythmPoints: 'คลิกจุดจังหวะที่เคลื่อนที่จากบนลงล่าง',
        fourColorsCorrespondToDifferentAudio: 'สี่สีของจุดจังหวะสอดคล้องกับเสียงที่แตกต่างกัน',
        redBlueGreenYellowFrequencies: 'แดง (440Hz)、น้ำเงิน (523Hz)、เขียว (659Hz)、เหลือง (784Hz)',
        accuracyScoring: 'คะแนนความแม่นยำ',
        perfect100ms: 'Perfect (ภายใน 100ms)：+10 คะแนน',
        good200ms: 'Good (ภายใน 200ms)：+5 คะแนน',
        ok300ms: 'OK (ภายใน 300ms)：+2 คะแนน',
        missOver300ms: 'Miss (เกิน 300ms)：0 คะแนน',
        scoring: 'คะแนน',
        eachSuccessfulClickIncreasesCombo: 'แต่ละการคลิกที่สำเร็จเพิ่มจำนวนคอมโบ',
        combo5TimesTriggersEffect: 'คอมโบ 5 ครั้งขึ้นไปกระตุ้นเอฟเฟกต์พิเศษ',
        missingRhythmPointResetsCombo: 'พลาดจุดจังหวะรีเซ็ตคอมโบ',
        soundControl: 'ควบคุมเสียง',
        soundSwitchInTopRight: 'สวิตช์เสียงควบคุมที่มุมขวาบน',
        clickRhythmPointPlaysAudio: 'คลิกจุดจังหวะเล่นเสียงที่สอดคล้องกัน',
        canTurnSoundOnOffAnytime: 'สามารถเปิด/ปิดเสียงได้ทุกเมื่อ',
        gameTime: 'เวลาเกม',
        sixtySecondsPerGame: '60 วินาทีต่อเกม',
        autoScoreWhenTimeUp: 'คะแนนอัตโนมัติเมื่อหมดเวลา',
        clickRhythmPointsFollowMusic: 'คลิกจุดจังหวะและตามจังหวะดนตรี!'
      },
      'la': {
        score: 'Puncta',
        time: 'Tempus',
        combo: 'Combo',
        title: 'Rhythmus Musicae',
        rules: 'Regulae Ludi',
        close: 'Claudere',
        gameplay: 'Ludus',
        clickMovingRhythmPoints: 'Clicca puncta rhythmi moventia de superiore ad inferiorem',
        fourColorsCorrespondToDifferentAudio: 'Quattuor colores punctorum rhythmi correspondent diversis auditis',
        redBlueGreenYellowFrequencies: 'Rubrum (440Hz), Caeruleum (523Hz), Viride (659Hz), Flavum (784Hz)',
        accuracyScoring: 'Punctatio Accurationis',
        perfect100ms: 'Perfect (intra 100ms): +10 puncta',
        good200ms: 'Good (intra 200ms): +5 puncta',
        ok300ms: 'OK (intra 300ms): +2 puncta',
        missOver300ms: 'Miss (super 300ms): 0 puncta',
        scoring: 'Punctatio',
        eachSuccessfulClickIncreasesCombo: 'Quaelibet felix cliccatio auget numerum combo',
        combo5TimesTriggersEffect: 'Combo 5 vicibus vel plus activat effectus speciales',
        missingRhythmPointResetsCombo: 'Amittendo punctum rhythmi reset combo',
        soundControl: 'Controllatio Sonorum',
        soundSwitchInTopRight: 'Sonorum commutator in angulo superiore dextro',
        clickRhythmPointPlaysAudio: 'Cliccando puncta rhythmi ludit auditum correspondentem',
        canTurnSoundOnOffAnytime: 'Potest sonos aperire/claudere quandocumque',
        gameTime: 'Tempus Ludi',
        sixtySecondsPerGame: '60 secundis pro quaque ludo',
        autoScoreWhenTimeUp: 'Auto puncta quando tempus finitum est',
        clickRhythmPointsFollowMusic: 'Puncta rhythmi preme et musicam sequere!'
      },
      'ms': {
        score: 'Markah',
        time: 'Masa',
        combo: 'Combo',
        title: 'Irama Muzik',
        rules: 'Peraturan Permainan',
        close: 'Tutup',
        gameplay: 'Cara Bermain',
        clickMovingRhythmPoints: 'Klik titik irama yang bergerak dari atas ke bawah',
        fourColorsCorrespondToDifferentAudio: 'Empat warna titik irama sepadan dengan audio berbeza',
        redBlueGreenYellowFrequencies: 'Merah (440Hz), Biru (523Hz), Hijau (659Hz), Kuning (784Hz)',
        accuracyScoring: 'Penilaian Ketepatan',
        perfect100ms: 'Perfect (dalam 100ms): +10 markah',
        good200ms: 'Good (dalam 200ms): +5 markah',
        ok300ms: 'OK (dalam 300ms): +2 markah',
        missOver300ms: 'Miss (melebihi 300ms): 0 markah',
        scoring: 'Penilaian',
        eachSuccessfulClickIncreasesCombo: 'Setiap klik berjaya menambah bilangan combo',
        combo5TimesTriggersEffect: 'Combo 5 kali atau lebih mencetuskan kesan khas',
        missingRhythmPointResetsCombo: 'Terlepas titik irama reset combo',
        soundControl: 'Kawalan Bunyi',
        soundSwitchInTopRight: 'Suis bunyi kawalan di sudut kanan atas',
        clickRhythmPointPlaysAudio: 'Klik titik irama memainkan audio sepadan',
        canTurnSoundOnOffAnytime: 'Boleh hidupkan/matikan bunyi bila-bila masa',
        gameTime: 'Masa Permainan',
        sixtySecondsPerGame: '60 saat setiap permainan',
        autoScoreWhenTimeUp: 'Markah automatik apabila masa habis',
        clickRhythmPointsFollowMusic: 'Klik titik irama, ikut rentak muzik!'
      }
    };
    return translations[lang]?.[key] || translations['zh-TW'][key] || key;
  };

  // 載入遊戲進度
  useEffect(() => {
    const saved = loadGameProgress('rhythm');
    if (saved) {
      setHighScore(saved.highScore || 0);
    }
  }, []);

  // 保存遊戲進度
  useEffect(() => {
    if (highScore > 0) {
      saveGameProgress('rhythm', { highScore });
    }
  }, [highScore]);

  // 初始化音頻上下文
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      setAudioContext(new AudioContext());
    }
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setBeats([]);
    setCombo(0);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const spawnBeat = () => {
    if (!isPlaying) return;
    
    const types = ['red', 'blue', 'green', 'yellow'];
    const type = types[Math.floor(Math.random() * types.length)];
    const x = Math.random() * 80 + 10;
    
    setBeats(prev => [...prev, {
      id: Date.now(),
      x,
      y: -10,
      type,
      timing: Date.now()
    }]);
  };

  const hitBeat = (beatId: number) => {
    const beat = beats.find(b => b.id === beatId);
    if (!beat) return;

    const timing = Date.now() - beat.timing;
    let points = 0;
    let accuracy = '';

    if (timing < 100) {
      points = 10;
      accuracy = 'Perfect!';
    } else if (timing < 200) {
      points = 5;
      accuracy = 'Good!';
    } else if (timing < 300) {
      points = 2;
      accuracy = 'OK';
    } else {
      points = 0;
      accuracy = 'Miss';
    }

    setScore(prev => prev + points);
    setCombo(prev => prev + 1);
    
    if (combo >= 5) {
      setShowComboEffect(true);
      setTimeout(() => setShowComboEffect(false), 1000);
    }

    // 播放音效
    if (audioContext && soundEnabled) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const frequencies = { red: 440, blue: 523, green: 659, yellow: 784 };
      oscillator.frequency.setValueAtTime(frequencies[beat.type as keyof typeof frequencies], audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }

    setBeats(prev => prev.filter(b => b.id !== beatId));
  };

  // 遊戲主循環
  useEffect(() => {
    if (!isPlaying) return;

    const gameInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });

      // 生成節奏點
      if (Math.random() < 0.03) {
        spawnBeat();
      }

      // 更新節奏點位置
      setBeats(prev => {
        const updated = prev.map(beat => ({
          ...beat,
          y: beat.y + 2
        })).filter(beat => beat.y < 110);

        // 檢查錯過的節奏點
        updated.forEach(beat => {
          if (beat.y > 90) {
            setCombo(0);
            setBeats(prev => prev.filter(b => b.id !== beat.id));
          }
        });

        return updated;
      });
    }, 50);

    return () => clearInterval(gameInterval);
  }, [isPlaying]);

  const getBeatColor = (type: string) => {
    const colors = {
      red: '#FF4444',
      blue: '#4444FF',
      green: '#44FF44',
      yellow: '#FFFF44'
    };
    return colors[type as keyof typeof colors] || '#FF4444';
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 遊戲資訊 */}
      <div style={{
        position: 'absolute',
        top: 'clamp(20px, 4vw, 40px)',
        left: 'clamp(80px, 16vw, 100px)',
        background: 'rgba(255,255,255,0.9)',
        padding: 'clamp(8px, 1.5vw, 12px)',
        borderRadius: '10px',
        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
        zIndex: 100
      }}>
        <div>{getText('score')}: {score}</div>
        <div>{getText('time')}: {timeLeft}s</div>
        <div>{getText('combo')}: {combo}</div>
      </div>

      {/* 音效開關 */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        style={{
          position: 'absolute',
          top: 'clamp(10px, 2vw, 20px)',
          right: 'clamp(10px, 2vw, 20px)',
          background: soundEnabled ? '#4CAF50' : '#f44336',
          color: '#fff',
          border: 'none',
          borderRadius: '25px',
          padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      {/* 節奏軌道 */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        right: '10%',
        height: '60%',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '20px',
        border: '2px solid rgba(255,255,255,0.3)'
      }} />

      {/* 節奏點 */}
      {beats.map(beat => (
        <div
          key={beat.id}
          onClick={() => hitBeat(beat.id)}
          style={{
            position: 'absolute',
            bottom: `${beat.y}%`,
            left: `${beat.x}%`,
            transform: 'translateX(-50%)',
            width: 'clamp(40px, 8vw, 60px)',
            height: 'clamp(40px, 8vw, 60px)',
            background: getBeatColor(beat.type),
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: `0 0 20px ${getBeatColor(beat.type)}`,
            animation: 'pulse 0.5s ease-in-out infinite alternate'
          }}
        />
      ))}

      {/* 連擊效果 */}
      {showComboEffect && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 'bold',
          color: '#00BCD4',
          textShadow: '0 0 20px #00BCD4',
          animation: 'comboEffect 1s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          COMBO x{combo}!
        </div>
      )}

      {/* 開始遊戲按鈕 */}
      {!isPlaying && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 30px)',
          textAlign: 'center',
          zIndex: 1001
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', 
            margin: '0 0 15px 0',
            color: '#00BCD4'
          }}>
            {getText('title')}
          </h2>
          <p style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
            marginBottom: '20px',
            color: '#666'
          }}>
            {getText('clickRhythmPointsFollowMusic')}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={startGame}
              style={{
                background: '#00BCD4',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: 'clamp(10px, 2vw, 15px) clamp(20px, 4vw, 30px)',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {getText('start')}
            </button>
            <button
              onClick={() => setShowRules(true)}
              style={{
                background: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: 'clamp(10px, 2vw, 15px) clamp(20px, 4vw, 30px)',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                cursor: 'pointer'
              }}
            >
              {getText('rules')}
            </button>
          </div>
        </div>
      )}

      {/* 規則說明彈窗 */}
      {showRules && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 30px)',
            maxWidth: 'clamp(300px, 80vw, 500px)',
            maxHeight: 'clamp(400px, 80vh, 600px)',
            overflow: 'auto'
          }}>
            <h3 style={{ 
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', 
              margin: '0 0 15px 0',
              color: '#00BCD4',
              textAlign: 'center'
            }}>
              {getText('rhythmGame')} - {getText('rules')}
            </h3>
            <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: '1.6' }}>
              <p><strong>🎵 {getText('gameplay')}：</strong></p>
              <ul>
                <li>{getText('clickMovingRhythmPoints')}</li>
                <li>{getText('fourColorsCorrespondToDifferentAudio')}</li>
                <li>{getText('redBlueGreenYellowFrequencies')}</li>
              </ul>
              
              <p><strong>🎯 {getText('accuracyScoring')}：</strong></p>
              <ul>
                <li>{getText('perfect100ms')}</li>
                <li>{getText('good200ms')}</li>
                <li>{getText('ok300ms')}</li>
                <li>{getText('missOver300ms')}</li>
              </ul>
              
              <p><strong>🏆 {getText('scoring')}：</strong></p>
              <ul>
                <li>{getText('eachSuccessfulClickIncreasesCombo')}</li>
                <li>{getText('combo5TimesTriggersEffect')}</li>
                <li>{getText('missingRhythmPointResetsCombo')}</li>
              </ul>
              
              <p><strong>🔊 {getText('soundControl')}：</strong></p>
              <ul>
                <li>{getText('soundSwitchInTopRight')}</li>
                <li>{getText('clickRhythmPointPlaysAudio')}</li>
                <li>{getText('canTurnSoundOnOffAnytime')}</li>
              </ul>
              
              <p><strong>⏰ {getText('gameTime')}：</strong></p>
              <ul>
                <li>{getText('sixtySecondsPerGame')}</li>
                <li>{getText('autoScoreWhenTimeUp')}</li>
              </ul>
            </div>
            <button
              onClick={() => setShowRules(false)}
              style={{
                background: '#00BCD4',
                color: '#fff',
                border: 'none',
                borderRadius: '15px',
                padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                cursor: 'pointer',
                marginTop: '20px',
                width: '100%'
              }}
            >
              {getText('close')}
            </button>
          </div>
        </div>
      )}

      {/* 遊戲結束畫面 */}
      {!isPlaying && score > 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 30px)',
          textAlign: 'center',
          zIndex: 1001
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', 
            margin: '0 0 15px 0',
            color: '#00BCD4'
          }}>
            {getText('gameOver')}！
          </h2>
          <div style={{ 
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
            marginBottom: '10px' 
          }}>
            {getText('finalScore')}：{score}
          </div>
          <div style={{ 
            fontSize: 'clamp(0.9rem, 2vw, 1rem)', 
            marginBottom: '20px',
            color: '#666'
          }}>
            {getText('highScore')}：{highScore}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button
                onClick={startGame}
                style={{
                  background: '#00BCD4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '15px',
                  padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  cursor: 'pointer'
                }}
              >
                                {getText('restart')}
              </button>
              <button
                onClick={onClose}
                style={{
                  background: '#666',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '15px',
                  padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 24px)',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  cursor: 'pointer'
                }}
              >
                {getText('back')}
              </button>
          </div>
        </div>
      )}

      {/* 動畫樣式 */}
      <style>{`
        @keyframes pulse {
          0% { transform: translateX(-50%) scale(1); }
          100% { transform: translateX(-50%) scale(1.1); }
        }
        @keyframes comboEffect {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}