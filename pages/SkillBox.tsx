import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getAuth, signOut } from 'firebase/auth';
import { useVideoReaction } from '../components/VideoReactionContext';
import { VideoReactionType } from '../components/VideoReactionPlayer';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import SharedHeader from '../components/SharedHeader';
type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'th' | 'vi' | 'ms' | 'la';

const LANGS: { code: LanguageCode; label: string }[] = [
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

const UI_TEXT = {
  backToHome: { 'zh-TW': '← 返回', 'zh-CN': '← 返回', 'ja': '← 戻る', 'en': '← Back', 'ko': '← 뒤로', 'th': '← กลับ', 'vi': '← Quay lại', 'ms': '← Kembali', 'la': '← Redire' },
  logout: { 'zh-TW': '登出', 'zh-CN': '登出', 'ja': 'ログアウト', 'en': 'Logout', 'ko': '로그아웃', 'th': 'ออกจากระบบ', 'vi': 'Đăng xuất', 'ms': 'Log keluar', 'la': 'Exire' },
  pageTitle: { 
    'zh-TW': '情境模擬室 SkillBox', 
    'zh-CN': '情境模拟室 SkillBox', 
    'en': 'SkillBox Scenario Room', 
    'ja': 'シナリオ練習室 SkillBox', 
    'ko': '상황 시뮬레이션실 SkillBox', 
    'th': 'ห้องจำลองสถานการณ์ SkillBox', 
    'vi': 'Phòng mô phỏng tình huống SkillBox', 
    'ms': 'Bilik Senario SkillBox', 
    'la': 'Camera Scaenarii SkillBox' 
  },
  subtitle: { 
    'zh-TW': '在這裡磨練你的對話技巧，應對各種挑戰。', 
    'zh-CN': '在这里磨练你的对话技巧，应对各种挑战。', 
    'en': 'Hone your conversation skills here for any challenge.', 
    'ja': 'ここで会話スキルを磨き、様々な挑戦に備えましょう。', 
    'ko': '여기서 대화 기술을 연마하여 모든 도전에 대비하세요.', 
    'th': 'ฝึกฝนทักษะการสนทนาของคุณที่นี่เพื่อรับมือกับทุกความท้าทาย', 
    'vi': 'Rèn luyện kỹ năng trò chuyện của bạn ở đây cho mọi thử thách.', 
    'ms': 'Asah kemahiran perbualan anda di sini untuk sebarang cabaran.', 
    'la': 'Hic peritiam colloquii tui exacue ad quamvis provocationem.' 
  },
  selectScenario: { 
    'zh-TW': '選擇一個情境開始練習', 
    'zh-CN': '选择一个情境开始练习', 
    'en': 'Select a scenario to start practicing', 
    'ja': '練習を始めるシナリオを選択してください', 
    'ko': '연습을 시작할 시나리오를 선택하세요', 
    'th': 'เลือกสถานการณ์เพื่อเริ่มฝึก', 
    'vi': 'Chọn một kịch bản để bắt đầu luyện tập', 
    'ms': 'Pilih senario untuk mula berlatih', 
    'la': 'Scaenarium elige ut exercere incipias' 
  },
  startPractice: { 
    'zh-TW': '進入模擬', 
    'zh-CN': '进入模拟', 
    'en': 'Enter Simulation', 
    'ja': 'シミュレーションに入る', 
    'ko': '시뮬레이션 시작', 
    'th': 'เข้าสู่การจำลอง', 
    'vi': 'Vào mô phỏng', 
    'ms': 'Masuk Simulasi', 
    'la': 'Intra Simulationem' 
  },
  scenarioTitle: {
    'zh-TW': '情境',
    'zh-CN': '情境',
    'en': 'Scenario',
    'ja': 'シナリオ',
    'ko': '시나리오',
    'th': 'สถานการณ์',
    'vi': 'Kịch bản',
    'ms': 'Senario',
    'la': 'Scaenarium',
  },
  scenarioDesc: {
    'zh-TW': '描述',
    'zh-CN': '描述',
    'en': 'Description',
    'ja': '説明',
    'ko': '설명',
    'th': 'คำอธิบาย',
    'vi': 'Mô tả',
    'ms': 'Penerangan',
    'la': 'Descriptio',
  },
  scenarioDifficulty: {
    'zh-TW': '難度',
    'zh-CN': '难度',
    'en': 'Difficulty',
    'ja': '難易度',
    'ko': '난이도',
    'th': 'ความยาก',
    'vi': 'Độ khó',
    'ms': 'Kesukaran',
    'la': 'Difficultas',
  },
  cancelButton: {
    'zh-TW': '取消',
    'zh-CN': '取消',
    'en': 'Cancel',
    'ja': 'キャンセル',
    'ko': '취소',
    'th': 'ยกเลิก',
    'vi': 'Hủy',
    'ms': 'Batal',
    'la': 'Abstinere'
  }
};

export type Scenario = {
    id: string;
    title: string;
    description: string;
    category?: string;
    difficulty: string;
    emoji?: string;
    tags?: string[];
    tone?: string;
    system_prompt?: string;
    starting_line?: string;
};

export default function SkillBox() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { lang: contextLang } = useLanguage();
  const lang = (contextLang as LanguageCode) || (localStorage.getItem('lang') as LanguageCode) || 'zh-TW';
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  
  const legalMenuRef = useRef<HTMLDivElement>(null);
  
  // 登出文字常數
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

  useEffect(() => {
    const fetchScenarios = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/locales/${lang}/scenarios.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch scenarios');
        }
        const data = await response.json();
        setScenarios(data);
      } catch (error) {
        console.error("Error fetching scenarios:", error);
        setScenarios([]);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, [lang]);

  // Handle clicking outside legal menu
  useEffect(() => {
    if (!showLegalMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (legalMenuRef.current && !legalMenuRef.current.contains(e.target as Node)) {
        setShowLegalMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showLegalMenu]);

  const handleScenarioClick = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setSelectedScenarioId(scenario.id);
    setShowModal(true);
  };

  const handleStartPractice = () => {
    if (selectedScenarioId) {
      navigate(`/skillbox/${selectedScenarioId}`);
    } else {
      alert(UI_TEXT.selectScenario[lang]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedScenario(null);
    setSelectedScenarioId(null);
  };

  if (loading) {
      return <div>Loading scenarios...</div>;
  }

  return (
    <div className="modern-bg" style={{ background: `url('/plains.png') center center / cover no-repeat fixed`, minHeight: '100vh', width:'100vw', overflow:'hidden', position:'relative' }}>
      {/* 手機版共用頁頭 */}
      <div className="mobile-shared-header">
        <SharedHeader />
      </div>
      
      {/* 桌面版頁頭 - 複製ChatCompanion格式 */}
      {window.innerWidth > 768 ? (
        <div className="desktop-topbar">
          {/* LOGO */}
          <div className="fixed-logo-box" style={{ position: 'fixed', top: 16, left: 42, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10000, paddingTop: 0, marginTop: 0 }}>
            <img src="/ctx-logo.png" className="fixed-logo-img" style={{ marginBottom: 0, width: 182, height: 182, cursor: 'pointer', marginTop: '-40px' }} onClick={() => navigate('/')} />
          </div>
          
          {/* 右側導航按鈕 */}
          <div style={{ position: 'fixed', top: 8, right: 36, zIndex: 9999, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, pointerEvents: 'auto', width: '100%', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginRight: 24 }}>
              <button 
                className="topbar-btn" 
                onClick={() => navigate('/about')} 
                style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 80 }}
              >
                {lang==='zh-TW'?'🧬 Restarter™｜我們是誰':'zh-CN'===lang?'🧬 Restarter™｜我们是谁':'en'===lang?'🧬 Restarter™｜Who We Are':'ja'===lang?'🧬 Restarter™｜私たちについて':'ko'===lang?'🧬 Restarter™｜우리는 누구인가':'th'===lang?'🧬 Restarter™｜เราเป็นใคร':'vi'===lang?'🧬 Restarter™｜Chúng tôi là ai':'ms'===lang?'🧬 Restarter™｜Siapa Kami':'🧬 Restarter™｜Quis sumus'}
              </button>
              <button 
                className="topbar-btn" 
                onClick={() => navigate('/feedback')} 
                style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 100 }}
              >
                {lang==='zh-TW'?'💬 意見箱｜我們想聽你說':'zh-CN'===lang?'💬 意见箱｜我们想听你说':'en'===lang?'💬 Feedback｜We Want to Hear You':'ja'===lang?'💬 ご意見箱｜あなたの声を聞かせて':'ko'===lang?'💬 피드백｜여러분의 의견을 듣고 싶어요':'th'===lang?'💬 กล่องความคิดเห็น｜เราอยากฟังคุณ':'vi'===lang?'💬 Hộp góp ý｜Chúng tôi muốn lắng nghe bạn':'ms'===lang?'💬 Kotak Maklum Balas｜Kami ingin mendengar anda':'💬 Arca Consilii｜Te audire volumus'}
              </button>

              {getAuth().currentUser ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {getAuth().currentUser?.photoURL ? (
  <img src={getAuth().currentUser.photoURL} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #90caf9' }} />
) : (
  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#90caf9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', border: '2px solid #90caf9' }}>
    {getAuth().currentUser?.displayName ? getAuth().currentUser.displayName.charAt(0).toUpperCase() : 'U'}
  </div>
)}
                    <span style={{ color: '#1976d2', fontWeight: 700, fontSize: 16 }}>{getAuth().currentUser?.displayName || getAuth().currentUser?.email || '用戶'}</span>
                    <button className="topbar-btn" onClick={async () => { const auth = getAuth(); await auth.signOut(); }} style={{ background: '#fff', color: '#ff6347', border: '2px solid #ffb4a2', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '8px 14px', marginLeft: 6 }}>{LOGOUT_TEXT[lang]}</button>
                  </div>
                </>
              ) : (
                <button className="topbar-btn" onClick={() => navigate('/register')} style={{ background: '#fff', color: '#1976d2', border: '2px solid #90caf9', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '8px 10px', minWidth: 90 }}>{lang==='zh-TW'?'註冊/登入':'zh-CN'===lang?'注册/登录':'en'===lang?'Register / Login':'ja'===lang?'登録/ログイン':'ko'===lang?'가입/로그인':'th'===lang?'สมัคร/เข้าสู่ระบบ':'vi'===lang?'Đăng ký/Đăng nhập':'ms'===lang?'Daftar / Log Masuk':'Registrare / Login'}</button>
              )}
            </div>
            {/* 法律文件漢堡選單 */}
            <div style={{ position: 'relative', display: 'inline-block' }} ref={legalMenuRef}>
              <button
                className="topbar-btn"
                style={{
                  background: '#fff',
                  color: '#6B5BFF',
                  border: '2px solid #6B5BFF',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 16,
                  padding: '8px 12px',
                  minWidth: 50,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setShowLegalMenu(v => !v)}
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
                  minWidth: 200,
                  maxWidth: 250,
                  padding: '8px 0'
                }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#6B5BFF' }}>法律文件</span>
                  </div>
                  {[
                    { key: 'privacy', title: '隱私政策', path: '/privacy-policy' },
                    { key: 'terms', title: '使用條款', path: '/terms' },
                    { key: 'data', title: '數據刪除', path: '/data-deletion' },
                    { key: 'ai', title: 'AI使用聲明', path: '/ai-statement' },
                    { key: 'mental', title: '心理健康免責聲明', path: '/mental-health-disclaimer' },
                    { key: 'cookie', title: 'Cookie政策', path: '/cookie-policy' },
                    { key: 'children', title: '兒童隱私保護', path: '/children-privacy' },
                    { key: 'international', title: '國際用戶聲明', path: '/international-users' },
                    { key: 'security', title: '安全聲明', path: '/security-statement' },
                    { key: 'update', title: '更新通知機制', path: '/update-notification' }
                  ].map(item => (
                    <div 
                      key={item.key}
                      style={{ 
                        padding: '8px 16px', 
                        cursor: 'pointer', 
                        color: '#232946', 
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                        borderRadius: '4px',
                        margin: '2px 8px'
                      }} 
                      onClick={() => { 
                        navigate(item.path); 
                        setShowLegalMenu(false); 
                      }}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      
      {/* 桌面版白色卡片 - 縮短並只包含標題 */}
      {window.innerWidth > 768 ? (
        <div
          style={{
            width: '100%',
            maxWidth: 500, // 縮短白色卡片
            margin: '120px auto 0 auto', // 增加頂部margin讓它往下移動，與副標題交接
            padding: '16px 24px',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <h1 style={{ 
            fontWeight: 900, 
            fontSize: 18, 
            color: '#6B5BFF', 
            margin: 0, 
            lineHeight: 1,
            textShadow: '0 2px 8px #6B5BFF88',
            textAlign: 'center',
          }}>
            <span role="img" aria-label="skillbox">🛠️</span> {UI_TEXT.pageTitle[lang]}
          </h1>
        </div>
      ) : null}
      
      {/* 內容區塊可捲動，並自動下移不被頂部按鈕遮住 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        width: '100%', 
        padding: window.innerWidth <= 768 ? '16px' : '24px', 
        marginTop: window.innerWidth <= 768 ? 80 : 20, 
        minHeight:'calc(100vh - 120px)', 
        overflowY:'auto' 
      }}>
        {/* 手機版：主標題 */}
        {window.innerWidth <= 768 && (
          <h1 style={{ 
            fontSize: 22, 
            fontWeight: 900, 
            color: '#6B5BFF', 
            marginBottom: 12, 
            textAlign:'center', 
            background:'rgba(255,255,255,0.95)', 
            padding:'12px 20px', 
            borderRadius:16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <span role="img" aria-label="skillbox">🛠️</span> 情境模擬室 SkillBox
          </h1>
        )}
        
        <div style={{ fontSize: 16, color: '#4A4A4A', fontWeight: 500, marginBottom: 20, textAlign:'center', background:'rgba(255,255,255,0.7)', padding:'8px 16px', borderRadius:8 }}>{UI_TEXT.subtitle[lang]}</div>
        
        <div style={{ 
          maxWidth: 800, 
          width: window.innerWidth <= 768 ? '95%' : '90%', 
          background: '#fff', 
          borderRadius: 16, 
          padding: window.innerWidth <= 768 ? '20px 16px' : '24px 32px', 
          boxShadow: '0 4px 24px #0002', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          margin: window.innerWidth <= 768 ? '0 8px' : '0'
        }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: '#6B5BFF', marginBottom: 24 }}>{UI_TEXT.selectScenario[lang]}</h3>
          
          <div style={{ 
            width: '100%', 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth <= 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: window.innerWidth <= 768 ? '16px' : '24px' 
          }}>
            {scenarios.map(scenario => (
              <div 
                key={scenario.id}
                onClick={() => handleScenarioClick(scenario)}
                style={{ 
                  background: selectedScenarioId === scenario.id ? 'linear-gradient(135deg, #6B5BFF 0%, #4D8FFF 100%)' : '#e8e6ff', 
                  color: selectedScenarioId === scenario.id ? '#fff' : '#2D2D2D',
                  borderRadius: 12, 
                  padding: window.innerWidth <= 768 ? 16 : 20, 
                  boxShadow: selectedScenarioId === scenario.id ? '0 8px 24px #6B5BFF66' : '0 4px 12px #0000001a', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  border: selectedScenarioId === scenario.id ? '2px solid #fff' : '2px solid transparent',
                  transform: selectedScenarioId === scenario.id ? 'translateY(-5px)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: window.innerWidth <= 768 ? 36 : 48, marginBottom: window.innerWidth <= 768 ? 8 : 12 }}>{scenario.emoji}</div>
                <h4 style={{ fontSize: window.innerWidth <= 768 ? 16 : 18, fontWeight: 700, margin: '0 0 8px 0' }}>{scenario.title}</h4>
                <p style={{ fontSize: window.innerWidth <= 768 ? 12 : 14, margin: '0 0 12px 0', opacity: 0.8, minHeight: window.innerWidth <= 768 ? '32px' : '40px' }}>{scenario.description}</p>
                <div style={{ fontWeight: 600, fontSize: 14, padding: '4px 12px', borderRadius: 16, background: selectedScenarioId === scenario.id ? 'rgba(255,255,255,0.2)' : 'rgba(107, 91, 255, 0.1)', color: selectedScenarioId === scenario.id ? '#fff' : '#6B5BFF' }}>
                    {UI_TEXT.scenarioDifficulty[lang]}: {scenario.difficulty}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 浮窗模態框 */}
      {showModal && selectedScenario && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleCloseModal}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              maxWidth: 400,
              width: '90%',
              textAlign: 'center',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 關閉按鈕 */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#999',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ×
            </button>

            <div style={{ fontSize: 48, marginBottom: 16 }}>{selectedScenario.emoji}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#6B5BFF', margin: '0 0 8px 0' }}>{selectedScenario.title}</h3>
            <p style={{ fontSize: 14, color: '#666', margin: '0 0 16px 0', lineHeight: 1.5 }}>{selectedScenario.description}</p>
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1px solid #ddd',
                  background: '#f8f9fa',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e9ecef'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f8f9fa'}
              >
                {UI_TEXT.cancelButton[lang] || '取消'}
              </button>
              <button
                onClick={handleStartPractice}
                style={{
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'linear-gradient(135deg, #6B5BFF 0%, #4D8FFF 100%)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(107, 91, 255, 0.3)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {UI_TEXT.startPractice[lang]}
              </button>
            </div>
          </div>
        </div>
      )}
      

      
      <style>{`
        @media (min-width: 768px) {
          .mobile-shared-header {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-shared-header {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
} 