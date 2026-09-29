import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  createCurriculum, 
  getUserCurriculums, 
  deleteCurriculum, 
  updateCurriculum 
} from '../services/curriculumService';
import CurriculumWizard from '../components/CurriculumWizard';
import MatSideTimer from '../components/MatSideTimer';
import { 
  LogOut, 
  BookOpen, 
  User, 
  Info, 
  Plus, 
  Trash2, 
  Play, 
  ChevronRight, 
  Clock, 
  Layers 
} from 'lucide-react';

export default function Dashboard() {
  const { currentUser, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  const [curriculums, setCurriculums] = useState([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeSessionForTimer, setActiveSessionForTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user curriculums on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (currentUser?.uid) {
          const plans = await getUserCurriculums(currentUser.uid);
          setCurriculums(plans);
          if (plans.length > 0) setSelectedPlan(plans[0]);
        }
      } catch (err) {
        console.error('Error fetching curriculums:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Handle building a new curriculum
  async function handleCreateCurriculum(planData) {
    try {
      const planId = await createCurriculum(currentUser?.uid || 'guest-user', planData);
      const newPlan = { id: planId, ...planData };
      setCurriculums([newPlan, ...curriculums]);
      setSelectedPlan(newPlan);
    } catch (err) {
      console.error('Failed to create curriculum:', err);
    }
  }

  // Handle deleting a curriculum plan
  async function handleDeleteCurriculum(planId, e) {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this curriculum?')) return;

    try {
      await deleteCurriculum(currentUser?.uid || 'guest-user', planId);
      const updated = curriculums.filter((c) => c.id !== planId);
      setCurriculums(updated);
      if (selectedPlan?.id === planId) {
        setSelectedPlan(updated[0] || null);
      }
    } catch (err) {
      console.error('Failed to delete curriculum:', err);
    }
  }

  // Add a new phase to a specific session locally & persist
  async function handleAddPhase(weekIndex, sessionIndex) {
    if (!selectedPlan) return;

    const updatedPlan = JSON.parse(JSON.stringify(selectedPlan));
    const targetSession = updatedPlan.weeks[weekIndex].sessions[sessionIndex];

    targetSession.phases.push({
      id: 'p-' + Date.now(),
      name: 'New Phase',
      durationMinutes: 10,
      notes: 'Add phase focus notes...'
    });

    setSelectedPlan(updatedPlan);
    const updatedList = curriculums.map((c) => (c.id === updatedPlan.id ? updatedPlan : c));
    setCurriculums(updatedList);

    await updateCurriculum(currentUser?.uid || 'guest-user', updatedPlan.id, {
      weeks: updatedPlan.weeks
    });
  }

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
            Phase 1 MVP
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

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {isGuest && (
          <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start space-x-3 text-amber-900 text-sm shadow-sm">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">Viewing as Demo Guest</p>
              <p className="mt-0.5 text-amber-700">
                You can create curriculums and run mat-side timers. Sign up for a permanent account to save data securely.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Curriculum Library</h2>
            <p className="text-sm text-slate-500 mt-0.5">Manage combat sport training cycles and session blocks</p>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Curriculum</span>
          </button>
        </div>

        {/* Workspace Layout */}
        {curriculums.length === 0 && !loading ? (
          <div className="bg-white/60 border border-dashed border-slate-300 rounded-2xl p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="p-4 bg-blue-50/80 rounded-full border border-blue-100">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-800">No Curriculums Created</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Get started by creating your first training block using the wizard.
              </p>
            </div>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Curriculum</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar List of Plans */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                Your Plans ({curriculums.length})
              </h3>
              <div className="space-y-2">
                {curriculums.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      selectedPlan?.id === plan.id
                        ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                        : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <h4 className="font-semibold text-slate-900 truncate text-sm">{plan.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                          {plan.sport}
                        </span>
                        <span>•</span>
                        <span>{plan.totalWeeks} Wks</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteCurriculum(plan.id, e)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition shrink-0"
                      title="Delete Curriculum"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Selected Plan View */}
            {selectedPlan && (
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        {selectedPlan.sport}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedPlan.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{selectedPlan.description}</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full border border-blue-100">
                      {selectedPlan.level}
                    </span>
                  </div>

                  {/* Weeks & Sessions Breakdown */}
                  <div className="space-y-4 pt-2">
                    {selectedPlan.weeks?.map((week, wIdx) => (
                      <div key={wIdx} className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-600" />
                            {week.title}
                          </h4>
                        </div>

                        {week.sessions?.map((session, sIdx) => (
                          <div key={session.id || sIdx} className="bg-white border border-slate-200/80 rounded-lg p-4 space-y-3 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                {session.name}
                              </span>

                              <button
                                onClick={() => setActiveSessionForTimer(session)}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-xs"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Launch Mat Timer</span>
                              </button>
                            </div>

                            {/* Phase blocks list */}
                            <div className="space-y-2">
                              {session.phases?.map((phase, pIdx) => (
                                <div key={phase.id || pIdx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-200/50">
                                  <div>
                                    <span className="font-semibold text-slate-800">{phase.name}</span>
                                    {phase.notes && <p className="text-slate-500 mt-0.5">{phase.notes}</p>}
                                  </div>
                                  <span className="flex items-center space-x-1 font-mono text-slate-600 font-medium bg-white px-2 py-1 rounded border border-slate-200">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <span>{phase.durationMinutes}m</span>
                                  </span>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => handleAddPhase(wIdx, sIdx)}
                              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1 pt-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Phase</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Curriculum Modal Wizard */}
      <CurriculumWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCreate={handleCreateCurriculum}
      />

      {/* Mat Side Timer Overlay */}
      {activeSessionForTimer && (
        <MatSideTimer
          session={activeSessionForTimer}
          onClose={() => setActiveSessionForTimer(null)}
        />
      )}
    </div>
  );
}
