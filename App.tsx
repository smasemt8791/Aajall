import React, { useEffect, useState } from 'react';
import { getDeadlines, addDeadline, updateDeadline, deleteDeadline } from './services/storage';
import { Deadline } from './types';
import DeadlineCard from './components/DeadlineCard';
import DeadlineForm from './components/DeadlineForm';
import Modal from './components/Modal';
import Dashboard from './components/Dashboard';
import CountDown from './components/CountDown';
import InstallRibbon from './components/InstallRibbon';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import { Plus, Scale, Moon, Sun, BarChart3, AlertOctagon, Gavel, FileWarning, Download } from 'lucide-react';

const App: React.FC = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const { isInstallable, handleInstallClick } = useInstallPrompt();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    setLanguage(navigator.language.startsWith('ar') ? 'ar' : 'en');
  }, []);

  // Theme State
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  // Apply Theme
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const data = getDeadlines();
    setDeadlines(data);
  };

  // Handlers
  const handleAddClick = () => {
    setEditingDeadline(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      await deleteDeadline(id);
      refreshData();
    }
  };

  const handleFormSubmit = async (data: Omit<Deadline, 'id'>) => {
    try {
      if (editingDeadline) {
        await updateDeadline(editingDeadline.id, data);
      } else {
        await addDeadline(data);
      }
      refreshData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving deadline:", error);
      alert("حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.");
    }
  };

  // Derived State for Sections
  const now = Date.now();

  // Top 3 Critical (Upcoming, sorted by closeness)
  const criticalDeadlines = deadlines
    .filter(d => d.targetDate > now)
    .sort((a, b) => a.targetDate - b.targetDate)
    .slice(0, 3);

  // Appointments (Hearings & Meetings) vs Non-Appointment (Filings/Limitations)
  const appointments = deadlines.filter(d => (d.type === 'hearing' || d.type === 'meeting' || !d.type)); // Backwards compatibility
  const filings = deadlines.filter(d => d.type === 'filing' || d.type === 'limitation');

  return (
    <div
      className="min-h-screen text-slate-900 dark:text-gray-100 transition-colors duration-300 pb-24 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: isDark ? "url('/images/backgournd dark.png')" : "url('/images/backgournd.png')"
      }}
    >

      {/* Top Decoration Bar */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-gold-500 to-primary-500 w-full fixed top-0 z-50"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 py-5 px-6 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-gold-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm">
                <Scale className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-none tracking-wide">آجال</h1>
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-1 font-medium">مساعدك في المواعيد القضائية</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95 font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'ar' ? 'حمل التطبيق' : 'Install App'}</span>
              </button>
            )}
            <button
              onClick={() => setIsDashboardOpen(true)}
              className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all active:scale-95 shadow-sm"
              title="لوحة المعلومات"
            >
              <BarChart3 className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all active:scale-95"
              aria-label="تبديل النمط"
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            <button
              onClick={handleAddClick}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-600 hover:to-primary-500 text-white px-6 py-3 rounded-lg transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 active:scale-95 font-medium text-lg"
            >
              <Plus className="w-6 h-6" />
              <span>موعد جديد</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-6 mt-6 space-y-12">

        {/* Critical Top 3 Dashboard */}
        {criticalDeadlines.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                المواعيد الأكثر أهمية
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {criticalDeadlines.map((deadline) => (
                <div key={'crit-' + deadline.id} className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-700">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="font-bold text-xl truncate max-w-[80%]">{deadline.caseTitle}</h3>
                    <span className="text-sm bg-white/10 px-2 py-1 rounded text-gray-300 font-mono">#{deadline.caseNumber}</span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                    <CountDown targetDate={deadline.targetDate} />
                  </div>

                  {deadline.assignedTo && (
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
                      <span>المكلف:</span>
                      <span className="text-white font-medium">{deadline.assignedTo}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {deadlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500 dark:text-slate-500 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-full shadow-inner mb-6">
              <BarChart3 className="w-20 h-20 opacity-30 text-primary-500" />
            </div>
            <h2 className="text-3xl font-serif text-slate-700 dark:text-slate-300 mb-2">القائمة فارغة</h2>
            <p className="text-base opacity-60">لا توجد مواعيد مسجلة حالياً، ابدأ بإضافة موعد جديد</p>
            <button
              onClick={handleAddClick}
              className="mt-8 text-primary-600 dark:text-primary-400 hover:underline font-bold text-lg"
            >
              إضافة موعد الآن
            </button>
          </div>
        ) : (
          <>
            {/* Section 1: Hearings & Appointments */}
            {appointments.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8 px-1 border-b border-gray-200 dark:border-slate-800 pb-3">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <Gavel className="w-6 h-6 text-primary-600" />
                    المواعيد والجلسات القضائية
                  </h2>
                  <span className="bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-400 px-4 py-1.5 rounded-full text-sm font-bold">
                    {appointments.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {appointments.map((deadline) => (
                    <DeadlineCard
                      key={deadline.id}
                      deadline={deadline}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 2: Filings & Limitations */}
            {filings.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8 px-1 border-b border-gray-200 dark:border-slate-800 pb-3">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <FileWarning className="w-6 h-6 text-amber-600" />
                    المهل القانونية والإيداعات
                  </h2>
                  <span className="bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 px-4 py-1.5 rounded-full text-sm font-bold">
                    {filings.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filings.map((deadline) => (
                    <DeadlineCard
                      key={deadline.id}
                      deadline={deadline}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 left-6 z-40">
        <button
          onClick={handleAddClick}
          className="bg-gradient-to-r from-primary-700 to-primary-600 text-white w-16 h-16 rounded-2xl shadow-xl shadow-primary-900/30 flex items-center justify-center transition-transform active:scale-90 rotate-0 hover:rotate-90 duration-300"
          aria-label="إضافة موعد"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDeadline ? 'تعديل بيانات الموعد' : 'تسجيل موعد جديد'}
      >
        <DeadlineForm
          initialData={editingDeadline || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Dashboard Modal */}
      <Modal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        title="لوحة المعلومات والإحصائيات"
        maxWidth="max-w-4xl"
      >
        <Dashboard deadlines={deadlines} />
      </Modal>

      <InstallRibbon />
    </div>
  );
};

export default App;