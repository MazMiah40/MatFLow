import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Shield } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DISCIPLINES = ['BJJ (Gi)', 'No-Gi Grappling', 'MMA', 'Kickboxing / Muay Thai', 'Wrestling', 'Junior BJJ', 'Boxing'];

export default function TimetableManager({ isOpen, onClose, timetable, onAddClass, onDeleteClass }) {
  const [discipline, setDiscipline] = useState(DISCIPLINES[0]);
  const [dayOfWeek, setDayOfWeek] = useState(DAYS[0]);
  const [time, setTime] = useState('12:00 PM');

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!time.trim()) return;

    onAddClass({
      discipline,
      dayOfWeek,
      time
    });

    setTime('12:00 PM');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Gym Weekly Timetable</h3>
            <p className="text-xs text-slate-500 mt-0.5">Configure recurring training sessions</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form to Add New Class */}
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 shrink-0">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Add Scheduled Class</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-blue-600" /> Discipline
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" /> Day
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                {DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" /> Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 6:30 PM"
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition shadow-xs flex items-center justify-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Class to Timetable</span>
          </button>
        </form>

        {/* Class List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Active Timetable ({timetable.length})</h4>
          {timetable.map((cls) => (
            <div key={cls.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">{cls.discipline}</span>
                <span className="text-slate-500 text-[11px]">
                  {cls.dayOfWeek}s @ {cls.time}
                </span>
              </div>
              <button
                onClick={() => onDeleteClass(cls.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete Class"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
