import React, { useState } from 'react';
import { X, Search, Plus, BookOpen, Tag } from 'lucide-react';

const PRESET_DRILLS = [
  { id: 't1', category: 'BJJ - Guard', name: 'Scissor Sweep & Armbar Transition', defaultMin: 15, notes: 'Focus on hip displacement and gripping control before extending the arm.' },
  { id: 't2', category: 'BJJ - Passing', name: 'Knee Slice Guard Pass', defaultMin: 15, notes: 'Establish underhook and head position before slicing the knee to the mat.' },
  { id: 't3', category: 'Muay Thai - Strikes', name: 'Jab-Cross-Low Kick Combo', defaultMin: 10, notes: 'Pivoting lead foot on the low kick; step off-line for power.' },
  { id: 't4', category: 'Muay Thai - Clinch', name: 'Plum Clinch Control & Knee Striking', defaultMin: 15, notes: 'Posture control with crown grip; break opponent posture with collar tie.' },
  { id: 't5', category: 'Wrestling - Takedowns', name: 'Double Leg Takedown Mechanics', defaultMin: 20, notes: 'Level change, penetration step, driving across the body with head up.' },
  { id: 't6', category: 'Wrestling - Control', name: 'Mat Return & Ground Control', defaultMin: 15, notes: 'Spiral ride down; claw & ankle breakdown mechanics.' },
  { id: 't7', category: 'MMA - Wall Work', name: 'Cage Pin & Takedown Defense', defaultMin: 15, notes: 'Whizzer mechanics against the wall and turning hip to clear posture.' },
  { id: 't8', category: 'Warm-up', name: 'Dynamic Joint Mobility & Flow Rolling', defaultMin: 10, notes: 'Light movement focusing on hip mobility, neck stretches, and entry light reps.' }
];

export default function TechniqueLibraryModal({ isOpen, onClose, onSelectTechnique }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', ...new Set(PRESET_DRILLS.map((d) => d.category.split(' - ')[0]))];

  const filteredDrills = PRESET_DRILLS.filter((drill) => {
    const matchesSearch = drill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          drill.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || drill.category.startsWith(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-2xl w-full p-6 space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Technique & Drill Bank</h3>
              <p className="text-xs text-slate-500">Insert pre-configured drills into your session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search techniques, positions, or drills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Drills Grid / List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredDrills.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No matching techniques found in bank.
            </div>
          ) : (
            filteredDrills.map((drill) => (
              <div
                key={drill.id}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-blue-300 hover:bg-blue-50/20 transition flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-blue-600 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      {drill.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {drill.defaultMin} mins
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">{drill.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{drill.notes}</p>
                </div>

                <button
                  onClick={() => {
                    onSelectTechnique(drill);
                    onClose();
                  }}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-semibold rounded-lg border border-slate-200 hover:border-blue-600 transition shadow-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
