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
        mt-8 px-8 py-3 rounded-full font-bold text-lg
        transition-all duration-200 transform
        ${isRolling
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
        }
        backdrop-blur-sm
      `}
    >
      {isRolling ? 'ROLLING...' : 'ROLL'}
    </button>
  );
};

export default RollButton;
