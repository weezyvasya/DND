import React from 'react';

interface ControlsProps {
  isRolling: boolean;
  onRoll: () => void;
  onClose: () => void;
  onSettings: () => void;
  isMultiMode: boolean;
  onToggleMulti: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRolling,
  onRoll,
  onClose,
  onSettings,
  isMultiMode,
  onToggleMulti,
}) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-50 p-2 rounded-xl ui-panel">
      {/* Multiple Dice Mode Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleMulti();
        }}
        className={`px-4 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all border-2 ${
          isMultiMode
            ? 'bg-blue-600/90 border-blue-400 text-white shadow-lg shadow-blue-500/30'
            : 'bg-gray-800/80 hover:bg-gray-700/80 border-gray-600/50 text-white/90 hover:border-gray-500'
        }`}
        title="Multiple dice mode"
      >
        🎯 Multi
      </button>

      {/* Settings Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSettings();
        }}
        className="w-9 h-9 flex items-center justify-center bg-gray-800/80 hover:bg-gray-700/80 rounded-lg text-white transition-all border-2 border-gray-600/50 hover:border-gray-500 text-lg"
        title="Settings"
      >
        ⚙️
      </button>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="w-9 h-9 flex items-center justify-center bg-red-600/80 hover:bg-red-500 rounded-lg text-white transition-all border-2 border-red-500/50 hover:border-red-400 text-lg"
        title="Close App"
      >
        ✕
      </button>
    </div>
  );
};

export default Controls;
