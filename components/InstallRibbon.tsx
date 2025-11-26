import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const InstallRibbon: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="bg-gradient-to-r from-primary-900 to-slate-900 text-white rounded-xl shadow-2xl border border-primary-500/30 p-4 flex items-center justify-between max-w-5xl mx-auto backdrop-blur-lg bg-opacity-95">
        <div className="flex items-center gap-4">
          <div className="bg-primary-600 p-2 rounded-lg animate-pulse">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">تطبيق آجال</h3>
            <p className="text-sm text-gray-300">ثبت التطبيق لتجربة أفضل ووصول أسرع</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleInstallClick}
            className="bg-white text-primary-900 hover:bg-gray-100 px-4 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95 flex items-center gap-2"
          >
            <span>حمل التطبيق</span>
            <span className="hidden sm:inline text-xs font-normal opacity-75">(Install App)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallRibbon;
