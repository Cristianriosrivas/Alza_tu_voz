import React, { useEffect } from 'react';
import { CheckCircle, Save } from 'lucide-react';

interface SnackbarProps {
  message: string;
  type?: 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Snackbar({ message, type = 'success', onClose, duration = 3000 }: SnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const Icon = type === 'success' ? CheckCircle : Save;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1C1C1E] text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in z-50">
      <Icon className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
}