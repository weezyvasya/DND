import React from 'react';
import { DiceType, DICE_TYPES } from '../types';

interface DiceSelectorProps {
  selectedDie: DiceType;
  isMultiMode: boolean;
  multiSelection: Record<DiceType, number>;
  isRolling: boolean;
  onSelectDie: (die: DiceType) => void;
  onIncrementDie: (die: DiceType) => void;
  onDecrementDie: (die: DiceType) => void;
}

const DiceSelector: React.FC<DiceSelectorProps> = ({
  selectedDie,
  isMultiMode,
  multiSelection,
  isRolling,
  onSelectDie,
  onIncrementDie,
  onDecrementDie,
}) => {
  const handleClick = (die: DiceType) => {
    if (isMultiMode) {
      onIncrementDie(die);
    } else {
      onSelectDie(die);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap max-w-[420px] p-3 rounded-xl ui-panel">
      {DICE_TYPES.map((die) => {
        const isActive = selectedDie === die.id;
        const count = multiSelection[die.id];

        return (
          <div
            key={die.id}
            className={`flex items-center rounded-lg border-2 transition-all ${
              isActive
                ? 'bg-amber-700/90 border-amber-500 shadow-lg shadow-amber-500/30'
                : 'bg-gray-800/80 border-gray-600/50 hover:bg-gray-700/80 hover:border-gray-500'
            }`}
          >
            {isMultiMode && (
              <button
                onClick={(e) => { e.stopPropagation(); onDecrementDie(die.id); }}
                disabled={count === 0 || isRolling}
                className={`w-6 h-8 flex items-center justify-center text-sm font-bold rounded-l-md transition-colors ${
                  count > 0 ? 'text-white hover:bg-red-500/40' : 'text-white/30 cursor-not-allowed'
                }`}
              >
                −
              </button>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); handleClick(die.id); }}
              disabled={isRolling}
              className={`px-2 py-1.5 text-sm font-bold transition-colors ${
                isActive ? 'text-white' : 'text-white/80 hover:text-white'
              } ${isMultiMode ? '' : 'rounded-lg'} ${isRolling ? 'cursor-not-allowed' : ''}`}
            >
              {isMultiMode && count > 0 ? `${count}${die.label}` : die.label}
            </button>

            {isMultiMode && (
              <button
                onClick={(e) => { e.stopPropagation(); onIncrementDie(die.id); }}
                disabled={isRolling}
                className={`w-6 h-8 flex items-center justify-center text-sm font-bold text-white hover:bg-green-500/40 rounded-r-md transition-colors ${
                  isRolling ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                +
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DiceSelector;
