import React, { useEffect, useState } from 'react';
import { TimeComponents } from '../types';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountDownProps {
  targetDate: number;
}

const CountDown: React.FC<CountDownProps> = ({ targetDate }) => {
  const [time, setTime] = useState<TimeComponents | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = targetDate - now;
      const isPast = diff < 0;
      const absDiff = Math.abs(diff);

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

      setTime({ days, hours, minutes, isPast });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!time) return <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 animate-pulse rounded"></div>;

  // Urgency logic: Less than 48 hours and not past
  const isUrgent = !time.isPast && time.days < 2;
  const isVeryUrgent = !time.isPast && time.days === 0 && time.hours < 12;

  let textColorClass = "text-primary-600 dark:text-primary-400";
  let icon = <Clock className="w-5 h-5" />;
  
  if (time.isPast) {
    textColorClass = "text-red-500/70 dark:text-red-400/60";
  } else if (isVeryUrgent) {
    textColorClass = "text-red-600 dark:text-red-500 font-bold";
    icon = <AlertTriangle className="w-5 h-5 animate-pulse" />;
  } else if (isUrgent) {
    textColorClass = "text-amber-600 dark:text-amber-400 font-medium";
  }

  return (
    <div className={`flex items-center gap-2 text-base mt-2 ${textColorClass}`}>
      {icon}
      <span dir="rtl" className="tracking-tight">
        {time.isPast ? 'انقضى منذ: ' : 'المتبقي: '}
        <span className="font-mono font-bold mx-1 text-lg">
          {time.days > 0 && `${time.days} يوم، `}
          {time.hours > 0 && `${time.hours} ساعة، `}
          {`${time.minutes} دقيقة`}
        </span>
      </span>
    </div>
  );
};

export default CountDown;