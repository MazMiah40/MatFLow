import React, { useState } from 'react';

export default function CurriculumWizard({ slotContext, onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [focusArea, setFocusArea] = useState('Guard Passing');
  const [techniqueInput, setTechniqueInput] = useState('');
  const [techniques, setTechniques] = useState([]);

  const handleAddTechnique = () => {
    if (!techniqueInput.trim()) return;
    setTechniques([...techniques, { name: techniqueInput.trim(), category: focusArea }]);
    setTechniqueInput('');
  };

  const handleRemoveTechnique = (index) => {
    setTechniques(techniques.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      focusArea,
      techniques
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Curriculum Wizard • {slotContext?.day} ({slotContext?.slot})
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              {step === 1 ? '1. Programme Overview' : '2. Add Techniques'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Programme Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Side Control Escapes & Reversals"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Focus Area
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Guard Passing">Guard Passing</option>
                  <option value="Submissions">Submissions</option>
                  <option value="Escapes & Retention">Escapes & Retention</option>
                  <option value="Takedowns & Throws">Takedowns & Throws</option>
                  <option value="Positional Control">Positional Control</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Add Technique / Move
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Knee Slice Pass to Side Control"
                    value={techniqueInput}
                    onChange={(e) => setTechniqueInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechnique}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Added List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {techniques.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No techniques added yet.</p>
                ) : (
                  techniques.map((tech, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs"
                    >
                      <span className="text-slate-200 font-medium">{tech.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTechnique(idx)}
                        className="text-red-400 hover:text-red-300 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
              >
                Back
              </button>
            ) : (
              <span />
            )}

            {step === 1 ? (
              <button
                type="button"
                disabled={!title.trim()}
                onClick={() => setStep(2)}
                className="px-5 py-2.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl disabled:opacity-50 transition-all"
              >
                Next: Add Techniques →
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all"
              >
                Save Programme
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
