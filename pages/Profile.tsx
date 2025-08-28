import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

export default function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const lang = localStorage.getItem('lang') || 'zh-TW';

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7faff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px #0002', minWidth: 320, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#6B5BFF', marginBottom: 18 }}>請先註冊/登入才能進入個人中心</div>
          <button onClick={() => navigate('/register')} style={{ background: '#6B5BFF', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginTop: 8 }}>前往註冊/登入</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7faff', padding: 0 }}>
      {/* 左上角返回首頁按鈕 */}
      <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>← 返回首頁</button>
      <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '32px 24px', marginTop: 64, textAlign: 'center' }}>
        {user.photoURL ? (
  <img src={user.photoURL} alt="avatar" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ececff', background: '#eee', marginBottom: 18 }} />
) : (
  <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#6B5BFF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 'bold', border: '2px solid #ececff', marginBottom: 18 }}>
    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
  </div>
)}
        <div style={{ fontSize: 24, fontWeight: 900, color: '#6B5BFF', marginBottom: 8 }}>{user.displayName || user.email || '用戶'}</div>
        <div style={{ fontSize: 16, color: '#888', marginBottom: 18 }}>{user.email}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 24 }}>
          <button onClick={() => navigate('/CompleteProfile')} style={{ background: '#00CFFF', color: '#fff', fontWeight: 700, fontSize: 18, padding: '10px 32px', borderRadius: 10, boxShadow: '0 2px 8px #00CFFF33', border: 'none', cursor: 'pointer' }}>編輯個人資料</button>
          <button onClick={() => navigate('/upgrade')} style={{ background: '#6B5BFF', color: '#fff', fontWeight: 700, fontSize: 18, padding: '10px 32px', borderRadius: 10, boxShadow: '0 2px 8px #6B5BFF33', border: 'none', cursor: 'pointer' }}>升級訂閱</button>
        </div>
      </div>
    </div>
  );
} 