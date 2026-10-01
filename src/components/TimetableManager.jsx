import React, { useState, useEffect } from 'react';
import { getTimetableData, saveProgrammeToSlot, removeProgrammeFromSlot } from '../services/timetableService';
import { useAuth } from '../context/AuthContext';
import CurriculumWizard from './CurriculumWizard';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

export default function TimetableManager() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || 'guest';

  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [viewingProgramme, setViewingProgramme] = useState(null);

  useEffect(() => {
    fetchTimetable();
  }, [userId]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const data = await getTimetableData(userId);
      setTimetable(data || {});
    } catch (err) {
      console.error('Failed to load timetable', err);
    } finally {
      setLoading(false);
    }
  };

  const getSlotKey = (day, slot) => `${day}_${slot}`;

  const handleTileClick = (day, slot) => {
    const key = getSlotKey(day, slot);
    const existingProgramme = timetable[key];

    setSelectedSlot({ day, slot });

    if (existingProgramme) {
      setViewingProgramme(existingProgramme);
    } else {
      setIsWizardOpen(true);
    }
  };

  const handleSaveWizardProgramme = async (programmeData) => {
    if (!selectedSlot) return;
    const key = getSlotKey(selectedSlot.day, selectedSlot.slot);

    const updatedData = {
      ...programmeData,
      day: selectedSlot.day,
      slot: selectedSlot.slot,
      updatedAt: new Date().toISOString()
    };

    try {
      await saveProgrammeToSlot(key, updatedData, userId);
      setTimetable((prev) => ({ ...prev, [key]: updatedData }));
      setIsWizardOpen(false);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Error saving programme:', err);
    }
  };

  const handleRemoveProgramme = async (key) => {
    try {
      await removeProgrammeFromSlot(key, userId);
      setTimetable((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setViewingProgramme(null);
    } catch (err) {
      console.error('Error removing programme:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <p className="animate-pulse text-sm">Loading academy timetable...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Weekly Class Schedule</h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any tile to view attached curriculum plans or build a new programme using the wizard.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {DAYS.map((day) => (
          <div key={day} className="flex flex-col gap-3">
            <div className="py-2 px-3 text-center bg-slate-900 border border-slate-800 rounded-xl font-semibold text-xs text-slate-300 uppercase tracking-wider">
              {day}
            </div>

            {TIME_SLOTS.map((slot) => {
              const key = getSlotKey(day, slot);
              const programme = timetable[key];

              return (
                <div
                  key={slot}
                  onClick={() => handleTileClick(day, slot)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                    programme
                      ? 'bg-slate-900/90 border-emerald-500/50 hover:border-emerald-400 shadow-md'
                      : 'bg-slate-900/30 border-slate-800/80 hover:border-slate-600 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{slot}</span>
                    {programme ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 hover:text-slate-300">+ Add</span>
                    )}
                  </div>

                  {programme ? (
                    <div className="mt-2">
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-2">{programme.title || 'Untitled Plan'}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {programme.techniques?.length || 0} Techniques
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-600 italic">No programme</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Viewing Modal */}
      {viewingProgramme && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                  {viewingProgramme.day} • {viewingProgramme.slot}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{viewingProgramme.title}</h3>
                {viewingProgramme.focusArea && (
                  <p className="text-xs text-slate-400 mt-1">Focus Area: {viewingProgramme.focusArea}</p>
                )}
              </div>
              <button onClick={() => setViewingProgramme(null)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum Techniques</h4>
              {viewingProgramme.techniques && viewingProgramme.techniques.length > 0 ? (
                <ul className="space-y-2">
                  {viewingProgramme.techniques.map((tech, idx) => (
                    <li key={idx} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-200 flex items-center justify-between">
                      <span className="font-semibold">{typeof tech === 'string' ? tech : tech.name}</span>
                      {tech.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">{tech.category}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">No techniques explicitly listed.</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => handleRemoveProgramme(getSlotKey(viewingProgramme.day, viewingProgramme.slot))}
                className="px-4 py-2 text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all"
              >
                Delete Programme
              </button>
              <button
                onClick={() => setViewingProgramme(null)}
                className="px-5 py-2 text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Modal */}
      {isWizardOpen && selectedSlot && (
        <CurriculumWizard
          slotContext={selectedSlot}
          onSave={handleSaveWizardProgramme}
          onClose={() => {
            setIsWizardOpen(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}
