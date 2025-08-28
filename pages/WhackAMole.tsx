import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { useUserStatus } from '../hooks/useUserStatus';
import { LanguageSelector } from '../components/LanguageSelector';
// --- Types ---
export interface Mole {
  id: string;
  name: string;
  image: string;
}

export interface PhraseBank {
  praise: string[];
  taunt: string[];
  severeTaunt: string[];
}

type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'vi' | 'th' | 'la' | 'ms';

const LANGS: { code: LanguageCode; label: string }[] = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'la', label: 'Latīna' },
  { code: 'ms', label: 'Bahasa Melayu' },
];

const TEXTS: Record<LanguageCode, { title: string; loading: string; error: string; tryAgain: string; selectTime: string; thirty: string; sixty: string; ninety: string; timeUp: string; yourScore: string; duration: string; playAgain: string; seconds: string; }> = {
    'zh-TW': { title: "打爆你", loading: "正在加載遊戲...", error: "加載遊戲資源失敗", tryAgain: "沒有成功加載遊戲資源，請刷新頁面重試。", selectTime: "選擇遊戲時長", thirty: "30秒", sixty: "60秒", ninety: "90秒", timeUp: "時間到！", yourScore: "你的分數", duration: "遊戲時長", playAgain: "再玩一次", seconds: "秒" },
    'zh-CN': { title: "打爆你", loading: "正在加载游戏...", error: "加载游戏资源失败", tryAgain: "没有成功加载游戏资源，请刷新页面重试。", selectTime: "选择游戏时长", thirty: "30秒", sixty: "60秒", ninety: "90秒", timeUp: "时间到！", yourScore: "你的分数", duration: "游戏时长", playAgain: "再玩一次", seconds: "秒" },
    'en': { title: "Whack the Bastards", loading: "Loading game...", error: "Failed to load game assets", tryAgain: "Failed to load game assets, please refresh and try again.", selectTime: "Select Game Duration", thirty: "30 Seconds", sixty: "60 Seconds", ninety: "90 Seconds", timeUp: "Time's Up!", yourScore: "Your Score", duration: "Duration", playAgain: "Play Again", seconds: "s" },
    'ja': { title: "やつらを叩け", loading: "ゲームを読み込み中...", error: "ゲームアセットの読み込みに失敗しました", tryAgain: "ゲームアセットの読み込みに失敗しました。リフレッシュして再試行してください。", selectTime: "ゲーム時間を選択", thirty: "30秒", sixty: "60秒", ninety: "90秒", timeUp: "時間切れ！", yourScore: "スコア", duration: "ゲーム時間", playAgain: "もう一度プレイ", seconds: "秒" },
    'ko': { title: "녀석들을 때려잡아라", loading: "게임 로딩 중...", error: "게임 자산을 불러오지 못했습니다", tryAgain: "게임 자산을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.", selectTime: "게임 시간 선택", thirty: "30초", sixty: "60초", ninety: "90초", timeUp: "시간 종료!", yourScore: "점수", duration: "게임 시간", playAgain: "다시 플레이", seconds: "초" },
    'vi': { title: "Đập tan lũ khốn", loading: "Đang tải trò chơi...", error: "Tải tài nguyên trò chơi thất bại", tryAgain: "Tải tài nguyên trò chơi thất bại, vui lòng làm mới và thử lại.", selectTime: "Chọn thời gian chơi", thirty: "30 giây", sixty: "60 giây", ninety: "90 giây", timeUp: "Hết giờ!", yourScore: "Điểm của bạn", duration: "Thời gian", playAgain: "Chơi lại", seconds: "giây" },
    'th': { title: "ทุบหัวพวกมันซะ", loading: "กำลังโหลดเกม...", error: "โหลดทรัพยากรเกมล้มเหลว", tryAgain: "โหลดทรัพยากรเกมล้มเหลว กรุณารีเฟรชแล้วลองอีกครั้ง", selectTime: "เลือกเวลาเล่น", thirty: "30 วินาที", sixty: "60 วินาที", ninety: "90 วินาที", timeUp: "หมดเวลา!", yourScore: "คะแนนของคุณ", duration: "ระยะเวลา", playAgain: "เล่นอีกครั้ง", seconds: "วินาที" },
    'la': { title: "Percute Scelestos", loading: "Ludum onerans...", error: "Deficio onerare ludum bonorum", tryAgain: "Deficio onerare ludum bonorum, quaeso refice et iterum conare.", selectTime: "Elige Ludum Duratio", thirty: "30 Secundas", sixty: "60 Secundas", ninety: "90 Secundas", timeUp: "Tempus Est!", yourScore: "Tuum Score", duration: "Duratio", playAgain: "Iterum Lude", seconds: "s" },
    'ms': { title: "Hentam Si Jahat", loading: "Memuatkan permainan...", error: "Gagal memuatkan aset permainan", tryAgain: "Gagal memuatkan aset permainan, sila muat semula dan cuba lagi.", selectTime: "Pilih Tempoh Permainan", thirty: "30 Saat", sixty: "60 Saat", ninety: "90 Saat", timeUp: "Masa Tamat!", yourScore: "Skor Anda", duration: "Tempoh", playAgain: "Main Lagi", seconds: "s" }
};

