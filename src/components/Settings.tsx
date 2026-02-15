import React, { useState } from 'react';

interface SettingsProps {
  clickThrough: boolean;
  opacity: number;
  animationSpeed: number;
  onUpdate: (updates: { clickThrough?: boolean; opacity?: number; animationSpeed?: number }) => void;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ clickThrough, opacity, animationSpeed, onUpdate, onClose }) => {
  const [localClickThrough, setLocalClickThrough] = useState(clickThrough);
  const [localOpacity, setLocalOpacity] = useState(opacity);
  const [localAnimationSpeed, setLocalAnimationSpeed] = useState(animationSpeed);

  const handleClickThroughChange = (value: boolean) => {
    setLocalClickThrough(value);
    onUpdate({ clickThrough: value });
  };

  const handleOpacityChange = (value: number) => {
    setLocalOpacity(value);
    onUpdate({ opacity: value });
  };

  const handleAnimationSpeedChange = (value: number) => {
    setLocalAnimationSpeed(value);
    onUpdate({ animationSpeed: value });
  };

  return (
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 w-80 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            &#10062;
          </button>
        </div>

        <div className="space-y-4">
          {/* Click-through Toggle */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-white">Click-through Mode</span>
              <button
                onClick={() => handleClickThroughChange(!localClickThrough)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localClickThrough ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localClickThrough ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <p className="text-xs text-white/60">
              When enabled, mouse clicks pass through to windows behind
            </p>
          </div>

          {/* Opacity Slider */}
          <div>
            <label className="block mb-2">
              <span className="text-white">Opacity: {Math.round(localOpacity * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={localOpacity}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Animation Speed Slider */}
          <div>
            <label className="block mb-2">
              <span className="text-white">Animation Speed: {localAnimationSpeed.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={localAnimationSpeed}
              onChange={(e) => handleAnimationSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
