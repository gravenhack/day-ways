import React, { useMemo } from 'react';
import { Task, TaskStatus, EnergyType } from '../types';
import { Play, CheckCircle, Clock } from 'lucide-react';

interface CircularTimelineProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
}

const CircularTimeline: React.FC<CircularTimelineProps> = ({ tasks, onTaskSelect }) => {
  // SVG Configuration
  const size = 340;
  const center = size / 2;
  const radius = 120;
  const strokeWidth = 20;

  // Convert time to angle (0 degrees is 6:00 AM to simulate sunrise at top/start usually, 
  // but let's do 0 = 12AM at top for standard clock).
  // Top (0, -1) is -90 degrees in SVG math.
  
  const timeToDegrees = (timeStr: string) => {
    if(!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 360;
  };

  const getCoordinates = (angleInDegrees: number, offsetRadius: number = 0) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);
    const x = center + (radius + offsetRadius) * Math.cos(angleInRadians);
    const y = center + (radius + offsetRadius) * Math.sin(angleInRadians);
    return { x, y };
  };

  // Sort tasks by time (naive implementation for demo)
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => (a.startTime || '0').localeCompare(b.startTime || '0'));
  }, [tasks]);

  const getColor = (type: EnergyType) => {
    switch (type) {
      case EnergyType.MENTAL: return '#6366f1'; // Indigo
      case EnergyType.PHYSICAL: return '#ef4444'; // Red
      case EnergyType.EMOTIONAL: return '#10b981'; // Emerald
      default: return '#94a3b8';
    }
  };

  return (
    <div className="relative flex items-center justify-center mt-8">
        {/* The Dial */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-2xl">
        {/* Background Circle */}
        <circle cx={center} cy={center} r={radius} stroke="#1e293b" strokeWidth={2} fill="transparent" />
        <circle cx={center} cy={center} r={radius - 40} fill="#0f172a" opacity={0.5} />

        {/* Hour Markers */}
        {[0, 6, 12, 18].map((hour) => {
            const angle = (hour / 24) * 360;
            const pos = getCoordinates(angle, 20);
            return (
                <text 
                    key={hour} 
                    x={pos.x} 
                    y={pos.y} 
                    fill="#64748b" 
                    fontSize="12" 
                    textAnchor="middle" 
                    alignmentBaseline="middle"
                >
                    {hour === 0 ? '24' : hour}h
                </text>
            )
        })}

        {/* Tasks Arcs */}
        {sortedTasks.map((task) => {
            if (!task.startTime) return null;
            
            const startAngle = timeToDegrees(task.startTime);
            // Approximate end angle based on duration (duration / 24h in mins * 360)
            const sweepAngle = (task.durationMinutes / 1440) * 360; 
            const endAngle = startAngle + sweepAngle;

            // SVG Arc path command
            const start = getCoordinates(startAngle);
            const end = getCoordinates(endAngle);
            const largeArcFlag = sweepAngle <= 180 ? "0" : "1";

            const d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
            ].join(" ");

            const isDone = task.status === TaskStatus.COMPLETED;
            const color = isDone ? '#334155' : getColor(task.energyType);

            return (
                <g key={task.id} onClick={() => onTaskSelect(task)} className="cursor-pointer transition-opacity hover:opacity-80">
                    <path 
                        d={d} 
                        stroke={color} 
                        strokeWidth={strokeWidth} 
                        fill="none" 
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
                    />
                    {/* Task Icon / Dot */}
                    <circle cx={start.x} cy={start.y} r={6} fill="#ffffff" />
                </g>
            );
        })}

        {/* Center Hub */}
        <g transform={`translate(${center}, ${center})`}>
            <text x="0" y="-10" textAnchor="middle" fill="#f8fafc" fontSize="24" fontWeight="bold">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </text>
            <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="12" letterSpacing="2">
                NOW
            </text>
        </g>
      </svg>

        {/* Floating Context Labels (Absolute positioned for visual flair) */}
       <div className="absolute bottom-0 w-full flex justify-center space-x-4 text-xs text-slate-400">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Mental
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> Physical
            </div>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Emotional
            </div>
       </div>
    </div>
  );
};

export default CircularTimeline;
