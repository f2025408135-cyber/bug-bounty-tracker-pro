import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: { icon: <CheckCircle className="text-green-500" size={24} />, bg: 'bg-green-50 border-green-200 text-green-800' },
    error: { icon: <AlertCircle className="text-red-500" size={24} />, bg: 'bg-red-50 border-red-200 text-red-800' },
    info: { icon: <Info className="text-blue-500" size={24} />, bg: 'bg-blue-50 border-blue-200 text-blue-800' }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${config[type].bg} min-w-[300px]`}>
        {config[type].icon}
        <p className="flex-1 font-medium text-sm">{message}</p>
        <button onClick={onClose} className="text-current opacity-60 hover:opacity-100 transition-opacity">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Notification;
