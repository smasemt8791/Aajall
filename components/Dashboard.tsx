import React from 'react';
import { Deadline } from '../types';
import { PieChart, BarChart, Gavel, Calendar, CheckCircle2, FileWarning } from 'lucide-react';

interface DashboardProps {
  deadlines: Deadline[];
}

const Dashboard: React.FC<DashboardProps> = ({ deadlines }) => {
  const now = Date.now();
  
  // Statistics
  const total = deadlines.length;
  const past = deadlines.filter(d => d.targetDate < now).length;
  const upcoming = total - past;
  
  // Update: Include meetings in the "Hearings/Sessions" count
  const hearingsCount = deadlines.filter(d => d.type === 'hearing' || d.type === 'meeting' || !d.type).length;
  const filingsCount = deadlines.filter(d => d.type === 'filing' || d.type === 'limitation').length;

  // Gantt Chart Logic
  const processedDeadlines = deadlines
    .map(d => {
        let start = d.createdAt || (d.targetDate - (7 * 24 * 60 * 60 * 1000));
        if (start > d.targetDate) start = d.targetDate - (24 * 60 * 60 * 1000);
        return { ...d, start };
    })
    .sort((a, b) => a.targetDate - b.targetDate);

  const minDate = Math.min(now, ...processedDeadlines.map(d => d.start));
  const maxDate = Math.max(now + (7 * 24 * 60 * 60 * 1000), ...processedDeadlines.map(d => d.targetDate));
  const totalDuration = maxDate - minDate;

  // Helper to get percentage position
  const getPercent = (time: number) => {
    if (totalDuration === 0) return 0;
    return Math.max(0, Math.min(100, ((time - minDate) / totalDuration) * 100));
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('ar-SA', { month: 'short', day: 'numeric' }).format(new Date(ts));
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-100 dark:border-primary-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">جلسات/اجتماعات</span>
            <Gavel className="w-4 h-4 text-primary-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800 dark:text-white font-serif">{hearingsCount}</span>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">إيداعات/مهل</span>
            <FileWarning className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800 dark:text-white font-serif">{filingsCount}</span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
          <div className="flex justify-between items-start mb-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">القادمة</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800 dark:text-white font-serif">{upcoming}</span>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">المنقضية</span>
            <CheckCircle2 className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-2xl font-bold text-slate-800 dark:text-white font-serif">{past}</span>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-serif flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary-500" />
                الخط الزمني (Gantt Chart)
            </h3>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">اليوم: {formatDate(now)}</span>
        </div>

        {deadlines.length === 0 ? (
            <div className="text-center text-gray-400 py-10">لا توجد بيانات للعرض</div>
        ) : (
            <div className="relative mt-4">
                {/* Current Time Marker */}
                <div 
                    className="absolute top-0 bottom-0 w-px bg-red-500 z-10 border-r border-red-500 border-dashed"
                    style={{ left: `${getPercent(now)}%`, opacity: 0.6 }}
                >
                    <div className="absolute -top-2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>

                {/* Timeline Header */}
                <div className="flex justify-between text-xs text-gray-400 mb-4 border-b border-gray-200 dark:border-slate-700 pb-2 font-mono">
                    <span>{formatDate(minDate)}</span>
                    <span>{formatDate(minDate + totalDuration / 2)}</span>
                    <span>{formatDate(maxDate)}</span>
                </div>

                {/* Rows */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {processedDeadlines.map((deadline) => {
                        const startPct = getPercent(deadline.start);
                        const endPct = getPercent(deadline.targetDate);
                        const widthPct = Math.max(1, endPct - startPct);
                        const isPast = deadline.targetDate < now;
                        
                        let barColor = "bg-gradient-to-r from-primary-500 to-primary-400";
                        if (deadline.type === 'filing') barColor = "bg-gradient-to-r from-amber-500 to-amber-400";
                        if (deadline.type === 'limitation') barColor = "bg-gradient-to-r from-red-500 to-red-400";
                        if (deadline.type === 'meeting') barColor = "bg-gradient-to-r from-emerald-500 to-emerald-400";
                        
                        return (
                            <div key={deadline.id} className="relative group">
                                <div className="flex justify-between text-xs mb-1 px-1">
                                    <span className="font-bold truncate max-w-[70%] text-slate-700 dark:text-slate-300">
                                        {deadline.caseTitle}
                                    </span>
                                    <span className="text-gray-400 font-mono">{deadline.caseNumber}</span>
                                </div>
                                
                                {/* Track Background */}
                                <div className="h-3 w-full bg-gray-100 dark:bg-slate-700/50 rounded-full overflow-hidden relative">
                                    {/* Bar */}
                                    <div 
                                        className={`absolute top-0 bottom-0 rounded-full transition-all duration-500 ${
                                            isPast 
                                            ? 'bg-slate-400 dark:bg-slate-600' 
                                            : barColor
                                        }`}
                                        style={{ 
                                            left: `${startPct}%`,
                                            width: `${widthPct}%` 
                                        }}
                                    ></div>
                                </div>
                                
                                {/* Tooltip on hover */}
                                <div className="absolute top-full mt-1 right-0 z-20 hidden group-hover:block bg-black/80 text-white text-xs px-2 py-1 rounded">
                                    {formatDate(deadline.targetDate)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;