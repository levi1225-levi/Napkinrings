import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Flame, Target, Clock, Star } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { getLevelInfo } from '../../lib/xp';
import AnimatedNumber from '../ui/AnimatedNumber';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Normalise the polymorphic `cardsStudied` field that can be number | string[] */
function countCards(cs: number | string[] | undefined): number {
  if (Array.isArray(cs)) return cs.length;
  if (typeof cs === 'number') return cs;
  return 0;
}

function formatTime(totalMinutes: number): string {
  if (totalMinutes < 60) return `${Math.round(totalMinutes)}m`;
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
};

interface StatDef {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  value: number;
  display?: string;
  suffix?: string;
  decimals?: number;
}

export default function StatsOverview() {
  const { data } = useAppStore();

  const stats = useMemo<StatDef[]>(() => {
    const sessions = data.sessions ?? [];
    const profile = data.profile;

    // 1. Total cards studied
    const totalCards = sessions.reduce(
      (sum, s) => sum + countCards((s as any).cardsStudied),
      0,
    );

    // 2. Streak
    const currentStreak = profile.streak ?? 0;
    const longestStreak = profile.longestStreak ?? 0;

    // 3. Overall accuracy
    const totalCorrect = sessions.reduce((s, x) => s + (x.correctCount ?? 0), 0);
    const totalIncorrect = sessions.reduce((s, x) => s + (x.incorrectCount ?? 0), 0);
    const totalAttempts = totalCorrect + totalIncorrect;
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    // 4. Total study time
    const totalStudyTime = (profile as any).totalStudyTime ?? 0; // minutes

    // 5. XP + level
    const xp = (profile as any).xp ?? (profile as any).totalXP ?? 0;
    const levelInfo = getLevelInfo(xp);

    return [
      {
        label: 'Cards Studied',
        icon: BookOpen,
        color: '#4f8ef7',
        bg: 'rgba(79,142,247,0.12)',
        value: totalCards,
      },
      {
        label: 'Streak',
        icon: Flame,
        color: '#ff9f0a',
        bg: 'rgba(255,159,10,0.12)',
        value: currentStreak,
        display: longestStreak > 0 && longestStreak !== currentStreak
          ? `${currentStreak} / ${longestStreak} days`
          : `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`,
      },
      {
        label: 'Accuracy',
        icon: Target,
        color: '#34c759',
        bg: 'rgba(52,199,89,0.12)',
        value: accuracy,
        suffix: '%',
        decimals: 1,
      },
      {
        label: 'Study Time',
        icon: Clock,
        color: '#bf5af2',
        bg: 'rgba(191,90,242,0.12)',
        value: totalStudyTime,
        display: formatTime(totalStudyTime),
      },
      {
        label: `Level ${levelInfo.level} XP`,
        icon: Star,
        color: '#ffd60a',
        bg: 'rgba(255,214,10,0.12)',
        value: xp,
      },
    ];
  }, [data]);

  return (
    <motion.div
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            variants={card}
            className="min-w-[160px] flex-1 flex flex-col items-center gap-2.5 px-5 py-5"
            style={{
              background: 'var(--bg-elevated)',
              borderRadius: '16px',
              border: '1px solid var(--bg-border)',
            }}
          >
            {/* Icon circle */}
            <div
              className="flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: s.bg,
              }}
            >
              <Icon size={20} color={s.color} strokeWidth={2} />
            </div>

            {/* Value */}
            {s.display ? (
              <span
                className="text-xl font-bold"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}
              >
                {s.display}
              </span>
            ) : (
              <AnimatedNumber
                value={s.value}
                suffix={s.suffix}
                decimals={s.decimals ?? 0}
                className="text-xl font-bold"
              />
            )}

            {/* Label */}
            <span
              className="text-xs font-medium whitespace-nowrap"
              style={{ color: 'var(--text-secondary)' }}
            >
              {s.label}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
