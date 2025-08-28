import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import Footer from '../components/Footer';
type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'vi' | 'th' | 'la' | 'ms';

const LANGS: { code: LanguageCode; label: string }[] = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'la', label: 'Latina' },
  { code: 'ms', label: 'Bahasa Melayu' },
];
const TEXT: Record<string, { title: string; subtitle: string; inputSentence: string; or: string; selectMood: string; selectColor: string; generate: string; preview: string; stylePrompt: string; download: string; share: string; moodLabel: string; sentenceLabel: string; loading: string; result: string; backToHome: string; backToPrevious: string; logout: string; }> = {
  'zh-TW': {
    title: '情緒圖像實驗室',
    subtitle: '用AI生成你的情緒藝術圖像 🎨',
    inputSentence: '輸入一句話（描述你的情緒）',
    or: '或',
    selectMood: '選擇心情類型',
    selectColor: '選擇色調',
    generate: '生成圖像',
    preview: '圖像預覽',
    stylePrompt: '圖像風格提示詞',
    download: '下載 PNG',
    share: '分享',
    moodLabel: '心情標籤',
    sentenceLabel: '原始語句',
    loading: '生成中，請稍候...',
    result: '生成結果',
    backToHome: '← 返回首頁',
    backToPrevious: '↩ 返回上一頁',
    logout: '登出',
  },
  'zh-CN': {
    title: '情绪图像实验室',
    subtitle: '用AI生成你的情绪艺术图像 🎨',
    inputSentence: '输入一句话（描述你的情绪）',
    or: '或',
    selectMood: '选择心情类型',
    selectColor: '选择色调',
    generate: '生成图像',
    preview: '图像预览',
    stylePrompt: '图像风格提示词',
    download: '下载 PNG',
    share: '分享',
    moodLabel: '心情标签',
    sentenceLabel: '原始语句',
    loading: '生成中，请稍候...',
    result: '生成结果',
    backToHome: '← 返回首页',
    backToPrevious: '↩ 返回上一页',
    logout: '登出',
  },
  'en': {
    title: 'Emotion Visual Lab',
    subtitle: 'Generate your emotion art with AI 🎨',
    inputSentence: 'Enter a sentence (describe your emotion)',
    or: 'or',
    selectMood: 'Select mood type',
    selectColor: 'Select tone color',
    generate: 'Generate Image',
    preview: 'Image Preview',
    stylePrompt: 'Style Prompt',
    download: 'Download PNG',
    share: 'Share',
    moodLabel: 'Mood Label',
    sentenceLabel: 'Original Sentence',
    loading: 'Generating, please wait...',
    result: 'Result',
    backToHome: '← Home',
    backToPrevious: '↩ Back',
    logout: 'Logout',
  },
  'ja': {
    title: '感情ビジュアルラボ',
    subtitle: 'AIであなたの感情アートを生成 🎨',
    inputSentence: '一言入力（あなたの感情を表現）',
    or: 'または',
    selectMood: '感情タイプを選択',
    selectColor: '色調を選択',
    generate: '画像生成',
    preview: '画像プレビュー',
    stylePrompt: 'スタイルプロンプト',
    download: 'PNGをダウンロード',
    share: 'シェア',
    moodLabel: '感情ラベル',
    sentenceLabel: '元の文章',
    loading: '生成中、お待ちください...',
    result: '生成結果',
    backToHome: '← ホームへ戻る',
    backToPrevious: '↩ 前のページへ',
    logout: 'ログアウト',
  },
  'ko': {
    title: '감정 비주얼 랩',
    subtitle: 'AI로 당신의 감정 예술을 생성하세요 🎨',
    inputSentence: '문장 입력 (당신의 감정을 묘사)',
    or: '또는',
    selectMood: '감정 유형 선택',
    selectColor: '색조 선택',
    generate: '이미지 생성',
    preview: '이미지 미리보기',
    stylePrompt: '스타일 프롬프트',
    download: 'PNG 다운로드',
    share: '공유',
    moodLabel: '감정 라벨',
    sentenceLabel: '원본 문장',
    loading: '생성 중, 잠시만 기다려 주세요...',
    result: '생성 결과',
    backToHome: '← 홈으로 돌아가기',
    backToPrevious: '↩ 이전 페이지로',
    logout: '로그아웃',
  },
  'vi': {
    title: 'Phòng thí nghiệm hình ảnh cảm xúc',
    subtitle: 'Tạo nghệ thuật cảm xúc của bạn với AI 🎨',
    inputSentence: 'Nhập một câu (mô tả cảm xúc của bạn)',
    or: 'hoặc',
    selectMood: 'Chọn loại tâm trạng',
    selectColor: 'Chọn tông màu',
    generate: 'Tạo hình ảnh',
    preview: 'Xem trước hình ảnh',
    stylePrompt: 'Gợi ý phong cách',
    download: 'Tải xuống PNG',
    share: 'Chia sẻ',
    moodLabel: 'Nhãn tâm trạng',
    sentenceLabel: 'Câu gốc',
    loading: 'Đang tạo, vui lòng đợi...',
    result: 'Kết quả',
    backToHome: '← Về trang chủ',
    backToPrevious: '↩ Quay lại',
    logout: 'Đăng xuất',
  },
  'th': {
    title: 'ห้องทดลองภาพอารมณ์',
    subtitle: 'สร้างงานศิลปะอารมณ์ของคุณด้วย AI 🎨',
    inputSentence: 'ป้อนประโยค (อธิบายอารมณ์ของคุณ)',
    or: 'หรือ',
    selectMood: 'เลือกประเภทอารมณ์',
    selectColor: 'เลือกโทนสี',
    generate: 'สร้างภาพ',
    preview: 'ตัวอย่างภาพ',
    stylePrompt: 'พรอมต์สไตล์',
    download: 'ดาวน์โหลด PNG',
    share: 'แชร์',
    moodLabel: 'ป้ายกำกับอารมณ์',
    sentenceLabel: 'ประโยคดั้งเดิม',
    loading: 'กำลังสร้าง, กรุณารอสักครู่...',
    result: 'ผลลัพธ์',
    backToHome: '← กลับหน้าหลัก',
    backToPrevious: '↩ กลับ',
    logout: 'ออกจากระบบ',
  },
  'la': {
    title: 'Laboratorium Visuale Emotionis',
    subtitle: 'Genera artem tuam emotionis cum AI 🎨',
    inputSentence: 'Sententiam inscribe (describe emotionem tuam)',
    or: 'vel',
    selectMood: 'Elige genus modi',
    selectColor: 'Elige colorem toni',
    generate: 'Genera imaginem',
    preview: 'Praevisum imaginis',
    stylePrompt: 'Stylus promptus',
    download: 'Depone PNG',
    share: 'Communica',
    moodLabel: 'Pittacium modi',
    sentenceLabel: 'Sententia originalis',
    loading: 'Generans, quaeso exspecta...',
    result: 'Resultatum',
    backToHome: '← Ad domum',
    backToPrevious: '↩ Retro',
    logout: 'Exire',
  },
  'ms': {
    title: 'Makmal Visual Emosi',
    subtitle: 'Hasilkan seni emosi anda dengan AI 🎨',
    inputSentence: 'Masukkan ayat (gambarkan emosi anda)',
    or: 'atau',
    selectMood: 'Pilih jenis mood',
    selectColor: 'Pilih warna nada',
    generate: 'Hasilkan Imej',
    preview: 'Pratonton Imej',
    stylePrompt: 'Prompt Gaya',
    download: 'Muat turun PNG',
    share: 'Kongsi',
    moodLabel: 'Label Mood',
    sentenceLabel: 'Ayat Asal',
    loading: 'Menjana, sila tunggu...',
    result: 'Hasil',
    backToHome: '← Kembali ke Laman Utama',
    backToPrevious: '↩ Kembali',
    logout: 'Log keluar',
  },
};
const MOODS: Record<string, string[]> = {
  'zh-TW': ['孤獨','療癒','焦慮','希望','平靜','快樂','悲傷','勇氣'],
  'zh-CN': ['孤独','疗愈','焦虑','希望','平静','快乐','悲伤','勇气'],
  'en': ['Loneliness','Healing','Anxiety','Hope','Calm','Joy','Sadness','Courage'],
  'ja': ['孤独','癒し','不安','希望','平穏','喜び','悲しみ','勇気'],
  'ko': ['외로움','치유','불안','희망','평온','기쁨','슬픔','용기'],
  'vi': ['Cô đơn','Chữa lành','Lo lắng','Hy vọng','Bình tĩnh','Niềm vui','Buồn bã','Dũng cảm'],
  'th': ['ความเหงา','การเยียวยา','ความวิตกกังวล','ความหวัง','ความสงบ','ความสุข','ความโศกเศร้า','ความกล้าหาญ'],
  'la': ['Solitudo','Sanatio','Anxietas','Spes','Calma','Gaudium','Tristitia','Fortitudo'],
  'ms': ['Kesunyian','Penyembuhan','Kebimbangan','Harapan','Ketenangan','Kegembiraan','Kesedihan','Keberanian'],
};
const COLORS: Record<string, string[]> = {
  'zh-TW': ['藍','紫','粉','綠','黃','灰','紅'],
  'zh-CN': ['蓝','紫','粉','绿','黄','灰','红'],
  'en': ['Blue','Purple','Pink','Green','Yellow','Gray','Red'],
  'ja': ['青','紫','ピンク','緑','黄','グレー','赤'],
  'ko': ['파랑','보라','분홍','초록','노랑','회색','빨강'],
  'vi': ['Xanh dương','Tím','Hồng','Xanh lá','Vàng','Xám','Đỏ'],
  'th': ['น้ำเงิน','ม่วง','ชมพู','เขียว','เหลือง','เทา','แดง'],
  'la': ['Caeruleus','Purpureus','Roseus','Viridis','Flavus','Canus','Ruber'],
  'ms': ['Biru','Ungu','Merah jambu','Hijau','Kuning','Kelabu','Merah'],
};

