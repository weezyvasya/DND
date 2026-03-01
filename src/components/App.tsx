import React, { useEffect, useCallback } from 'react';
import { useDiceRoller, useSettings, useDiceSelection } from '../hooks';
import { DiceData, createEmptySelection } from '../types';

import DiceSelector from './DiceSelector';
import RollModeToggle from './RollModeToggle';
import { SingleDiceArea, MultiDiceArea } from './DiceArea';
import { 
  PhaseIndicator, 
  SingleResult, 
  AdvantageResult, 
  MultiTotal, 
  MultiBreakdown, 
  SelectionLabel 
} from './ResultDisplay';
import Controls from './Controls';
import Settings from './Settings';
import RollHistory from './RollHistory';
import RollButton from './RollButton';

const App: React.FC = () => {
  // Settings hook
  const {
    settings,
    showSettings,
    setShowSettings,
    updateSettings,
    handleMouseEnterUI,
    handleMouseLeaveUI,
    screenSize,
    isMaximized,
    toggleMaximize,
  } = useSettings();

  // Dice roller hook
  const roller = useDiceRoller(settings.animationSpeed * 2000);

  // Selection hook
  const selection = useDiceSelection(roller.isRolling, roller.clearAllResults);

  // Handle roll action
  const handleRoll = useCallback(() => {
    roller.startRoll({
      selectedDie: selection.selectedDie,
      isMultiMode: selection.isMultiMode,
      multiSelection: selection.multiSelection,
      rollMode: selection.rollMode,
      onComplete: selection.resetMultiSelection,
    });
  }, [roller, selection]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !roller.isRolling && !showSettings) {
        e.preventDefault();
        handleRoll();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [roller.isRolling, showSettings, handleRoll]);

  // Close app handler
  const handleCloseApp = () => {
    if (window.electronAPI) window.electronAPI.closeApp();
  };

  // Close dice handler (also clears results)
  const handleCloseDice = useCallback(() => {
    selection.hideDice();
    handleMouseLeaveUI();
  }, [selection, handleMouseLeaveUI]);

  // Computed display conditions
  const hasMultiResults = roller.multiDiceData.length > 0 && 
    roller.multiDiceData.some(d => d.result !== null);
  const showMultiDice = (selection.isMultiMode && selection.totalDiceCount > 0) || hasMultiResults;
  const showSingleDice = !showMultiDice && selection.isDiceVisible;
  
  // Generate dice data for display
  const getDiceData = (): DiceData[] => {
    if (roller.multiDiceData.length > 0) return roller.multiDiceData;
    
    const data: DiceData[] = [];
    let idx = 0;
    (Object.entries(selection.multiSelection) as [string, number][])
      .filter(([, count]) => count > 0)
      .forEach(([type, count]) => {
        for (let i = 0; i < count; i++) {
          data.push({ type: type as any, result: null, id: `${type}-${idx++}` });
        }
      });
    return data;
  };

  // Show conditions
  const showPhase = selection.rollMode !== 'normal' && roller.currentPhase > 0;
  const showNormalResult = selection.rollMode === 'normal' && 
    roller.singleResult !== null && 
    !roller.isRolling && 
    !showMultiDice;
  const showAdvantageResult = selection.rollMode !== 'normal' && 
    !roller.isRolling && 
    roller.finalResult !== null && 
    !showMultiDice;

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent" 
         style={{ opacity: settings.opacity }}>
      <div className="relative w-full h-full flex flex-col items-center justify-center draggable-area">
        
        {/* Dice Selector - Top Left */}
        <div className="absolute top-4 left-4 z-40" 
             onMouseEnter={handleMouseEnterUI} 
             onMouseLeave={handleMouseLeaveUI}>
          <DiceSelector
            selectedDie={selection.selectedDie}
            isMultiMode={selection.isMultiMode}
            multiSelection={selection.multiSelection}
            isRolling={roller.isRolling}
            onSelectDie={selection.selectDie}
            onIncrementDie={selection.incrementDie}
            onDecrementDie={selection.decrementDie}
          />
        </div>

        {/* Roll Mode Toggle - Top Center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40" 
             onMouseEnter={handleMouseEnterUI} 
             onMouseLeave={handleMouseLeaveUI}>
          <RollModeToggle
            currentMode={selection.rollMode}
            onModeChange={selection.setRollMode}
          />
        </div>

        {/* Main Dice Area - Center */}
        <div className="relative flex flex-col items-center justify-center"
             onMouseEnter={handleMouseEnterUI} 
             onMouseLeave={handleMouseLeaveUI}>
          
          {showPhase && <PhaseIndicator phase={roller.currentPhase} />}

          {showMultiDice && selection.isDiceVisible && (
            <MultiDiceArea
              diceData={getDiceData()}
              isRolling={roller.isRolling}
              animationSpeed={settings.animationSpeed}
              onRoll={handleRoll}
              onClose={handleCloseDice}
            />
          )}

          {showSingleDice && (
            <SingleDiceArea
              selectedDie={selection.selectedDie}
              result={roller.singleResult}
              isRolling={roller.isRolling}
              animationSpeed={settings.animationSpeed}
              diceSize={settings.diceSize}
              onRoll={handleRoll}
              onClose={handleCloseDice}
            />
          )}

          {showAdvantageResult && roller.roll1 !== null && roller.roll2 !== null && (
            <AdvantageResult
              roll1={roller.roll1}
              roll2={roller.roll2}
              finalResult={roller.finalResult!}
              mode={selection.rollMode}
            />
          )}

          {showNormalResult && <SingleResult result={roller.singleResult!} />}

          {roller.multiTotal !== null && !roller.isRolling && (
            <MultiTotal total={roller.multiTotal} />
          )}

          {roller.multiBreakdown.length > 0 && !roller.isRolling && (
            <MultiBreakdown
              breakdown={roller.multiBreakdown}
              diceData={roller.multiDiceData}
              rollMode={selection.rollMode}
            />
          )}

          {selection.isMultiMode && selection.selectionLabel && !roller.multiTotal && (
            <SelectionLabel label={selection.selectionLabel} />
          )}

          {selection.isDiceVisible && (
            <RollButton isRolling={roller.isRolling} onRoll={handleRoll} />
          )}
        </div>

        {/* Controls - Top Right */}
        <div onMouseEnter={handleMouseEnterUI} onMouseLeave={handleMouseLeaveUI}>
          <Controls
            isRolling={roller.isRolling}
            onRoll={handleRoll}
            onClose={handleCloseApp}
            onSettings={() => setShowSettings(true)}
            isMultiMode={selection.isMultiMode}
            onToggleMulti={selection.toggleMultiMode}
            isMaximized={isMaximized}
            onMaximize={toggleMaximize}
          />
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div onMouseEnter={handleMouseEnterUI} onMouseLeave={handleMouseLeaveUI}>
            <Settings
              clickThrough={settings.clickThrough}
              opacity={settings.opacity}
              animationSpeed={settings.animationSpeed}
              diceSize={settings.diceSize}
              windowWidth={settings.windowWidth}
              windowHeight={settings.windowHeight}
              screenSize={screenSize}
              onUpdate={updateSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}

        {/* Roll History */}
        {roller.rollHistory.length > 0 && (
          <div onMouseEnter={handleMouseEnterUI} onMouseLeave={handleMouseLeaveUI}>
            <RollHistory rolls={roller.rollHistory} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
