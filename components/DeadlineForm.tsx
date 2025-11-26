import React, { useState, useEffect } from 'react';
import { Deadline, DeadlineFormData, DeadlineType } from '../types';
import { Bell, Briefcase, Calendar, AlertTriangle, Gavel, FileText, User, Users } from 'lucide-react';

interface DeadlineFormProps {
  initialData?: Deadline;
  onSubmit: (data: Omit<Deadline, 'id'>) => void;
  onCancel: () => void;
}

const DeadlineForm: React.FC<DeadlineFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<DeadlineFormData>({
    caseTitle: '',
    caseNumber: '',
    targetDate: '',
    targetTime: '09:00',
    type: 'hearing',
    assignedTo: '',
    alertOffsets: []
  });

  useEffect(() => {
    if (initialData) {
      const date = new Date(initialData.targetDate);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');

      setFormData({
        caseTitle: initialData.caseTitle,
        caseNumber: initialData.caseNumber,
        targetDate: `${yyyy}-${mm}-${dd}`,
        targetTime: `${hh}:${min}`,
        type: initialData.type || 'hearing',
        assignedTo: initialData.assignedTo || '',
        alertOffsets: initialData.alertOffsets || [],
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTimeString = `${formData.targetDate}T${formData.targetTime}`;
    const timestamp = new Date(dateTimeString).getTime();

    onSubmit({
      caseTitle: formData.caseTitle,
      caseNumber: formData.caseNumber,
      targetDate: timestamp,
      type: formData.type,
      assignedTo: formData.assignedTo,
      alertOffsets: formData.alertOffsets,
      createdAt: initialData ? initialData.createdAt : Date.now(),
    });
  };

  const toggleAlert = (minutes: number) => {
    setFormData(prev => {
      const exists = prev.alertOffsets.includes(minutes);
      if (exists) {
        return { ...prev, alertOffsets: prev.alertOffsets.filter(m => m !== minutes) };
      } else {
        return { ...prev, alertOffsets: [...prev.alertOffsets, minutes] };
      }
    });
  };

  const inputClasses = "w-full font-cairo bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-600";
  const labelClasses = "block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2";
  
  // Alert options in minutes
  const alertOptions = [
    { label: 'قبل شهر (30 يوم)', value: 43200 },
    { label: 'قبل أسبوع (7 أيام)', value: 10080 },
    { label: 'قبل 24 ساعة', value: 1440 },
    { label: 'قبل ساعة', value: 60 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <button
            type="button"
            onClick={() => setFormData({...formData, type: 'hearing'})}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${formData.type === 'hearing' ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400 ring-1 ring-primary-500' : 'bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-500'}`}
        >
            <Gavel className="w-5 h-5" />
            <span className="text-xs font-bold">جلسة قضائية</span>
        </button>
        <button
            type="button"
            onClick={() => setFormData({...formData, type: 'filing'})}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${formData.type === 'filing' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500' : 'bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-500'}`}
        >
            <Briefcase className="w-5 h-5" />
            <span className="text-xs font-bold">إيداع مذكرة</span>
        </button>
        <button
            type="button"
            onClick={() => setFormData({...formData, type: 'limitation'})}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${formData.type === 'limitation' ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-400 ring-1 ring-red-500' : 'bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-500'}`}
        >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs font-bold">تقادم / مهلة</span>
        </button>
        <button
            type="button"
            onClick={() => setFormData({...formData, type: 'meeting'})}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${formData.type === 'meeting' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500' : 'bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-500'}`}
        >
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold">موعد عميل</span>
        </button>
      </div>

      <div>
        <label className={labelClasses}>
            {formData.type === 'hearing' || formData.type === 'meeting' ? 'العنوان / الموضوع' : 'عنوان الإجراء'}
        </label>
        <input
          type="text"
          required
          value={formData.caseTitle}
          onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
          placeholder="مثال: جلسة سماع الشهود / اجتماع مع الموكل"
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className={labelClasses}>رقم القضية / المرجع</label>
            <input
            type="text"
            required
            value={formData.caseNumber}
            onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
            placeholder="مثال: ٤٤١٢٣٤٥٦"
            className={inputClasses}
            />
        </div>
        <div>
            <label className={labelClasses}>المكلف بالمهمة</label>
            <div className="relative">
                <User className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
                <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="اسم المحامي أو المستشار"
                className={`${inputClasses} pr-10`}
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>التاريخ</label>
          <input
            type="date"
            required
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            className={`${inputClasses} [color-scheme:light] dark:[color-scheme:dark]`}
          />
        </div>
        <div>
          <label className={labelClasses}>الوقت</label>
          <input
            type="time"
            required
            value={formData.targetTime}
            onChange={(e) => setFormData({ ...formData, targetTime: e.target.value })}
            className={`${inputClasses} [color-scheme:light] dark:[color-scheme:dark]`}
          />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-100 dark:border-slate-800">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
            <Bell className="w-4 h-4" />
            التنبيهات التصاعدية
        </label>
        <div className="grid grid-cols-2 gap-3">
            {alertOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.alertOffsets.includes(option.value) ? 'bg-primary-600 border-primary-600' : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600'}`}>
                        {formData.alertOffsets.includes(option.value) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={formData.alertOffsets.includes(option.value)}
                        onChange={() => toggleAlert(option.value)}
                    />
                    <span className={`text-sm transition-colors ${formData.alertOffsets.includes(option.value) ? 'text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-500'}`}>
                        {option.label}
                    </span>
                </label>
            ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg shadow-primary-500/20"
        >
          {initialData ? 'حفظ التعديلات' : 'إضافة'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-transparent border border-gray-300 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
};

export default DeadlineForm;