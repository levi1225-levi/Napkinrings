import { motion } from 'framer-motion';
import type { SM2Grade } from '../../lib/sm2';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface RatingButtonsProps {
  onRate: (grade: SM2Grade) => void;
  disabled: boolean;
}

/* ------------------------------------------------------------------ */
/*  Rating definitions                                                 */
/* ------------------------------------------------------------------ */
interface RatingDef {
  grade: SM2Grade;
  label: string;
  desc: string;
  color: string;
  bg: string;
  borderColor: string;
}

const ratings: RatingDef[] = [
  {
    grade: 0,
    label: 'Again',
    desc: 'Forgot',
    color: '#ff453a',
    bg: 'rgba(255,69,58,0.12)',
    borderColor: 'rgba(255,69,58,0.20)',
  },
  {
    grade: 1,
    label: 'Hard',
    desc: 'Struggled',
    color: '#ff6b5a',
    bg: 'rgba(255,107,90,0.10)',
    borderColor: 'rgba(255,107,90,0.16)',
  },
  {
    grade: 2,
    label: 'Good',
    desc: 'Difficult',
    color: '#ff9f0a',
    bg: 'rgba(255,159,10,0.10)',
    borderColor: 'rgba(255,159,10,0.16)',
  },
  {
    grade: 3,
    label: 'Easy',
    desc: 'Hesitated',
    color: '#4f8ef7',
    bg: 'rgba(79,142,247,0.10)',
    borderColor: 'rgba(79,142,247,0.16)',
  },
  {
    grade: 4,
    label: 'Perfect',
    desc: 'Confident',
    color: '#34c759',
    bg: 'rgba(52,199,89,0.10)',
    borderColor: 'rgba(52,199,89,0.16)',
  },
  {
    grade: 5,
    label: 'Instant',
    desc: 'Immediate',
    color: '#ffd60a',
    bg: 'rgba(255,214,10,0.10)',
    borderColor: 'rgba(255,214,10,0.16)',
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 420, damping: 22 },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <motion.div
      className="grid grid-cols-3 gap-2.5 w-full max-w-[420px] mx-auto mt-6 sm:grid-cols-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="group"
      aria-label="Rate your recall"
    >
      {ratings.map((r) => (
        <motion.button
          key={r.grade}
          variants={itemVariants}
          whileTap={disabled ? undefined : { scale: 0.93 }}
          whileHover={disabled ? undefined : { scale: 1.04, y: -2 }}
          disabled={disabled}
          onClick={() => onRate(r.grade)}
          className="flex flex-col items-center justify-center gap-0.5 py-3 px-2 rounded-xl border transition-colors"
          style={{
            background: r.bg,
            borderColor: r.borderColor,
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          aria-label={`Rate ${r.label}: ${r.desc}`}
        >
          <span
            className="text-sm font-semibold leading-none"
            style={{ color: r.color }}
          >
            {r.label}
          </span>
          <span
            className="text-[10px] leading-tight mt-0.5"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {r.desc}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

export default RatingButtons;
