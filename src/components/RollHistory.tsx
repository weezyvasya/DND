import React from 'react';

interface RollHistoryProps {
  rolls: number[];
}

const RollHistory: React.FC<RollHistoryProps> = ({ rolls }) => {
  if (rolls.length === 0) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-center z-40">
      <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
        <div className="flex gap-2 items-center">
          <span className="text-white/60 text-xs mr-2">Recent:</span>
          {rolls.map((roll, index) => (
            <div
              key={index}
              className="w-8 h-8 flex items-center justify-center bg-blue-600/50 rounded text-white text-sm font-semibold"
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
