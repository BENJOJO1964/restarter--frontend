import React, { useState } from 'react';

const LANGS = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
];
const TEXT: Record<string, { title: string; inputSentence: string; or: string; selectMood: string; selectColor: string; generate: string; preview: string; stylePrompt: string; download: string; share: string; moodLabel: string; sentenceLabel: string; loading: string; result: string; }> = {
  'zh-TW': {
    title: '情緒圖像實驗室',
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
  },
  'zh-CN': {
    title: '情绪图像实验室',
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
  },
  'en': {
    title: 'Emotion Visual Lab',
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
  },
  'ja': {
    title: '感情ビジュアルラボ',
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
  },
};
const MOODS: Record<string, string[]> = {
  'zh-TW': ['孤獨','療癒','焦慮','希望','平靜','快樂','悲傷','勇氣'],
  'zh-CN': ['孤独','疗愈','焦虑','希望','平静','快乐','悲伤','勇气'],
  'en': ['Loneliness','Healing','Anxiety','Hope','Calm','Joy','Sadness','Courage'],
  'ja': ['孤独','癒し','不安','希望','平穏','喜び','悲しみ','勇気'],
};
const COLORS: Record<string, string[]> = {
  'zh-TW': ['藍','紫','粉','綠','黃','灰','紅'],
  'zh-CN': ['蓝','紫','粉','绿','黄','灰','红'],
  'en': ['Blue','Purple','Pink','Green','Yellow','Gray','Red'],
  'ja': ['青','紫','ピンク','緑','黄','グレー','赤'],
};

export default function EmotionVisualLab() {
  const [lang, setLang] = useState<string>('zh-TW');
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
        <button className="topbar-btn" onClick={()=>window.location.href='/'} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s', marginRight:8}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{lang==='zh-TW'?'← 返回首頁':lang==='zh-CN'?'← 返回首页':lang==='ja'?'← ホームへ戻る':'← Home'}</button>
        {isSubPage && <button className="topbar-btn" onClick={()=>window.history.back()} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s', marginLeft:8}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{lang==='zh-TW'?'↩ 返回上一頁':lang==='zh-CN'?'↩ 返回上一页':lang==='ja'?'↩ 前のページへ':'↩ Back'}</button>}
      </div>
      <div style={{position:'absolute',top:0,right:0,zIndex:100,display:'flex',alignItems:'center',padding:'18px 32px 0 32px',boxSizing:'border-box',background:'transparent',gap:12}}>
        <button className="topbar-btn" onClick={()=>{localStorage.clear();window.location.href='/'}} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s'}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{lang==='zh-TW'?'登出':lang==='zh-CN'?'登出':lang==='ja'?'ログアウト':'Logout'}</button>
        <select className="topbar-select" value={lang} onChange={e => setLang(e.target.value)} style={{padding:'6px 14px',borderRadius:8,fontWeight:600,border:'1.5px solid #6B5BFF',color:'#6B5BFF',background:'#fff',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s'}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>
          {LANGS.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
      <div style={{ maxWidth: 540, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px #0002' }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, display:'flex',alignItems:'center',gap:8, color:'#6B5BFF', textShadow:'0 2px 12px #6B5BFF88, 0 4px 24px #0008', letterSpacing:1 }}>🎨 {t.title}</h2>
        <div style={{ fontSize: 18, color: '#614425', fontWeight: 700, marginBottom: 18, display:'flex',alignItems:'center',gap:8 }}>用AI生成你的情緒藝術圖像 🎨</div>
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
    </div>
  );
} 