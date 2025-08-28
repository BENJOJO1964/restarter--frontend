import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { Scenario } from './SkillBox';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { usePermission } from '../hooks/usePermission';
import { TokenRenewalModal } from '../components/TokenRenewalModal';
import { useTestMode } from '../App';
import { generateResponse } from '../lib/ai/generateResponse';
type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'th' | 'vi' | 'ms' | 'la';

const LANGS: { code: LanguageCode; label: string }[] = [
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

const UI_TEXT = {
    backToScenarios: { 'zh-TW': '← 返回情境列表', 'zh-CN': '← 返回情境列表', 'ja': '← シナリオ一覧へ戻る', 'en': '← Back to Scenarios', 'ko': '← 시나리오 목록으로', 'th': '← กลับไปที่รายการสถานการณ์', 'vi': '← Quay lại danh sách kịch bản', 'ms': '← Kembali ke Senarai Senario', 'la': '← Ad indicem scaenariorum redire' },
    logout: { 'zh-TW': '登出', 'zh-CN': '登出', 'ja': 'ログアウト', 'en': 'Logout', 'ko': '로그아웃', 'th': 'ออกจากระบบ', 'vi': 'Đăng xuất', 'ms': 'Log keluar', 'la': 'Exire' },
    practiceRoom: { 'zh-TW': '模擬練習中', 'zh-CN': '模拟练习中', 'ja': '練習シミュレーション中', 'en': 'Practice in Progress', 'ko': '연습 시뮬레이션 중', 'th': 'กำลังฝึกซ้อม', 'vi': 'Đang thực hành', 'ms': 'Latihan Sedang Berlangsung', 'la': 'In Exercitatione' },
    yourTurn: { 'zh-TW': '換你說了', 'zh-CN': '换你说了', 'ja': 'あなたの番です', 'en': 'Your turn', 'ko': '당신 차례입니다', 'th': 'ตาคุณแล้ว', 'vi': 'Đến lượt bạn', 'ms': 'Giliran anda', 'la': 'Tua vice est' },
    recording: { 'zh-TW': '錄音中...', 'zh-CN': '录音中...', 'ja': '録音中...', 'en': 'Recording...', 'ko': '녹음 중...', 'th': 'กำลังบันทึก...', 'vi': 'Đang ghi âm...', 'ms': 'Merakam...', 'la': 'Registrans...' },
    send: { 'zh-TW': '傳送', 'zh-CN': '发送', 'ja': '送信', 'en': 'Send', 'ko': '보내기', 'th': 'ส่ง', 'vi': 'Gửi', 'ms': 'Hantar', 'la': 'Mitte' },
};

// 1. 新增多語言對應
const SCENARIO_TEXT = {
  category: {
    'zh-TW': '分類', 'zh-CN': '分类', 'en': 'Category', 'ja': 'カテゴリ', 'ko': '분류', 'th': 'หมวดหมู่', 'vi': 'Phân loại', 'ms': 'Kategori', 'la': 'Categoria'
  },
  difficulty: {
    'zh-TW': '難度', 'zh-CN': '难度', 'en': 'Difficulty', 'ja': '難易度', 'ko': '난이도', 'th': 'ความยาก', 'vi': 'Độ khó', 'ms': 'Kesukaran', 'la': 'Difficultas'
  },
  tags: {
    'zh-TW': '標籤', 'zh-CN': '标签', 'en': 'Tags', 'ja': 'タグ', 'ko': '태그', 'th': 'แท็ก', 'vi': 'Thẻ', 'ms': 'Tag', 'la': 'Tags'
  }
};
const DIFFICULTY_MAP: Record<string, Record<LanguageCode, string>> = {
  'hard': { 'zh-TW': '困難', 'zh-CN': '困难', 'en': 'Hard', 'ja': '難しい', 'ko': '어려움', 'th': 'ยาก', 'vi': 'Khó', 'ms': 'Sukar', 'la': 'Difficile' },
  'medium': { 'zh-TW': '中等', 'zh-CN': '中等', 'en': 'Medium', 'ja': '普通', 'ko': '보통', 'th': 'ปานกลาง', 'vi': 'Trung bình', 'ms': 'Sederhana', 'la': 'Mediocris' },
  'easy': { 'zh-TW': '簡單', 'zh-CN': '简单', 'en': 'Easy', 'ja': '簡単', 'ko': '쉬움', 'th': 'ง่าย', 'vi': 'Dễ', 'ms': 'Mudah', 'la': 'Facilis' }
};

// 取得多語言 scenario
function getLocalizedScenario(scenarios: any[], scenarioId: string, lang: string): any {
  const current = scenarios.find(s => s.id === scenarioId);
  if (!current) return null;
  // 若有多語言欄位，優先顯示當前語言，否則 fallback 英文
  if (current.translations && current.translations[lang]) {
    return { ...current, ...current.translations[lang] };
  }
  return current;
}

export default function PracticePage() {
    const navigate = useNavigate();
    const { scenarioId } = useParams();
    const safeScenarioId = scenarioId || '';
    const auth = getAuth();
    const lang = (localStorage.getItem('lang') as LanguageCode) || 'zh-TW';
    
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [userText, setUserText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);
    // 新增：友善提示浮窗
    const [toast, setToast] = useState('');
    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 1800);
    };

    // 語音辨識相關狀態
    const [recording, setRecording] = useState(false);
    const [recognizing, setRecognizing] = useState(false);
    const [speechError, setSpeechError] = useState('');
    const [lastTranscript, setLastTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    
    // AI流式回覆狀態
    const [aiStreaming, setAIStreaming] = useState(false);

    // 新增：權限檢查
    const { checkPermission, recordUsage } = usePermission();
    const [showRenewalModal, setShowRenewalModal] = useState(false);
    const [permissionResult, setPermissionResult] = useState<any>(null);
    const { isTestMode } = useTestMode();

    // 判斷是否為完整句子
    function isMeaningfulInput(input: string) {
        if (!input || input.trim().length < 12) return false;
        return true;
    }

    // 語音辨識初始化
    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = lang === 'zh-TW' ? 'zh-TW' : lang === 'zh-CN' ? 'zh-CN' : lang === 'en' ? 'en-US' : lang === 'ja' ? 'ja-JP' : lang === 'ko' ? 'ko-KR' : 'zh-TW';

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                if (finalTranscript) {
                    const transcript = finalTranscript.trim();
                    setUserText(transcript);
                    setLastTranscript(transcript);
                    // 停止語音辨識
                    recognitionRef.current.stop();
                    // 自動發送辨識結果
                    setTimeout(() => {
                        if (transcript && transcript.length >= 2) {
                            // 直接調用發送邏輯，避免依賴handleSendText中的userText狀態
                            sendMessage(transcript);
                        }
                    }, 300);
                } else if (interimTranscript) {
                    setUserText(interimTranscript.trim());
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                let errorMsg = '';
                switch (event.error) {
                    case 'no-speech':
                        errorMsg = '未檢測到語音，請重試';
                        break;
                    case 'audio-capture':
                    case 'network':
                        errorMsg = '語音辨識失敗，請重試';
                        break;
                    default:
                        errorMsg = '';
                }
                if (errorMsg) setSpeechError(errorMsg);
                setRecognizing(false);
                setRecording(false);
            };

            recognitionRef.current.onend = () => {
                setRecognizing(false);
                setRecording(false);
            };
        } else {
            setSpeechError('此瀏覽器不支援語音辨識，請使用Chrome/Edge');
        }
    }, [lang]);

    useEffect(() => {
        const fetchScenarioDetails = async () => {
            setIsLoading(true);
            console.log('[useEffect] fetchScenarioDetails start, isLoading:', true);
            try {
                const response = await fetch(`/locales/${lang}/scenarios.json`);
                if (!response.ok) throw new Error('Failed to fetch scenarios');
                const scenarios: Scenario[] = await response.json();
                const currentScenario = getLocalizedScenario(scenarios, safeScenarioId, lang);
                if (currentScenario) {
                    setScenario(currentScenario);
                    setMessages([{ sender: 'ai', text: currentScenario.starting_line || currentScenario.system_prompt || '' }]);
                    console.log('[useEffect] scenario loaded:', currentScenario);
                } else {
                    setScenario(null);
                    console.log('[useEffect] scenario not found');
                }
            } catch (error) {
                console.error('[useEffect] Error fetching scenario details:', error);
                setScenario(null);
            } finally {
                setIsLoading(false);
                console.log('[useEffect] fetchScenarioDetails end, isLoading:', false);
            }
        };
        if (scenarioId) {
            fetchScenarioDetails();
        }
    }, [scenarioId, lang]);



    const handleAudio = async (audioBlob: Blob) => {
        setIsLoading(true);
        console.log('[handleAudio] isLoading:', true);
        try {
            // 檢查語音權限
            const user = auth.currentUser;
            if (!user) {
                showToast('請先登入');
                return;
            }

            const permission = await checkPermission('aiChat');
            if (!permission.allowed) {
                if (isTestMode) return;
                if (permission.canRenew) {
                    setPermissionResult(permission);
                    setShowRenewalModal(true);
                } else {
                    setPermissionResult(permission);
                    setShowRenewalModal(true);
                }
                return;
            }

            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.webm');
            formData.append('userId', user.uid); // 添加用戶ID
            
            const res = await fetch('/api/whisper', { method: 'POST', body: formData });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Whisper API failed: ${errorText}`);
            }
            const data = await res.json();
            const transcript = data.transcript || data.text || '';
            if (transcript) {
                setUserText(transcript); // 先顯示在輸入框
                // 自動送出
                setTimeout(() => {
                  handleSendText();
                }, 300);
            }
        } catch (error) {
            console.error("Error with audio processing:", error);
        } finally {
            setIsLoading(false);
            console.log('[handleAudio] end, isLoading:', false);
        }
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) {
            showToast('請先輸入內容再送出');
            return;
        }
        if (!isMeaningfulInput(text)) {
            showToast('請輸入至少12個字訓練表達能力');
            return;
        }

        // 防止並發請求
        if (aiStreaming || isLoading) {
            showToast('AI正在回覆中，請稍候');
            return;
        }

        // 檢查 AI 聊天權限
        const user = auth.currentUser;
        if (!user) {
            showToast('請先登入');
            return;
        }

        const permission = await checkPermission('aiChat');
        if (!permission.allowed) {
            if (isTestMode) return;
            if (permission.canRenew) {
                setPermissionResult(permission);
                setShowRenewalModal(true);
            } else {
                setPermissionResult(permission);
                setShowRenewalModal(true);
            }
            return;
        }

        const msg = text;
        setMessages(prev => [...prev, { sender: 'user', text: msg, id: `user-${Date.now()}` }]);
        setUserText('');
        
        // 調用AI回覆
        await getAIResponse(msg);
    };

    const handleRecordVoice = async () => {
        if (!recognitionRef.current) return;
        
        if (recording || recognizing) {
            recognitionRef.current.stop();
            setRecording(false);
            setRecognizing(false);
        } else {
            // 檢查語音權限
            const permission = await checkPermission('aiChat');
            if (!permission.allowed) {
                if (isTestMode) {
                    // 測試模式下直接執行，不檢查權限
                    setLastTranscript('');
                    setUserText('');
                    recognitionRef.current.start();
                    setRecording(true);
                    setRecognizing(true);
                    setSpeechError('');
                    return;
                }
                if (permission.canRenew) {
                    setPermissionResult(permission);
                    setShowRenewalModal(true);
                } else {
                    setPermissionResult(permission);
                    setShowRenewalModal(true);
                }
                return;
            }

            setLastTranscript('');
            setUserText('');
            recognitionRef.current.start();
            setRecording(true);
            setRecognizing(true);
            setSpeechError('');
        }
    };
    
    const handleSendText = async () => {
        await sendMessage(userText);
    };

    const getAIResponse = async (text: string) => {
        setIsLoading(true);
        setAIStreaming(true);
        console.log('[getAIResponse] called with text:', text);
        
        const newMsgId = `ai-${Date.now()}`;
        setMessages(prev => [...prev, { sender: 'ai', text: '', id: newMsgId, status: 'streaming' }]);
        
        try {
            // 構建系統提示詞
            const systemPrompt = scenario ? 
                `${scenario.system_prompt || '你是一個友善的助手，幫助用戶進行情境模擬練習。'}\n\n情境：${scenario.title || ''}\n描述：${scenario.description || ''}` : 
                '你是一個友善的助手，幫助用戶進行情境模擬練習。';
            
            const stream = await generateResponse(text, lang, systemPrompt, isTestMode);
            let fullReply = '';
            
            for await (const chunk of stream) {
                fullReply += chunk;
                setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: fullReply } : m));
            }
            
            setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, status: 'done' } : m));
            console.log('[getAIResponse] AI response completed:', fullReply);
            
            // 記錄使用量
            await recordUsage('aiChat', 2);
        } catch (error) {
            console.error('[getAIResponse] Error getting AI response:', error);
            const errorMessage = error instanceof Error ? error.message : '未知錯誤';
            setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: `API錯誤：${errorMessage}`, status: 'done' } : m));
        } finally {
            setIsLoading(false);
            setAIStreaming(false);
            console.log('[getAIResponse] end');
        }
    };

    // 移除全畫面 isLoading 判斷
    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    if (!scenario) {
        return <div style={{textAlign:'center',marginTop:80}}><div style={{fontSize:22,marginBottom:16}}>⚠️ Scenario not found.</div><button onClick={() => navigate('/')} style={{padding:'10px 28px',borderRadius:8,background:'#6B5BFF',color:'#fff',fontWeight:700,fontSize:16,border:'none',cursor:'pointer'}}>返回首頁</button></div>;
    }

    const handleRenewalModalClose = () => {
        setShowRenewalModal(false);
        setPermissionResult(null);
    };

    return (
        <div className="modern-bg" style={{ background: `url('/senario.png') center center / cover no-repeat fixed`, minHeight: '100vh', width:'100vw', overflow:'hidden', position:'relative' }}>
            <audio ref={audioRef} hidden />
            {/* 固定頂部的三個按鈕區塊 */}
            <div style={{position:'fixed',top:0,left:0,right:0,zIndex:200,display:'flex',justifyContent:'flex-start',alignItems:'center',padding:'18px 32px 0 32px',background:'transparent',width:'100vw',pointerEvents:'auto'}}>
                <button className="topbar-btn" onClick={() => navigate('/skillbox', { replace: true })} style={{ fontWeight: 700, fontSize: 18, padding: '6px 16px', borderRadius: 8, border: '1.5px solid #6B5BFF', background: '#fff', color: '#6B5BFF', cursor: 'pointer' }}>
                  {UI_TEXT.backToScenarios[lang]}
                </button>
            </div>
            {/* 內容區塊可捲動，並自動下移不被頂部按鈕遮住 */}
            <div style={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'flex-start', 
              marginTop: window.innerWidth <= 768 ? 60 : 80, 
              overflowY:'auto', 
              maxHeight: window.innerWidth <= 768 ? 'calc(100vh - 60px)' : 'calc(100vh - 80px)', 
              padding: window.innerWidth <= 768 ? '12px 6px' : '24px' 
            }}>
                {/* Scenario Header - 移除麥克風按鈕 */}
                <div style={{ 
                  width: window.innerWidth <= 768 ? '88%' : '90%', 
                  maxWidth: 700, 
                  background: 'rgba(255,255,255,0.97)', 
                  borderRadius: 16, 
                  padding: window.innerWidth <= 768 ? '12px 10px 10px 10px' : '32px 32px 18px 32px', 
                  boxShadow: '0 4px 24px #0002', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  marginBottom: window.innerWidth <= 768 ? 8 : 0, 
                  position: 'relative' 
                }}>
                    <div style={{ fontSize: window.innerWidth <= 768 ? 40 : 54, marginBottom: window.innerWidth <= 768 ? 6 : 8 }}>{scenario.emoji}</div>
                    <h2 style={{ color: '#6B5BFF', fontWeight: 900, fontSize: window.innerWidth <= 768 ? 20 : 28, marginBottom: window.innerWidth <= 768 ? 12 : 24, textAlign: 'center' }}>{scenario.title}</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: window.innerWidth <= 768 ? 8 : 12, marginBottom: window.innerWidth <= 768 ? 6 : 8 }}>
                      <span style={{ fontWeight: 600, fontSize: window.innerWidth <= 768 ? 12 : 14, padding: window.innerWidth <= 768 ? '3px 8px' : '4px 12px', borderRadius: 16, background: '#6B5BFF22', color: '#6B5BFF' }}>{SCENARIO_TEXT.category[lang]}: {scenario.category}</span>
                      <span style={{ fontWeight: 600, fontSize: window.innerWidth <= 768 ? 12 : 14, padding: window.innerWidth <= 768 ? '3px 8px' : '4px 12px', borderRadius: 16, background: '#23c6e622', color: '#23c6e6' }}>{SCENARIO_TEXT.difficulty[lang]}: {DIFFICULTY_MAP[scenario.difficulty]?.[lang] || scenario.difficulty}</span>
                    </div>
                    <p style={{ fontSize: window.innerWidth <= 768 ? 14 : 16, color: '#4A4A4A', textAlign: 'center', margin: window.innerWidth <= 768 ? '0 0 6px 0' : '0 0 8px 0', lineHeight:1.5 }}>{scenario.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: window.innerWidth <= 768 ? 6 : 8, marginBottom: window.innerWidth <= 768 ? 10 : 16 }}>
                      {scenario.tags?.map(tag => <span key={tag} style={{ fontSize: window.innerWidth <= 768 ? 11 : 13, background: '#f7f7ff', color: '#6B5BFF', borderRadius: 12, padding: window.innerWidth <= 768 ? '2px 8px' : '2px 10px' }}>{tag}</span>)}
                    </div>
                </div>
                {/* Chat Area */}
                <div style={{ 
                  width: window.innerWidth <= 768 ? '88%' : '90%', 
                  maxWidth: 700, 
                  background: 'rgba(255,255,255,0.95)', 
                  borderRadius: 16, 
                  padding: window.innerWidth <= 768 ? '14px 12px 16px 12px' : '18px 32px 24px 32px', 
                  boxShadow: window.innerWidth <= 768 ? '0 6px 32px rgba(0,0,0,0.08)' : '0 4px 24px #0002', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  marginTop: 0,
                  marginBottom: window.innerWidth <= 768 ? 40 : 0
                }}>
                    <div style={{ 
                      minHeight: window.innerWidth <= 768 ? '20vh' : '32vh', 
                      maxHeight: window.innerWidth <= 768 ? '26vh' : '44vh', 
                      overflowY: 'auto', 
                      background: '#f6f7fa', 
                      borderRadius: 12, 
                      padding: window.innerWidth <= 768 ? 10 : 16, 
                      marginBottom: window.innerWidth <= 768 ? 12 : 24, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px', 
                      boxShadow: window.innerWidth <= 768 ? '0 3px 12px rgba(107, 91, 255, 0.15)' : '0 2px 8px #6B5BFF11' 
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                <div style={{
                                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)' : '#fff',
                                    color: msg.sender === 'user' ? '#fff' : '#4A4A4A',
                                    padding: '10px 16px',
                                    borderRadius: '18px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Input Area - 麥克風放左側 */}
                    <div style={{ 
                      display: 'flex', 
                      gap: window.innerWidth <= 768 ? '8px' : '12px', 
                      alignItems: 'center', 
                      position: 'relative',
                      flexWrap: window.innerWidth <= 768 ? 'nowrap' : 'nowrap'
                    }}>
                        <button
                            onClick={handleRecordVoice}
                            disabled={isLoading}
                            style={{
                                padding: window.innerWidth <= 768 ? 12 : 16,
                                borderRadius: '50%',
                                border: 'none',
                                background: (recording || recognizing) ? '#ff4d4d' : '#1877f2',
                                color: '#fff',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                fontSize: window.innerWidth <= 768 ? 18 : 20,
                                flexShrink: 0,
                                width: window.innerWidth <= 768 ? 44 : 52,
                                height: window.innerWidth <= 768 ? 44 : 52,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {(recording || recognizing) ? '停止' : '🎤'}
                        </button>
                        <input 
                            type="text"
                            value={userText}
                            onChange={(e) => setUserText(e.target.value)}
                            placeholder={isLoading ? "AI正在思考..." : UI_TEXT.yourTurn[lang]}
                            disabled={isLoading}
                            style={{ 
                              flex: 1, 
                              padding: window.innerWidth <= 768 ? '10px 12px' : '12px 16px', 
                              borderRadius: 12, 
                              border: '2px solid #ddd', 
                              fontSize: window.innerWidth <= 768 ? 14 : 16, 
                              outline: 'none', 
                              background: isLoading ? '#f0f0f0' : '#fff',
                              minWidth: 0
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                        />
                        <button 
                            onClick={handleSendText} 
                            disabled={isLoading} 
                            style={{ 
                              padding: window.innerWidth <= 768 ? '10px 16px' : '12px 24px', 
                              borderRadius: 12, 
                              background: isLoading ? '#ccc' : '#6B5BFF', 
                              color: '#fff', 
                              border: 'none', 
                              fontWeight: 700, 
                              fontSize: window.innerWidth <= 768 ? 14 : 16, 
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              flexShrink: 0
                            }}
                        >
                            {isLoading ? "..." : UI_TEXT.send[lang]}
                        </button>
                        {isLoading && <div style={{ position: 'absolute', right: -36, top: '50%', transform: 'translateY(-50%)' }}><span className="loader" style={{ display: 'inline-block', width: 24, height: 24, border: '3px solid #6B5BFF', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>}
                    </div>
                    {/* 動態輸入提示 */}
                    {userText && !isMeaningfulInput(userText) && (
                      <div style={{ color: '#ff9800', fontSize: 15, marginTop: 6, fontWeight: 600 }}>
                        請輸入至少12個字訓練表達能力
                      </div>
                    )}
                </div>
            </div>
            {/* Toast 浮窗 */}
            {toast && <div style={{ position:'fixed', top: 32, left:'50%', transform:'translateX(-50%)', background:'#ff9800', color:'#fff', padding:'12px 32px', borderRadius: 16, fontWeight:700, fontSize:18, zIndex:9999, boxShadow:'0 2px 12px #0002' }}>{toast}</div>}
            <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
            
            {/* Token 續購彈窗 */}
            {showRenewalModal && permissionResult && (
                <TokenRenewalModal
                    isOpen={showRenewalModal}
                    onClose={handleRenewalModalClose}
                    currentPlan={permissionResult.currentPlan}
                    remainingDays={permissionResult.remainingDays}
                    usedTokens={permissionResult.usedTokens}
                    totalTokens={permissionResult.totalTokens}
                />
            )}
        </div>
    );
} 