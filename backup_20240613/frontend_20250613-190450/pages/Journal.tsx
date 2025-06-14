import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import app from '../src/firebaseConfig';

const auth = getAuth(app);

const BACK_BUTTON: Record<string, string> = {
  'zh-TW': '← 返回首頁',
  'zh-CN': '← 返回首页',
  'en': '← Home',
  'ja': '← ホームへ戻る',
  'ko': '← 홈으로',
  'vi': '← Trang chủ',
};

const BACK_PREV_BUTTON: Record<string, string> = {
  'zh-TW': '↩ 返回上一頁',
  'zh-CN': '↩ 返回上一页',
  'en': '↩ Back',
  'ja': '↩ 前のページへ',
  'ko': '↩ 이전 페이지',
  'vi': '↩ Quay lại',
};

const Journal: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('zh-TW');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
      setLang(storedLang);
    }
  }, []);

  return (
    <div>
      {/* TopBar：左上返回首頁/上一頁，右上登出/語言切換 */}
      <div style={{position:'absolute',top:0,left:0,zIndex:100,display:'flex',alignItems:'center',padding:'18px 32px 0 32px',background:'transparent'}}>
        <button className="topbar-btn" onClick={()=>navigate('/')} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s', marginRight:8}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{BACK_BUTTON[lang]}</button>
        {window.location.pathname!=='/journal' && <button className="topbar-btn" onClick={()=>navigate(-1)} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s', marginLeft:8}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{BACK_PREV_BUTTON[lang]}</button>}
      </div>
      <div style={{position:'absolute',top:0,right:0,zIndex:100,display:'flex',alignItems:'center',padding:'18px 32px 0 32px',background:'transparent',gap:12}}>
        <button className="topbar-btn" onClick={async()=>{await signOut(auth);localStorage.clear();window.location.href='/'}} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s'}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{lang==='zh-TW'?'登出':lang==='zh-CN'?'登出':lang==='ja'?'ログアウト':'Logout'}</button>
        <select className="topbar-select" value={lang} onChange={e=>{localStorage.setItem('lang',e.target.value);window.location.reload();}} style={{padding:'6px 14px',borderRadius:8,fontWeight:600,border:'1.5px solid #6B5BFF',color:'#6B5BFF',background:'#fff',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s'}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>
          <option value="zh-TW">繁中</option>
          <option value="zh-CN">简中</option>
          <option value="en">EN</option>
          <option value="ja">日文</option>
        </select>
      </div>
      {/* 主標題：只保留一個有 emoji 的主標題，移到最上方 */}
      <div style={{marginTop:100,marginBottom:24,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#6B5BFF', textShadow: '0 2px 12px #6B5BFF88, 0 4px 24px #0008', letterSpacing:1, background:'#fff', borderRadius:12, boxShadow:'0 2px 12px #6B5BFF22', padding:'12px 32px', margin:0, display:'flex',alignItems:'center',gap:12 }}>🎨 {lang==='zh-TW'?'情緒圖像實驗室 Journal':lang==='zh-CN'?'情绪图像实验室 Journal':lang==='ja'?'感情ビジュアルラボ Journal':'Journal'}</h2>
      </div>
    </div>
  );
};

export default Journal; 