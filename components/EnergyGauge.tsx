import React from 'react';

interface EnergyGaugeProps {
    level: number; // 0 to 100
}

const EnergyGauge: React.FC<EnergyGaugeProps> = ({ level }) => {
    // Determine color based on level
    let colorClass = "bg-green-500";
    if (level < 30) colorClass = "bg-red-500";
    else if (level < 60) colorClass = "bg-yellow-500";

    return (
        <div className="w-full p-4 bg-slate-800/50 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm font-medium tracking-wider">INTERNAL BATTERY</span>
                <span className="text-white font-bold">{level}%</span>
            </div>
            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${colorClass} transition-all duration-1000 ease-out relative`} 
                    style={{ width: `${level}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right">
                {level > 80 ? "Peak Performance" : level > 40 ? "Stable State" : "Recovery Needed"}
            </p>
        </div>
    );
};

export default EnergyGauge;
