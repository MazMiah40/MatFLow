import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, X, Volume2, VolumeX } from 'lucide-react';

export default function MatSideTimer({ session, onClose }) {
  const phases = session?.phases || [];
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState((phases[0]?.durationMinutes || 5) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activePhase = phases[currentPhaseIndex];

  // Update timer target when active phase changes
  useEffect(() => {
    if (activePhase) {
      setTimeLeft(activePhase.durationMinutes * 60);
      setIsRunning(false);
    }
  }, [currentPhaseIndex, phases]);

  // Main countdown ticker loop
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play alert tone if audio enabled
      if (soundEnabled) {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, soundEnabled]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (activePhase) {
      setTimeLeft(activePhase.durationMinutes * 60);
    }
  };

  if (!activePhase) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-xl font-medium text-slate-300">No phases configured for this session.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition"
          >
            Close Timer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 md:p-10 select-none">
      {/* Top Bar Navigation & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xs uppercase tracking-widest bg-blue-600/30 text-blue-400 font-semibold px-3 py-1 rounded-full border border-blue-500/30">
            Phase {currentPhaseIndex + 1} of {phases.length}
          </span>
          <h2 className="text-lg md:text-xl font-semibold text-slate-300">{session.name}</h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-400" />}
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main High-Visibility Centerpiece */}
      <div className="flex-1 flex flex-col items-center justify-center my-8 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{activePhase.name}</h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            {activePhase.notes || 'No notes added for this phase.'}
          </p>
        </div>

        {/* Big Digit Countdown Display */}
        <div className="text-8xl sm:text-9xl md:text-[13rem] font-mono font-black tracking-tight text-blue-500 leading-none drop-shadow-lg">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Primary Mat Controls */}
      <div className="max-w-xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={handleReset}
            className="p-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-slate-800 transition"
            title="Reset Phase Timer"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-10 py-5 rounded-2xl text-xl font-bold flex items-center space-x-3 shadow-lg transition ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-7 h-7 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-7 h-7 fill-current" />
                <span>Start Phase</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextPhase}
            disabled={currentPhaseIndex >= phases.length - 1}
            className="p-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-400 hover:text-white rounded-2xl border border-slate-800 transition"
            title="Next Phase"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Interactive Phase Sequence Bar */}
        <div className="grid grid-cols-4 gap-2">
          {phases.map((p, idx) => (
            <button
              key={p.id || idx}
              onClick={() => setCurrentPhaseIndex(idx)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold border transition truncate ${
                idx === currentPhaseIndex
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {idx + 1}. {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
