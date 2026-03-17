import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import {
  Play,
  Clock,
  Layers,
  ChevronRight,
  RotateCcw,
  X,
  Undo2,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { CARDS, CATEGORY_COLORS, getCardById } from '../../data/cards';
import type { SM2Grade } from '../../lib/sm2';
import { FlashcardDisplay } from './FlashcardDisplay';
import { RatingButtons } from './RatingButtons';
import { SessionComplete } from './SessionComplete';
import {
  saveStudyProgress,
  loadStudyProgress,
  clearStudyProgress,
  type SavedStudyProgress,
} from '../../lib/storage';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Build a {category: count} map from an array of card IDs. */
function getCategoryBreakdown(cardIds: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const id of cardIds) {
    const card = getCardById(id);
    if (card) {
      counts[card.category] = (counts[card.category] ?? 0) + 1;
    }
  }
  return counts;
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Start Screen                                        */
/* ------------------------------------------------------------------ */

interface StartScreenProps {
  dueCardIds: string[];
  onStart: () => void;
}

function StartScreen({ dueCardIds, onStart }: StartScreenProps) {
  const dueCount = dueCardIds.length;
  const estimatedMinutes = Math.max(1, Math.round((dueCount * 30) / 60));
  const breakdown = getCategoryBreakdown(dueCardIds);

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-6 py-12 min-h-[60vh]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Glowing icon */}
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
        style={{
          background:
            'radial-gradient(circle, rgba(79,142,247,0.18) 0%, transparent 70%)',
        }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
      >
        <Layers size={36} strokeWidth={1.6} style={{ color: '#4f8ef7' }} />
      </motion.div>

      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Flashcard Session
      </h2>

      <p className="text-base mb-2" style={{ color: 'var(--text-secondary)' }}>
        {dueCount === 0
          ? 'No cards due right now. Check back later!'
          : `${dueCount} card${dueCount !== 1 ? 's' : ''} due for review`}
      </p>

      {/* Estimated time */}
      {dueCount > 0 && (
        <div
          className="flex items-center gap-2 mb-8 text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <Clock size={14} strokeWidth={2.2} />
          <span>~{estimatedMinutes} min estimated</span>
        </div>
      )}

      {/* Category breakdown pills */}
      {dueCount > 0 && Object.keys(breakdown).length > 0 && (
        <div className="w-full max-w-sm mb-10">
          <p
            className="text-[11px] uppercase tracking-widest font-semibold mb-3 text-center"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(breakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => {
                const color = CATEGORY_COLORS[category] ?? '#4f8ef7';
                return (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      background: color + '14',
                      color,
                      border: `1px solid ${color}20`,
                    }}
                  >
                    {category}
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-0.5"
                      style={{ background: color + '20' }}
                    >
                      {count}
                    </span>
                  </span>
                );
              })}
          </div>
        </div>
      )}

      {/* Start button */}
      {dueCount > 0 && (
        <motion.button
          onClick={onStart}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold"
          style={{
            background: 'linear-gradient(135deg, #4f8ef7 0%, #3a6fd8 100%)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(79,142,247,0.35)',
          }}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Start flashcard session"
        >
          <Play size={18} fill="#fff" />
          Start Session
        </motion.button>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function FlashcardSession() {
  const {
    currentSession,
    currentCardIndex,
    studyQueue,
    isFlipped,
    cardStartTime,
    data,
    startFlashcardSession,
    flipCard,
    gradeCard,
    endSession,
    showSessionComplete,
    getCardState,
    undoLastGrade,
    lastGradeAction,
  } = useAppStore();

  /* ── Session resume state ────────────────────────────────────── */
  const [savedProgress, setSavedProgress] = useState<SavedStudyProgress | null>(null);
  const [resumeBannerDismissed, setResumeBannerDismissed] = useState(false);

  // Check for saved progress on mount
  useEffect(() => {
    const progress = loadStudyProgress();
    if (progress && progress.mode === 'flashcard' && progress.cardIds && progress.cardIds.length > 0) {
      setSavedProgress(progress);
    }
  }, []);

  // Save progress whenever queue or index changes during an active session
  useEffect(() => {
    if (currentSession && currentSession.mode === 'flashcard' && studyQueue.length > 0 && !showSessionComplete) {
      saveStudyProgress({
        mode: 'flashcard',
        timestamp: Date.now(),
        cardIds: studyQueue,
        currentIndex: currentCardIndex,
      });
    }
  }, [currentSession, studyQueue, currentCardIndex, showSessionComplete]);

  // Clear saved progress when session completes
  useEffect(() => {
    if (showSessionComplete) {
      clearStudyProgress();
      setSavedProgress(null);
    }
  }, [showSessionComplete]);

  const handleResume = useCallback(() => {
    if (!savedProgress?.cardIds) return;
    // Start a fresh session, then override queue & index from saved progress
    startFlashcardSession();
    useAppStore.setState({
      studyQueue: savedProgress.cardIds,
      currentCardIndex: savedProgress.currentIndex ?? 0,
    });
    clearStudyProgress();
    setSavedProgress(null);
    setResumeBannerDismissed(false);
  }, [savedProgress, startFlashcardSession]);

  const handleDismissResume = useCallback(() => {
    setResumeBannerDismissed(true);
    clearStudyProgress();
    setSavedProgress(null);
  }, []);

  /* ── Related card navigation ─────────────────────────────────── */
  useEffect(() => {
    const handler = (e: Event) => {
      const cardId = (e as CustomEvent).detail as string;
      if (!cardId || !currentSession) return;
      // Add the related card to the queue after current position and navigate to it
      const idx = studyQueue.indexOf(cardId);
      if (idx >= 0) {
        // Card already in queue — jump to it
        useAppStore.setState({ currentCardIndex: idx, isFlipped: false, cardStartTime: Date.now() });
      } else {
        // Insert after current and navigate
        const newQueue = [...studyQueue];
        newQueue.splice(currentCardIndex + 1, 0, cardId);
        useAppStore.setState({
          studyQueue: newQueue,
          currentCardIndex: currentCardIndex + 1,
          isFlipped: false,
          cardStartTime: Date.now(),
        });
      }
    };
    window.addEventListener('kinneret-navigate-card', handler);
    return () => window.removeEventListener('kinneret-navigate-card', handler);
  }, [currentSession, studyQueue, currentCardIndex]);

  /* ── Elapsed time tracker ─────────────────────────────────────── */
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (currentSession && cardStartTime && !showSessionComplete) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - cardStartTime);
      }, 200);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSession, cardStartTime, showSessionComplete]);

  // Reset elapsed time when card advances
  useEffect(() => {
    setElapsedTime(0);
    setRated(false);
    setFeedback(null);
  }, [currentCardIndex]);

  /* ── Rating feedback state ────────────────────────────────────── */
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [rated, setRated] = useState(false);

  const handleRate = useCallback(
    (grade: SM2Grade) => {
      if (rated) return;
      setRated(true);

      const isCorrect = grade >= 3;
      setFeedback(isCorrect ? 'correct' : 'incorrect');

      // Brief feedback animation before grading + auto-advance
      setTimeout(() => {
        gradeCard(grade);
        setFeedback(null);
        setRated(false);
      }, 500);
    },
    [gradeCard, rated],
  );

  /* ── Keyboard shortcuts ──────────────────────────────────────── */
  const flashcardShortcuts = useMemo(
    () => ({
      ' ': (e: KeyboardEvent) => {
        e.preventDefault();
        flipCard();
      },
      '1': () => {
        if (isFlipped) handleRate(0);
      },
      '2': () => {
        if (isFlipped) handleRate(2);
      },
      '3': () => {
        if (isFlipped) handleRate(3);
      },
      '4': () => {
        if (isFlipped) handleRate(5);
      },
      'arrowright': () => {
        if (currentCardIndex < studyQueue.length - 1) {
          useAppStore.setState({
            currentCardIndex: currentCardIndex + 1,
            isFlipped: false,
            cardStartTime: Date.now(),
          });
        }
      },
      'arrowleft': () => {
        if (currentCardIndex > 0) {
          useAppStore.setState({
            currentCardIndex: currentCardIndex - 1,
            isFlipped: false,
            cardStartTime: Date.now(),
          });
        }
      },
    }),
    [flipCard, isFlipped, handleRate, currentCardIndex, studyQueue.length],
  );

  useKeyboardShortcuts(flashcardShortcuts, !!currentSession && !showSessionComplete);

  /* ── Due cards (for start screen) ─────────────────────────────── */
  const dueCardIds: string[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (const card of CARDS) {
    const cs = data.cardStates[card.id];
    if (!cs) {
      dueCardIds.push(card.id);
    } else {
      const reviewDate = new Date(cs.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      if (reviewDate <= now) dueCardIds.push(card.id);
    }
  }

  /* ── Session complete screen ──────────────────────────────────── */
  if (showSessionComplete) {
    return <SessionComplete />;
  }

  /* ── Start screen (no active session) ─────────────────────────── */
  if (!currentSession) {
    return (
      <>
        {/* Resume banner */}
        {savedProgress && !resumeBannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="w-full max-w-md mx-auto mb-4 px-4 py-3 rounded-xl flex items-center justify-between gap-3"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(79,142,247,0.3)',
              boxShadow: '0 2px 12px rgba(79,142,247,0.1)',
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <RotateCcw size={16} style={{ color: '#4f8ef7', flexShrink: 0 }} />
              <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                Resume previous session? ({(savedProgress.cardIds?.length ?? 0) - (savedProgress.currentIndex ?? 0)} cards left)
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
        <StartScreen
          dueCardIds={dueCardIds}
          onStart={startFlashcardSession}
        />
      </>
    );
  }

  /* ── Active session ───────────────────────────────────────────── */
  const currentCardId = studyQueue[currentCardIndex];
  const currentCard = getCardById(currentCardId);
  const cardState = getCardState(currentCardId);
  const total = studyQueue.length;
  const progressPct = total > 0 ? ((currentCardIndex + 1) / total) * 100 : 0;

  if (!currentCard) {
    return (
      <div
        className="flex items-center justify-center min-h-[50vh]"
        role="status"
      >
        <p style={{ color: 'var(--text-secondary)' }}>Loading card...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 min-h-[70vh]">
      {/* ── Progress bar ──────────────────────────────────────── */}
      <div className="w-full max-w-[420px] mb-6">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[11px] font-semibold tracking-wide uppercase"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Progress
          </span>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: 'var(--text-secondary)' }}
          >
            {currentCardIndex + 1}
            <span style={{ color: 'var(--text-tertiary)' }}> / </span>
            {total}
          </span>
        </div>

        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--bg-overlay)' }}
          role="progressbar"
          aria-valuenow={currentCardIndex + 1}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #4f8ef7 0%, #34c759 100%)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
      </div>

      {/* ── Feedback overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            key="feedback-overlay"
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {feedback === 'correct' ? (
              <motion.div
                className="w-52 h-52 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(52,199,89,0.3) 0%, transparent 70%)',
                }}
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 3, opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              />
            ) : (
              <motion.div
                className="w-36 h-36 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,69,58,0.3) 0%, transparent 70%)',
                }}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{
                  scale: [0.4, 2, 1.5],
                  opacity: [0, 0.8, 0],
                  x: [0, -10, 10, -6, 0],
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Card with slide transition + swipe gesture ─────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCardId}
          className="w-full"
          initial={{ opacity: 0, x: 64, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -64, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          drag={!isFlipped ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_e, info) => {
            // Swipe up to flip
            if (!isFlipped && Math.abs(info.offset.y) > 50 && Math.abs(info.offset.x) < 30) {
              flipCard();
            }
          }}
        >
          <FlashcardDisplay
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={flipCard}
            cardState={cardState}
            showTimer={data.settings?.showTimer ?? true}
            elapsedTime={elapsedTime}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Rating buttons (visible when card is flipped) ─────── */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            key="rating-buttons"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full"
          >
            <RatingButtons onRate={handleRate} disabled={rated} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Undo button ───────────────────────────────────────── */}
      {lastGradeAction && currentCardIndex > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={undoLastGrade}
          className="mt-4 flex items-center gap-1.5 text-xs font-medium"
          style={{
            color: 'var(--accent-orange)',
            background: 'rgba(255,159,10,0.08)',
            border: '1px solid rgba(255,159,10,0.2)',
            borderRadius: '8px',
            padding: '6px 12px',
            cursor: 'pointer',
          }}
          whileTap={{ scale: 0.95 }}
          aria-label="Undo last grade"
        >
          <Undo2 size={13} />
          Undo
        </motion.button>
      )}

      {/* ── End session shortcut ──────────────────────────────── */}
      <motion.button
        onClick={() => {
          // Save progress before ending so it can be resumed later
          if (studyQueue.length > 0 && currentCardIndex < studyQueue.length - 1) {
            saveStudyProgress({
              mode: 'flashcard',
              timestamp: Date.now(),
              cardIds: studyQueue,
              currentIndex: currentCardIndex,
            });
          }
          endSession();
        }}
        className="mt-8 text-xs font-medium flex items-center gap-1 group"
        style={{
          color: 'var(--text-tertiary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 14px',
        }}
        whileHover={{ color: 'var(--text-secondary)' }}
        aria-label="End session early"
      >
        End session
        <ChevronRight
          size={12}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </motion.button>
    </div>
  );
}

export default FlashcardSession;
