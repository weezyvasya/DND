import React, { useState, useEffect, useCallback } from "react";
import Dice3D from "./Dice3D";
import Controls from "./Controls";
import Settings from "./Settings";
import RollHistory from "./RollHistory";
import RollButton from "./RollButton";

interface AppState {
  isRolling: boolean;
  result: number | null;
  rollHistory: number[];
  clickThrough: boolean;
  opacity: number;
  animationSpeed: number;
  showSettings: boolean;
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

    setState((prev) => ({ ...prev, isRolling: true }));

    // Roll animation duration (2-3 seconds)
    const animationDuration = 2000 + Math.random() * 1000;

    setTimeout(() => {
      const newResult = Math.floor(Math.random() * 20) + 1;
      setState((prev) => ({
        ...prev,
        result: newResult,
        isRolling: false,
        rollHistory: [newResult, ...prev.rollHistory].slice(0, 5),
      }));
    }, animationDuration);
  }, [state.isRolling]);

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
      Pick<AppState, "clickThrough" | "opacity" | "animationSpeed">
    >,
  ) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-transparent"
      style={{ opacity: state.opacity }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center draggable-area">
        {/* Main Dice Area */}
        {/* <h1 className="text-3xl font-bold underline text-blue-600">
          Hello world!
        </h1> */}
        <div className="relative flex flex-col items-center justify-center">
          <Dice3D
            result={state.result}
            isRolling={state.isRolling}
            animationSpeed={state.animationSpeed}
            onRoll={handleRoll}
          />

          {/* Result Display */}
          {state.result && !state.isRolling && (
            <div className="mt-6 text-6xl font-bold text-white drop-shadow-lg">
              {state.result}
            </div>
          )}

          {/* Roll Button */}
          <RollButton isRolling={state.isRolling} onRoll={handleRoll} />
        </div>

        {/* Controls */}
        <Controls
          isRolling={state.isRolling}
          onRoll={handleRoll}
          onClose={handleClose}
          onSettings={toggleSettings}
        />

        {/* Settings Panel */}
        {state.showSettings && (
          <Settings
            clickThrough={state.clickThrough}
            opacity={state.opacity}
            animationSpeed={state.animationSpeed}
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
