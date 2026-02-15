import React from 'react';

interface ControlsProps {
  isRolling: boolean;
  onRoll: () => void;
  onClose: () => void;
  onSettings: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isRolling, onRoll, onClose, onSettings }) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-50">
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
