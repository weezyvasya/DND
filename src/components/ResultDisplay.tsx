import React from 'react';
import { RollMode, DiceBreakdown, DiceData } from '../types';

// Phase indicator for advantage/disadvantage rolls
interface PhaseIndicatorProps {
  phase: number;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ phase }) => (
  <div className="mb-2 px-4 py-2 rounded-lg ui-panel text-lg font-bold text-yellow-400">
    Roll {phase}/2
  </div>
);

// Single die result (normal mode)
interface SingleResultProps {
  result: number;
}

export const SingleResult: React.FC<SingleResultProps> = ({ result }) => (
  <div className="mt-4 text-7xl font-black text-amber-400 result-text">
    {result}
  </div>
);

// Advantage/Disadvantage single die result
interface AdvantageResultProps {
  roll1: number;
  roll2: number;
  finalResult: number;
  mode: RollMode;
}

export const AdvantageResult: React.FC<AdvantageResultProps> = ({ 
  roll1, roll2, finalResult, mode 
}) => (
  <div className="mt-4 flex flex-col items-center">
    <div className="flex gap-4 mb-2 text-lg">
      <span className={`px-3 py-1 rounded font-bold ${
        finalResult === roll1 ? 'bg-green-600/80 text-white' : 'bg-gray-600/50 text-white/50 line-through'
      }`}>
        {roll1}
      </span>
      <span className={`px-3 py-1 rounded font-bold ${
        finalResult === roll2 ? 'bg-green-600/80 text-white' : 'bg-gray-600/50 text-white/50 line-through'
      }`}>
        {roll2}
      </span>
    </div>
    <div className="text-7xl font-black text-amber-400 result-text">
      {finalResult}
    </div>
    <div className="text-sm text-white/70 mt-1">
      {mode === 'advantage' ? 'Best of 2' : 'Worst of 2'}
    </div>
  </div>
);

// Multi-dice total
interface MultiTotalProps {
  total: number;
}

export const MultiTotal: React.FC<MultiTotalProps> = ({ total }) => (
  <div className="mt-4 text-7xl font-black text-amber-400 result-text">
    Total: {total}
  </div>
);

// Multi-dice breakdown
interface MultiBreakdownProps {
  breakdown: DiceBreakdown[];
  diceData: DiceData[];
  rollMode: RollMode;
}

export const MultiBreakdown: React.FC<MultiBreakdownProps> = ({ 
  breakdown, diceData, rollMode 
}) => {
  const hasAdvantageData = rollMode !== 'normal' && 
    diceData.length > 0 && 
    diceData[0].roll1Result !== undefined;

  return (
    <div className="mt-3 px-4 py-2 rounded-lg ui-panel text-sm text-white text-center space-y-1">
      {breakdown.map((entry) => (
        <div key={entry.type} className="breakdown-text">
          <span className="font-bold text-amber-400">{entry.type}:</span>{' '}
          <span>{entry.results.join(', ')}</span>
        </div>
      ))}
      
      {hasAdvantageData && (
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="text-xs text-white/70 mb-1">
            {rollMode === 'advantage' ? 'Best of each:' : 'Worst of each:'}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {diceData.map((die, idx) => (
              <div key={die.id} className="flex items-center gap-1 text-xs">
                <span className="text-white/50">#{idx + 1}:</span>
                <span className={
                  die.finalResult === die.roll1Result 
                    ? 'text-green-400 font-bold' 
                    : 'text-white/40 line-through'
                }>
                  {die.roll1Result}
                </span>
                <span className="text-white/30">vs</span>
                <span className={
                  die.finalResult === die.roll2Result 
                    ? 'text-green-400 font-bold' 
                    : 'text-white/40 line-through'
                }>
                  {die.roll2Result}
                </span>
                <span className="text-amber-400 font-bold">=</span>
                <span className="text-amber-400 font-bold">{die.finalResult}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Selection label (shows current multi-dice selection)
interface SelectionLabelProps {
  label: string;
}

export const SelectionLabel: React.FC<SelectionLabelProps> = ({ label }) => (
  <div className="mt-4 px-4 py-2 rounded-lg ui-panel text-lg text-amber-400 font-bold tracking-wide">
    {label}
  </div>
);