// --- Hole Component ---
interface HoleProps {
  mole: Mole | null;
  onClick: () => void;
  isPeeking: boolean;
}

const Hole: React.FC<HoleProps> = ({ mole, onClick, isPeeking }) => (
  <div 
    className={`hole ${isPeeking ? 'up' : ''}`} 
    onClick={onClick}
    onTouchStart={(e) => {
      e.preventDefault(); // 防止觸摸事件的默認行為
      onClick();
    }}
    style={{ 
      cursor: 'pointer',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none'
    }}
  >
    {mole && <img src={mole.image} alt={mole.name} className="mole-image" />}
  </div>
);

// --- Game Component ---
interface GameProps {
  moles: Mole[];
  phrases: PhraseBank;
  duration: number;
  onGameEnd: (score: number) => void;
}

const Game: React.FC<GameProps> = ({ moles, phrases, duration, onGameEnd }) => {
  const [score, setScore] = useState(0);
  const [holes, setHoles] = useState<(Mole | null)[]>(new Array(9).fill(null));
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [feedback, setFeedback] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const { addBadge, rank, badges } = useUserStatus();

  const hitCount = useRef(0);
  const missCount = useRef(0);
  const totalMoles = useRef(0);
  const level = useRef(1);
  const timers = useRef<(NodeJS.Timeout | null)[]>([]);

  const showFeedback = (text: string) => {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 1000);
  };
  
  const getRandomPhrase = (type: keyof PhraseBank) => phrases[type][Math.floor(Math.random() * phrases[type].length)];

  const updateLevel = () => {
    const accuracy = totalMoles.current > 0 ? hitCount.current / totalMoles.current : 0;
    
    // 新的等級系統：基於30秒內的成功率
    if (level.current === 1 && accuracy >= 0.7) {
      level.current = 2;
      setCurrentLevel(2);
      showFeedback(`升級！LV 2 - ${getRandomPhrase('praise')}`);
    } else if (level.current === 2 && accuracy >= 0.6) {
      level.current = 3;
      setCurrentLevel(3);
      showFeedback(`升級！LV 3 - ${getRandomPhrase('praise')}`);
    } else if (level.current === 3 && accuracy >= 0.5) {
      level.current = 4;
      setCurrentLevel(4);
      showFeedback(`升級！LV 4 - ${getRandomPhrase('praise')}`);
    }
  };

  const peek = useCallback(() => {
    if (!isGameRunning) return;
    // 根據等級調整地鼠冒出消失速度：等級越高，速度越快
    const baseTime = 1200; // 基礎時間
    const levelSpeedMultiplier = Math.max(0.3, 1 - (level.current - 1) * 0.15); // 每級減少15%時間
    const time = Math.max(300, baseTime * levelSpeedMultiplier);
    
    const holeIndex = Math.floor(Math.random() * 9);
    
    if (holes[holeIndex]) {
        peek();
        return;
    }; 

    totalMoles.current++;
    const randomMole = moles[Math.floor(Math.random() * moles.length)];
    
    setHoles(prev => {
        const newHoles = [...prev];
        newHoles[holeIndex] = randomMole;
        return newHoles;
    });

    const timeoutId = setTimeout(() => {
      setHoles(prev => {
        const newHoles = [...prev];
        if (newHoles[holeIndex]) { // if mole is still there (wasn't hit)
          missCount.current++;
          // 地鼠消失時沒有點擊任何地方 - 失敗扣1分
          setScore(prevScore => prevScore - 1);
          setCombo(0);
          updateLevel();
          showFeedback(getRandomPhrase(level.current <=1 ? 'severeTaunt' : 'taunt'));
        }
        newHoles[holeIndex] = null;
        return newHoles;
      });
      timers.current[holeIndex] = null;
      peek(); // Next mole
    }, time);

    timers.current[holeIndex] = timeoutId;
  }, [isGameRunning, holes, moles, phrases]);

  const bonk = (index: number) => {
    if (holes[index]) {
      // 點擊到地鼠身上 - 成功
      const timeout = timers.current[index];
      if (timeout) {
        clearTimeout(timeout);
        timers.current[index] = null;
      }
      
      hitCount.current++;
      setScore(prevScore => {
        const newScore = prevScore + 1; // 打成功得1分
        // 更新最高分
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        return newScore;
      });
      
      // 更新連擊
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) {
        setMaxCombo(newCombo);
      }
      
      updateLevel();
      showFeedback(getRandomPhrase('praise'));
      
      setHoles(prev => {
          const newHoles = [...prev];
          newHoles[index] = null;
          return newHoles;
      });
      peek(); // Speed up next mole appearance
    } else {
      // 點擊空坑或地鼠消失後點擊 - 失敗
      setScore(prevScore => prevScore - 1); // 沒打到扣1分
      setCombo(0); // 重置連擊
      showFeedback(getRandomPhrase(level.current <=1 ? 'severeTaunt' : 'taunt'));
    }
  };

  useEffect(() => {
    setIsGameRunning(true);
    setTimeLeft(duration);
    setScore(0);
    setCurrentLevel(1);
    setCombo(0);
    hitCount.current = 0;
    missCount.current = 0;
    totalMoles.current = 0;
    level.current = 1;

    for (let i = 0; i < 3; i++) { // Start with 3 moles
      peek();
    }

    const gameTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimer);
          setIsGameRunning(false);
          timers.current.forEach(timer => {
            if (timer) clearTimeout(timer);
          });
          
          // 新增：遊戲結束時根據分數給予徽章獎勵
          const finalScore = score;
          if (finalScore >= 20) {
            addBadge(); // 高分獎勵徽章
          }
          
          onGameEnd(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(gameTimer);
      timers.current.forEach(t => t && clearTimeout(t));
    };
  }, [duration, onGameEnd, peek, addBadge]);

  return (
    <div className="game">
       <div className="game-info">
        <span>分數: {score}</span>
        <span>時間: {timeLeft}s</span>
        <span>等級: {currentLevel}</span>
        <span>擊中: {hitCount.current}</span>
        <span>準確率: {totalMoles.current > 0 ? Math.round((hitCount.current / totalMoles.current) * 100) : 0}%</span>
        <span>連擊: {combo}</span>
        <span>最高分: {highScore}</span>
        <span>最高連擊: {maxCombo}</span>
        <span>{rank?.icon} {rank?.name_zh} (徽章: {badges}/10)</span>
      </div>
      {feedback && <div className="feedback">{feedback}</div>}
      <div className="hole-grid">
        {holes.map((mole, i) => (
          <Hole key={i} mole={mole} onClick={() => bonk(i)} isPeeking={!!mole} />
        ))}
      </div>
    </div>
  );
};

