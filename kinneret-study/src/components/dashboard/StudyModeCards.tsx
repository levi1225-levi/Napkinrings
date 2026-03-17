import { motion } from 'framer-motion';
import { Layers, FileQuestion, Zap } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

interface StudyModeConfig {
  id: 'flashcard' | 'quiz' | 'speed';
  title: string;
  subtitle: string;
  icon: typeof Layers;
  iconColor: string;
  iconBg: string;
  getDetail: (dueCount: number) => string;
}

const STUDY_MODES: StudyModeConfig[] = [
  {
    id: 'flashcard',
    title: 'Flashcards',
    subtitle: 'Spaced Repetition',
    icon: Layers,
    iconColor: '#4f8ef7',
    iconBg: 'rgba(79, 142, 247, 0.125)',
    getDetail: (dueCount: number) => `${dueCount} cards due`,
  },
  {
    id: 'quiz',
    title: 'Quiz Mode',
    subtitle: 'Multiple Choice',
    icon: FileQuestion,
    iconColor: '#34c759',
    iconBg: 'rgba(52, 199, 89, 0.125)',
    getDetail: () => '20 questions available',
  },
  {
    id: 'speed',
    title: 'Speed Round',
    subtitle: 'Beat the Clock',
    icon: Zap,
    iconColor: '#ffd60a',
    iconBg: 'rgba(255, 214, 10, 0.125)',
    getDetail: () => '60-second challenge',
  },
];

export default function StudyModeCards() {
  const { setActiveTab, setStudyMode, getDueCardCount } = useAppStore();
  const dueCount = getDueCardCount();

  const handleStart = (mode: 'flashcard' | 'quiz' | 'speed') => {
    setStudyMode(mode);
    setActiveTab('study');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {STUDY_MODES.map((mode) => {
        const Icon = mode.icon;

        return (
          <motion.div
            key={mode.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px var(--bg-border-strong)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex flex-col"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '16px',
              border: '1px solid var(--bg-border)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer',
            }}
            onClick={() => handleStart(mode.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStart(mode.id);
              }
            }}
          >
            {/* Icon */}
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                backgroundColor: mode.iconBg,
                marginBottom: '16px',
              }}
            >
              <Icon size={24} style={{ color: mode.iconColor }} />
            </div>

            {/* Title */}
            <h3
              style={{
                color: 'var(--text-primary)',
                fontSize: '17px',
                fontWeight: 700,
                marginBottom: '4px',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {mode.title}
            </h3>

            {/* Subtitle */}
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '12px',
              }}
            >
              {mode.subtitle}
            </span>

            {/* Detail */}
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 500,
                marginBottom: '20px',
              }}
            >
              {mode.getDetail(dueCount)}
            </span>

            {/* Start Button */}
            <motion.button
              whileHover={{ backgroundColor: mode.iconColor }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="mt-auto flex items-center justify-center"
              style={{
                width: '100%',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: mode.iconBg,
                color: mode.iconColor,
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-ui)',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = mode.iconColor;
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleStart(mode.id);
              }}
            >
              Start
            </motion.button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
