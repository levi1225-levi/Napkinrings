import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Flame, BookOpen } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import AnimatedNumber from '../ui/AnimatedNumber';
import ProgressRing from '../ui/ProgressRing';

const containerVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function DailyStatus() {
  const { data, getDueCardCount, getTodayXP } = useAppStore();

  const streak = data.profile.streak;
  const dueCount = getDueCardCount();
  const todayXP = getTodayXP();
  const dailyGoal = 200;
  const xpProgress = Math.min(100, (todayXP / dailyGoal) * 100);

  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center justify-between gap-4"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderRadius: '16px',
        border: '1px solid var(--bg-border)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Date */}
      <motion.div variants={itemVariants} className="flex flex-col">
        <span
          style={{
            color: 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Today
        </span>
        <span
          style={{
            color: 'var(--text-primary)',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          {formattedDate}
        </span>
      </motion.div>

      {/* Streak */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2"
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: 'var(--accent-orange-dim)',
          }}
        >
          <Flame size={18} style={{ color: 'var(--accent-orange)' }} />
        </div>
        <div className="flex flex-col">
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Streak
          </span>
          <span
            style={{
              color: 'var(--accent-orange)',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            <AnimatedNumber value={streak} suffix=" days" />
          </span>
        </div>
      </motion.div>

      {/* Cards Due */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2"
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: 'var(--accent-blue-dim)',
          }}
        >
          <BookOpen size={18} style={{ color: 'var(--accent-blue)' }} />
        </div>
        <div className="flex flex-col">
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Due Today
          </span>
          <span
            style={{
              color: 'var(--accent-blue)',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            <AnimatedNumber value={dueCount} suffix=" cards" />
          </span>
        </div>
      </motion.div>

      {/* XP Progress Ring */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3"
      >
        <ProgressRing
          progress={xpProgress}
          size={48}
          strokeWidth={5}
          color={todayXP >= dailyGoal ? '#34c759' : '#4f8ef7'}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: todayXP >= dailyGoal
                ? 'var(--accent-green)'
                : 'var(--accent-blue)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {Math.round(xpProgress)}%
          </span>
        </ProgressRing>
        <div className="flex flex-col">
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Daily XP
          </span>
          <span
            style={{
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            <AnimatedNumber value={todayXP} /> / {dailyGoal}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
