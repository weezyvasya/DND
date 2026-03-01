// Dice Types
export type DiceType = 'd3' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';
export type DiceSize = 'small' | 'medium' | 'large' | 'xl';
export type RollMode = 'normal' | 'advantage' | 'disadvantage';

// Dice Data for multi-dice display
export interface DiceData {
  type: DiceType;
  result: number | null;
  roll1Result?: number;
  roll2Result?: number;
  finalResult?: number;
  id: string;
}

// Breakdown of results by dice type
export interface DiceBreakdown {
  type: DiceType;
  count: number;
  results: number[];
}

// Settings
export interface AppSettings {
  clickThrough: boolean;
  opacity: number;
  animationSpeed: number;
  diceSize: DiceSize;
  windowWidth: number;
  windowHeight: number;
}

// Constants
export const DICE_TYPES: { id: DiceType; label: string }[] = [
  { id: 'd3', label: 'd3' },
  { id: 'd4', label: 'd4' },
  { id: 'd6', label: 'd6' },
  { id: 'd8', label: 'd8' },
  { id: 'd10', label: 'd10' },
  { id: 'd12', label: 'd12' },
  { id: 'd20', label: 'd20' },
];

// Utility functions
export const getSidesForDie = (type: DiceType): number => {
  const sides: Record<DiceType, number> = {
    d3: 3, d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20
  };
  return sides[type];
};

export const createEmptySelection = (): Record<DiceType, number> => ({
  d3: 0, d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0,
});

export const rollDie = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};
