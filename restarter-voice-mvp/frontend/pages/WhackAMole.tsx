import React, { useState } from 'react';
import Game from '../components/Game';

export default function WhackAMoleStart() {
  const [selectedTime, setSelectedTime] = useState<number|null>(null);
  const [showGame, setShowGame] = useState(false);

  const handleSelect = (seconds: number) => {
    setSelectedTime(seconds);
  };

  const handleStart = () => {
    if (selectedTime) {
      setShowGame(true);
    } else {
      alert('請先選擇遊戲時間！');
    }
  };

  if (showGame && selectedTime) {
    return <Game initialTime={selectedTime} />;
  }

  return (
    <div className="bg-[url('/clay_background.png')] bg-cover bg-center min-h-screen flex flex-col items-center py-12 px-4">
      {/* Title */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-red-700 text-center drop-shadow-lg mb-20 animate-bounce tracking-wider" style={{textShadow:'2px 2px 8px #fff8, 0 0 16px #b94a1f'}}>今天就讓怒氣出拳！</h1>

      {/* Time Selection */}
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 text-center mb-24">
        <button
          className={`bg-yellow-100 border-2 border-yellow-700 text-yellow-800 text-2xl font-semibold px-10 py-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-yellow-200 transition transform drop-shadow ${selectedTime===30 ? 'ring-4 ring-yellow-400 scale-110' : ''}`}
          onClick={()=>handleSelect(30)}
        >
          <span className="text-3xl">⏲</span> <br/>我現在超煩，要打30秒
        </button>
        <button
          className={`bg-white border-2 border-red-600 text-red-700 text-2xl font-semibold px-10 py-6 rounded-2xl shadow-xl hover:scale-105 hover:bg-red-50 transition transform drop-shadow ${selectedTime===60 ? 'ring-4 ring-red-400 scale-110' : ''}`}
          onClick={()=>handleSelect(60)}
        >
          <span className="text-3xl">🔥</span> <br/>真的超怒啦！來60秒
        </button>
      </div>

      {/* Start Button */}
      <div className="flex justify-center w-full">
        <button
          className="bg-red-700 text-white text-5xl px-32 py-10 rounded-full shadow-2xl hover:bg-red-800 hover:scale-105 active:scale-95 transition-all animate-pulse font-extrabold tracking-wider transform -translate-y-8"
          onClick={handleStart}
        >
          🌟 直接開打！
        </button>
      </div>
    </div>
  );
} 