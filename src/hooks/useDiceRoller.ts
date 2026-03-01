import { useState, useCallback, useRef } from 'react';
import { DiceType, DiceData, DiceBreakdown, RollMode, getSidesForDie, rollDie } from '../types';
import { soundManager } from '../utils/sound';

interface RollParams {
  selectedDie: DiceType;
  isMultiMode: boolean;
  multiSelection: Record<DiceType, number>;
  rollMode: RollMode;
  onComplete?: () => void;
}

interface UseDiceRollerReturn {
  // State
  isRolling: boolean;
  currentPhase: number;
  singleResult: number | null;
  roll1: number | null;
  roll2: number | null;
  finalResult: number | null;
  multiTotal: number | null;
  multiBreakdown: DiceBreakdown[];
  multiDiceData: DiceData[];
  rollHistory: number[];
  
  // Actions
  startRoll: (params: RollParams) => void;
  clearAllResults: () => void;
}

export const useDiceRoller = (animationDuration: number = 2500): UseDiceRollerReturn => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  
  // Single die state
  const [singleResult, setSingleResult] = useState<number | null>(null);
  const [roll1, setRoll1] = useState<number | null>(null);
  const [roll2, setRoll2] = useState<number | null>(null);
  const [finalResult, setFinalResult] = useState<number | null>(null);
  
  // Multi-dice state
  const [multiTotal, setMultiTotal] = useState<number | null>(null);
  const [multiBreakdown, setMultiBreakdown] = useState<DiceBreakdown[]>([]);
  const [multiDiceData, setMultiDiceData] = useState<DiceData[]>([]);
  
  // History
  const [rollHistory, setRollHistory] = useState<number[]>([]);
  
  // Ref to track if roll is in progress (prevents double-clicks)
  const rollInProgress = useRef(false);

  const clearAllResults = useCallback(() => {
    setSingleResult(null);
    setRoll1(null);
    setRoll2(null);
    setFinalResult(null);
    setMultiTotal(null);
    setMultiBreakdown([]);
    setMultiDiceData([]);
    setCurrentPhase(0);
  }, []);

  const addToHistory = useCallback((value: number) => {
    setRollHistory(prev => [value, ...prev].slice(0, 5));
  }, []);

  const generateEmptyDiceData = useCallback((multiSelection: Record<DiceType, number>): DiceData[] => {
    const data: DiceData[] = [];
    let idx = 0;
    (Object.entries(multiSelection) as [DiceType, number][])
      .filter(([, count]) => count > 0)
      .forEach(([type, count]) => {
        for (let i = 0; i < count; i++) {
          data.push({ type, result: null, id: `${type}-${idx++}` });
        }
      });
    return data;
  }, []);

  const startRoll = useCallback((params: RollParams) => {
    const { selectedDie, isMultiMode, multiSelection, rollMode, onComplete } = params;
    
    // Prevent double-clicks
    if (rollInProgress.current || isRolling) return;
    rollInProgress.current = true;

    const totalDice = Object.values(multiSelection).reduce((sum, c) => sum + c, 0);
    const duration = animationDuration + Math.random() * 500;
    const soundCount = isMultiMode && totalDice > 0 ? totalDice : 1;

    // CRITICAL: Clear ALL previous results before starting new roll
    clearAllResults();
    
    soundManager.playDiceRoll(soundCount);

    // === MULTI-DICE ROLL ===
    if (isMultiMode && totalDice > 0) {
      const emptyDice = generateEmptyDiceData(multiSelection);
      setIsRolling(true);
      setMultiDiceData(emptyDice);

      if (rollMode === 'normal') {
        // Normal multi-dice
        setCurrentPhase(0);
        
        setTimeout(() => {
          let total = 0;
          const breakdown: DiceBreakdown[] = [];
          const rolled: DiceData[] = [];
          let idx = 0;

          (Object.entries(multiSelection) as [DiceType, number][])
            .filter(([, count]) => count > 0)
            .forEach(([type, count]) => {
              const sides = getSidesForDie(type);
              const results: number[] = [];
              for (let i = 0; i < count; i++) {
                const value = rollDie(sides);
                results.push(value);
                total += value;
                rolled.push({ type, result: value, id: `${type}-${idx++}` });
              }
              breakdown.push({ type, count, results });
            });

          setIsRolling(false);
          setMultiTotal(total);
          setMultiBreakdown(breakdown);
          setMultiDiceData(rolled);
          addToHistory(total);
          rollInProgress.current = false;
          onComplete?.();
        }, duration);

      } else {
        // Advantage/Disadvantage multi-dice
        setCurrentPhase(1);

        // FIRST ROLL
        setTimeout(() => {
          const roll1Dice: DiceData[] = [];
          let idx = 0;

          (Object.entries(multiSelection) as [DiceType, number][])
            .filter(([, count]) => count > 0)
            .forEach(([type, count]) => {
              const sides = getSidesForDie(type);
              for (let i = 0; i < count; i++) {
                const value = rollDie(sides);
                roll1Dice.push({ 
                  type, 
                  result: value, 
                  roll1Result: value, 
                  id: `${type}-${idx++}` 
                });
              }
            });

          setIsRolling(false);
          setMultiDiceData(roll1Dice);

          // SECOND ROLL (auto-triggered)
          setTimeout(() => {
            soundManager.playDiceRoll(soundCount);
            setIsRolling(true);
            setCurrentPhase(2);

            setTimeout(() => {
              let finalTotal = 0;
              const finalDice: DiceData[] = [];
              const breakdown: DiceBreakdown[] = [];
              const typeResults: Record<DiceType, number[]> = {
                d3: [], d4: [], d6: [], d8: [], d10: [], d12: [], d20: []
              };

              roll1Dice.forEach((die) => {
                const sides = getSidesForDie(die.type);
                const r2 = rollDie(sides);
                const r1 = die.roll1Result!;
                const final = rollMode === 'advantage' 
                  ? Math.max(r1, r2) 
                  : Math.min(r1, r2);

                finalTotal += final;
                typeResults[die.type].push(final);
                finalDice.push({
                  ...die,
                  result: final,
                  roll2Result: r2,
                  finalResult: final,
                });
              });

              Object.entries(typeResults).forEach(([type, results]) => {
                if (results.length > 0) {
                  breakdown.push({ type: type as DiceType, count: results.length, results });
                }
              });

              setIsRolling(false);
              setCurrentPhase(0);
              setMultiTotal(finalTotal);
              setMultiBreakdown(breakdown);
              setMultiDiceData(finalDice);
              addToHistory(finalTotal);
              rollInProgress.current = false;
              onComplete?.();
            }, duration);
          }, 800);
        }, duration);
      }
      return;
    }

    // === SINGLE DIE ROLL ===
    setIsRolling(true);
    const sides = getSidesForDie(selectedDie);

    if (rollMode !== 'normal') {
      // Advantage/Disadvantage single die
      setCurrentPhase(1);

      setTimeout(() => {
        const r1 = rollDie(sides);
        setIsRolling(false);
        setSingleResult(r1);
        setRoll1(r1);

        // Second roll
        setTimeout(() => {
          soundManager.playDiceRoll(1);
          setIsRolling(true);
          setCurrentPhase(2);

          setTimeout(() => {
            const r2 = rollDie(sides);
            const final = rollMode === 'advantage' ? Math.max(r1, r2) : Math.min(r1, r2);

            setIsRolling(false);
            setCurrentPhase(0);
            setSingleResult(final); // Show FINAL on dice
            setRoll2(r2);
            setFinalResult(final);
            addToHistory(final);
            rollInProgress.current = false;
          }, duration);
        }, 800);
      }, duration);
    } else {
      // Normal single die
      setCurrentPhase(0);

      setTimeout(() => {
        const value = rollDie(sides);
        setIsRolling(false);
        setSingleResult(value);
        addToHistory(value);
        rollInProgress.current = false;
      }, duration);
    }
  }, [isRolling, animationDuration, clearAllResults, addToHistory, generateEmptyDiceData]);

  return {
    isRolling,
    currentPhase,
    singleResult,
    roll1,
    roll2,
    finalResult,
    multiTotal,
    multiBreakdown,
    multiDiceData,
    rollHistory,
    startRoll,
    clearAllResults,
  };
};
