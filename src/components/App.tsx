import React, { useState, useEffect, useCallback } from "react";
import Dice3D from "./Dice3D";
import Controls from "./Controls";
import Settings from "./Settings";
import RollHistory from "./RollHistory";
import RollButton from "./RollButton";

type DiceType = "d3" | "d4" | "d6" | "d8" | "d10" | "d12" | "d20";
type DiceSize = "small" | "medium" | "large";

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
    clickThrough: true,
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
    if (window.electronAPI) {
      window.electronAPI.setClickThrough(state.clickThrough);
    }
  }, [state.clickThrough]);

  useEffect(() => {
    // Set window opacity
    if (window.electronAPI) {
      window.electronAPI.setOpacity(state.opacity);
    }
  }, [state.opacity]);

  const handleRoll = useCallback(() => {
    if (state.isRolling) return;

    const { isMultiMode, selectedDie, multiSelection } = state;

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
        const breakdown: { type: DiceType; count: number; results: number[] }[] =
          [];

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
        }));
      }
    }, animationDuration);
  }, [state.isRolling, state.isMultiMode, state.selectedDie, state.multiSelection]);

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
      Pick<
        AppState,
        "clickThrough" | "opacity" | "animationSpeed" | "diceSize"
      >
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
      ...(prev.isMultiMode
        ? { multiTotal: null, multiBreakdown: [] }
        : null),
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
      ? activeMultiEntries
          .map(([type, count]) => `${count}${type}`)
          .join(" + ")
      : "";

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-transparent"
      style={{ opacity: state.opacity }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center draggable-area">
        {/* Dice type selector */}
        <div className="absolute top-4 left-4 flex gap-2 z-40">
          {DICE_TYPES.map((die) => {
            const isActive = state.selectedDie === die.id;
            const count = state.multiSelection[die.id];
            return (
              <div key={die.id} className="flex flex-col items-start gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDieIconClick(die.id);
                  }}
                  className={`px-2 py-1 rounded-md text-xs font-semibold border transition-colors backdrop-blur-sm ${
                    isActive
                      ? "bg-blue-600/80 border-blue-400 text-white"
                      : "bg-black/40 border-white/20 text-white/70 hover:bg-black/60 hover:text-white"
                  }`}
                >
                  {die.label}
                </button>

                {state.isMultiMode && (
                  <div className="flex items-center gap-1 text-[10px] text-white/80">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrementDie(die.id);
                      }}
                      className="w-4 h-4 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70"
                    >
                      -
                    </button>
                    <span className="min-w-[1.25rem] text-center">
                      {count}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrementDie(die.id);
                      }}
                      className="w-4 h-4 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Dice Area */}
        {/* <h1 className="text-3xl font-bold underline text-blue-600">
          Hello world!
        </h1> */}
        <div className="relative flex flex-col items-center justify-center">
          {state.isDiceVisible && (
            <div className="relative flex flex-col items-center justify-center">
              {/* Dice label */}
              <div className="absolute -top-6 text-white/80 text-sm font-semibold tracking-wide drop-shadow">
                {state.selectedDie}
              </div>

              {/* Close (hide) button on the centered dice */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleHideCenterDice();
                }}
                className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center bg-red-500/30 hover:bg-red-500/50 rounded-full text-white transition-colors backdrop-blur-sm z-50"
                title="Hide"
              >
                &#10062;
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
              <div className="mt-6 text-6xl font-bold text-blue-500 drop-shadow-lg">
                {state.result}
              </div>
            )}

          {state.isMultiMode && state.isDiceVisible && (
            <>
              {selectionLabel && (
                <div className="mt-5 text-sm text-blue-500 font-semibold tracking-wide drop-shadow">
                  {selectionLabel}
                </div>
              )}

              {state.multiTotal !== null && !state.isRolling && (
                <div className="mt-3 text-4xl font-bold text-blue-500 drop-shadow-lg">
                  {state.multiTotal}
                </div>
              )}

              {state.multiBreakdown.length > 0 && !state.isRolling && (
                <div className="mt-2 text-xs text-white/75 text-center space-y-1 max-w-xs">
                  {state.multiBreakdown.map((entry) => (
                    <div key={entry.type}>
                      <span className="font-semibold">{entry.type}:</span>{" "}
                      <span>{entry.results.join(", ")}</span>
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
        <Controls
          isRolling={state.isRolling}
          onRoll={handleRoll}
          onClose={handleClose}
          onSettings={toggleSettings}
          isMultiMode={state.isMultiMode}
          onToggleMulti={handleToggleMultiMode}
        />

        {/* Settings Panel */}
        {state.showSettings && (
          <Settings
            clickThrough={state.clickThrough}
            opacity={state.opacity}
            animationSpeed={state.animationSpeed}
            diceSize={state.diceSize}
            onUpdate={updateSettings}
            onClose={toggleSettings}
          />
        )}

        {/* Roll History */}
        {state.rollHistory.length > 0 && (
          <RollHistory rolls={state.rollHistory} />
        )}
      </div>
    </div>
  );
};

export default App;

//зайти на сайт тэйлвинд и попременять стили, изучить названия классов
