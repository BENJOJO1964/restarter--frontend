import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../src/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { COUNTRY_OPTIONS, INTEREST_OPTIONS, EVENT_TYPE_OPTIONS, ageRanges } from './RegisterPage';

// 多語言提示與返回按鈕
const PROFILE_NOTICE = {
  'zh-TW': { msg: '請先補齊個人資料', back: '返回' },
  'zh-CN': { msg: '请先补齐个人资料', back: '返回' },
  'en': { msg: 'Please complete your profile first', back: 'Back' },
  'ja': { msg: 'まずプロフィールを完成させてください', back: '戻る' },
  'ko': { msg: '먼저 프로필을 완성해 주세요', back: '뒤로' },
  'th': { msg: 'กรุณากรอกข้อมูลส่วนตัวให้ครบก่อน', back: 'กลับ' },
  'vi': { msg: 'Vui lòng hoàn thiện hồ sơ cá nhân trước', back: 'Quay lại' },
  'ms': { msg: 'Sila lengkapkan profil anda terlebih dahulu', back: 'Kembali' },
  'la': { msg: 'Quaeso prius profile tuum comple', back: 'Revertere' },
};

const BACK_TEXT = {
  'zh-TW': '返回',
  'zh-CN': '返回',
  'en': 'Back',
  'ja': '戻る',
  'ko': '뒤로',
  'th': 'กลับ',
  'vi': 'Quay lại',
  'ms': 'Kembali',
  'la': 'Revertere',
};

function ProfileRequiredNotice() {
  const lang = localStorage.getItem('lang') || 'zh-TW';
  const navigate = useNavigate();
  const t = PROFILE_NOTICE[lang as keyof typeof PROFILE_NOTICE] || PROFILE_NOTICE['zh-TW'];
  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={() => navigate('/register', { replace: true })} style={{ position: 'absolute', top: 32, left: 36, zIndex: 10, backgroundColor: '#374151', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: 16 }}>
        &larr; {t.back}
      </button>
      <div style={{ fontSize: 22, color: '#374151', fontWeight: 600, textAlign: 'center', marginTop: 80 }}>{t.msg}</div>
    </div>
  );
}

export { ProfileRequiredNotice };

export default function CompleteProfile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const lang = (localStorage.getItem('lang') || 'zh-TW') as keyof typeof BACK_TEXT;

  useEffect(() => {
    if (!user) {
      navigate('/register', { replace: true });
    }
  }, [user, navigate]);

  const [nickname, setNickname] = useState(user?.displayName || '');
  const [email] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || '');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [age, setAge] = useState('');
  const [interest, setInterest] = useState('');
  const [eventType, setEventType] = useState('');
  const [improvement, setImprovement] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 攔截關閉、跳離、返回，全部登出並導回註冊頁
  useEffect(() => {
    let handled = false;
    const safeSignOut = async () => {
      if (handled) return;
      handled = true;
      await signOut(auth);
      navigate('/register?needProfile=1', { replace: true });
    };
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      safeSignOut();
    };
    const handlePopState = (e?: PopStateEvent) => {
      // 強制阻止返回首頁或其他頁面
      e?.preventDefault?.();
      safeSignOut();
      // 立即 pushState 回補資料頁，避免瀏覽器繼續往前
      window.history.pushState(null, '', '/CompleteProfile');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    // 進入頁面時 pushState 一次，確保 history stack 正確
    window.history.pushState(null, '', '/CompleteProfile');
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [auth, navigate]);

  // 若有 X 關閉鈕，請在 onClick={() => { signOut(auth); navigate('/register'); }}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nickname || !gender || !country || !age || !interest || !eventType || !improvement) {
      setError('請填寫所有欄位');
      return;
    }
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user!.uid), {
        nickname,
        email,
        avatarUrl,
        gender,
        country,
        region,
        age,
        interest,
        eventType,
        improvement,
        completed: true,
        updatedAt: new Date()
      });
      setLoading(false);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // 進入本頁時如 Firestore 已有 completed=true 也強制登出導回 /register
  useEffect(() => {
    const checkCompleted = async () => {
      if (user?.uid) {
        const userDoc = await import('firebase/firestore').then(firestore => firestore.getDoc(firestore.doc(db, 'users', user.uid)));
        if (userDoc.exists() && userDoc.data().completed) {
          await signOut(auth);
          navigate('/register', { replace: true });
        }
      }
    };
    checkCompleted();
  }, [user, auth, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7fa', position: 'relative' }}>
      <button
        onClick={() => navigate('/register', { replace: true })}
        style={{ position: 'absolute', top: 32, left: 36, zIndex: 10, backgroundColor: '#374151', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: 16 }}>
        &larr; {BACK_TEXT[lang] || '返回'}
      </button>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px #0001', width: 360, position: 'relative' }}>
        {/* X 關閉鈕 */}
        <button type="button" onClick={async () => { await signOut(auth); navigate('/register?needProfile=1', { replace: true }); }} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>×</button>
        <h2 style={{ textAlign: 'center', marginBottom: 16 }}>補充個人資料</h2>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <div style={{ marginBottom: 12 }}>
          <label>暱稱：</label>
          <input value={nickname} onChange={e => setNickname(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>電子郵件：</label>
          <input value={email} disabled style={{ width: '100%', background: '#eee' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>頭像網址：</label>
          <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>性別：</label>
          <select value={gender} onChange={e => setGender(e.target.value)} required style={{ width: '100%' }}>
            <option value="">請選擇</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>國家/地區：</label>
          <select value={country} onChange={e => setCountry(e.target.value)} required style={{ width: '100%' }}>
            <option value="">請選擇</option>
            {(COUNTRY_OPTIONS['zh-TW'] || []).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>城市：</label>
          <input value={region} onChange={e => setRegion(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>年齡：</label>
          <select value={age} onChange={e => setAge(e.target.value)} required style={{ width: '100%' }}>
            <option value="">請選擇</option>
            {ageRanges.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>興趣：</label>
          <select value={interest} onChange={e => setInterest(e.target.value)} required style={{ width: '100%' }}>
            <option value="">請選擇</option>
            {(INTEREST_OPTIONS['zh-TW'] || []).map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>事件類別：</label>
          <select value={eventType} onChange={e => setEventType(e.target.value)} required style={{ width: '100%' }}>
            <option value="">請選擇</option>
            {(EVENT_TYPE_OPTIONS['zh-TW'] || []).map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>想改善什麼：</label>
          <input value={improvement} onChange={e => setImprovement(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, fontWeight: 700, fontSize: 18, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8 }}>
          {loading ? '儲存中...' : '完成'}
        </button>
      </form>
    </div>
  );
} 