import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getTimetableClasses, 
  createTimetableClass, 
  deleteTimetableClass,
  updateTimetableClass
} from '../services/timetableService';
import { 
  getUserCurriculums, 
  createCurriculum 
} from '../services/curriculumService';
import TimetableManager from '../components/TimetableManager';
import CurriculumWizard from '../components/CurriculumWizard';
import MatSideTimer from '../components/MatSideTimer';
import TechniqueLibraryModal from '../components/TechniqueLibraryModal';
import { printCurriculumSheet } from '../utils/printPlan';
import { 
  LogOut, User, Info, Plus, Play, Clock, Calendar, Shield, ChevronRight, Settings, Printer, BookPlus, ArrowUp, ArrowDown, Trash2
} from 'lucide-react';

const DAYS_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Dashboard() {
  const { currentUser, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  const [timetable, setTimetable] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isTechniqueModalOpen, setIsTechniqueModalOpen] = useState(false);
  const [activeSessionForTimer, setActiveSessionForTimer] = useState(null);
  const [activeInsertionTarget, setActiveInsertionTarget] = useState(null);

  const todayName = DAYS_MAP[new Date().getDay()];

  useEffect(() => {
    async function loadData() {
      try {
        const uid = currentUser?.uid || 'guest-user';
        const [ttData, currData] = await Promise.all([
          getTimetableClasses(uid),
          getUserCurriculums(uid)
        ]);
        setTimetable(ttData);
        setCurriculums(currData);
      } catch (err) {
        console.error('Error loading timetable dashboard data:', err);
      }
    }
    loadData();
  }, [currentUser]);

  // Handle Timetable Changes
  async function handleAddClass(classData) {
    const uid = currentUser?.uid || 'guest-user';
    const newId = await createTimetableClass(uid, classData);
    setTimetable([...timetable, { id: newId, ...classData }]);
  }

  async function handleDeleteClass(classId) {
    const uid = currentUser?.uid || 'guest-user';
    await deleteTimetableClass(uid, classId);
    setTimetable(timetable.filter((c) => c.id !== classId));
    if (selectedClass?.id === classId) setSelectedClass(null);
  }

  // Assign Curriculum Session to Class
  async function handleLinkPlanToClass(classId, planId) {
    const uid = currentUser?.uid || 'guest-user';
    await updateTimetableClass(uid, classId, { activePlanId: planId });
    setTimetable(timetable.map((c) => c.id === classId ? { ...c, activePlanId: planId } : c));
  }

  // Get today's scheduled classes
  const todaysClasses = timetable.filter((c) => c.dayOfWeek === todayName);

  // Group timetable by discipline tiles
  const disciplines = [...new Set(timetable.map((c) => c.discipline))];

  // Get active session for a class
  function getClassActiveSession(cls) {
    const plan = curriculums.find((p) => p.id === cls?.activePlanId) || curriculums[0];
    return plan?.weeks?.[0]?.sessions?.[0] || null;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xs border-b border-slate-200/80 sticky top-0 z-10 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MatFlow
          </h1>
          <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 font-semibold rounded-full border border-blue-100">
            Timetable Mode
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsTimetableOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition border border-slate-200"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Manage Timetable</span>
          </button>

          <button
            onClick={() => logout()}
            className="p-1.5 sm:px-3 sm:py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg flex items-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TODAY'S SCHEDULE SECTION (Jumps straight to class plan) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Today's Schedule ({todayName})</h2>
            </div>
            <span className="text-xs font-medium text-slate-500">{todaysClasses.length} Sessions Scheduled</span>
          </div>

          {todaysClasses.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">No training classes scheduled on the timetable for today.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {todaysClasses.map((cls) => {
                const session = getClassActiveSession(cls);
                return (
                  <div key={cls.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{cls.discipline}</span>
                        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" /> {cls.time}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (session) setActiveSessionForTimer(session);
                        else alert('Attach a curriculum plan to this class first.');
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center space-x-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Class Plan</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DISCIPLINE TILES SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Disciplines</h2>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Curriculum Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {disciplines.map((disc) => (
              <button
                key={disc}
                onClick={() => {
                  setSelectedDiscipline(disc);
                  const matchingClasses = timetable.filter((c) => c.discipline === disc);
                  setSelectedClass(matchingClasses[0] || null);
                }}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between h-24 ${
                  selectedDiscipline === disc
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/80 text-slate-800'
                }`}
              >
                <Shield className={`w-5 h-5 ${selectedDiscipline === disc ? 'text-white' : 'text-blue-600'}`} />
                <div>
                  <span className="font-bold text-sm block truncate">{disc}</span>
                  <span className={`text-[10px] ${selectedDiscipline === disc ? 'text-blue-100' : 'text-slate-500'}`}>
                    {timetable.filter((c) => c.discipline === disc).length} weekly slots
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* DISCIPLINE DAYS & ACTIVE CLASS PLAN VIEW */}
        {selectedDiscipline && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {selectedDiscipline} Schedule Days
            </h3>

            {/* Days Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {timetable
                .filter((c) => c.discipline === selectedDiscipline)
                .map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                      selectedClass?.id === cls.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cls.dayOfWeek} @ {cls.time}
                  </button>
                ))}
            </div>

            {/* Attached Class Session Plan */}
            {selectedClass && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Selected Class Slot</span>
                    <h4 className="text-base font-bold text-slate-900">
                      {selectedClass.discipline} — {selectedClass.dayOfWeek}s at {selectedClass.time}
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      const session = getClassActiveSession(selectedClass);
                      if (session) setActiveSessionForTimer(session);
                    }}
                    className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Mat Side Timer</span>
                  </button>
                </div>

                {/* Session Details */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Phase Structure</span>
                  
                  {getClassActiveSession(selectedClass)?.phases?.map((phase, pIdx) => (
                    <div key={phase.id || pIdx} className="p-3 bg-white border border-slate-200/80 rounded-lg text-xs flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-800">{phase.name}</span>
                        {phase.notes && <p className="text-slate-500 text-[11px] mt-0.5">{phase.notes}</p>}
                      </div>
                      <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {phase.durationMinutes}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Overlays */}
      <TimetableManager
        isOpen={isTimetableOpen}
        onClose={() => setIsTimetableOpen(false)}
        timetable={timetable}
        onAddClass={handleAddClass}
        onDeleteClass={handleDeleteClass}
      />

      <CurriculumWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCreate={async (plan) => {
          const uid = currentUser?.uid || 'guest-user';
          await createCurriculum(uid, plan);
          const currData = await getUserCurriculums(uid);
          setCurriculums(currData);
        }}
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
