import React, { useState, useEffect } from 'react';
import { UserState, Task, TaskStatus, EnergyType } from './types';
import HorizonView from './views/HorizonView';
import PulseView from './views/PulseView';
import FlowView from './views/FlowView';
import MorningArchitect from './components/MorningArchitect';
import { Home, Activity, PlusCircle, Clock, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<UserState>({
    energyLevel: 70,
    currentView: 'HORIZON',
    tasks: [], // Initially empty, waiting for Architect
    activeTaskId: null,
  });

  const [showArchitect, setShowArchitect] = useState(true);

  // Handlers
  const handleScenarioSelect = (scenario: any, initialEnergy: number) => {
    setState(prev => ({
      ...prev,
      energyLevel: initialEnergy,
      tasks: scenario.tasks,
    }));
    setShowArchitect(false);
  };

  const startTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      activeTaskId: taskId,
      currentView: 'FLOW',
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: TaskStatus.IN_PROGRESS } : t)
    }));
  };

  const completeTask = (task: Task) => {
    setState(prev => ({
      ...prev,
      activeTaskId: null,
      currentView: 'HORIZON',
      // Consume energy based on task cost
      energyLevel: Math.max(0, prev.energyLevel - (task.energyCost * 2)), 
      tasks: prev.tasks.map(t => t.id === task.id ? { ...t, status: TaskStatus.COMPLETED, completedAt: new Date().toISOString() } : t)
    }));
  };

  const exitFlow = () => {
    setState(prev => ({ ...prev, currentView: 'HORIZON', activeTaskId: null }));
  }

  // Navigation Tab Component
  const NavBar = () => (
    <div className="fixed bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl h-16 flex items-center justify-around shadow-2xl z-40">
      <button 
        onClick={() => setState(s => ({ ...s, currentView: 'HORIZON' }))}
        className={`p-2 rounded-xl transition-all ${state.currentView === 'HORIZON' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <Home size={24} />
      </button>
      
      <button 
        onClick={() => setState(s => ({ ...s, currentView: 'PULSE' }))}
        className={`p-2 rounded-xl transition-all ${state.currentView === 'PULSE' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <Activity size={24} />
      </button>

      <div className="w-px h-8 bg-slate-700/50"></div>

      <button 
        onClick={() => setShowArchitect(true)} // Re-open architect for demo
        className="text-slate-500 hover:text-slate-300"
      >
        <PlusCircle size={24} />
      </button>
    </div>
  );

  // View Router
  const renderView = () => {
    switch (state.currentView) {
      case 'HORIZON':
        return <HorizonView tasks={state.tasks} onStartTask={startTask} />;
      case 'PULSE':
        return <PulseView userState={state} />;
      case 'FLOW':
        const activeTask = state.tasks.find(t => t.id === state.activeTaskId);
        return <FlowView activeTask={activeTask || null} onComplete={completeTask} onExit={exitFlow} />;
      default:
        return <HorizonView tasks={state.tasks} onStartTask={startTask} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-50 overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      
      {/* Morning Architect Modal */}
      {showArchitect && (
        <MorningArchitect 
            onScenarioSelected={handleScenarioSelect} 
            onClose={() => setShowArchitect(false)} 
        />
      )}

      {/* Main Content */}
      <main className="h-full w-full max-w-md mx-auto relative bg-slate-900 md:border-x border-slate-800 shadow-2xl">
        {renderView()}
        
        {/* Navigation Bar (Hidden in Flow Mode) */}
        {state.currentView !== 'FLOW' && <NavBar />}
      </main>

    </div>
  );
};

export default App;
