import React from 'react';

interface MoleType {
  name: string;
  emoji: string;
}

interface HoleProps {
  mole: MoleType | null;
  onHit: () => void;
}

const Hole: React.FC<HoleProps> = ({ mole, onHit }) => {
  const isVisible = mole !== null;

  return (
    <div className="relative w-32 h-32 md:w-48 md:h-48">
      {/* Hole background */}
      <div className={`absolute bottom-0 w-full h-1/2 bg-black rounded-full transition-transform duration-300 ${isVisible ? 'scale-105' : ''}`}>
        <div className="absolute inset-0 bg-gray-800 rounded-full transform scale-90"></div>
      </div>
      
      {/* Mole */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 md:w-36 md:h-36 transition-transform duration-300 ease-out cursor-pointer ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={isVisible ? onHit : undefined}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {isVisible && (
            <div className="text-6xl md:text-8xl transition-transform transform hover:scale-110 active:scale-95">
              {mole.emoji}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hole; 