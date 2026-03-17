import { useMemo, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  ArrowRight,
  Flame,
  CalendarClock,
  Target,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */

function useAnimatedCounter(target: number, duration = 1200, delay = 0): number {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    let delayDone = false;

    const tick = (ts: number) => {
      if (!delayDone) {
        if (!start) start = ts;
        if (ts - start < delay) {
          frameRef.current = requestAnimationFrame(tick);
          return;
        }
        delayDone = true;
        start = ts;
      }

      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, delay]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  Progress Ring SVG                                                  */
/* ------------------------------------------------------------------ */

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}

function ProgressRing({
  progress,
  size = 140,
  strokeWidth = 10,
  color = '#34c759',
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Confetti                                                           */
/* ------------------------------------------------------------------ */

const CONFETTI_COLORS = ['#4f8ef7', '#34c759', '#ffd60a', '#ff9f0a', '#bf5af2', '#ff453a'];

function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.6,
        duration: 2 + Math.random() * 2.5,
        drift: (Math.random() - 0.5) * 180,
        rotation: Math.random() * 720,
        isCircle: Math.random() > 0.5,
      })),
    [],
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-50"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={p.isCircle ? 'rounded-full' : 'rounded-sm'}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.isCircle ? p.size : p.size * 0.6,
            background: p.color,
            left: `${p.x}%`,
            top: -12,
          }}
          animate={{
            y: [0, typeof window !== 'undefined' ? window.innerHeight + 30 : 900],
            x: [0, p.drift],
            rotate: [0, p.rotation],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating XP animation                                              */
/* ------------------------------------------------------------------ */

function FloatingXP({ value }: { value: number }) {
  return (
    <motion.span
      className="absolute -top-6 text-sm font-bold"
      style={{ color: '#bf5af2' }}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: -32 }}
      transition={{ duration: 1.2, delay: 0.6 }}
      aria-hidden="true"
    >
      +{value} XP
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Stagger variant helpers                                            */
/* ------------------------------------------------------------------ */

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

/* ------------------------------------------------------------------ */
/*  SessionComplete component                                          */
/* ------------------------------------------------------------------ */

export function SessionComplete() {
  const { currentSession, data, setStudyMode, setActiveTab } =
    useAppStore();

  /* ── Derive stats ─────────────────────────────────────────────── */
  const stats = useMemo(() => {
    if (!currentSession) return null;

    const total = currentSession.correctCount + currentSession.incorrectCount;
    const accuracy =
      total > 0
        ? Math.round((currentSession.correctCount / total) * 100)
        : 0;

    // Difficulty breakdown from card states
    const breakdown = { new: 0, learning: 0, review: 0, mastered: 0 };

    // cardsStudied may be a number (store runtime) or string[] (storage type).
    // We count from card states instead for reliability.
    for (const [_id, cs] of Object.entries(data.cardStates)) {
      if (cs && typeof cs === 'object' && 'difficulty' in cs) {
        const diff = (cs as { difficulty: string }).difficulty as keyof typeof breakdown;
        if (diff in breakdown) {
          breakdown[diff]++;
        }
      }
    }

    // Find longest streak from card states
    let longestStreak = 0;
    for (const cs of Object.values(data.cardStates)) {
      if (cs && typeof cs === 'object' && 'streak' in cs) {
        const s = (cs as { streak: number }).streak;
        if (s > longestStreak) longestStreak = s;
      }
    }

    // Next review date
    const reviewDates = Object.values(data.cardStates)
      .map((s) => (s as { nextReviewDate?: string }).nextReviewDate)
      .filter(Boolean) as string[];
    const todayISO = new Date().toISOString();
    const futureDates = reviewDates.filter((d) => d > todayISO).sort();
    const nextReview = futureDates[0] ?? null;

    const xp = currentSession.xpEarned ?? 0;

    return {
      total,
      accuracy,
      breakdown,
      xp,
      longestStreak,
      nextReview,
      correct: currentSession.correctCount,
      incorrect: currentSession.incorrectCount,
    };
  }, [currentSession, data.cardStates]);

  /* ── Animated counters ────────────────────────────────────────── */
  const animAccuracy = useAnimatedCounter(stats?.accuracy ?? 0, 1400, 400);
  const animXP = useAnimatedCounter(stats?.xp ?? 0, 1000, 800);

  /* ── Done handler ─────────────────────────────────────────────── */
  const handleDone = () => {
    setStudyMode(null);
    setActiveTab('home');
  };

  if (!stats) return null;

  const showConfetti = stats.accuracy > 80;

  return (
    <motion.div
      className="flex flex-col items-center px-6 py-10 max-w-md mx-auto min-h-[70vh]"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* ── Confetti overlay ──────────────────────────────────── */}
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      {/* ── Trophy icon ───────────────────────────────────────── */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
        className="mb-4"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle, var(--accent-orange-dim) 0%, transparent 70%)',
          }}
        >
          <Trophy size={42} strokeWidth={1.6} style={{ color: 'var(--accent-gold)' }} />
        </div>
      </motion.div>

      {/* ── Title ─────────────────────────────────────────────── */}
      <motion.h2
        className="text-2xl font-bold mb-8"
        style={{ color: 'var(--text-primary)' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        Session Complete!
      </motion.h2>

      {/* ── Accuracy ring ─────────────────────────────────────── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <ProgressRing
          progress={stats.accuracy}
          size={150}
          strokeWidth={11}
          color={stats.accuracy >= 80 ? '#34c759' : stats.accuracy >= 50 ? '#ff9f0a' : '#ff453a'}
        >
          <div className="text-center">
            <div
              className="text-4xl font-bold tabular-nums"
              style={{ color: 'var(--text-primary)' }}
            >
              {animAccuracy}%
            </div>
            <div className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-secondary)' }}>
              Accuracy
            </div>
          </div>
        </ProgressRing>
      </motion.div>

      {/* ── Stats grid (staggered) ────────────────────────────── */}
      <motion.div
        className="grid grid-cols-2 gap-3 w-full mb-6"
        variants={containerStagger}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'Cards Studied', value: stats.total, color: '#4f8ef7', icon: Target },
          { label: 'Correct', value: stats.correct, color: '#34c759', icon: undefined },
          { label: 'Incorrect', value: stats.incorrect, color: '#ff453a', icon: undefined },
          { label: 'Longest Streak', value: stats.longestStreak, color: '#ff9f0a', icon: Flame },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemFadeUp}
            className="p-4 rounded-xl text-center"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
            }}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              {stat.icon && (
                <stat.icon size={16} strokeWidth={2} style={{ color: stat.color }} />
              )}
              <span
                className="text-2xl font-bold tabular-nums"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Difficulty breakdown ───────────────────────────────── */}
      <motion.div
        className="grid grid-cols-4 gap-2 w-full mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        {(
          [
            { key: 'new', label: 'New', color: '#4f8ef7' },
            { key: 'learning', label: 'Learning', color: '#ff9f0a' },
            { key: 'review', label: 'Review', color: '#bf5af2' },
            { key: 'mastered', label: 'Mastered', color: '#34c759' },
          ] as const
        ).map(({ key, label, color }) => (
          <div
            key={key}
            className="text-center py-2.5 px-1 rounded-lg"
            style={{ background: color + '12' }}
          >
            <div
              className="text-lg font-bold tabular-nums"
              style={{ color }}
            >
              {stats.breakdown[key]}
            </div>
            <div
              className="text-[10px] uppercase tracking-wider font-medium"
              style={{ color: color + 'aa' }}
            >
              {label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── XP earned ─────────────────────────────────────────── */}
      <motion.div
        className="relative flex items-center gap-2.5 mb-5 px-5 py-3 rounded-xl"
        style={{ background: 'rgba(191,90,242,0.10)', border: '1px solid rgba(191,90,242,0.15)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <FloatingXP value={stats.xp} />
        <Star size={18} strokeWidth={2} style={{ color: '#bf5af2' }} />
        <span className="text-sm font-semibold tabular-nums" style={{ color: '#bf5af2' }}>
          +{animXP} XP earned
        </span>
      </motion.div>

      {/* ── Next session ──────────────────────────────────────── */}
      {stats.nextReview && (
        <motion.div
          className="flex items-center gap-2 mb-8 text-sm"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15 }}
        >
          <CalendarClock size={14} strokeWidth={2} />
          <span>
            Next session:{' '}
            <span style={{ color: 'var(--text-secondary)' }}>
              {new Date(stats.nextReview).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </span>
        </motion.div>
      )}

      {/* ── Done button ───────────────────────────────────────── */}
      <motion.button
        onClick={handleDone}
        className="flex items-center justify-center gap-2.5 w-full max-w-xs px-6 py-4 rounded-2xl text-base font-semibold"
        style={{
          background: 'linear-gradient(135deg, #4f8ef7 0%, #3a6fd8 100%)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(79,142,247,0.30)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.25 }}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Return to study hub"
      >
        Done
        <ArrowRight size={18} strokeWidth={2.4} />
      </motion.button>
    </motion.div>
  );
}

export default SessionComplete;
