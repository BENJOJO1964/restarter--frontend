import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f7faff', padding: 0 }}>
      <button onClick={() => navigate('/plans')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>← 返回</button>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '32px 24px', marginTop: 64 }}>
        <h2 style={{ color: '#4B5BFF', fontWeight: 900, fontSize: 32, marginBottom: 24, letterSpacing: 1 }}>聯絡客服</h2>
        <div style={{ fontSize: 18, color: '#333', marginBottom: 24, lineHeight: 1.8 }}>
          如有任何問題、付款疑問、升級需求，歡迎透過以下方式聯絡我們：
        </div>
        <ul style={{ fontSize: 17, color: '#666', marginBottom: 32, marginLeft: 24 }}>
          <li>Email：<span href="mailto:support@restarter.app" style={{ color: '#6B5BFF', textDecoration: 'underline' }}>support@restarter.app</span></li>
          <li>LINE 客服：<span href="https://line.me/R/ti/p/@restarter" target="_blank" rel="noopener noreferrer" style={{ color: '#6B5BFF', textDecoration: 'underline' }}>@restarter</span></li>
          <li>Messenger：<span href="https://m.me/restarterapp" target="_blank" rel="noopener noreferrer" style={{ color: '#6B5BFF', textDecoration: 'underline' }}>Restarter 粉專</span></li>
          <li>線上表單：<span href="https://forms.gle/xxxxxx" target="_blank" rel="noopener noreferrer" style={{ color: '#6B5BFF', textDecoration: 'underline' }}>填寫表單</span></li>
        </ul>
        <div style={{ fontSize: 16, color: '#888', marginTop: 24 }}>客服回覆時間：週一至週五 10:00-18:00</div>
      </div>
    </div>
  );
} 