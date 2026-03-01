import React from 'react';
import { RollMode } from '../types';

interface RollModeToggleProps {
  currentMode: RollMode;
  onModeChange: (mode: RollMode) => void;
}

const MODES: { id: RollMode; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'advantage', label: 'Advantage' },
  { id: 'disadvantage', label: 'Disadvantage' },
];

const RollModeToggle: React.FC<RollModeToggleProps> = ({ currentMode, onModeChange }) => {
  const getButtonClass = (mode: RollMode, isActive: boolean): string => {
    const base = 'px-3 py-1.5 rounded-lg text-sm font-bold transition-all border-2';
    
    if (!isActive) {
      return `${base} bg-gray-700/60 text-white/70 hover:bg-gray-600/60 border-transparent`;
    }
    
    switch (mode) {
      case 'advantage':
        return `${base} bg-green-600/90 text-white border-green-400`;
      case 'disadvantage':
        return `${base} bg-red-600/90 text-white border-red-400`;
      default:
        return `${base} bg-amber-600/90 text-white border-amber-400`;
    }
  };

  return (
    <div className="flex gap-1 p-1 rounded-xl ui-panel">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={getButtonClass(mode.id, currentMode === mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default RollModeToggle;
