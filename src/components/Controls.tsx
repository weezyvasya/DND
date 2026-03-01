import React from 'react';

interface ControlsProps {
  isRolling: boolean;
  onRoll: () => void;
  onClose: () => void;
  onSettings: () => void;
  isMultiMode: boolean;
  onToggleMulti: () => void;
  isMaximized: boolean;
  onMaximize: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRolling,
  onRoll,
  onClose,
  onSettings,
  isMultiMode,
  onToggleMulti,
  isMaximized,
  onMaximize,
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

      {/* Maximize/Fullscreen Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
        className={`w-9 h-9 flex items-center justify-center rounded-lg text-white transition-all border-2 text-sm ${
          isMaximized
            ? 'bg-green-600/80 hover:bg-green-500 border-green-500/50 hover:border-green-400'
            : 'bg-gray-800/80 hover:bg-gray-700/80 border-gray-600/50 hover:border-gray-500'
        }`}
        title={isMaximized ? "Restore window" : "Maximize window"}
      >
        {isMaximized ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="1" width="9" height="9" rx="1" />
            <rect x="1" y="4" width="9" height="9" rx="1" fill="currentColor" fillOpacity="0.3" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="12" height="12" rx="1" />
          </svg>
        )}
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