// --- WhackAMole Page Component ---
const WhackAMole: React.FC = () => {
  const [moles, setMoles] = useState<Mole[]>([]);
  const [phrases, setPhrases] = useState<PhraseBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const { lang, setLang } = useLanguage();
  const t = TEXTS[lang] || TEXTS['en'];

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as LanguageCode;
    if (savedLang && TEXTS[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const molesResponse = await fetch('/moles.json');
        if (!molesResponse.ok) throw new Error(`HTTP error! status: ${molesResponse.status}`);
        const molesData = await molesResponse.json();
        setMoles(molesData);

        const phrasesResponse = await fetch('/phrases.json');
        if (!phrasesResponse.ok) throw new Error(`HTTP error! status: ${phrasesResponse.status}`);
        const phrasesData = await phrasesResponse.json();
        setPhrases(phrasesData);
      } catch (e) {
        setError(e instanceof Error ? `${t.error}: ${e.message}` : String(t.error));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t.error]);

  const handleGameEnd = (score: number) => {
    setFinalScore(score);
  };
  
  const handleRestart = () => {
      setDuration(null);
      setFinalScore(null);
      setGameKey(prev => prev + 1);
  };
  
  const renderContent = () => {
    if (loading) return <div>{t.loading}</div>;
    if (error) return <div>{t.tryAgain}</div>;

    if (finalScore !== null && duration !== null) {
        return (
            <div className="endscreen">
                <h2>{t.timeUp}</h2>
                <p>{t.yourScore}: {finalScore}</p>
                <p>{t.duration}: {duration} {t.seconds}</p>
                <button onClick={handleRestart}>{t.playAgain}</button>
            </div>
        );
    }

    if (!duration) {
      return (
        <div className="start-screen">
          <h1>{t.title}</h1>
          <h3>{t.selectTime}</h3>
          <div className="duration-options">
            <button onClick={() => setDuration(30)}>{t.thirty}</button>
            <button onClick={() => setDuration(60)}>{t.sixty}</button>
            <button onClick={() => setDuration(90)}>{t.ninety}</button>
          </div>
        </div>
      );
    }
    
    if (moles.length > 0 && phrases) {
      return <Game key={gameKey} moles={moles} phrases={phrases} duration={duration} onGameEnd={handleGameEnd} />;
    }

    return null;
  };

  return (
    <div className="whack-a-mole-container">
       <div style={{ position: 'absolute', top: 24, right: 36, zIndex: 100 }}>
        <LanguageSelector />
      </div>
      {renderContent()}
      
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
};

export default WhackAMole;