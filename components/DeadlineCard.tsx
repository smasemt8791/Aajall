import React from 'react';
import { Deadline } from '../types';
import CountDown from './CountDown';
import { Trash2, Edit, FileText, Gavel, AlertTriangle, Briefcase, User, Bell, Users } from 'lucide-react';

interface DeadlineCardProps {
  deadline: Deadline;
  onDelete: (id: string) => void;
  onEdit: (deadline: Deadline) => void;
}

const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline, onDelete, onEdit }) => {
  const dateObj = new Date(deadline.targetDate);
  const formattedDate = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
  
  const formattedTime = new Intl.DateTimeFormat('ar-SA', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(dateObj);

  // Urgency logic
  const now = Date.now();
  const diff = deadline.targetDate - now;
  const isUrgent = diff > 0 && diff < 172800000; // 48 hours
  const isPast = diff < 0;

  // Dynamic Styles based on type
  const getTypeConfig = () => {
    switch (deadline.type) {
        case 'hearing':
            return { icon: <Gavel className="w-4 h-4" />, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20', border: 'border-primary-100', label: 'جلسة' };
        case 'filing':
            return { icon: <Briefcase className="w-4 h-4" />, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100', label: 'إيداع' };
        case 'limitation':
            return { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100', label: 'تقادم' };
        case 'meeting':
            return { icon: <Users className="w-4 h-4" />, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100', label: 'موعد عميل' };
        default:
            return { icon: <FileText className="w-4 h-4" />, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: 'عام' };
    }
  };

  const typeConfig = getTypeConfig();

  // Styles
  let cardBorder = "border-stone-200 dark:border-slate-700";
  let hoverEffect = "hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] dark:hover:shadow-[0_0_30px_rgba(14,165,233,0.1)] hover:scale-[1.02] hover:-translate-y-1";
  let urgencyGlow = "";
  
  if (isPast) {
    cardBorder = "border-stone-200 dark:border-slate-800 opacity-70 grayscale-[0.5]";
    hoverEffect = "hover:opacity-100 hover:grayscale-0 transition-all duration-300";
  } else if (isUrgent) {
    cardBorder = "border-amber-400 dark:border-amber-600";
    urgencyGlow = "shadow-[0_0_15px_rgba(251,191,36,0.15)]";
  } else if (deadline.type === 'limitation') {
    cardBorder = "border-red-200 dark:border-red-800/50";
  }

  return (
    <div className={`
      relative group flex flex-col justify-between
      bg-[#fafaf9] dark:bg-slate-800/80 backdrop-blur-sm
      rounded-2xl p-6 
      border ${cardBorder} ${urgencyGlow}
      shadow-sm
      transform transition-all duration-300 ease-out
      animate-fade-in
      ${hoverEffect}
    `}>
      
      {/* Type Badge */}
      <div className="absolute top-0 left-6">
        <div className={`px-4 py-1.5 rounded-b-lg text-xs font-bold flex items-center gap-1.5 ${typeConfig.bg} ${typeConfig.color}`}>
            {typeConfig.icon}
            <span>{typeConfig.label}</span>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 mt-2">
             <span className="text-sm font-mono font-bold text-gray-400 dark:text-gray-500 tracking-wider truncate max-w-[150px]">
               #{deadline.caseNumber}
             </span>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <button 
                  onClick={() => onEdit(deadline)}
                  className="p-2 rounded-md text-gray-400 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
                  aria-label="تعديل"
              >
                  <Edit className="w-4 h-4" />
              </button>
              <button 
                  onClick={() => onDelete(deadline.id)}
                  className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-red-900/20 transition-colors shadow-sm"
                  aria-label="حذف"
              >
                  <Trash2 className="w-4 h-4" />
              </button>
          </div>
        </div>

        <h3 className={`text-xl font-bold font-serif mb-3 leading-relaxed ${isPast ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-slate-800 dark:text-white'}`}>
          {deadline.caseTitle}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-5 font-medium">
          <span className="bg-white dark:bg-slate-700/50 px-3 py-1.5 rounded border border-stone-200 dark:border-slate-700 shadow-sm">{formattedDate}</span>
          <span className="bg-white dark:bg-slate-700/50 px-3 py-1.5 rounded border border-stone-200 dark:border-slate-700 shadow-sm">{formattedTime}</span>
        </div>

        {/* Assignee & Alerts */}
        <div className="flex items-center justify-between border-t border-dashed border-gray-200 dark:border-slate-700 pt-4 mb-3">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-300">
                    <User className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate max-w-[140px]">
                    {deadline.assignedTo || 'غير معين'}
                </span>
            </div>

            {deadline.alertOffsets && deadline.alertOffsets.length > 0 && (
                <div className="flex items-center gap-1.5" title="التنبيهات مفعلة">
                    <Bell className="w-4 h-4 text-gold-500" />
                    <span className="text-xs font-mono text-gray-400">{deadline.alertOffsets.length}</span>
                </div>
            )}
        </div>
      </div>

      <div className={`pt-3 border-t ${isUrgent ? 'border-amber-100 dark:border-amber-900/30' : 'border-stone-200 dark:border-slate-700/50'}`}>
        <CountDown targetDate={deadline.targetDate} />
      </div>
    </div>
  );
};

export default DeadlineCard;