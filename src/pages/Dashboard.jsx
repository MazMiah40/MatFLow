import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, User, Info, Plus } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MatFlow
          </h1>
          <span className="text-xs px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium border border-slate-200">
            Phase 0
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60">
            <User className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{currentUser?.email || 'Guest Coach'}</span>
            {isGuest && (
              <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                Demo
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Banner for Demo Mode */}
        {isGuest && (
          <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start space-x-3 text-amber-900 text-sm shadow-sm">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Viewing as Demo Guest</p>
              <p className="mt-0.5 text-amber-700">
                You are currently previewing the dashboard in guest mode. Sign up for an account to sync curriculums securely across your devices.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Welcome Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome to MatFlow</h2>
              <p className="text-slate-500 mt-1 max-w-xl text-sm">
                Firebase authentication and storage foundation are fully setup and connected:
                <code className="ml-1.5 bg-slate-100 text-indigo-600 px-2 py-0.5 rounded font-mono text-xs border border-slate-200">
                  users/{currentUser?.uid || 'guest-user'}/plans/&#123;planId&#125;
                </code>
              </p>
            </div>
            <button className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition">
              <Plus className="w-4 h-4" />
              <span>Create Curriculum</span>
            </button>
          </div>
        </div>

        {/* Empty State / Library Placeholder */}
        <div className="bg-white/60 border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
          <div className="p-4 bg-blue-50/80 rounded-full border border-blue-100">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Curriculum Library Empty</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Phase 1 will introduce the curriculum builder wizard, week editor, and mat-side phase timer.
          </p>
        </div>
      </main>
    </div>
  );
}
