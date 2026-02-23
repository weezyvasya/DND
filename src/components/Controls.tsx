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
    <div className="absolute top-4 right-4 flex gap-2 z-50">
      {/* Multiple Dice Mode Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleMulti();
        }}
        className={`px-3 h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-colors backdrop-blur-sm border ${
          isMultiMode
            ? 'bg-blue-600/80 border-blue-400 text-white'
            : 'bg-black/30 hover:bg-black/50 border-white/20 text-white/80'
        }`}
        title="Multiple dice mode"
      >
        Multiple
      </button>

      {/* Settings Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSettings();
        }}
        className="w-8 h-8 flex items-center justify-center bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors backdrop-blur-sm"
        title="Settings"
      >
        &#128736;
      </button>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="w-8 h-8 flex items-center justify-center bg-red-500/30 hover:bg-red-500/50 rounded-full text-white transition-colors backdrop-blur-sm"
        title="Close"
      >
        &#10062;
      </button>
    </div>
  );
};

export default Controls;
