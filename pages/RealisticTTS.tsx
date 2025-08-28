import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'vi' | 'th' | 'la' | 'ms';

const LANGS: { code: LanguageCode; label: string }[] = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'la', 'label': 'Latina' },
  { code: 'ms', 'label': 'Bahasa Melayu' },
];

const TEXTS: Record<LanguageCode, any> = {
  'zh-TW': {
    title: '擬真語音輸出',
    comingSoon: '體驗即將開放，敬請期待！',
    playing: '播放中...',
    playAudio: '播放語音',
  },
  'zh-CN': {
    title: '拟真语音输出',
    comingSoon: '体验即将开放，敬请期待！',
    playing: '播放中...',
    playAudio: '播放语音',
  },
  'en': {
    title: 'Realistic TTS',
    comingSoon: 'Experience coming soon, stay tuned!',
    playing: 'Playing...',
    playAudio: 'Play Audio',
  },
  'ja': {
    title: 'リアルな音声出力',
    comingSoon: '体験は近日公開予定です、お楽しみに！',
    playing: '再生中...',
    playAudio: '音声を再生',
  },
  'ko': {
    title: '사실적인 음성 출력',
    comingSoon: '체험이 곧 시작될 예정이니 기대해주세요!',
    playing: '재생 중...',
    playAudio: '오디오 재생',
  },
  'vi': {
    title: 'Đầu ra giọng nói thực tế',
    comingSoon: 'Trải nghiệm sắp ra mắt, hãy theo dõi!',
    playing: 'Đang phát...',
    playAudio: 'Phát âm thanh',
  },
  'th': {
    title: 'การส่งออกเสียงที่สมจริง',
    comingSoon: 'ประสบการณ์กำลังจะมาเร็วๆ นี้ โปรดติดตาม!',
    playing: 'กำลังเล่น...',
    playAudio: 'เล่นเสียง',
  },
  'la': {
    title: 'Sermo Verus Output',
    comingSoon: 'Experientia mox praesto erit, mane exspectans!',
    playing: 'Ludens...',
    playAudio: 'Sonum redde',
  },
  'ms': {
    title: 'Output Suara Realistik',
    comingSoon: 'Pengalaman akan datang, nantikan!',
    playing: 'Sedang dimainkan...',
    playAudio: 'Mainkan Audio',
  },
};

export default function RealisticTTS() {
  const [playing, setPlaying] = React.useState(false);
  const [lang, setLang] = React.useState<LanguageCode>('zh-TW');
  const t = TEXTS[lang] || TEXTS['zh-TW'];

  React.useEffect(() => {
    const savedLang = localStorage.getItem('lang') as LanguageCode;
    if (savedLang && LANGS.find(l => l.code === savedLang)) {
      setLang(savedLang);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const handlePlay = () => {
    setPlaying(true);
    // Simulate playing audio
    setTimeout(() => setPlaying(false), 2000);
  };

  return (
    <div className="modern-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 24, right: 36, zIndex: 100 }}>
        <LanguageSelector />
      </div>
      <div className="modern-container" style={{ maxWidth: 480, width: '100%', margin: '0 auto', textAlign: 'center', padding: 48, borderRadius: 18, background: 'rgba(60,40,20,0.18)', boxShadow: '0 4px 24px #0002' }}>
        <h2 style={{ color: '#6B5BFF', fontWeight: 900, fontSize: 28, marginBottom: 24 }}>{t.title}</h2>
        <div style={{ color: '#6B4F27', fontSize: 22, fontWeight: 700 }}>{t.comingSoon}</div>
        <button onClick={handlePlay} style={{ padding: '6px 18px', borderRadius: 8, background: '#6c63ff', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, marginTop: 8 }} disabled={playing}>
          {playing ? t.playing : t.playAudio}
        </button>
      </div>
    </div>
  );
} 