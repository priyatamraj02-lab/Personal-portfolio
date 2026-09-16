import React from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-[999] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-purple-500 to-cyan-400 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
