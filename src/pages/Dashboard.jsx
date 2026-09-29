import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, User, Info } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-red-500">MatCraft</h1>
          <span className="text-xs px-2.5 py-0.5 bg-gray-700 text-gray-300 rounded-full font-medium">
            Phase 0
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-300 bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-700">
            <User className="w-4 h-4 text-red-400" />
            <span>{currentUser?.email || 'Guest Coach'}</span>
            {isGuest && (
              <span className="ml-1 text-xs bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                Demo
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col space-y-6">
        {/* Banner for Demo Mode */}
        {isGuest && (
          <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-start space-x-3 text-amber-200 text-sm">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Viewing as Demo Guest</p>
              <p className="mt-0.5 text-amber-200/80">
                You are currently previewing the dashboard in guest mode. Sign up for an account to sync curriculums securely across your devices.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Welcome Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome to MatCraft</h2>
          <p className="text-gray-400 max-w-2xl">
            Phase 0 foundation complete. Real Firebase authentication is connected and your user data path is ready:
            <code className="ml-1 bg-gray-900 px-2 py-1 rounded text-red-400 text-sm">
              users/{currentUser?.uid || 'guest-user'}/plans/&#123;planId&#125;
            </code>
          </p>
        </div>

        {/* Empty State / Library Placeholder */}
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-3 bg-gray-800/30">
          <div className="p-4 bg-gray-800 rounded-full border border-gray-700">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white">Curriculum Library Empty</h3>
          <p className="text-sm text-gray-400 max-w-sm">
            Phase 1 will introduce the curriculum builder wizard, week editor, and mat-side phase timer.
          </p>
        </div>
      </main>
    </div>
  );
}
