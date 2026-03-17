import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { Brain, Layers, Zap, ArrowRight, RotateCcw, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { quizQuestions as QUIZ_QUESTIONS } from '../../data/quizQuestions';
import type { QuizQuestion as QuizQuestionType } from '../../data/quizQuestions';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import Button from '../ui/Button';
import {
  saveStudyProgress,
  loadStudyProgress,
  clearStudyProgress,
  type SavedStudyProgress,
} from '../../lib/storage';

type Phase = 'start' | 'playing' | 'results';

/** Fisher-Yates shuffle (returns new array). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Shuffle options for a question, adjusting correctIndex accordingly. */
function shuffleOptions(q: QuizQuestionType): QuizQuestionType {
  const indices = q.options.map((_, i) => i);
  const shuffled = shuffle(indices);
  const newOptions = shuffled.map((i) => q.options[i]);
  const newCorrectIndex = shuffled.indexOf(q.correctIndex);
  return { ...q, options: newOptions, correctIndex: newCorrectIndex };
}

export default function QuizSession() {
  const {
    currentSession,
    quizAnswers,
    data,
    startQuizSession,
    answerQuiz,
    endQuizSession,
    setStudyMode,
  } = useAppStore();

  const [phase, setPhase] = useState<Phase>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const questionStartTime = useRef(Date.now());

  /* ── Session resume state ────────────────────────────────────── */
  const [savedProgress, setSavedProgress] = useState<SavedStudyProgress | null>(null);
  const [resumeBannerDismissed, setResumeBannerDismissed] = useState(false);

  // Check for saved progress on mount
  useEffect(() => {
    const progress = loadStudyProgress();
    if (progress && progress.mode === 'quiz' && progress.quiz) {
      setSavedProgress(progress);
    }
  }, []);

  // Saved question order for resume (set when user resumes)
  const [resumedQuestionIds, setResumedQuestionIds] = useState<string[] | null>(null);

  const handleResume = useCallback(() => {
    if (!savedProgress?.quiz) return;
    startQuizSession();
    setPhase('playing');
    // Restore the exact question order from the saved IDs
    if (savedProgress.quiz.questionIds) {
      setResumedQuestionIds(savedProgress.quiz.questionIds);
    }
    setCurrentIndex(savedProgress.quiz.currentIndex);
    setAnswered(false);
    setSelectedIndex(null);
    questionStartTime.current = Date.now();
    clearStudyProgress();
    setSavedProgress(null);
    setResumeBannerDismissed(false);
  }, [savedProgress, startQuizSession]);

  const handleDismissResume = useCallback(() => {
    setResumeBannerDismissed(true);
    clearStudyProgress();
    setSavedProgress(null);
  }, []);

  // Prioritize questions: sort by weakest related cards (lowest ease factor)
  const orderedQuestions = useMemo(() => {
    // If resuming, restore the exact question order from saved IDs
    if (resumedQuestionIds) {
      const byId = new Map(QUIZ_QUESTIONS.map((q) => [q.id, q]));
      const restored = resumedQuestionIds
        .map((id) => byId.get(id))
        .filter((q): q is QuizQuestionType => q !== undefined);
      if (restored.length > 0) {
        return restored.map(shuffleOptions);
      }
    }

    const scored = QUIZ_QUESTIONS.map((q) => {
      const cardState = data.cardStates[q.relatedCardId];
      const easeFactor = cardState ? cardState.easeFactor : 2.5;
      return { question: q, easeFactor };
    });

    scored.sort((a, b) => a.easeFactor - b.easeFactor);

    const selected = scored.slice(0, 15);

    const result: typeof selected = [];
    const chunks: (typeof selected)[] = [];
    for (let i = 0; i < selected.length; i += 5) {
      chunks.push(shuffle(selected.slice(i, i + 5)));
    }
    for (const chunk of chunks) {
      result.push(...chunk);
    }

    return result.map((s) => shuffleOptions(s.question));
  }, [data.cardStates, resumedQuestionIds]);

  // Save progress whenever index or answers change during an active quiz
  useEffect(() => {
    if (phase === 'playing' && orderedQuestions.length > 0) {
      saveStudyProgress({
        mode: 'quiz',
        timestamp: Date.now(),
        quiz: {
          questionIndices: orderedQuestions.map((_, i) => i),
          questionIds: orderedQuestions.map((q) => q.id),
          currentIndex,
          answers: quizAnswers as Record<string, { selectedIndex: number; correct: boolean; timeMs: number }>,
        },
      });
    }
  }, [phase, currentIndex, quizAnswers, orderedQuestions]);

  // Clear saved progress when results are shown
  useEffect(() => {
    if (phase === 'results') {
      clearStudyProgress();
      setSavedProgress(null);
    }
  }, [phase]);

  const totalQuestions = orderedQuestions.length;

  // Category breakdown for start screen
  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, number> = {};
    orderedQuestions.forEach((q) => {
      cats[q.type] = (cats[q.type] || 0) + 1;
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  }, [orderedQuestions]);

  const difficultyBreakdown = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    orderedQuestions.forEach((q) => {
      if (q.difficulty === 1) easy++;
      else if (q.difficulty === 2) medium++;
      else hard++;
    });
    return { easy, medium, hard };
  }, [orderedQuestions]);

  const handleStart = useCallback(() => {
    startQuizSession();
    setPhase('playing');
    setCurrentIndex(0);
    setAnswered(false);
    setSelectedIndex(null);
    questionStartTime.current = Date.now();
  }, [startQuizSession]);

  const handleAnswer = useCallback(
    (selected: number) => {
      if (answered) return;

      const question = orderedQuestions[currentIndex];
      const correct = selected === question.correctIndex;
      const timeMs = Date.now() - questionStartTime.current;

      setSelectedIndex(selected);
      setAnswered(true);

      answerQuiz(currentIndex, selected, correct, timeMs, question.relatedCardId);

      // Auto-advance after 1.5s
      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          setDirection(1);
          setCurrentIndex((prev) => prev + 1);
          setAnswered(false);
          setSelectedIndex(null);
          questionStartTime.current = Date.now();
        } else {
          endQuizSession();
          setPhase('results');
        }
      }, 1500);
    },
    [answered, currentIndex, totalQuestions, orderedQuestions, answerQuiz, endQuizSession],
  );

  const handleStudyWeakCards = useCallback(() => {
    setStudyMode('flashcard');
  }, [setStudyMode]);

  const handleTryAgain = useCallback(() => {
    setPhase('start');
    setCurrentIndex(0);
    setAnswered(false);
    setSelectedIndex(null);
  }, []);

  const handleDone = useCallback(() => {
    setStudyMode(null);
  }, [setStudyMode]);

  /* ── Keyboard shortcuts ──────────────────────────────────────── */
  const quizShortcuts = useMemo(
    () => ({
      '1': () => {
        if (!answered && orderedQuestions[currentIndex]?.options.length >= 1) handleAnswer(0);
      },
      '2': () => {
        if (!answered && orderedQuestions[currentIndex]?.options.length >= 2) handleAnswer(1);
      },
      '3': () => {
        if (!answered && orderedQuestions[currentIndex]?.options.length >= 3) handleAnswer(2);
      },
      '4': () => {
        if (!answered && orderedQuestions[currentIndex]?.options.length >= 4) handleAnswer(3);
      },
    }),
    [answered, currentIndex, orderedQuestions, handleAnswer],
  );

  useKeyboardShortcuts(quizShortcuts, phase === 'playing');

  // Slide variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  // ─── Start screen ───
  if (phase === 'start') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto py-8"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {/* Resume banner */}
        {savedProgress && !resumeBannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="w-full px-4 py-3 rounded-xl flex items-center justify-between gap-3"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(79,142,247,0.3)',
              boxShadow: '0 2px 12px rgba(79,142,247,0.1)',
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <RotateCcw size={16} style={{ color: '#4f8ef7', flexShrink: 0 }} />
              <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                Resume previous quiz? (question {(savedProgress.quiz?.currentIndex ?? 0) + 1} of {totalQuestions})
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleResume}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: '#4f8ef7',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Resume
              </button>
              <button
                onClick={handleDismissResume}
                className="p-1.5 rounded-lg"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                }}
                aria-label="Dismiss resume banner"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(79,142,247,0.2), rgba(79,142,247,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Brain size={32} color="#4f8ef7" />
          </motion.div>
          <h1
            style={{
              color: 'var(--text-primary)',
              fontSize: '28px',
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Quiz Mode
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', textAlign: 'center', margin: 0 }}>
            Test your knowledge of the Kinneret study material
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '14px',
              border: '1px solid var(--bg-border)',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <Layers size={18} color="#4f8ef7" style={{ margin: '0 auto 8px' }} />
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: '22px',
                fontWeight: 700,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {totalQuestions}
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', margin: '4px 0 0' }}>Questions</p>
          </div>
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '14px',
              border: '1px solid var(--bg-border)',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <Zap size={18} color="#ff9f0a" style={{ margin: '0 auto 8px' }} />
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: '22px',
                fontWeight: 700,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {difficultyBreakdown.hard}
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', margin: '4px 0 0' }}>Hard</p>
          </div>
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '14px',
              border: '1px solid var(--bg-border)',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <Brain size={18} color="#34c759" style={{ margin: '0 auto 8px' }} />
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: '22px',
                fontWeight: 700,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {categoryBreakdown.length}
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', margin: '4px 0 0' }}>Topics</p>
          </div>
        </div>

        {/* Category list */}
        <div
          className="w-full"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '16px',
            border: '1px solid var(--bg-border)',
            padding: '16px',
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, margin: '0 0 12px' }}>
            Topics covered
          </p>
          <div className="flex flex-wrap gap-2">
            {categoryBreakdown.map(([cat, count]) => (
              <span
                key={cat}
                style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(79,142,247,0.08)',
                  color: '#4f8ef7',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {cat} ({count})
              </span>
            ))}
          </div>
        </div>

        <Button variant="primary" size="lg" onClick={handleStart} icon={<ArrowRight size={18} />}>
          Start Quiz
        </Button>
      </motion.div>
    );
  }

  // ─── Results screen ───
  if (phase === 'results') {
    return (
      <QuizResults
        answers={quizAnswers}
        questions={orderedQuestions}
        totalXP={currentSession?.xpEarned ?? 0}
        onStudyWeakCards={handleStudyWeakCards}
        onTryAgain={handleTryAgain}
        onDone={handleDone}
      />
    );
  }

  // ─── Playing screen ───
  const currentQuestion = orderedQuestions[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            onAnswer={handleAnswer}
            answered={answered}
            selectedIndex={selectedIndex}
            showTimer={data.settings.showTimer}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
