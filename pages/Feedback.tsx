import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getAuth } from 'firebase/auth';

const PLACEHOLDERS: { [key: string]: string[] } = {
  'zh-TW': [
    '💡 你希望多一個什麼功能？',
    '💬 有沒有讓你感動，或失望的使用時刻？',
    '🔧 你覺得哪裡還不夠順、不夠暖、不夠真？',
    '今天我想說...',
    '如果我能改一件事，我會...'
  ],
  'zh-CN': [
    '💡 你希望多一个什么功能？',
    '💬 有没有让你感动，或失望的使用时刻？',
    '🔧 你觉得哪里还不够顺、不够暖、不够真？',
    '今天我想说...',
    '如果我能改一件事，我会...'
  ],
  'en': [
    '💡 What feature do you wish for?',
    '💬 Any moment that moved or disappointed you?',
    '🔧 Where could we be smoother, warmer, or more real?',
    'Today I want to say...',
    'If I could change one thing, I would...'
  ],
  'ja': [
    '💡 どんな機能が欲しいですか？',
    '💬 感動した、またはがっかりした瞬間はありますか？',
    '🔧 どこがもっとスムーズで、温かく、リアルになれると思いますか？',
    '今日はこう言いたい...',
    'もし一つ変えられるなら、私は...'
  ],
  'ko': [
    '💡 어떤 기능이 더 있었으면 하나요?',
    '💬 감동하거나 실망했던 순간이 있나요?',
    '🔧 어디가 더 부드럽고, 따뜻하고, 진실해질 수 있을까요?',
    '오늘 나는 이렇게 말하고 싶어요...',
    '만약 한 가지를 바꿀 수 있다면, 나는...'
  ],
  'th': [
    '💡 คุณอยากได้ฟีเจอร์อะไรเพิ่ม?',
    '💬 มีช่วงเวลาไหนที่คุณประทับใจหรือผิดหวังไหม?',
    '🔧 ตรงไหนที่คุณคิดว่ายังไม่ลื่นไหล ไม่อบอุ่น หรือไม่จริงใจ?',
    'วันนี้ฉันอยากพูดว่า...',
    'ถ้าฉันเปลี่ยนอะไรได้สักอย่าง ฉันจะ...'
  ],
  'vi': [
    '💡 Bạn muốn có thêm tính năng gì?',
    '💬 Có khoảnh khắc nào khiến bạn cảm động hoặc thất vọng không?',
    '🔧 Bạn nghĩ chỗ nào chưa đủ mượt, chưa đủ ấm, chưa đủ thật?',
    'Hôm nay tôi muốn nói...',
    'Nếu tôi có thể thay đổi một điều, tôi sẽ...'
  ],
  'ms': [
    '💡 Apa ciri yang anda inginkan?',
    '💬 Ada detik yang menyentuh atau mengecewakan anda?',
    '🔧 Di mana yang anda rasa belum cukup lancar, hangat, atau benar?',
    'Hari ini saya ingin berkata...',
    'Jika saya boleh ubah satu perkara, saya akan...'
  ],
  'la': [
    '💡 Quam rem novam optas?',
    '💬 Estne momentum quod te movit aut destituit?',
    '🔧 Ubi putas nondum satis lenem, calidum, verum esse?',
    'Hodie dicere volo...',
    'Si unum mutare possem, id facerem...'
  ],
};

