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
import TechniqueLibraryModal from '../components/TechniqueLibraryModal';
import { printCurriculumSheet } from '../utils/printPlan';
import { 
  LogOut, 
  BookOpen, 
  User, 
  Info, 
  Plus, 
  Trash2, 
  Play, 
  Clock, 
  Layers,
  Printer,
  ArrowUp,
  ArrowDown,
  BookPlus
} from 'lucide-react';

export default function Dashboard() {
  const { currentUser, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  const [curriculums, setCurriculums] = useState([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isTechniqueModalOpen, setIsTechniqueModalOpen] = useState(false);
  const [activeInsertionTarget, setActiveInsertionTarget] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeSessionForTimer, setActiveSessionForTimer] = useState(null);
  const [loading, setLoading] = useState(true);

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

  async function persistPlanUpdate(updatedPlan) {
    setSelectedPlan(updatedPlan);
    const updatedList = curriculums.map((c) => (c.id === updatedPlan.id ? updatedPlan : c));
    setCurriculums(updatedList);

    await updateCurriculum(currentUser?.uid || 'guest-user', updatedPlan.id, {
      weeks: updatedPlan.weeks
    });
  }

  function handleAddPhase(wIdx, sIdx) {
    if (!selectedPlan) return;
    const updatedPlan = JSON.parse(JSON.stringify(selectedPlan));
    const phases = updatedPlan.weeks[wIdx].sessions[sIdx].phases;

    phases.push({
      id: 'p-' + Date.now(),
      name: 'New Phase',
      durationMinutes: 10,
      notes: 'Add phase focus notes...'
    });

    persistPlanUpdate(updatedPlan);
  }

  function handleMovePhase(wIdx, sIdx, pIdx, direction) {
    if (!selectedPlan) return;
    const updatedPlan = JSON.parse(JSON.stringify(selectedPlan));
    const phases = updatedPlan.weeks[wIdx].sessions[sIdx].phases;

    const targetIdx = direction === 'up' ? pIdx - 1 : pIdx + 1;
    if (targetIdx < 0 || targetIdx >= phases.length) return;

    const temp = phases[pIdx];
    phases[pIdx] = phases[targetIdx];
    phases[targetIdx] = temp;

    persistPlanUpdate(updatedPlan);
  }

  function handleDeletePhase(wIdx, sIdx, pIdx) {
    if (!selectedPlan) return;
    const updatedPlan = JSON.parse(JSON.stringify(selectedPlan));
    updatedPlan.weeks[wIdx].sessions[sIdx].phases.splice(pIdx, 1);

    persistPlanUpdate(updatedPlan);
  }

  function handleInjectTechnique(drill) {
    if (!selectedPlan || !activeInsertionTarget) return;
    const { wIdx, sIdx } = activeInsertionTarget;

    const updatedPlan = JSON.parse(JSON.stringify(selectedPlan));
    const phases = updatedPlan.weeks[wIdx].sessions[sIdx].phases;

    phases.push({
      id: 'p-' + Date.now(),
      name: drill.name,
      durationMinutes: drill.defaultMin,
      notes: drill.notes
    });

    persistPlanUpdate(updatedPlan);
    setActiveInsertionTarget(null);
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
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col w-full max-w-full overflow-x-hidden box-border">
      {/* Mobile-Safe Collapsible Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-10 px-3 sm:px-6 py-2.5 flex items-center justify-between w-full max-w-full overflow-hidden">
        <div className="flex items-center space-x-1.5 shrink-0">
          <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MatFlow
          </h1>
          <span className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium border border-slate-200">
            P2
          </span>
        </div>

        <div className="flex items-center space-x-1.5 min-w-0 shrink">
          <div className="flex items-center space-x-1 text-xs text-slate-600 bg-slate-100/80 px-2 py-1 rounded-lg border border-slate-200/60 min-w-0 max-w-[140px] sm:max-w-[220px]">
            <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-medium truncate text-[11px] sm:text-xs">{currentUser?.email || 'Guest'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition shadow-xs shrink-0 flex items-center"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block ml-1">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 space-y-5 box-border overflow-x-hidden">
        {isGuest && (
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start space-x-2.5 text-amber-900 text-xs sm:text-sm shadow-xs w-full box-border">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-semibold text-amber-900">Viewing as Demo Guest</p>
              <p className="mt-0.5 text-amber-700 leading-tight">
                Create curriculums, reorder phases, and launch mat timers seamlessly.
              </p>
            </div>
          </div>
        )}

        {/* Header Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Curriculum Library</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage training blocks, print sheets, and launch mat timers</p>
          </div>

          <button
            onClick={() => setIsWizardOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Curriculum</span>
          </button>
        </div>

        {curriculums.length === 0 && !loading ? (
          <div className="bg-white/60 border border-dashed border-slate-300 rounded-2xl p-6 sm:p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-xs w-full box-border">
            <div className="p-3 bg-blue-50/80 rounded-full border border-blue-100">
              <BookOpen className="w-7 h-7 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-800">No Curriculums Created</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                Get started by creating your first training block using the wizard.
              </p>
            </div>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm rounded-xl transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Curriculum</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
            {/* Sidebar Plans List */}
            <div className="space-y-2.5 w-full">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                Your Plans ({curriculums.length})
              </h3>
              <div className="space-y-2 w-full">
                {curriculums.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between w-full box-border ${
                      selectedPlan?.id === plan.id
                        ? 'bg-white border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                        : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-2">
                      <h4 className="font-semibold text-slate-900 truncate text-sm">{plan.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium truncate">
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

            {/* Selected Plan Details */}
            {selectedPlan && (
              <div className="lg:col-span-2 space-y-5 w-full">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 w-full box-border">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4 w-full">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        {selectedPlan.sport}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 truncate">{selectedPlan.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">{selectedPlan.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => printCurriculumSheet(selectedPlan)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
                        title="Print Clipboard Sheet"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                      <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full border border-blue-100 shrink-0">
                        {selectedPlan.level}
                      </span>
                    </div>
                  </div>

                  {/* Weeks and Sessions Breakdown */}
                  <div className="space-y-4 pt-1 w-full">
                    {selectedPlan.weeks?.map((week, wIdx) => (
                      <div key={wIdx} className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3 sm:p-4 space-y-3 w-full box-border">
                        <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{week.title}</span>
                        </h4>

                        {week.sessions?.map((session, sIdx) => (
                          <div key={session.id || sIdx} className="bg-white border border-slate-200/80 rounded-lg p-3 sm:p-4 space-y-3 shadow-xs w-full box-border">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide truncate">
                                {session.name}
                              </span>

                              <button
                                onClick={() => setActiveSessionForTimer(session)}
                                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-xs"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Launch Mat Timer</span>
                              </button>
                            </div>

                            {/* Phases List */}
                            <div className="space-y-2 w-full">
                              {session.phases?.map((phase, pIdx) => (
                                <div key={phase.id || pIdx} className="flex items-center justify-between p-2 sm:p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-200/50 w-full box-border">
                                  <div className="min-w-0 pr-1.5">
                                    <span className="font-semibold text-slate-800 block truncate">{phase.name}</span>
                                    {phase.notes && <p className="text-slate-500 truncate text-[11px] mt-0.5">{phase.notes}</p>}
                                  </div>

                                  <div className="flex items-center space-x-1 shrink-0">
                                    <span className="flex items-center space-x-1 font-mono text-slate-600 font-medium bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] sm:text-[11px]">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      <span>{phase.durationMinutes}m</span>
                                    </span>

                                    <div className="flex items-center">
                                      <button
                                        onClick={() => handleMovePhase(wIdx, sIdx, pIdx, 'up')}
                                        disabled={pIdx === 0}
                                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600 transition"
                                      >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleMovePhase(wIdx, sIdx, pIdx, 'down')}
                                        disabled={pIdx === session.phases.length - 1}
                                        className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-600 transition"
                                      >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePhase(wIdx, sIdx, pIdx)}
                                        className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded transition"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Phase Creation Bar */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                              <button
                                onClick={() => handleAddPhase(wIdx, sIdx)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Phase</span>
                              </button>

                              <span className="text-slate-300 hidden sm:inline">•</span>

                              <button
                                onClick={() => {
                                  setActiveInsertionTarget({ wIdx, sIdx });
                                  setIsTechniqueModalOpen(true);
                                }}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                              >
                                <BookPlus className="w-3.5 h-3.5" />
                                <span>From Technique Bank</span>
                              </button>
                            </div>
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

      {/* Modals */}
      <CurriculumWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCreate={handleCreateCurriculum}
      />

      <TechniqueLibraryModal
        isOpen={isTechniqueModalOpen}
        onClose={() => setIsTechniqueModalOpen(false)}
        onSelectTechnique={handleInjectTechnique}
      />

      {activeSessionForTimer && (
        <MatSideTimer
          session={activeSessionForTimer}
          onClose={() => setActiveSessionForTimer(null)}
        />
      )}
    </div>
  );
}
