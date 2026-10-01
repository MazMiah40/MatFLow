import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TimetableManager from '../components/TimetableManager';
import TechniqueLibraryModal from '../components/TechniqueLibraryModal';
import MatSideTimer from '../components/MatSideTimer';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('timetable');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header & Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-lg">
            M
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">MatFlow</h1>
            <p className="text-xs text-slate-400 mt-0.5">Academy Management & Curriculum Planner</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'timetable'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            🗓️ Timetable & Plans
          </button>
          <button
            onClick={() => setIsLibraryOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all"
          >
            📚 Technique Library
          </button>
          <button
            onClick={() => setIsTimerOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all"
          >
            ⏱️ Mat Timer
          </button>
        </nav>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            {currentUser?.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-all"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'timetable' && <TimetableManager />}
      </main>

      {/* Modals */}
      {isLibraryOpen && (
        <TechniqueLibraryModal onClose={() => setIsLibraryOpen(false)} />
      )}
      {isTimerOpen && (
        <MatSideTimer onClose={() => setIsTimerOpen(false)} />
      )}
    </div>
  );
}
