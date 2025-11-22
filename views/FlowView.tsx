import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus } from '../types';
import { Pause, Play, CheckCircle, XCircle, Music } from 'lucide-react';

interface FlowViewProps {
    activeTask: Task | null;
    onComplete: (task: Task) => void;
    onExit: () => void;
}

const FlowView: React.FC<FlowViewProps> = ({ activeTask, onComplete, onExit }) => {
    const [timeLeft, setTimeLeft] = useState(activeTask ? activeTask.durationMinutes * 60 : 1500);
    const [isActive, setIsActive] = useState(true);
    const [showBinaural, setShowBinaural] = useState(false);
    
    // Circle progress calculation
    const totalTime = activeTask ? activeTask.durationMinutes * 60 : 1500;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - ((totalTime - timeLeft) / totalTime) * circumference;

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!activeTask) return <div className="p-10 text-white">No active task</div>;

    return (
        <div className="h-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none"></div>
            
            {/* Header */}
            <div className="absolute top-8 w-full px-8 flex justify-between items-center z-10">
                <button onClick={onExit} className="p-2 rounded-full bg-slate-900/50 text-slate-400 hover:text-white transition-colors">
                    <XCircle size={24} />
                </button>
                <div className="text-xs font-bold tracking-[0.3em] text-slate-500 uppercase">Flow State</div>
                <button 
                    onClick={() => setShowBinaural(!showBinaural)}
                    className={`p-2 rounded-full transition-colors ${showBinaural ? 'bg-indigo-500 text-white' : 'bg-slate-900/50 text-slate-400'}`}
                >
                    <Music size={24} />
                </button>
            </div>

            {/* Timer Visualization */}
            <div className="relative z-0 mb-12">
                <svg width="320" height="320" className="transform -rotate-90">
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="#1e1b4b"
                        strokeWidth="4"
                        fill="transparent"
                    />
                    <circle
                        cx="160"
                        cy="160"
                        r={radius}
                        stroke="#6366f1"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-light font-mono text-white tracking-tighter">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="text-indigo-400 text-sm mt-2 font-medium tracking-wider animate-pulse">
                        FOCUSING
                    </div>
                </div>
            </div>

            {/* Task Info */}
            <div className="text-center max-w-xs mb-12 z-10">
                <h2 className="text-2xl font-medium text-white mb-2">{activeTask.title}</h2>
                <p className="text-slate-500 text-sm">{activeTask.context} • {activeTask.energyType} Energy</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 z-10">
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-all"
                >
                    {isActive ? <Pause size={28} /> : <Play size={28} ml-1 />}
                </button>

                <button 
                    onClick={() => onComplete(activeTask)}
                    className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900/50 hover:scale-105 transition-transform"
                >
                    <CheckCircle size={40} />
                </button>
            </div>
            
            {/* Binaural Simulation Message */}
            {showBinaural && (
                <div className="absolute bottom-8 text-xs text-indigo-300/50 tracking-widest animate-pulse">
                    40Hz BINAURAL BEATS ACTIVE
                </div>
            )}
        </div>
    );
};

export default FlowView;