const TEXTS: { [key: string]: { title: string; submit: string; success: string; subtitle: string } } = {
  'zh-TW': {
    title: '💬 意見箱｜我們想聽你說',
    submit: '送出',
    success: '我們聽見你了，感謝你願意說出來。',
    subtitle: '你的建議，可能會成為下一版的靈魂！',
  },
  'zh-CN': {
    title: '💬 意见箱｜我们想听你说',
    submit: '提交',
    success: '我们听见你了，感谢你愿意说出来。',
    subtitle: '你的建议，可能会成为下一个版本的灵魂！',
  },
  'en': {
    title: '💬 Feedback｜We Want to Hear You',
    submit: 'Send',
    success: 'We hear you. Thank you for sharing your thoughts.',
    subtitle: 'Your suggestion could be the soul of our next update!',
  },
  'ja': {
    title: '💬 ご意見箱｜あなたの声を聞かせて',
    submit: '送信',
    success: 'あなたの声が届きました。伝えてくれてありがとう。',
    subtitle: 'あなたの提案が次のアップデートの魂になるかも！',
  },
  'ko': {
    title: '💬 의견함｜당신의 이야기를 듣고 싶어요',
    submit: '보내기',
    success: '당신의 목소리를 들었습니다. 말해줘서 고마워요.',
    subtitle: '당신의 제안이 다음 업데이트의 영혼이 될 수 있어요!',
  },
  'th': {
    title: '💬 กล่องความคิดเห็น｜เราอยากฟังคุณ',
    submit: 'ส่ง',
    success: 'เราได้รับข้อความของคุณแล้ว ขอบคุณที่แบ่งปันความคิดของคุณ',
    subtitle: 'ข้อเสนอของคุณอาจเป็นหัวใจของอัปเดตถัดไป!',
  },
  'vi': {
    title: '💬 Hộp góp ý｜Chúng tôi muốn lắng nghe bạn',
    submit: 'Gửi',
    success: 'Chúng tôi đã nghe bạn. Cảm ơn bạn đã chia sẻ.',
    subtitle: 'Góp ý của bạn có thể là linh hồn của bản cập nhật tiếp theo!',
  },
  'ms': {
    title: '💬 Kotak Maklum Balas｜Kami ingin mendengar anda',
    submit: 'Hantar',
    success: 'Kami telah mendengar anda. Terima kasih kerana berkongsi.',
    subtitle: 'Cadangan anda mungkin menjadi jiwa kemas kini kami yang seterusnya!',
  },
  'la': {
    title: '💬 Arca Consilii｜Te audire volumus',
    submit: 'Mitte',
    success: 'Te audivimus. Gratias quod communicasti.',
    subtitle: 'Consilium tuum animam versionis proximæ efficere potest!',
  },
};

const LANGS = [
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

export default function Feedback() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('zh-TW');
  const [phIdx, setPhIdx] = useState(0);

  const t = TEXTS[lang] || TEXTS['zh-TW'];

  useEffect(() => {
    const onStorage = () => setLang(localStorage.getItem('lang') || 'zh-TW');
    onStorage();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhIdx(prev => (prev + 1) % PLACEHOLDERS[lang].length);
    }, 3000);
    return () => clearInterval(interval);
  }, [lang]);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const user = auth.currentUser;
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: value.trim(),
          userEmail: user?.email || '',
          userNickname: user?.displayName || '匿名',
          userLang: lang
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSent(true);
        setValue('');
      } else {
        setError(data.error || '提交失敗，請稍後再試');
      }
    } catch (err) {
      setError('網路錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #b7cfff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '48px 0 120px 0' }}>
      <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>
        返回
      </button>
      <div style={{ maxWidth: 520, background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #6B5BFF22', padding: 40, marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#6B5BFF', marginBottom: 8 }}>{t.title}</h1>
        <div style={{ fontSize: 18, color: '#614425', fontWeight: 700, marginBottom: 18, textAlign: 'center' }}>{t.subtitle}</div>
        {!sent ? (
          <>
            <textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={PLACEHOLDERS[lang][phIdx]}
              style={{ width: '100%', minHeight: 160, fontSize: 20, border: 'none', outline: 'none', resize: 'vertical', background: '#f7f8fa', borderRadius: 12, padding: 18, marginBottom: 18, boxShadow: '0 2px 8px #6B5BFF11' }}
            />
            {error && (
              <div style={{ color: '#ff4d4f', fontSize: 14, marginBottom: 12, textAlign: 'center' }}>
                {error}
              </div>
            )}
            <button
              onClick={handleSubmit}
              style={{ 
                background: isSubmitting ? '#ccc' : '#6B5BFF', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: '12px 32px', 
                fontWeight: 900, 
                fontSize: 20, 
                cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                boxShadow: '0 2px 8px #6B5BFF33', 
                marginTop: 8 
              }}
              disabled={!value.trim() || isSubmitting}
            >
              {isSubmitting ? '送出中...' : t.submit}
            </button>
          </>
        ) : (
          <div style={{ fontSize: 22, color: '#614425', fontWeight: 900, marginTop: 32, textAlign: 'center', minHeight: 80 }}>{t.success}</div>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 