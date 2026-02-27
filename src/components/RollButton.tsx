import React from 'react';

interface RollButtonProps {
  isRolling: boolean;
  onRoll: () => void;
}

const RollButton: React.FC<RollButtonProps> = ({ isRolling, onRoll }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!isRolling) {
          onRoll();
        }
      }}
      disabled={isRolling}
      className={`
        mt-6 px-10 py-4 rounded-full font-black text-xl uppercase tracking-wider
        transition-all duration-200 transform border-2
        ${isRolling
          ? 'bg-gray-700/80 text-gray-400 cursor-not-allowed border-gray-600'
          : 'bg-blue-600/90 hover:bg-blue-500 text-white border-blue-400/50 roll-btn hover:scale-105 active:scale-95'
        }
        backdrop-blur-md
      `}
    >
      {isRolling ? '🎲 Rolling...' : '🎲 Roll'}
    </button>
  );
};

export default RollButton;
