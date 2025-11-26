import React, { useState } from 'react';
import { Gavel, Loader2, AlertCircle } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setError('نظام المصادقة غير مفعل في هذه النسخة المحلية.');

    } catch (err: any) {
      console.error("Auth Error:", err);
      setError('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="bg-primary-50 dark:bg-primary-900/10 p-8 flex flex-col items-center border-b border-gray-100 dark:border-slate-800">
          <div className="bg-primary-600 p-3 rounded-xl shadow-lg mb-4">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-1">آجال</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">بوابة إدارة الجلسات والمواعيد</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 text-center">
            {isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400 leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full font-cairo bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all dir-ltr text-right placeholder:text-right"
                placeholder="name@example.com"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full font-cairo bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all dir-ltr text-right placeholder:text-right"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{isRegistering ? 'إنشاء الحساب' : 'تسجيل الدخول'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              {isRegistering 
                ? 'لديك حساب بالفعل؟ تسجيل الدخول' 
                : 'ليس لديك حساب؟ إنشاء حساب جديد'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;