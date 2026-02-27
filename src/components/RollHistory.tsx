import React from 'react';

interface RollHistoryProps {
  rolls: number[];
}

const RollHistory: React.FC<RollHistoryProps> = ({ rolls }) => {
  if (rolls.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-center z-40">
      <div className="ui-panel rounded-xl px-5 py-3">
        <div className="flex gap-3 items-center">
          <span className="text-white/80 text-sm font-semibold mr-1">📜 History:</span>
          {rolls.map((roll, index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-white text-base font-bold border-2 ${
                index === 0 
                  ? 'bg-blue-600/90 border-blue-400 shadow-lg shadow-blue-500/30' 
                  : 'bg-gray-700/80 border-gray-600/50'
              }`}
            >
              {roll}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RollHistory;
