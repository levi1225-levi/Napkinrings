import { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './BottomNav';
import Toast from '../ui/Toast';
import Button from '../ui/Button';
import { useAppStore } from '../../store/appStore';

const Dashboard = lazy(() => import('../../pages/Dashboard'));
const StudyHub = lazy(() => import('../../pages/StudyHub'));
const Analytics = lazy(() => import('../../pages/Analytics'));
const Sources = lazy(() => import('../../pages/Sources'));
const Settings = lazy(() => import('../../pages/Settings'));

const levelTitles: Record<number, string> = {
  1: 'Talmid',
  2: 'Talmid Chacham',
  3: 'Chaver',
  4: 'Rav',
  5: 'Rosh Yeshiva',
  6: 'Gaon',
};

const pageComponents: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
  home: Dashboard,
  study: StudyHub,
  analytics: Analytics,
  sources: Sources,
  settings: Settings,
};

function PageLoader() {
  return (
    <div
      style={{ padding: '24px 24px 32px', maxWidth: '960px', margin: '0 auto', width: '100%' }}
      role="status"
      aria-label="Loading page"
    >
      {/* Skeleton greeting */}
      <div className="skeleton skeleton-title" style={{ width: '45%', marginBottom: 8 }} />
      <div className="skeleton skeleton-text" style={{ width: '65%', marginBottom: 24 }} />
      {/* Skeleton CTA */}
      <div className="skeleton" style={{ height: 52, borderRadius: 16, marginBottom: 24 }} />
      {/* Skeleton cards */}
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" style={{ width: '80%' }} />
    </div>
  );
}

function LevelUpOverlay() {
  const { showLevelUp, newLevel, dismissLevelUp } = useAppStore();

  if (!showLevelUp || newLevel === null) return null;

  const title = levelTitles[newLevel] ?? `Level ${newLevel}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        backgroundColor: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(12px)',
        fontFamily: 'var(--font-ui)',
      }}
      role="alertdialog"
      aria-label={`Level up! You reached level ${newLevel}: ${title}`}
    >
      {/* Confetti-like particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => {
          const colors = ['#ffd60a', '#4f8ef7', '#bf5af2', '#34c759', '#ff9f0a', '#ff453a'];
          const color = colors[i % colors.length];
          const left = `${Math.random() * 100}%`;
          const delay = Math.random() * 0.8;
          const size = 4 + Math.random() * 8;

          return (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 0, rotate: 0 }}
              animate={{
                y: ['0%', '120vh'],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360 + Math.random() * 360],
              }}
              transition={{
                duration: 2.5 + Math.random() * 1.5,
                delay,
                ease: 'easeOut',
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
              style={{
                position: 'absolute',
                left,
                top: '-10px',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          );
        })}
      </div>

      {/* Level up content */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        {/* Star / glow */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 40px rgba(255,214,10,0.2)',
              '0 0 80px rgba(255,214,10,0.4)',
              '0 0 40px rgba(255,214,10,0.2)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center justify-center"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffd60a, #ff9f0a)',
          }}
        >
          <span style={{ fontSize: '40px', fontWeight: 800, color: '#0a0a0f' }}>
            {newLevel}
          </span>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm font-medium uppercase tracking-widest"
          style={{ color: '#ffd60a' }}
        >
          Level Up!
        </motion.p>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold"
          style={{ color: 'var(--text-primary)', margin: 0 }}
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button variant="primary" size="lg" onClick={dismissLevelUp}>
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function AppShell() {
  const { activeTab, showLevelUp } = useAppStore();

  const ActivePage = pageComponents[activeTab] ?? pageComponents.home;

  return (
    <div
      className="relative flex flex-col"
      style={{
        backgroundColor: 'var(--bg-base)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-ui)',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Main scrollable area */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-container"
        style={{
          paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Suspense fallback={<PageLoader />}>
              <ActivePage />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <BottomNav />

      {/* Toast notifications */}
      <Toast />

      {/* Level up overlay */}
      <AnimatePresence>
        {showLevelUp && <LevelUpOverlay />}
      </AnimatePresence>
    </div>
  );
}
