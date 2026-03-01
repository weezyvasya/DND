import React from 'react';
import Dice3D from './Dice3D';
import MultiDiceDisplay from './MultiDiceDisplay';
import { DiceType, DiceSize, DiceData, getSidesForDie } from '../types';

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClose(); }}
    className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-red-600/60 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm z-50 border border-red-400/50"
    title="Close dice"
  >
    ✕
  </button>
);

interface SingleDiceAreaProps {
  selectedDie: DiceType;
  result: number | null;
  isRolling: boolean;
  animationSpeed: number;
  diceSize: DiceSize;
  onRoll: () => void;
  onClose: () => void;
}

export const SingleDiceArea: React.FC<SingleDiceAreaProps> = ({
  selectedDie,
  result,
  isRolling,
  animationSpeed,
  diceSize,
  onRoll,
  onClose,
}) => (
  <div className="relative flex flex-col items-center justify-center dice-container">
    <div className="absolute -top-2 text-white text-lg font-bold tracking-wide dice-label uppercase">
      {selectedDie}
    </div>
    <CloseButton onClose={onClose} />
    <Dice3D
      result={result}
      isRolling={isRolling}
      animationSpeed={animationSpeed}
      onRoll={onRoll}
      sides={getSidesForDie(selectedDie)}
      size={diceSize}
    />
  </div>
);

interface MultiDiceAreaProps {
  diceData: DiceData[];
  isRolling: boolean;
  animationSpeed: number;
  onRoll: () => void;
  onClose: () => void;
}

export const MultiDiceArea: React.FC<MultiDiceAreaProps> = ({
  diceData,
  isRolling,
  animationSpeed,
  onRoll,
  onClose,
}) => (
  <div className="relative flex flex-col items-center justify-center dice-container">
    <CloseButton onClose={onClose} />
    <MultiDiceDisplay
      dice={diceData}
      isRolling={isRolling}
      animationSpeed={animationSpeed}
      onRoll={onRoll}
    />
  </div>
);
