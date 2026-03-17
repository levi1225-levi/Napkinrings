import { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Layers,
  HelpCircle,
  Zap,
  BookOpen,
  GraduationCap,
  ChevronRight,
  Flame,
  Clock,
  Image,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { FlashcardSession } from '../components/flashcard/FlashcardSession';
import QuizSession from '../components/quiz/QuizSession';
import PracticeTest from '../components/quiz/PracticeTest';
import SpeedRound from '../components/speed/SpeedRound';
import ChallengeMode from '../components/quiz/ChallengeMode';
import DiagramLabelling, { DIAGRAM_DATA } from '../components/diagram/DiagramLabelling';

const GuidedSession = lazy(() => import('../components/guided/GuidedSession'));

type StudyModeId = 'flashcard' | 'quiz' | 'speed' | 'guided' | 'cram' | 'practice-test' | 'diagram';

const MODES: {
  id: StudyModeId;
  label: string;
  description: string;
  icon: typeof Layers;
  accentColor: string;
  badge?: string;
}[] = [
  {
    id: 'guided',
    label: 'Guided Session',
    description: 'Learn step-by-step with teaching & quizzes',
    icon: GraduationCap,
    accentColor: '#bf5af2',
    badge: 'Recommended',
  },
  {
    id: 'flashcard',
    label: 'Flashcards',
    description: 'Review cards with spaced repetition',
    icon: Layers,
    accentColor: '#4f8ef7',
  },
  {
    id: 'quiz',
    label: 'Quiz',
    description: 'Test your knowledge with multiple choice',
    icon: HelpCircle,
    accentColor: '#34c759',
  },
  {
    id: 'diagram',
    label: 'Diagram Labelling',
    description: 'Label body system diagrams interactively',
    icon: Image,
    accentColor: '#64d2ff',
    badge: 'New',
  },
  {
    id: 'practice-test',
    label: 'Practice Test',
    description: 'Timed test simulation with countdown',
    icon: Clock,
    accentColor: '#ff6b35',
    badge: 'Timed',
  },
  {
    id: 'speed',
    label: 'Speed Round',
    description: 'Fast-paced true or false challenge',
    icon: Zap,
    accentColor: '#ff9f0a',
  },
  {
    id: 'cram',
    label: 'Cram Mode',
    description: 'Intensive review of all cards, weakest first',
    icon: Flame,
    accentColor: '#ff453a',
    badge: 'Last Minute',
  },
];

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function StudyHub() {
  const { studyMode, setStudyMode, startCramSession } = useAppStore();
  const [diagramIndex, setDiagramIndex] = useState(0);
  const [showDiagram, setShowDiagram] = useState(false);

  const handleModeSelect = (modeId: StudyModeId) => {
    if (modeId === 'cram') {
      startCramSession();
      setStudyMode('flashcard');
    } else if (modeId === 'diagram') {
      setShowDiagram(true);
    } else if (modeId === 'practice-test') {
      setStudyMode('practice-test');
    } else {
      setStudyMode(modeId as 'flashcard' | 'quiz' | 'speed' | 'guided');
    }
  };

  // Diagram labelling mode (handled separately from Zustand studyMode)
  if (showDiagram) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="flex flex-col gap-4"
        style={{ padding: '24px 24px 32px', maxWidth: '960px', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}
      >
        {/* Back button */}
        <button
          onClick={() => setShowDiagram(false)}
          className="flex items-center gap-2 self-start transition-opacity hover:opacity-70"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#4f8ef7',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'var(--font-ui)',
            padding: '4px 0',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Study Hub</span>
        </button>

        {/* Diagram selector */}
        <div className="flex gap-2 flex-wrap">
          {DIAGRAM_DATA.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setDiagramIndex(i)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: diagramIndex === i ? 600 : 500,
                fontFamily: 'var(--font-ui)',
                cursor: 'pointer',
                border: diagramIndex === i ? '1.5px solid var(--accent-blue)' : '1.5px solid var(--bg-border-strong)',
                backgroundColor: diagramIndex === i ? 'var(--accent-blue)' : 'var(--bg-overlay)',
                color: diagramIndex === i ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {d.title}
            </button>
          ))}
        </div>

        <DiagramLabelling diagram={DIAGRAM_DATA[diagramIndex]} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="flex flex-col gap-6"
      style={{ padding: '24px 24px 32px', maxWidth: '960px', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}
    >
      <AnimatePresence mode="wait">
        {!studyMode ? (
          <motion.div
            key="selector"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col gap-6"
          >
            {/* Page header */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(52,199,89,0.15))',
                }}
              >
                <BookOpen
                  size={22}
                  style={{ color: '#4f8ef7' }}
                />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Study Hub
                </h1>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  Choose your study mode
                </p>
              </div>
            </div>

            {/* Mode cards */}
            <div className="flex flex-col gap-3">
              {MODES.map((mode, i) => {
                const Icon = mode.icon;
                return (
                  <motion.button
                    key={mode.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                    }}
                    onClick={() => handleModeSelect(mode.id)}
                    className="flex items-center gap-4 w-full text-left"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderRadius: '16px',
                      border: '1px solid var(--bg-border)',
                      padding: '18px 20px',
                      cursor: 'pointer',
                    }}
                    whileHover={{
                      scale: 1.01,
                      y: -1,
                      borderColor: `${mode.accentColor}40`,
                      boxShadow: `0 4px 20px ${mode.accentColor}15`,
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        backgroundColor: `${mode.accentColor}15`,
                        border: `1px solid ${mode.accentColor}25`,
                      }}
                    >
                      <Icon size={24} style={{ color: mode.accentColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3
                          style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            margin: 0,
                            fontFamily: 'var(--font-ui)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {mode.label}
                        </h3>
                        {mode.badge && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: `${mode.accentColor}20`,
                              color: mode.accentColor,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {mode.badge}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {mode.description}
                      </p>
                    </div>
                    <div
                      className="shrink-0"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <ChevronRight size={20} />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Challenge mode */}
            <ChallengeMode />
          </motion.div>
        ) : (
          <motion.div
            key={`mode-${studyMode}`}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="flex flex-col gap-4"
          >
            {/* Back button */}
            <button
              onClick={() => setStudyMode(null)}
              className="flex items-center gap-2 self-start transition-opacity hover:opacity-70"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4f8ef7',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'var(--font-ui)',
                padding: '4px 0',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Study Hub</span>
            </button>

            {/* Active study component */}
            <div>
              {studyMode === 'guided' && (
                <Suspense fallback={<div className="flex items-center justify-center" style={{ minHeight: '40vh' }}><div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--bg-border-strong)', borderTopColor: '#4f8ef7', borderRadius: '50%' }} /></div>}>
                  <GuidedSession />
                </Suspense>
              )}
              {studyMode === 'flashcard' && <FlashcardSession />}
              {studyMode === 'quiz' && <QuizSession />}
              {studyMode === 'practice-test' && <PracticeTest />}
              {studyMode === 'speed' && <SpeedRound />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
