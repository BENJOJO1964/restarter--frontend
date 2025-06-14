import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VirtualAvatar from '../components/VirtualAvatar';
import { generateResponse } from '../lib/ai/generateResponse';
import { speak } from '../lib/ai/speak';
import { generateTalkingFace } from '../lib/ai/talkingFace';
import { getAuth, signOut } from 'firebase/auth';

interface ChatMsg {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  status?: 'streaming' | 'done';
  audio?: string;
}

export default function ChatCompanion() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [aiStreaming, setAIStreaming] = useState(false);
  const aiTimeout = useRef<NodeJS.Timeout|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [recording, setRecording] = useState(false);
  const [aiAvatar, setAiAvatar] = useState<string>('');
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);
  const [avatarVideo, setAvatarVideo] = useState<string>('');
  const [avatarAudio, setAvatarAudio] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const AVATAR_FILES = [
    'Annie.png', 'berlex.png', 'Bray.png', 'Cayly.png', 'Derxl.png', 'El.png',
    'Fenny.png', 'Gily.png', 'Henny.png', 'Jesy.png', 'Karl.png', 'michy.png',
    'Mily.png', 'Neysher.png', 'sandy.png', 'Sherl.png', 'Shu.png', 'Shyly.png'
  ];
  const AVATAR_LIST = AVATAR_FILES.map(f => `/avatars/${f}`);
  const AVATAR_NAMES = AVATAR_FILES.map(f => f.replace(/\.png$/i, ''));
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'zh-TW');
  const AVATAR_TITLE = {
    'zh-TW': '選我做你的朋友',
    'zh-CN': '选我做你的朋友',
    'en': 'Pick Me as Your Friend',
    'ja': '友達に選んでね',
  };
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  let recognition: any = null;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = lang === 'zh-TW' ? 'zh-TW' : lang === 'zh-CN' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }
  const getNickname = () => {
    const user = getAuth().currentUser;
    return (user && user.displayName) || localStorage.getItem('nickname') || '朋友';
  };
  const [nickname, setNickname] = useState(getNickname());
  const [lastUid, setLastUid] = useState(() => localStorage.getItem('lastUid'));
  const [firstAvatarSelected, setFirstAvatarSelected] = useState(() => {
    return !localStorage.getItem('avatarWelcomed');
  });
  const [isFirstChat, setIsFirstChat] = useState(() => !localStorage.getItem('aiAvatar'));
  useEffect(() => {
    const saved = localStorage.getItem('aiAvatar');
    if (saved) {
      setAiAvatar(saved);
    } else {
      setShowAvatarSelect(true);
    }
  }, []);
  useEffect(() => {
    const user = getAuth().currentUser;
    if (user) {
      if (lastUid !== user.uid) {
        localStorage.removeItem('aiAvatar');
        localStorage.removeItem('avatarWelcomed');
        localStorage.setItem('lastUid', user.uid);
      }
      setNickname(user.displayName || '朋友');
    }
  }, []);
  const handleSelectAvatar = (url: string) => {
    setAiAvatar(url);
    localStorage.setItem('aiAvatar', url);
    setShowAvatarSelect(false);
    setIsFirstChat(false);
    if (!localStorage.getItem('avatarWelcomed')) {
      setFirstAvatarSelected(true);
      localStorage.setItem('avatarWelcomed', '1');
    }
  };

  // 多語言陪伴語
  const COMPANION_PHRASE = {
    'zh-TW': ['🕊️ 守在海這端，', '我都聽著呢。'],
    'zh-CN': ['🕊️ 守在海这端，', '我都听着呢。'],
    'en': ['🕊️ I\'m here by the sea,', 'I\'m listening.'],
    'ja': ['🕊️ この海辺で待ってるよ、', 'ずっと聞いているから。'],
  };
  const CHANGE_AVATAR_BTN = {
    'zh-TW': '更換我的頭像',
    'zh-CN': '更换我的头像',
    'en': 'Change My Avatar',
    'ja': 'アバターを変更',
  };

  const langTyped = (lang as 'zh-TW'|'zh-CN'|'en'|'ja');

  // 模擬 AI 回覆（可被打斷）
  const fakeAIReply = (userText: string) => {
    setAIStreaming(true);
    const aiMsg: ChatMsg = {
      id: Date.now().toString(),
      text: '',
      sender: 'ai',
      status: 'streaming',
    };
    setMessages(prev => [...prev, aiMsg]);
    let idx = 0;
    const reply = `AI陪聊：我明白你的意思，「${userText}」，讓我再多聽你說說...`;
    aiTimeout.current = setInterval(() => {
      idx++;
      setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, text: reply.slice(0, idx) } : m));
      if (idx >= reply.length) {
        clearInterval(aiTimeout.current!);
        setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, status: 'done' } : m));
        setAIStreaming(false);
      }
    }, 40);
  };

  // 用戶送出訊息
  const handleSend = async () => {
    if (!input.trim()) return;
    // 若AI正在回覆，立即打斷
    if (aiStreaming && aiTimeout.current) {
      clearInterval(aiTimeout.current);
      setMessages(prev => prev.filter(m => m.sender !== 'ai' || m.status === 'done'));
      setAIStreaming(false);
    }
    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => fakeAIReply(userMsg.text), 400);
    // AI 虛擬人回應
    setIsSpeaking(true);
    const openaiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    const playhtKey = process.env.REACT_APP_PLAYHT_API_KEY || '';
    const didKey = process.env.REACT_APP_DID_API_KEY || '';
    const aiText = await generateResponse([
      { role: 'assistant', content: '你是一個溫暖、善解人意的虛擬人，請用鼓勵、正向語氣回應。' },
      { role: 'user', content: input },
    ], openaiKey);
    const ttsUrl = await speak(aiText, aiAvatar.includes('female') ? 'female' : 'male', playhtKey);
    setAvatarAudio(ttsUrl);
    const videoUrl = await generateTalkingFace({
      imageUrl: aiAvatar,
      audioUrl: ttsUrl,
      text: aiText,
      apiKey: didKey,
    });
    setAvatarVideo(videoUrl);
    setIsSpeaking(false);
  };

  // 根據 public/avatars/ 目錄下的實際檔名顯示頭像與名字
  const getAvatarName = (url: string) => {
    if (!url) return '';
    const file = url.split('/').pop() || '';
    return file.replace(/\.png$/i, '');
  };

  const handleRecordVoice = () => {
    if (!SpeechRecognition) {
      setSpeechError(lang==='zh-TW'?'此瀏覽器不支援語音辨識，請改用 Chrome/Edge。':lang==='zh-CN'?'此浏览器不支持语音识别，请改用 Chrome/Edge。':lang==='ja'?'このブラウザは音声認識に対応していません。Chrome/Edgeを使ってください。':'This browser does not support speech recognition. Please use Chrome/Edge.');
      return;
    }
    setSpeechError('');
    setRecognizing(true);
    setLastTranscript('');
    recognition.start();
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setLastTranscript(transcript);
        setRecognizing(false);
        // 顯示用戶語音訊息
        const userMsg: ChatMsg = {
          id: Date.now().toString(),
          text: transcript,
          sender: 'user',
        };
        setMessages(prev => [...prev, userMsg]);
        // 呼叫 AI 回覆
        handleSendVoice(transcript);
      }
    };
    recognition.onerror = (event: any) => {
      setRecognizing(false);
      setSpeechError(lang==='zh-TW'?'語音辨識失敗，請再試一次。':lang==='zh-CN'?'语音识别失败，请再试一次。':lang==='ja'?'音声認識に失敗しました。もう一度お試しください。':'Speech recognition failed, please try again.');
    };
    recognition.onend = () => {
      if (!lastTranscript) {
        setRecognizing(false);
        setSpeechError(lang==='zh-TW'?'沒有偵測到語音，請再試一次。':lang==='zh-CN'?'没有检测到语音，请再试一次。':lang==='ja'?'音声が検出されませんでした。もう一度お試しください。':'No speech detected, please try again.');
      }
    };
  };

  const handleSendVoice = async (inputText: string) => {
    setAIStreaming(true);
    const aiMsg: ChatMsg = {
      id: Date.now().toString(),
      text: '',
      sender: 'ai',
      status: 'streaming',
    };
    setMessages(prev => [...prev, aiMsg]);
    let idx = 0;
    const openaiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    const playhtKey = process.env.REACT_APP_PLAYHT_API_KEY || '';
    const didKey = process.env.REACT_APP_DID_API_KEY || '';
    const aiText = await generateResponse([
      { role: 'assistant', content: '你是一個溫暖、善解人意的虛擬人，請用鼓勵、正向語氣回應。' },
      { role: 'user', content: inputText },
    ], openaiKey);
    // 動畫顯示 AI 回覆
    const reply = aiText;
    aiTimeout.current = setInterval(() => {
      idx++;
      setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, text: reply.slice(0, idx) } : m));
      if (idx >= reply.length) {
        clearInterval(aiTimeout.current!);
        setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, status: 'done' } : m));
        setAIStreaming(false);
      }
    }, 40);
    // AI 語音合成
    setIsSpeaking(true);
    const ttsUrl = await speak(aiText, aiAvatar.toLowerCase().includes('female') ? 'female' : 'male', playhtKey);
    setAvatarAudio(ttsUrl);
    const videoUrl = await generateTalkingFace({
      imageUrl: aiAvatar,
      audioUrl: ttsUrl,
      text: aiText,
      apiKey: didKey,
    });
    setAvatarVideo(videoUrl);
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (messages.length > 0 && firstAvatarSelected) {
      setFirstAvatarSelected(false);
    }
  }, [messages, firstAvatarSelected]);

  useEffect(() => {
    const onStorage = () => setLang(localStorage.getItem('lang') || 'zh-TW');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="modern-bg" style={{ background: `url('/skytree.png') center center / cover no-repeat`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{position:'fixed',top:0,left:0,width:'100%',zIndex:3000,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 32px 0 32px',boxSizing:'border-box',background:'transparent',pointerEvents:'auto'}}>
        <button className="topbar-btn" onClick={()=>navigate(-1)} style={{fontWeight:700,fontSize:18,marginRight:8}}>{lang==='zh-TW'?'← 返回上一頁':lang==='zh-CN'?'← 返回上一页':lang==='ja'?'← 前のページへ':'← Back'}</button>
        <div style={{display:'flex',gap:12,marginRight:8}}>
          <button className="topbar-btn" onClick={async()=>{const auth=getAuth();await signOut(auth);localStorage.clear();window.location.href='/';}}>{lang==='zh-TW'?'登出':lang==='zh-CN'?'登出':lang==='ja'?'ログアウト':'Logout'}</button>
          <select className="topbar-select" value={lang} onChange={e=>{localStorage.setItem('lang',e.target.value); setLang(e.target.value);}}
            style={{ padding: '6px 18px', borderRadius: 8, fontWeight: 700, border: '2px solid #6B5BFF', color: '#6B5BFF', background: '#fff', cursor: 'pointer', fontSize: 16, transition: 'background 0.2s, color 0.2s, box-shadow 0.2s', boxShadow: 'none' }}
            onMouseOver={e => { e.currentTarget.style.background = '#6B5BFF'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 2px 12px #6B5BFF55'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B5BFF'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <option value="zh-TW">繁中</option>
            <option value="zh-CN">简中</option>
            <option value="en">EN</option>
            <option value="ja">日文</option>
          </select>
        </div>
      </div>
      <div className="modern-container" style={{ maxWidth: 540, width: '100%', margin: '0 auto', justifyContent: 'flex-start', paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <h2 className="modern-title" style={{ fontSize: '2.2rem', margin: 0, flex: 1, textAlign: 'center', color:'#fff', textShadow:'0 2px 16px #6B5BFF, 0 4px 32px #0008', letterSpacing:1, display:'flex',alignItems:'center',gap:8 }}>💬 {lang==='zh-TW'?'一起聊聊吧':lang==='zh-CN'?'一起聊聊吧':lang==='ja'?'一緒に話そう':'Let\'s Chat'}</h2>
        </div>
        {/* 橢圓形頭像框與頭像選擇 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, marginTop: 0 }}>
          <div style={{ position: 'relative', width: 180, height: 120, marginBottom: 8, background: '#eee', borderRadius: '50% / 40%', overflow: 'hidden', boxShadow: '0 2px 12px #6B5BFF33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {aiAvatar ? (
              avatarVideo ? (
                <video src={avatarVideo} width={120} height={120} autoPlay muted loop style={{ borderRadius: '50% / 40%', objectFit: 'cover', width: 120, height: 120, filter: isSpeaking ? 'brightness(1.1)' : 'none' }} />
              ) : (
                <img src={aiAvatar} width={120} height={120} style={{ borderRadius: '50% / 40%', objectFit: 'cover', filter: isSpeaking ? 'brightness(1.1)' : 'none', transition: 'filter 0.2s' }} alt="avatar" />
              )
            ) : null}
          </div>
          {aiAvatar && <div style={{ fontWeight: 700, color: '#6B4F27', fontSize: 20, marginBottom: 4 }}>{getAvatarName(aiAvatar)}</div>}
          <button onClick={() => setShowAvatarSelect(true)} style={{ marginTop: 0, padding: '6px 18px', borderRadius: 8, fontWeight: 700, background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', cursor: 'pointer', fontSize: 15, transition: 'background 0.2s, color 0.2s, box-shadow 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = '#6B5BFF'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 2px 12px #6B5BFF55'; }} onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B5BFF'; e.currentTarget.style.boxShadow = 'none'; }}>{isFirstChat ? '你想我是誰？' : CHANGE_AVATAR_BTN[langTyped]}</button>
        </div>
        {/* AI頭像選擇彈窗 */}
        {showAvatarSelect && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: 32, minWidth: 320, maxWidth: 420, boxShadow: '0 4px 24px #0002', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => setShowAvatarSelect(false)} style={{ position: 'absolute', top: 12, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#6B4F27', cursor: 'pointer', fontWeight: 900 }}>×</button>
              <div style={{ fontWeight: 700, color: '#6B4F27', fontSize: 22, marginBottom: 18 }}>{AVATAR_TITLE[langTyped as keyof typeof AVATAR_TITLE]}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                {AVATAR_LIST.map((url, i) => (
                  <div key={url} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 64 }}>
                    <img src={url} alt={url} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #bbb', background: '#eee', cursor: 'pointer', boxShadow: aiAvatar === url ? '0 0 0 3px #6B5BFF' : undefined }} onClick={() => handleSelectAvatar(url)} />
                    <div style={{ fontSize: 15, color: '#6B4F27', fontWeight: 700, marginTop: 4 }}>{AVATAR_NAMES[i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* 陪伴語：左側固定，僅顯示一遍，位置靠近頭像左緣 */}
        <div className="companion-phrase-left">
          <p>{COMPANION_PHRASE[langTyped][0]}</p>
          <p>{COMPANION_PHRASE[langTyped][1]}</p>
        </div>
        {/* 語音訊息顯示區 */}
        <div className="quote-list" style={{ minHeight: 240, marginBottom: 18, background: 'rgba(35,41,70,0.7)', borderRadius: 16, padding: 12, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {messages.length === 0 && !recognizing && (
            !aiAvatar ? (
              <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, color: '#fff' }}>
                {lang==='zh-TW'?'嗨，'+nickname+'，先幫我選個頭像後我們再輕鬆自在，天南地北痛快聊...':
                 lang==='zh-CN'?'嗨，'+nickname+'，先帮我选个头像后我们再轻松自在，天南地北畅快聊...':
                 lang==='ja'?'やあ、'+nickname+'、まずは私のアバターを選んでから、気軽に何でも話そう！':
                 'Hi, '+nickname+', pick my avatar and let\'s chat freely!'}
              </div>
            ) : (
              <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, color: '#fff' }}>
                {lang==='zh-TW'?getAvatarName(aiAvatar)+'說：嗨，'+nickname+'，今天想聊點什麼呢？':
                 lang==='zh-CN'?getAvatarName(aiAvatar)+'说：嗨，'+nickname+'，今天想聊点什么呢？':
                 lang==='ja'?getAvatarName(aiAvatar)+'：やあ、'+nickname+'、今日は何を話そうか？':
                 getAvatarName(aiAvatar)+': Hi, '+nickname+', what do you want to talk about today?'}
              </div>
            )
          )}
          {messages.map(msg => (
            <div key={msg.id} className="quote-card" style={{ background: msg.sender === 'user' ? 'linear-gradient(120deg, #6c63ff 60%, #232946 100%)' : undefined, alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', color: msg.sender === 'user' ? '#fff' : undefined, marginTop: 32 }}>
              <div className="quote-text" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {msg.sender === 'ai' ? (
                  <>
                    <span style={{ color: '#614425', fontWeight: 700 }}>{getAvatarName(aiAvatar)}說：</span>
                    <span style={{ color: '#fff' }}>{msg.text}</span>
                  </>
                ) : (
                  msg.text
                )}
              </div>
              <div className="quote-tone" style={{ color: msg.sender === 'user' ? '#614425' : '#6c63ff' }}>{msg.sender === 'user' ? '你' : getAvatarName(aiAvatar)}</div>
              {msg.audio && <audio src={msg.audio} controls style={{ marginTop: 6 }} />}
              {msg.status === 'streaming' && <span style={{ color: '#6c63ff', fontSize: 12 }}>AI 回覆中...</span>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32, justifyContent: 'center' }}>
          <button
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: recognizing ? 'linear-gradient(135deg, #ff5e3a 60%, #ffb47b 100%)' : 'linear-gradient(135deg, #6c63ff 60%, #23c6e6 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 2px 12px #23294633',
              fontSize: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: 12,
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
            onClick={handleRecordVoice}
            disabled={recognizing}
            onMouseOver={e => { if (!recognizing) { e.currentTarget.style.background = 'linear-gradient(135deg, #4a3bbf 60%, #0e7fd6 100%)'; e.currentTarget.style.boxShadow = '0 4px 24px #6B5BFF55'; }}}
            onMouseOut={e => { if (!recognizing) { e.currentTarget.style.background = 'linear-gradient(135deg, #6c63ff 60%, #23c6e6 100%)'; e.currentTarget.style.boxShadow = '0 2px 12px #23294633'; }}}
          >
            {recognizing ? <span style={{fontSize: 38}}>■</span> : <span role="img" aria-label="mic">🎤</span>}
          </button>
          {!showInput && !recording && (
            <div style={{ color: '#fff', fontSize: 18, marginBottom: 8, textAlign: 'center', textShadow: '0 2px 8px #23294688', background: 'rgba(0,0,0,0.18)', borderRadius: 8, padding: '2px 12px', display: 'inline-block', backdropFilter: 'blur(2px)' }}>
              {lang==='zh-TW'?'按一下開始語音聊天...':lang==='zh-CN'?'点一下开始语音聊天...':lang==='ja'?'タップして音声チャット開始':'Tap to start voice chat...'}
            </div>
          )}
        </div>
        {aiStreaming && <div style={{ color: '#6c63ff', marginTop: 10, textAlign: 'center' }}>{lang==='zh-TW'?'AI 正在回覆中，輸入新訊息可立即打斷':lang==='zh-CN'?'AI 正在回复中，输入新消息可立即打断':lang==='ja'?'AIが返信中です。新しいメッセージを入力するとすぐに中断できます':'AI is replying, type a new message to interrupt.'}</div>}
        {speechError && <div style={{ color: 'red', marginTop: 8 }}>{speechError}</div>}
      </div>
    </div>
  );
}

<style>{`
  @media (min-width: 768px) {
    .emotion-phrase-left {
      position: fixed;
      top: 32%;
      left: 2vw;
      z-index: 1001;
      color: #fff;
      font-size: 1.1rem;
      font-weight: 400;
      text-shadow: 0 2px 8px #23294688;
      background: rgba(0,0,0,0.18);
      border-radius: 10px;
      padding: 6px 18px;
      backdrop-filter: blur(2px);
      box-shadow: 0 2px 12px #0002;
      display: block;
    }
    .emotion-phrase-right {
      position: fixed;
      top: 32%;
      right: 2vw;
      z-index: 1001;
      color: #fff;
      font-size: 1.1rem;
      font-weight: 400;
      text-shadow: 0 2px 8px #23294688;
      background: rgba(0,0,0,0.18);
      border-radius: 10px;
      padding: 6px 18px;
      backdrop-filter: blur(2px);
      box-shadow: 0 2px 12px #0002;
      text-align: right;
      display: block;
    }
    .emotion-phrase-mobile-top, .emotion-phrase-mobile-bottom {
      display: none;
    }
  }
  @media (max-width: 767px) {
    .emotion-phrase-left, .emotion-phrase-right {
      display: none;
    }
    .emotion-phrase-mobile-top {
      position: fixed;
      top: 70px;
      left: 0;
      width: 100vw;
      z-index: 1001;
      color: #fff;
      font-size: 1.08rem;
      font-weight: 400;
      text-shadow: 0 2px 8px #23294688;
      background: rgba(0,0,0,0.18);
      border-radius: 10px;
      padding: 6px 18px;
      backdrop-filter: blur(2px);
      box-shadow: 0 2px 12px #0002;
      text-align: center;
      display: block;
    }
    .emotion-phrase-mobile-bottom {
      position: fixed;
      bottom: 60px;
      left: 0;
      width: 100vw;
      z-index: 1001;
      color: #fff;
      font-size: 1.08rem;
      font-weight: 400;
      text-shadow: 0 2px 8px #23294688;
      background: rgba(0,0,0,0.18);
      border-radius: 10px;
      padding: 6px 18px;
      backdrop-filter: blur(2px);
      box-shadow: 0 2px 12px #0002;
      text-align: center;
      display: block;
    }
  }
  .companion-phrase-left {
    position: absolute;
    top: 120px;
    left: 32px;
    color: rgba(255,255,255,0.85);
    font-size: 1.15rem;
    line-height: 1.6;
    max-width: 200px;
    text-shadow: 0 2px 8px #23294688;
    z-index: 1001;
    font-weight: 400;
    pointer-events: none;
    letter-spacing: 0.5px;
    background: rgba(0,0,0,0.10);
    border-radius: 10px;
    padding: 8px 16px;
    box-shadow: 0 2px 12px #0002;
    backdrop-filter: blur(2px);
  }
  @media (max-width: 767px) {
    .companion-phrase-left {
      position: static;
      margin: 12px auto 0 auto;
      left: unset;
      top: unset;
      display: block;
      text-align: center;
      max-width: 90vw;
      background: rgba(0,0,0,0.18);
    }
  }
`}</style> 