export default function EmotionVisualLab() {
  const { lang, setLang } = useLanguage();
  const t = TEXT[lang];
  const [input, setInput] = useState('');
  const [mood, setMood] = useState('');
  const [color, setColor] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [stylePrompt, setStylePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultType, setResultType] = useState<'sentence'|'mood'>('sentence');
  const [isSubPage, setIsSubPage] = useState(false);

  // 假的生成函數，實際應串接 API
  const handleGenerate = async () => {
    setLoading(true);
    setTimeout(() => {
      setImgUrl('https://placehold.co/800x800?text=Emotion+Art');
      setStylePrompt(resultType==='sentence' ? 'A soft abstract painting symbolizing deep emotional loneliness in blue tones, cinematic lighting' : 'A dreamy avatar with foggy eyes, symbolizing quiet hope, illustrated in a minimal watercolor style');
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="modern-bg" style={{ minHeight: '100vh', background: `url('/plains.png') center center / cover no-repeat` }}>
      <div style={{position:'absolute',top:0,left:0,zIndex:100,display:'flex',alignItems:'center',padding:'18px 32px 0 32px',boxSizing:'border-box',background:'transparent'}}>
        <button className="topbar-btn" onClick={()=>window.location.href='/'} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s', marginRight:8}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{t.backToHome}</button>
        {isSubPage && <button className="topbar-btn" onClick={()=>window.history.back()} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s', marginLeft:8}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{t.backToPrevious}</button>}
      </div>
      <div style={{position:'absolute',top:0,right:0,zIndex:100,display:'flex',alignItems:'center',padding:'18px 32px 0 32px',boxSizing:'border-box',background:'transparent',gap:12}}>
        <button className="topbar-btn" onClick={()=>{localStorage.clear();window.location.href='/'}} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s'}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{t.logout}</button>
        <LanguageSelector />
      </div>
      <div style={{ maxWidth: 540, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px #0002' }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, display:'flex',alignItems:'center',gap:8, color:'#6B5BFF', textShadow:'0 2px 12px #6B5BFF88, 0 4px 24px #0008', letterSpacing:1 }}>🎨 {t.title}</h2>
        <div style={{ fontSize: 18, color: '#614425', fontWeight: 700, marginBottom: 18, display:'flex',alignItems:'center',gap:8 }}>{t.subtitle}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input type="text" value={input} onChange={e=>{setInput(e.target.value); setResultType('sentence');}} placeholder={t.inputSentence} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }} />
          <div style={{ textAlign: 'center', color: '#aaa', fontWeight: 700 }}>{t.or}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <select value={mood} onChange={e=>{setMood(e.target.value); setResultType('mood');}} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}>
              <option value="">{t.selectMood}</option>
              {MOODS[lang].map((m: string)=>(<option key={m} value={m}>{m}</option>))}
            </select>
            <select value={color} onChange={e=>{setColor(e.target.value); setResultType('mood');}} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}>
              <option value="">{t.selectColor}</option>
              {COLORS[lang].map((c: string)=>(<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <button onClick={handleGenerate} className="main-action-btn">{t.generate}</button>
        </div>
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 900, fontSize: 22, color: '#6B4F27', marginBottom: 12 }}>{t.preview}</h3>
          <div style={{ width: 340, height: 340, background: '#eee', borderRadius: 18, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
            {loading ? (
              <div style={{ color: '#6B5BFF', fontWeight: 700, fontSize: 22 }}>{t.loading}</div>
            ) : imgUrl ? (
              <img src={imgUrl} alt="emotion art" style={{ width: 340, height: 340, objectFit: 'cover' }} />
            ) : (
              <div style={{ color: '#bbb', fontSize: 22 }}>{t.preview}</div>
            )}
          </div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><b>{resultType==='sentence'?t.sentenceLabel:t.moodLabel}：</b>{resultType==='sentence'?input:(mood+' / '+color)}</div>
            <div><b>{t.stylePrompt}：</b>{stylePrompt}</div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 18 }}>
            <button className="download-btn">{t.download}</button>
            <button className="share-btn">{t.share}</button>
          </div>
        </div>
      </div>
      <style>{`
        .topbar-btn {
          font-weight: 700;
          font-size: 18px;
          padding: 6px 16px;
          border-radius: 8px;
          border: 1.5px solid #6B5BFF;
          background: #fff;
          color: #6B5BFF;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, border 0.18s;
        }
        .topbar-btn:hover {
          background: #6B5BFF;
          color: #fff;
        }
        .topbar-select {
          padding: 6px 14px;
          border-radius: 8px;
          font-weight: 600;
          border: 1.5px solid #6B5BFF;
          color: #6B5BFF;
          background: #fff;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, border 0.18s;
          font-size: 18px;
          outline: none;
          appearance: none;
        }
        .topbar-select:hover, .topbar-select:focus {
          background: #6B5BFF;
          color: #fff;
        }
        .main-action-btn {
          width: 100%;
          padding: 14px;
          background: #6B5BFF;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 900;
          font-size: 18px;
          margin-top: 8px;
          letter-spacing: 1px;
          box-shadow: 0 2px 12px #6B5BFF33;
          transition: background 0.18s, color 0.18s;
          cursor: pointer;
        }
        .main-action-btn:hover {
          background: #4a3bbf;
          color: #fff;
        }
        .download-btn {
          flex: 1;
          padding: 12px;
          background: #23c6e6;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 18px;
          transition: background 0.18s, color 0.18s;
          cursor: pointer;
        }
        .download-btn:hover {
          background: #1ba3c2;
          color: #fff;
        }
        .share-btn {
          flex: 1;
          padding: 12px;
          background: #6B5BFF;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 18px;
          transition: background 0.18s, color 0.18s;
          cursor: pointer;
        }
        .share-btn:hover {
          background: #4a3bbf;
          color: #fff;
        }
      `}</style>
      
      {/* Footer */}
      {/* Footer 5個按鈕 - 一行排列 */}
      <div style={{ 
        width: '100%', 
        margin: '0 auto', 
        marginTop: 24,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: '16px',
        boxShadow: '0 2px 12px #6B5BFF22'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          <span onClick={() => navigate("/privacy-policy")} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>隱私權政策</span>
          <span onClick={() => navigate("/terms")} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>條款/聲明</span>
          <span onClick={() => navigate("/data-deletion")} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>資料刪除說明</span>
          <span onClick={() => navigate("/about")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>🧬 Restarter™｜我們是誰</span>
          <span onClick={() => navigate("/feedback")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>💬 意見箱｜我們想聽你說</span>
        </div>
      </div>
    </div>
  );
} 