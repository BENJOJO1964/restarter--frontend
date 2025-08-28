import React, { useMemo, useState } from 'react';

type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'vi' | 'th' | 'la' | 'ms';

const END_SCREEN_TEXT: Record<LanguageCode, {
    gameOver: string;
    finalScore: string;
    hitRate: string;
    restart: string;
}> = {
    'zh-TW': { gameOver: '時間到！', finalScore: '最終分數', hitRate: '命中率', restart: '重新開始' },
    'zh-CN': { gameOver: '时间到！', finalScore: '最终分数', hitRate: '命中率', restart: '重新开始' },
    'en': { gameOver: 'Time\'s Up!', finalScore: 'Final Score', hitRate: 'Hit Rate', restart: 'Restart' },
    'ja': { gameOver: '時間切れ！', finalScore: '最終スコア', hitRate: '命中率', restart: 'リスタート' },
    'ko': { gameOver: '시간 종료!', finalScore: '최종 점수', hitRate: '명중률', restart: '재시작' },
    'vi': { gameOver: 'Hết giờ!', finalScore: 'Điểm cuối cùng', hitRate: 'Tỷ lệ trúng', restart: 'Khởi động lại' },
    'th': { gameOver: 'หมดเวลา!', finalScore: 'คะแนนสุดท้าย', hitRate: 'อัตราการตี', restart: 'เริ่มใหม่' },
    'la': { gameOver: 'Tempus Expletum!', finalScore: 'Punctum Finale', hitRate: 'Ratio Percussit', restart: 'Restart' },
    'ms': { gameOver: 'Masa Tamat!', finalScore: 'Skor Akhir', hitRate: 'Kadar Pukulan', restart: 'Mula Semula' },
};

interface Phrases {
  levelUp: string[];
  levelStay: string[];
  levelDown: string[];
  negativeScore: string[];
}

interface EndScreenProps {
  score: number;
  level: number;
  hitRate: number;
  onRestart: () => void;
  phrases: Phrases;
  onEndGame: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, level, hitRate, onRestart, phrases, onEndGame }) => {
  const [lang] = useState<LanguageCode>(() => (localStorage.getItem('lang') as LanguageCode) || 'zh-TW');
  const t = END_SCREEN_TEXT[lang];

  const resultMessage = useMemo(() => {
    if (score < 0) {
      return phrases.negativeScore[Math.floor(Math.random() * phrases.negativeScore.length)];
    }
    if (hitRate >= 90) {
      return phrases.levelUp[Math.floor(Math.random() * phrases.levelUp.length)];
    }
    if (hitRate <= 40) {
      return phrases.levelDown[Math.floor(Math.random() * phrases.levelDown.length)];
    }
    return phrases.levelStay[Math.floor(Math.random() * phrases.levelStay.length)];
  }, [score, hitRate, phrases]);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white z-20 p-4">
      <div className="text-center bg-gray-900 p-8 md:p-12 rounded-2xl shadow-2xl border-4 border-yellow-400">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-red-500">{t.gameOver}</h2>
        <div className="text-2xl md:text-3xl font-bold mb-6">
          <p>{t.finalScore}: <span className="text-yellow-300">{score}</span></p>
          <p>{t.hitRate}: <span className="text-cyan-300">{hitRate.toFixed(1)}%</span></p>
        </div>
        <p className="text-xl md:text-2xl italic font-semibold text-white mb-8 p-4 bg-red-500 bg-opacity-30 rounded-lg">
          "{resultMessage}"
        </p>
        <button
          onClick={onRestart}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-lg text-2xl md:text-3xl transition-transform transform hover:scale-105 shadow-lg border-b-4 border-green-800 hover:border-green-600"
        >
          {t.restart}
        </button>
         <button onClick={onEndGame} style={{ marginTop: '20px', backgroundColor: '#666', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>
            返回選擇畫面
        </button>
      </div>
    </div>
  );
};

export default EndScreen; 