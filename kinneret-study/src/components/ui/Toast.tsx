import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const typeConfig: Record<
  string,
  { color: string; bg: string; icon: typeof CheckCircle }
> = {
  success: {
    color: '#34c759',
    bg: 'rgba(52,199,89,0.12)',
    icon: CheckCircle,
  },
  error: {
    color: '#ff453a',
    bg: 'rgba(255,69,58,0.12)',
    icon: XCircle,
  },
  achievement: {
    color: '#ffd60a',
    bg: 'rgba(255,214,10,0.12)',
    icon: Trophy,
  },
  xp: {
    color: '#bf5af2',
    bg: 'rgba(191,90,242,0.12)',
    icon: Sparkles,
  },
};

function ToastItem({
  id,
  message,
  type,
}: {
  id: string;
  message: string;
  type: string;
}) {
  const { removeToast } = useAppStore();
  const config = typeConfig[type] ?? typeConfig.success;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      role="alert"
      aria-live="polite"
      className="flex items-center gap-3 pointer-events-auto"
      style={{
        backgroundColor: 'var(--bg-overlay)',
        border: `1px solid ${config.color}33`,
        borderRadius: '12px',
        padding: '12px 16px',
        minWidth: '280px',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-lg)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: config.bg,
        }}
      >
        <Icon size={18} color={config.color} />
      </div>
      <p
        className="flex-1 text-sm font-medium"
        style={{ color: 'var(--text-primary)' }}
      >
        {message}
      </p>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 transition-opacity hover:opacity-80"
        style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        aria-label="Dismiss notification"
      >
        <XCircle size={16} />
      </button>
    </motion.div>
  );
}

export default function Toast() {
  const { toasts } = useAppStore();

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
