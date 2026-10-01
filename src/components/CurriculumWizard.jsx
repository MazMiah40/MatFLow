import React, { useState } from 'react';
import { X, Calendar, Target, Shield, ArrowRight } from 'lucide-react';

const SPORTS = [
  'Brazilian Jiu-Jitsu (BJJ)',
  'Muay Thai / Kickboxing',
  'MMA',
  'Wrestling',
  'Boxing',
  'Judo'
];

const LEVELS = ['Beginner / Fundamentals', 'Intermediate', 'Advanced / Competition', 'All Levels'];

export default function CurriculumWizard({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState(SPORTS[0]);
  const [weeks, setWeeks] = useState(6);
  const [level, setLevel] = useState(LEVELS[0]);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    // Generate structure for chosen number of weeks
    const generatedWeeks = Array.from({ length: Number(weeks) }, (_, i) => ({
      weekNumber: i + 1,
      title: `Week ${i + 1}: Core Mechanics`,
      sessions: [
        {
          id: 'sess-1',
          name: 'Session A',
          phases: [
            { id: 'p1', name: 'Warm-up & Mobility', durationMinutes: 10, notes: 'Dynamic stretching & movement drills' },
            { id: 'p2', name: 'Primary Technique', durationMinutes: 25, notes: 'Break down core movement and entries' },
            { id: 'p3', name: 'Positional Drilling', durationMinutes: 15, notes: 'Targeted resistance training' },
            { id: 'p4', name: 'Cool-down / Q&A', durationMinutes: 10, notes: 'Light recovery and recap' }
          ]
        }
      ]
    }));

    const newPlan = {
      title,
      sport,
      totalWeeks: Number(weeks),
      level,
      description,
      weeks: generatedWeeks
    };

    onCreate(newPlan);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-lg w-full p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Create Curriculum</h3>
            <p className="text-sm text-slate-500 mt-0.5">Define your multi-week training block</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Curriculum Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Guard Passing Fundamentals"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-600" /> Sport
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Duration (Weeks)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={weeks}
                onChange={(e) => setWeeks(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-blue-600" /> Skill Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Description / Objectives
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline primary focus areas or key learning objectives..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
            >
              <span>Build Block</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
