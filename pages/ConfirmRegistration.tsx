import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiUrl } from '../src/config/api';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../src/firebaseConfig';
import { db } from '../src/firebaseConfig';
import { storage } from '../src/firebaseConfig';
import { useLanguage } from '../contexts/LanguageContext';

const auth = getAuth(app);

const TEXT = {
  'zh-TW': {
    title: '確認註冊',
    confirming: '正在確認註冊...',
    success: '註冊成功！',
    error: '確認失敗',
    invalidToken: '確認連結無效或已過期',
    networkError: '網路連線失敗，請稍後再試',
    redirecting: '正在跳轉到首頁...'
  },
  'zh-CN': {
    title: '确认注册',
    confirming: '正在确认注册...',
    success: '注册成功！',
    error: '确认失败',
    invalidToken: '确认链接无效或已过期',
    networkError: '网络连接失败，请稍后再试',
    redirecting: '正在跳转到首页...'
  },
  'en': {
    title: 'Confirm Registration',
    confirming: 'Confirming registration...',
    success: 'Registration successful!',
    error: 'Confirmation failed',
    invalidToken: 'Confirmation link is invalid or expired',
    networkError: 'Network connection failed, please try again later',
    redirecting: 'Redirecting to homepage...'
  }
};

export default function ConfirmRegistration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lang } = useLanguage();
  const t = TEXT[lang as keyof typeof TEXT] || TEXT['zh-TW'];

  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage(t.invalidToken);
      return;
    }

    const confirmRegistration = async () => {
      try {
        // 調用後端 API 確認註冊
        const response = await fetch(getApiUrl('/email-verification/confirm-registration'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (data.success) {
          // 使用返回的註冊資料完成註冊
          const { email, registrationData } = data;
          
          // 創建 Firebase 用戶
          const userCredential = await createUserWithEmailAndPassword(auth, email, registrationData.password);
          
          // 設置用戶資料
          await updateProfile(userCredential.user, { 
            displayName: registrationData.nickname 
          });

          // 寫入 Firestore profiles collection
          await setDoc(doc(db, 'profiles', userCredential.user.uid), {
            nickname: registrationData.nickname,
            email,
            avatar: '', // 頭像需要另外處理
            gender: registrationData.gender,
            country: registrationData.country,
            region: registrationData.region,
            age: registrationData.age,
            interest: registrationData.interest,
            eventType: registrationData.eventType,
            improvement: registrationData.improvement,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          setStatus('success');
          setMessage(t.success);
          
          // 3秒後跳轉到首頁
          setTimeout(() => {
            navigate('/');
          }, 3000);

        } else {
          setStatus('error');
          setMessage(data.error || t.error);
        }

      } catch (err: any) {
        console.error('確認註冊錯誤:', err);
        setStatus('error');
        
        if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError')) {
          setMessage(t.networkError);
        } else {
          setMessage(err?.message || t.error);
        }
      }
    };

    confirmRegistration();
  }, [searchParams, navigate, t]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
      }}>
        <div style={{ marginBottom: '24px' }}>
          {status === 'confirming' && (
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          )}
          {status === 'success' && (
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          )}
          {status === 'error' && (
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          )}
          
          <h1 style={{
            color: status === 'success' ? '#10b981' : status === 'error' ? '#ef4444' : '#6B5BFF',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            {status === 'confirming' && t.confirming}
            {status === 'success' && t.success}
            {status === 'error' && t.error}
          </h1>
          
          <p style={{
            color: '#666',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
        </div>

        {status === 'success' && (
          <div style={{
            background: '#f0f9ff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #0ea5e9',
            marginTop: '16px'
          }}>
            <p style={{ color: '#0c4a6e', fontSize: '14px' }}>
              {t.redirecting}
            </p>
          </div>
        )}

        {status === 'error' && (
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(90deg, #6e8efb, #a777e3)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            返回註冊頁面
          </button>
        )}
      </div>
    </div>
  );
} 