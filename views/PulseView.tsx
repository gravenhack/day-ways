import React from 'react';
import { UserState } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import EnergyGauge from '../components/EnergyGauge';

interface PulseViewProps {
    userState: UserState;
}

const PulseView: React.FC<PulseViewProps> = ({ userState }) => {
    
    // Mock Data for Charts
    const energyData = [
        { time: '6am', energy: 40 },
        { time: '9am', energy: 85 },
        { time: '12pm', energy: 70 },
        { time: '3pm', energy: 55 },
        { time: '6pm', energy: 65 },
        { time: '9pm', energy: 30 },
    ];

    const balanceData = [
        { subject: 'Mental', A: 80, fullMark: 100 },
        { subject: 'Physical', A: 45, fullMark: 100 },
        { subject: 'Emotional', A: 60, fullMark: 100 },
    ];

    return (
        <div className="h-full overflow-y-auto no-scrollbar p-6 pb-24">
            <h1 className="text-3xl font-light text-white mb-6">Pulse</h1>

            <div className="mb-8">
                <EnergyGauge level={userState.energyLevel} />
            </div>

            {/* Circadian Chart */}
            <div className="mb-8">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Circadian Rhythm</h3>
                <div className="h-48 w-full bg-slate-900/50 rounded-2xl border border-white/5 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={energyData}>
                            <defs>
                                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#f59e0b' }}
                            />
                            <Area type="monotone" dataKey="energy" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEnergy)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Balance Radar */}
            <div className="mb-8">
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Daily Balance</h3>
                <div className="h-64 w-full bg-slate-900/50 rounded-2xl border border-white/5 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={balanceData}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Radar name="Balance" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-4 right-4 text-xs text-slate-500">
                        Physical activity low.
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl">
                <h4 className="text-indigo-300 font-medium mb-1">Insight</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                    Your energy dips significantly around 3pm. Consider moving "Creative Writing" to 10am tomorrow.
                </p>
            </div>
        </div>
    );
};

export default PulseView;
