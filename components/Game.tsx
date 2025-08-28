import React, { useState, useEffect, useRef, useCallback } from 'react';
import Hole from './Hole';
import EndScreen from './EndScreen';

type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'vi' | 'th' | 'la' | 'ms';

const GAME_TEXT: Record<LanguageCode, { score: string; level: string; time: string; loading: string; }> = {
    'zh-TW': { score: '分數', level: '等級', time: '時間', loading: '載入遊戲資料...' },
    'zh-CN': { score: '分数', level: '等级', time: '时间', loading: '载入游戏资料...' },
    'en': { score: 'Score', level: 'Level', time: 'Time', loading: 'Loading Game Data...' },
    'ja': { score: 'スコア', level: 'レベル', time: '時間', loading: 'ゲームデータを読み込み中...' },
    'ko': { score: '점수', level: '레벨', time: '시간', loading: '게임 데이터 로딩 중...' },
    'vi': { score: 'Điểm', level: 'Cấp', time: 'Thời gian', loading: 'Đang tải dữ liệu trò chơi...' },
    'th': { score: 'คะแนน', level: 'ระดับ', time: 'เวลา', loading: 'กำลังโหลดข้อมูลเกม...' },
    'la': { score: 'Punctum', level: 'Gradus', time: 'Tempus', loading: 'Ludus data oneratis...' },
    'ms': { score: 'Skor', level: 'Tahap', time: 'Masa', loading: 'Memuatkan Data Permainan...' },
};

const LEVEL_SPEEDS = [
  [1200, 1000], [1000, 900], [900, 800],
  [800, 700], [700, 600], [600, 500]
];

interface GameProps {
  duration: number;
  onEndGame: () => void;
}

const Game: React.FC<GameProps> = ({ duration, onEndGame }) => {
  const [moles, setMoles] = useState<any[]>([]);
  const [phrases, setPhrases] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [level, setLevel] = useState(1);
  const [activeMole, setActiveMole] = useState<{ index: number; type: any } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [totalMoles, setTotalMoles] = useState(0);
  const [moleMessage, setMoleMessage] = useState<string | null>(null);
  const [lang] = useState<LanguageCode>(() => (localStorage.getItem('lang') as LanguageCode) || 'zh-TW');
  const t = GAME_TEXT[lang];
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const molesRes = await fetch('/moles.json');
      const molesData = await molesRes.json();
      setMoles(molesData);

      const phrasesRes = await fetch('/phrases.json');
      const phrasesData = await phrasesRes.json();
      setPhrases(phrasesData);
    };
    fetchData();
  }, []);

  const handleMiss = useCallback(() => {
    setScore(s => s - 1);
    setMissCount(m => m + 1);
  }, []);

  const showMole = useCallback(() => {
    if (moles.length === 0 || !phrases) return;

    const [min, max] = LEVEL_SPEEDS[level - 1];
    const moleDisappearTime = Math.random() * (900 - 600) + 600;
    const nextAppearanceTime = Math.random() * (max - min) + min;

    const moleType = moles[Math.floor(Math.random() * moles.length)];
    const holeIndex = Math.floor(Math.random() * 5);
    
    setTotalMoles(t => t + 1);
    setActiveMole({ index: holeIndex, type: moleType });

    moleTimeoutRef.current = setTimeout(() => {
      handleMiss();
      setActiveMole(current => (current?.index === holeIndex ? null : current));
    }, moleDisappearTime);
    
    gameLoopRef.current = setTimeout(showMole, nextAppearanceTime);
  }, [level, handleMiss, moles, phrases]);

  useEffect(() => {
    if (moles.length > 0 && phrases && !isGameOver) {
      showMole();
    }
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
      if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
    }
  }, [moles, phrases, showMole, isGameOver]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
      if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleHit = (moleIndex: number) => {
    if (activeMole?.index !== moleIndex || !phrases) return;

    if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
    setScore(s => s + 1);
    setHitCount(h => h + 1);
    setActiveMole(null);
    
    const hitPhrase = phrases.moleHit[Math.floor(Math.random() * phrases.moleHit.length)];
    setMoleMessage(hitPhrase);
    setTimeout(() => setMoleMessage(null), 800);

    if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    showMole();
  };

  useEffect(() => {
    const hitRate = totalMoles > 0 ? (hitCount / totalMoles) * 100 : 0;
    if (hitRate > 90 && level < 6) {
        setLevel(l => l + 1);
    } else if (hitRate <= 40 && level > 1) {
        setLevel(l => l - 1);
    }
  }, [hitCount, totalMoles, level]);

  if (isGameOver) {
    const hitRate = totalMoles > 0 ? (hitCount / totalMoles) * 100 : 0;
    
    return (
      <EndScreen
        score={score}
        level={level}
        hitRate={hitRate}
        onRestart={() => window.location.reload()}
        phrases={phrases}
        onEndGame={onEndGame}
      />
    );
  }
  
  if (!phrases || moles.length === 0) {
      return <div>{t.loading}</div>
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen bg-gray-800 text-white" style={{ background: `url('/clay_background.png') center center/cover no-repeat` }}>
      {/* HUD */}
      <div className="w-full max-w-4xl mx-auto p-4 z-10">
        <div className="flex justify-between items-center bg-gray-900 bg-opacity-70 rounded-lg p-4 text-2xl font-bold">
          <div><span className="text-yellow-400">{t.score}:</span> {score}</div>
          <div><span className="text-red-400">{t.level}:</span> {level}</div>
          <div><span className="text-cyan-400">{t.time}:</span> {timeLeft}s</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-5 gap-x-4 md:gap-x-12">
          {[...Array(5)].map((_, index) => (
            <Hole
              key={index}
              mole={activeMole?.index === index ? activeMole.type : null}
              onHit={() => handleHit(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Mole Hit Message */}
      {moleMessage && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-extrabold text-white" style={{ textShadow: '2px 2px 4px #000' }}>
          {moleMessage}
        </div>
      )}
    </div>
  );
};

export default Game; 