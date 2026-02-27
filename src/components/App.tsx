import React, { useState, useEffect, useCallback, useRef } from "react";
import Dice3D from "./Dice3D";
import Controls from "./Controls";
import Settings from "./Settings";
import RollHistory from "./RollHistory";
import RollButton from "./RollButton";
import { soundManager } from "../utils/sound";

type DiceType = "d3" | "d4" | "d6" | "d8" | "d10" | "d12" | "d20";
type DiceSize = "small" | "medium" | "large" | "xl";

const DICE_TYPES: { id: DiceType; label: string }[] = [
  { id: "d3", label: "d3" },
  { id: "d4", label: "d4" },
  { id: "d6", label: "d6" },
  { id: "d8", label: "d8" },
  { id: "d10", label: "d10" },
  { id: "d12", label: "d12" },
  { id: "d20", label: "d20" },
];

const getSidesForDie = (type: DiceType): number => {
  switch (type) {
    case "d3":
      return 3;
    case "d4":
      return 4;
    case "d6":
      return 6;
    case "d8":
      return 8;
    case "d10":
      return 10;
    case "d12":
      return 12;
    case "d20":
    default:
      return 20;
  }
};

interface AppState {
  isRolling: boolean;
  result: number | null;
  rollHistory: number[];
  clickThrough: boolean;
  opacity: number;
  animationSpeed: number;
  showSettings: boolean;
  selectedDie: DiceType;
  diceSize: DiceSize;
  isDiceVisible: boolean;
  isMultiMode: boolean;
  multiSelection: Record<DiceType, number>;
  multiTotal: number | null;
  multiBreakdown: { type: DiceType; count: number; results: number[] }[];
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isRolling: false,
    result: null,
    rollHistory: [],
    clickThrough: false,
    opacity: 1.0,
    animationSpeed: 1.0,
    showSettings: false,
    selectedDie: "d20",
    diceSize: "medium",
    isDiceVisible: true,
    isMultiMode: false,
    multiSelection: {
      d3: 0,
      d4: 0,
      d6: 0,
      d8: 0,
      d10: 0,
      d12: 0,
      d20: 0,
    },
    multiTotal: null,
    multiBreakdown: [],
  });

  // Track if mouse is over interactive UI elements
  const [isMouseOverUI, setIsMouseOverUI] = useState(false);

  useEffect(() => {
    // Initialize opacity from Electron
    const initOpacity = async () => {
      if (window.electronAPI) {
        const currentOpacity = await window.electronAPI.getOpacity();
        setState((prev) => ({ ...prev, opacity: currentOpacity }));
      }
    };
    initOpacity();
  }, []);

  useEffect(() => {
    // Set click-through mode
    // Disable click-through when:
    // - Settings is open
    // - Mouse is hovering over UI elements
    if (window.electronAPI) {
      const shouldClickThrough = state.clickThrough && !state.showSettings && !isMouseOverUI;
      window.electronAPI.setClickThrough(shouldClickThrough);
    }
  }, [state.clickThrough, state.showSettings, isMouseOverUI]);

  // Handlers for mouse enter/leave on interactive areas
  const handleMouseEnterUI = useCallback(() => {
    setIsMouseOverUI(true);
  }, []);

  const handleMouseLeaveUI = useCallback(() => {
    setIsMouseOverUI(false);
  }, []);

  useEffect(() => {
    // Set window opacity
    if (window.electronAPI) {
      window.electronAPI.setOpacity(state.opacity);
    }
  }, [state.opacity]);

  const handleRoll = useCallback(() => {
    if (state.isRolling) return;

    const { isMultiMode, selectedDie, multiSelection } = state;

    // Play dice rolling sound
    soundManager.playDiceRoll();

    setState((prev) => ({ ...prev, isRolling: true }));

    // Roll animation duration (2-3 seconds)
    const animationDuration = 2000 + Math.random() * 1000;

    setTimeout(() => {
      if (!isMultiMode) {
        const sides = getSidesForDie(selectedDie);
        const newResult = Math.floor(Math.random() * sides) + 1;
        setState((prev) => ({
          ...prev,
          result: newResult,
          isRolling: false,
          // keep history as single values
          rollHistory: [newResult, ...prev.rollHistory].slice(0, 5),
          // clear multi-specific results when in single mode
          multiTotal: null,
          multiBreakdown: [],
        }));
      } else {
        const entries = Object.entries(multiSelection).filter(
          ([, count]) => count > 0,
        ) as [DiceType, number][];

        if (entries.length === 0) {
          // nothing selected, just stop rolling
          setState((prev) => ({ ...prev, isRolling: false }));
          return;
        }

        let total = 0;
        const breakdown: {
          type: DiceType;
          count: number;
          results: number[];
        }[] = [];

        entries.forEach(([type, count]) => {
          const sides = getSidesForDie(type);
          const results: number[] = [];
          for (let i = 0; i < count; i += 1) {
            const roll = Math.floor(Math.random() * sides) + 1;
            results.push(roll);
            total += roll;
          }
          breakdown.push({ type, count, results });
        });

        setState((prev) => ({
          ...prev,
          isRolling: false,
          result: null,
          multiTotal: total,
          multiBreakdown: breakdown,
          rollHistory: [total, ...prev.rollHistory].slice(0, 5),
          // Auto-switch back to normal mode after multi roll
          isMultiMode: false,
          // Reset multi selection counts
          multiSelection: {
            d3: 0,
            d4: 0,
            d6: 0,
            d8: 0,
            d10: 0,
            d12: 0,
            d20: 0,
          },
        }));
      }
    }, animationDuration);
  }, [
    state.isRolling,
    state.isMultiMode,
    state.selectedDie,
    state.multiSelection,
  ]);

  useEffect(() => {
    // Keyboard shortcut for rolling (Spacebar)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && !state.isRolling && !state.showSettings) {
        e.preventDefault();
        handleRoll();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [state.isRolling, state.showSettings, handleRoll]);

  const handleClose = () => {
    if (window.electronAPI) {
      window.electronAPI.closeApp();
    }
  };

  const toggleSettings = () => {
    setState((prev) => ({ ...prev, showSettings: !prev.showSettings }));
  };

  const updateSettings = (
    updates: Partial<
      Pick<AppState, "clickThrough" | "opacity" | "animationSpeed" | "diceSize">
    >,
  ) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectDie = (die: DiceType) => {
    if (state.isRolling) return;
    setState((prev) => {
      // If hidden, reselecting the same die shows it again
      if (!prev.isDiceVisible && prev.selectedDie === die) {
        return { ...prev, isDiceVisible: true };
      }

      // Selecting any die shows the center dice
      if (prev.selectedDie !== die) {
        return {
          ...prev,
          selectedDie: die,
          isDiceVisible: true,
          result: null,
        };
      }

      return prev;
    });
  };

  const handleHideCenterDice = () => {
    if (state.isRolling) return;
    setState((prev) => ({ ...prev, isDiceVisible: false }));
  };

  const handleToggleMultiMode = () => {
    setState((prev) => ({
      ...prev,
      isMultiMode: !prev.isMultiMode,
      // when leaving multi mode, keep selection but clear multi results from UI
      ...(prev.isMultiMode ? { multiTotal: null, multiBreakdown: [] } : null),
    }));
  };

  const handleIncrementDie = (die: DiceType) => {
    setState((prev) => ({
      ...prev,
      multiSelection: {
        ...prev.multiSelection,
        [die]: prev.multiSelection[die] + 1,
      },
      // make this die the focused one visually
      selectedDie: prev.selectedDie,
    }));
  };

  const handleDecrementDie = (die: DiceType) => {
    setState((prev) => {
      const current = prev.multiSelection[die];
      const nextCount = current > 0 ? current - 1 : 0;
      if (nextCount === current) return prev;
      return {
        ...prev,
        multiSelection: {
          ...prev.multiSelection,
          [die]: nextCount,
        },
      };
    });
  };

  const handleDieIconClick = (die: DiceType) => {
    if (!state.isMultiMode) {
      handleSelectDie(die);
    } else {
      // In multi mode, clicking the icon increments that die and focuses it
      setState((prev) => ({
        ...prev,
        selectedDie: die,
        isDiceVisible: true,
        multiSelection: {
          ...prev.multiSelection,
          [die]: prev.multiSelection[die] + 1,
        },
      }));
    }
  };

  const activeMultiEntries = Object.entries(state.multiSelection).filter(
    ([, count]) => count > 0,
  ) as [DiceType, number][];

  const selectionLabel =
    activeMultiEntries.length > 0
      ? activeMultiEntries.map(([type, count]) => `${count}${type}`).join(" + ")
      : "";

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-transparent"
      style={{ opacity: state.opacity }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center draggable-area">
        {/* Dice type selector */}
        <div 
          className="absolute top-4 left-4 flex gap-2 z-40 flex-wrap max-w-[420px] p-3 rounded-xl ui-panel"
          onMouseEnter={handleMouseEnterUI}
          onMouseLeave={handleMouseLeaveUI}
        >
          {DICE_TYPES.map((die) => {
            const isActive = state.selectedDie === die.id;
            const count = state.multiSelection[die.id];
            return (
              <div
                key={die.id}
                className={`flex items-center rounded-lg border-2 transition-all ${
                  isActive
                    ? "bg-blue-600/90 border-blue-400 shadow-lg shadow-blue-500/30"
                    : "bg-gray-800/80 border-gray-600/50 hover:bg-gray-700/80 hover:border-gray-500"
                }`}
              >
                {/* Minus button (only in multi mode) */}
                {state.isMultiMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecrementDie(die.id);
                    }}
                    className={`w-6 h-8 flex items-center justify-center text-sm font-bold rounded-l-md transition-colors ${
                      count > 0
                        ? "text-white hover:bg-red-500/40"
                        : "text-white/30 cursor-not-allowed"
                    }`}
                    disabled={count === 0}
                  >
                    −
                  </button>
                )}

                {/* Dice label button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDieIconClick(die.id);
                  }}
                  className={`px-2 py-1.5 text-sm font-bold transition-colors ${
                    isActive ? "text-white" : "text-white/80 hover:text-white"
                  } ${state.isMultiMode ? "" : "rounded-lg"}`}
                >
                  {state.isMultiMode && count > 0 ? `${count}${die.label}` : die.label}
                </button>

                {/* Plus button (only in multi mode) */}
                {state.isMultiMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIncrementDie(die.id);
                    }}
                    className="w-6 h-8 flex items-center justify-center text-sm font-bold text-white hover:bg-green-500/40 rounded-r-md transition-colors"
                  >
                    +
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Dice Area */}
        <div 
          className="relative flex flex-col items-center justify-center"
          onMouseEnter={handleMouseEnterUI}
          onMouseLeave={handleMouseLeaveUI}
        >
          {state.isDiceVisible && (
            <div className="relative flex flex-col items-center justify-center dice-container">
              {/* Dice label */}
              <div className="absolute -top-2 text-white text-lg font-bold tracking-wide dice-label uppercase">
                {state.selectedDie}
              </div>

              {/* Close (hide) button on the centered dice */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleHideCenterDice();
                }}
                className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-red-600/60 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm z-50 border border-red-400/50"
                title="Hide"
              >
                ✕
              </button>

              <Dice3D
                result={state.result}
                isRolling={state.isRolling}
                animationSpeed={state.animationSpeed}
                onRoll={handleRoll}
                sides={getSidesForDie(state.selectedDie)}
                size={state.diceSize}
              />
            </div>
          )}

          {/* Result Display */}
          {!state.isMultiMode &&
            state.isDiceVisible &&
            state.result &&
            !state.isRolling && (
              <div className="mt-4 text-7xl font-black text-blue-400 result-text">
                {state.result}
              </div>
            )}

          {state.isMultiMode && state.isDiceVisible && (
            <>
              {selectionLabel && (
                <div className="mt-4 px-4 py-2 rounded-lg ui-panel text-lg text-blue-400 font-bold tracking-wide">
                  {selectionLabel}
                </div>
              )}

              {state.multiTotal !== null && !state.isRolling && (
                <div className="mt-3 text-6xl font-black text-blue-400 result-text">
                  {state.multiTotal}
                </div>
              )}

              {state.multiBreakdown.length > 0 && !state.isRolling && (
                <div className="mt-3 px-4 py-2 rounded-lg ui-panel text-sm text-white text-center space-y-1">
                  {state.multiBreakdown.map((entry) => (
                    <div key={entry.type} className="breakdown-text">
                      <span className="font-bold text-blue-400">{entry.type}:</span>{" "}
                      <span className="text-white">{entry.results.join(", ")}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Roll Button */}
          {state.isDiceVisible && (
            <RollButton isRolling={state.isRolling} onRoll={handleRoll} />
          )}
        </div>

        {/* Controls */}
        <div
          onMouseEnter={handleMouseEnterUI}
          onMouseLeave={handleMouseLeaveUI}
        >
          <Controls
            isRolling={state.isRolling}
            onRoll={handleRoll}
            onClose={handleClose}
            onSettings={toggleSettings}
            isMultiMode={state.isMultiMode}
            onToggleMulti={handleToggleMultiMode}
          />
        </div>

        {/* Settings Panel */}
        {state.showSettings && (
          <div
            onMouseEnter={handleMouseEnterUI}
            onMouseLeave={handleMouseLeaveUI}
          >
            <Settings
              clickThrough={state.clickThrough}
              opacity={state.opacity}
              animationSpeed={state.animationSpeed}
              diceSize={state.diceSize}
              onUpdate={updateSettings}
              onClose={toggleSettings}
            />
          </div>
        )}

        {/* Roll History */}
        {state.rollHistory.length > 0 && (
          <div
            onMouseEnter={handleMouseEnterUI}
            onMouseLeave={handleMouseLeaveUI}
          >
            <RollHistory rolls={state.rollHistory} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

//зайти на сайт тэйлвинд и попременять стили, изучить названия классов
