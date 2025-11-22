import React from 'react';
import { Task, TaskStatus } from '../types';
import CircularTimeline from '../components/CircularTimeline';
import { Calendar, MoreHorizontal, Play } from 'lucide-react';

interface HorizonViewProps {
    tasks: Task[];
    onStartTask: (taskId: string) => void;
}

const HorizonView: React.FC<HorizonViewProps> = ({ tasks, onStartTask }) => {
  const nextTask = tasks.find(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.IN_PROGRESS);

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-24 animate-float">
      <div className="px-6 pt-8 pb-4">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-light text-white">Horizon</h1>
                <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>
            <button className="p-2 bg-slate-800 rounded-full text-slate-400">
                <MoreHorizontal size={20} />
            </button>
        </div>
      </div>

      {/* The Core Visualization */}
      <div className="flex-grow flex flex-col items-center justify-center relative">
        <CircularTimeline 
            tasks={tasks} 
            onTaskSelect={(t) => console.log(t)} 
        />
      </div>

      {/* Next Action Card */}
      {nextTask && (
          <div className="px-6 mt-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => onStartTask(nextTask.id)}
            >
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Play fill="white" className="ml-1 text-white" size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-medium text-lg leading-tight">{nextTask.title}</h3>
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        {nextTask.durationMinutes} min • {nextTask.context}
                    </p>
                </div>
            </div>
          </div>
      )}
      
      {!nextTask && tasks.length > 0 && (
          <div className="text-center mt-10 text-slate-500">All tasks completed for the cycle.</div>
      )}
    </div>
  );
};

export default HorizonView;
