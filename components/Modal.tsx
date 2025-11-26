import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-white dark:bg-slate-900 w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-black/5 dark:ring-white/10 flex flex-col max-h-[90vh]`}
        role="dialog"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white font-serif">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;