
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.max(0, Math.min(100, (current / total) * 100));

  return (
    <div className="w-full bg-ion-gray-medium rounded-full h-2.5 my-4">
      <div
        className="bg-ion-blue h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
