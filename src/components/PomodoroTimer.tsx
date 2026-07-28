import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee } from 'lucide-react';

type Mode = 'focus' | 'break';

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
      setIsActive(false);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'focus') {
      setTimeLeft(25 * 60);
    } else {
      setTimeLeft(5 * 60);
    }
  };

  const switchMode = (newMode: Mode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-white px-2 sm:px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex gap-1 border-r border-slate-200 pr-2 sm:pr-3">
        <button
          onClick={() => switchMode('focus')}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold ${
            mode === 'focus' ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="Foco (25 min)"
        >
          <Clock className="w-4 h-4" />
          <span className="hidden sm:inline">Foco</span>
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold ${
            mode === 'break' ? 'bg-green-100 text-green-600' : 'text-slate-400 hover:bg-slate-100'
          }`}
          title="Pausa (5 min)"
        >
          <Coffee className="w-4 h-4" />
          <span className="hidden sm:inline">Pausa</span>
        </button>
      </div>

      <div className={`font-mono text-lg sm:text-xl font-bold w-12 sm:w-16 text-center ${mode === 'focus' ? 'text-red-600' : 'text-green-600'}`}>
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-1 pl-1">
        <button
          onClick={toggleTimer}
          className={`p-1.5 sm:p-2 rounded-full transition-colors ${
            isActive ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-1.5 sm:p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
