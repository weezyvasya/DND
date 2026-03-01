import { useState, useCallback } from 'react';
import { DiceType, RollMode, createEmptySelection } from '../types';

interface UseDiceSelectionReturn {
  selectedDie: DiceType;
  isDiceVisible: boolean;
  isMultiMode: boolean;
  multiSelection: Record<DiceType, number>;
  rollMode: RollMode;
  totalDiceCount: number;
  selectionLabel: string;
  
  selectDie: (die: DiceType) => void;
  incrementDie: (die: DiceType) => void;
  decrementDie: (die: DiceType) => void;
  hideDice: () => void;
  showDice: () => void;
  toggleMultiMode: () => void;
  setRollMode: (mode: RollMode) => void;
  resetMultiSelection: () => void;
}

export const useDiceSelection = (
  isRolling: boolean,
  onClearResults: () => void
): UseDiceSelectionReturn => {
  const [selectedDie, setSelectedDie] = useState<DiceType>('d20');
  const [isDiceVisible, setIsDiceVisible] = useState(true);
  const [isMultiMode, setIsMultiMode] = useState(false);
  const [multiSelection, setMultiSelection] = useState<Record<DiceType, number>>(createEmptySelection());
  const [rollMode, setRollModeState] = useState<RollMode>('normal');

  const totalDiceCount = Object.values(multiSelection).reduce((sum, c) => sum + c, 0);

  const selectionLabel = (Object.entries(multiSelection) as [DiceType, number][])
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `${count}${type}`)
    .join(' + ');

  const selectDie = useCallback((die: DiceType) => {
    if (isRolling) return;
    setSelectedDie(die);
    setIsDiceVisible(true);
    onClearResults();
  }, [isRolling, onClearResults]);

  const incrementDie = useCallback((die: DiceType) => {
    if (isRolling) return;
    setMultiSelection(prev => ({ ...prev, [die]: prev[die] + 1 }));
    setSelectedDie(die);
    setIsDiceVisible(true);
    onClearResults();
  }, [isRolling, onClearResults]);

  const decrementDie = useCallback((die: DiceType) => {
    if (isRolling) return;
    setMultiSelection(prev => ({ ...prev, [die]: Math.max(0, prev[die] - 1) }));
  }, [isRolling]);

  const hideDice = useCallback(() => {
    if (isRolling) return;
    setIsDiceVisible(false);
    onClearResults();
  }, [isRolling, onClearResults]);

  const showDice = useCallback(() => {
    setIsDiceVisible(true);
  }, []);

  const toggleMultiMode = useCallback(() => {
    setIsMultiMode(prev => !prev);
    setMultiSelection(createEmptySelection());
    onClearResults();
  }, [onClearResults]);

  const setRollMode = useCallback((mode: RollMode) => {
    setRollModeState(mode);
  }, []);

  const resetMultiSelection = useCallback(() => {
    setIsMultiMode(false);
    setMultiSelection(createEmptySelection());
  }, []);

  return {
    selectedDie,
    isDiceVisible,
    isMultiMode,
    multiSelection,
    rollMode,
    totalDiceCount,
    selectionLabel,
    selectDie,
    incrementDie,
    decrementDie,
    hideDice,
    showDice,
    toggleMultiMode,
    setRollMode,
    resetMultiSelection,
  };
};
