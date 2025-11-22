import React, { useState, useEffect } from 'react';
import { generateMorningScenarios } from '../services/geminiService';
import { DayScenario } from '../types';
import { Sparkles, Battery, Check, Loader2, Sun } from 'lucide-react';

interface MorningArchitectProps {
  onScenarioSelected: (scenario: DayScenario, initialEnergy: number) => void;
  onClose: () => void;
}

const MorningArchitect: React.FC<MorningArchitectProps> = ({ onScenarioSelected, onClose }) => {
  const [step, setStep] = useState<'ENERGY' | 'GENERATING' | 'SELECTION'>('ENERGY');
  const [energy, setEnergy] = useState(75);
  const [scenarios, setScenarios] = useState<DayScenario[]>([]);
  
  // Mock backlog for demo
  const backlog = [
    "Complete Project Alpha Proposal",
    "Gym Workout",
    "Buy Groceries",
    "Call Mom",
    "Review Quarterly Budget",
    "Read 20 pages",
    "Meditate"
  ];

  const handleGenerate = async () => {
    setStep('GENERATING');
    const results = await generateMorningScenarios(energy, backlog);
    setScenarios(results);
    setStep('SELECTION');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sun className="w-6 h-6 text-yellow-400" />
                Morning Architect
            </h2>
            <p className="text-indigo-200 text-sm mt-1">Design your day based on your biology.</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
            
            {step === 'ENERGY' && (
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-slate-200">How are you feeling today?</h3>
                        <p className="text-slate-400 text-sm">We'll adapt the workload to your physiological state.</p>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-5xl font-bold text-indigo-400">{energy}%</div>
                        <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            value={energy} 
                            onChange={(e) => setEnergy(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between w-full text-xs text-slate-500 font-medium uppercase tracking-wide">
                            <span>Exhausted</span>
                            <span>Energized</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        Generate Possibilities
                    </button>
                </div>
            )}

            {step === 'GENERATING' && (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-slate-300 animate-pulse">Analyzing circadian rhythm...</p>
                    <p className="text-slate-500 text-xs">Optimizing for peak flow states</p>
                </div>
            )}

            {step === 'SELECTION' && (
                <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-slate-200 mb-4">Choose your path:</h3>
                     {scenarios.map((s) => (
                         <div 
                            key={s.id}
                            onClick={() => onScenarioSelected(s, energy)}
                            className="group relative overflow-hidden bg-slate-800/50 border border-slate-700 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02]"
                         >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-white font-bold text-lg">{s.name}</h4>
                                    <span className="text-xs font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{s.focus}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-400">Predicted End Energy</div>
                                    <div className={`font-bold ${s.predictedEnergyEnd > 50 ? 'text-green-400' : 'text-orange-400'}`}>
                                        {s.predictedEnergyEnd}%
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">{s.description}</p>
                            <div className="flex gap-2 overflow-x-hidden pb-2">
                                {s.tasks.slice(0, 3).map((t, i) => (
                                    <span key={i} className="text-[10px] bg-slate-900/80 text-slate-300 px-2 py-1 rounded-full border border-slate-700 whitespace-nowrap">
                                        {t.title}
                                    </span>
                                ))}
                                {s.tasks.length > 3 && <span className="text-[10px] text-slate-500 py-1">+{s.tasks.length - 3} more</span>}
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                         </div>
                     ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MorningArchitect;
