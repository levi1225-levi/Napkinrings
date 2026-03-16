import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  Trophy,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { CARDS } from '../../data/cards';
import { quizQuestions } from '../../data/quizQuestions';
import type { Card } from '../../data/cards';
import Button from '../ui/Button';
import ProgressRing from '../ui/ProgressRing';

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'teaching' | 'practice' | 'summary';

interface QuizItem {
  card: Card;
  question: string;
  options: string[];
  correctIndex: number;
}

interface SessionResult {
  cardsLearned: Card[];
  quizCorrect: number;
  quizTotal: number;
  xpEarned: number;
  duration: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { minutes: 5, cards: 5, label: 'Quick', icon: Sparkles, color: '#4f8ef7' },
  { minutes: 10, cards: 10, label: 'Focused', icon: Brain, color: '#a78bfa' },
  { minutes: 15, cards: 15, label: 'Deep', icon: BookOpen, color: '#f59e0b' },
  { minutes: 20, cards: 20, label: 'Marathon', icon: Trophy, color: '#34d399' },
];

const TEACH_BATCH_SIZE = 3;

const cubicEase = [0.4, 0, 0.2, 1] as [number, number, number, number];
const springEase = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

const baseFont = "'DM Sans', sans-serif";
const hebrewFont = "'Frank Ruhl Libre', serif";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildQuizForCards(targetCards: Card[]): QuizItem[] {
  return targetCards.map((card) => {
    // Try to find a matching quiz question first
    const matchingQ = quizQuestions.find((q) => q.relatedCardId === card.id);
    if (matchingQ) {
      return {
        card,
        question: matchingQ.question,
        options: matchingQ.options,
        correctIndex: matchingQ.correctIndex,
      };
    }

    // Fallback: generate from card data
    const wrongCards = shuffleArray(CARDS.filter((c) => c.id !== card.id)).slice(0, 3);
    const options = shuffleArray([
      card.definition,
      ...wrongCards.map((c) => c.definition),
    ]);
    const correctIndex = options.indexOf(card.definition);

    return {
      card,
      question: `What is "${card.term}"?`,
      options,
      correctIndex,
    };
  });
}

function getEncouragement(accuracy: number): string {
  if (accuracy >= 0.9) return 'Outstanding! You have an excellent grasp of this material.';
  if (accuracy >= 0.7) return 'Great work! You are making solid progress.';
  if (accuracy >= 0.5) return 'Good effort! Review the tricky ones and you will master them.';
  return 'Keep going! Every study session strengthens your knowledge.';
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function GuidedSession() {
  const addToast = useAppStore((s) => s.addToast);

  // Phase & timing
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [startTime, setStartTime] = useState(0);

  // Card queue
  const [sessionCards, setSessionCards] = useState<Card[]>([]);
  const [learnedCards, setLearnedCards] = useState<Card[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [teachIndex, setTeachIndex] = useState(0);

  // Quiz state
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Tracking
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  // ─── Derived state ──────────────────────────────────────────────────────

  const selectedOption = useMemo(
    () => DURATION_OPTIONS.find((o) => o.minutes === selectedMinutes) ?? DURATION_OPTIONS[1],
    [selectedMinutes]
  );

  const currentBatch = useMemo(() => {
    const start = currentBatchIndex * TEACH_BATCH_SIZE;
    return sessionCards.slice(start, start + TEACH_BATCH_SIZE);
  }, [sessionCards, currentBatchIndex]);

  const currentTeachCard = currentBatch[teachIndex] ?? null;

  const currentQuiz = quizItems[quizIndex] ?? null;

  const overallProgress = useMemo(() => {
    if (sessionCards.length === 0) return 0;
    return Math.round((learnedCards.length / sessionCards.length) * 100);
  }, [learnedCards.length, sessionCards.length]);

  const isTimeUp = useMemo(() => {
    if (startTime === 0) return false;
    return Date.now() - startTime >= selectedMinutes * 60 * 1000;
  }, [startTime, selectedMinutes]);

  // ─── Actions ────────────────────────────────────────────────────────────

  const startSession = useCallback(() => {
    const count = selectedOption.cards;
    const selected = shuffleArray(CARDS).slice(0, count);
    setSessionCards(selected);
    setLearnedCards([]);
    setCurrentBatchIndex(0);
    setTeachIndex(0);
    setTotalCorrect(0);
    setTotalQuestions(0);
    setTotalXP(0);
    setStartTime(Date.now());
    setPhase('teaching');
  }, [selectedOption]);

  const handleGotIt = useCallback(() => {
    if (!currentTeachCard) return;

    const xp = 5;
    setTotalXP((prev) => prev + xp);
    addToast({ message: `+${xp} XP`, type: 'xp' });
    setLearnedCards((prev) => [...prev, currentTeachCard]);

    const nextTeachIdx = teachIndex + 1;
    if (nextTeachIdx < currentBatch.length) {
      setTeachIndex(nextTeachIdx);
    } else {
      // Batch complete -- quiz time
      const items = buildQuizForCards(currentBatch);
      setQuizItems(shuffleArray(items));
      setQuizIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setPhase('practice');
    }
  }, [currentTeachCard, teachIndex, currentBatch, addToast]);

  const handleAnswerSelect = useCallback(
    (idx: number) => {
      if (showFeedback || !currentQuiz) return;
      setSelectedAnswer(idx);
      setShowFeedback(true);

      const correct = idx === currentQuiz.correctIndex;
      setTotalQuestions((p) => p + 1);
      if (correct) {
        setTotalCorrect((p) => p + 1);
        const xp = 10;
        setTotalXP((prev) => prev + xp);
        addToast({ message: `+${xp} XP`, type: 'xp' });
      }
    },
    [showFeedback, currentQuiz, addToast]
  );

  const handleNextQuiz = useCallback(() => {
    const nextIdx = quizIndex + 1;
    if (nextIdx < quizItems.length) {
      setQuizIndex(nextIdx);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Check if time is up or no more cards
      const nextBatchStart = (currentBatchIndex + 1) * TEACH_BATCH_SIZE;
      if (isTimeUp || nextBatchStart >= sessionCards.length) {
        setPhase('summary');
      } else {
        setCurrentBatchIndex((p) => p + 1);
        setTeachIndex(0);
        setPhase('teaching');
      }
    }
  }, [quizIndex, quizItems.length, currentBatchIndex, sessionCards.length, isTimeUp]);

  const handleExit = useCallback(() => {
    useAppStore.getState().setStudyMode(null);
  }, []);

  // ─── Summary result ─────────────────────────────────────────────────────

  const sessionResult = useMemo<SessionResult>(() => {
    const duration = startTime > 0 ? Math.round((Date.now() - startTime) / 1000) : 0;
    return {
      cardsLearned: learnedCards,
      quizCorrect: totalCorrect,
      quizTotal: totalQuestions,
      xpEarned: totalXP,
      duration,
    };
  }, [learnedCards, totalCorrect, totalQuestions, totalXP, startTime]);

  // ─── Render phases ──────────────────────────────────────────────────────

  if (phase === 'setup') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: cubicEase }}
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          fontFamily: baseFont,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: cubicEase }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <GraduationCap size={48} color="#4f8ef7" strokeWidth={1.5} />
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#f0f0f5',
              margin: '16px 0 8px',
              fontFamily: baseFont,
            }}
          >
            Guided Study
          </h1>
          <p style={{ color: '#9999b0', fontSize: 16, maxWidth: 400, margin: '0 auto' }}>
            Learn new terms step by step, then test your knowledge with quizzes.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
            maxWidth: 440,
            width: '100%',
            marginBottom: 40,
          }}
        >
          {DURATION_OPTIONS.map((opt, i) => {
            const isSelected = opt.minutes === selectedMinutes;
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.minutes}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08, ease: cubicEase }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedMinutes(opt.minutes)}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${opt.color}18, ${opt.color}08)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${isSelected ? opt.color : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 16,
                  padding: '24px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `${opt.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={24} color={opt.color} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f5' }}>
                    {opt.minutes} min
                  </div>
                  <div style={{ fontSize: 13, color: '#9999b0', marginTop: 2 }}>
                    {opt.label} &middot; ~{opt.cards} cards
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: cubicEase }}
          style={{ display: 'flex', gap: 12 }}
        >
          <Button variant="ghost" size="lg" onClick={handleExit}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={startSession}
            icon={<ArrowRight size={18} />}
          >
            Start Session
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (phase === 'teaching' && currentTeachCard) {
    const batchProgress = teachIndex / currentBatch.length;
    return (
      <motion.div
        key={`teach-${currentTeachCard.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: cubicEase }}
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: baseFont,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
          }}
        >
          <button
            onClick={handleExit}
            style={{
              background: 'none',
              border: 'none',
              color: '#9999b0',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: baseFont,
            }}
          >
            Exit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={16} color="#4f8ef7" />
            <span style={{ color: '#9999b0', fontSize: 13 }}>
              Learning &middot; {learnedCards.length + 1}/{sessionCards.length}
            </span>
          </div>
          <ProgressRing progress={overallProgress} size={36} strokeWidth={3} color="#4f8ef7">
            <span style={{ fontSize: 10, color: '#9999b0' }}>{overallProgress}%</span>
          </ProgressRing>
        </div>

        {/* Batch progress bar */}
        <div style={{ padding: '0 24px', marginBottom: 8 }}>
          <div
            style={{
              height: 3,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${batchProgress * 100}%` }}
              transition={{ duration: 0.4, ease: cubicEase }}
              style={{ height: '100%', background: '#4f8ef7', borderRadius: 2 }}
            />
          </div>
        </div>

        {/* Card content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 24px 40px',
            maxWidth: 560,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: springEase }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 24,
              padding: '40px 32px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {/* Category tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(79,142,247,0.1)',
                border: '1px solid rgba(79,142,247,0.2)',
                borderRadius: 8,
                padding: '4px 12px',
                fontSize: 12,
                color: '#4f8ef7',
                marginBottom: 24,
              }}
            >
              <Star size={12} />
              {currentTeachCard.category}
            </div>

            {/* Hebrew */}
            {currentTeachCard.hebrew && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: cubicEase }}
                style={{
                  fontSize: 48,
                  fontFamily: hebrewFont,
                  color: '#f0f0f5',
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}
              >
                {currentTeachCard.hebrew}
              </motion.div>
            )}

            {/* Transliteration */}
            <div style={{ fontSize: 14, color: '#9999b0', marginBottom: 4 }}>
              {currentTeachCard.transliteration}
            </div>

            {/* English term */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: cubicEase }}
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#f0f0f5',
                margin: '16px 0 20px',
                fontFamily: baseFont,
              }}
            >
              {currentTeachCard.term}
            </motion.h2>

            {/* Definition */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: cubicEase }}
              style={{
                fontSize: 16,
                color: '#c8c8d8',
                lineHeight: 1.7,
                marginBottom: 20,
                textAlign: 'left',
              }}
            >
              {currentTeachCard.definition}
            </motion.p>

            {/* Extended notes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: cubicEase }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 12,
                padding: '16px 20px',
                textAlign: 'left',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#9999b0',
                  textTransform: 'uppercase' as const,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Extended Notes
              </div>
              <p style={{ fontSize: 14, color: '#b0b0c0', lineHeight: 1.6, margin: 0 }}>
                {currentTeachCard.extendedNotes}
              </p>
            </motion.div>

            {/* Mnemonic */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: cubicEase }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.15)',
                borderRadius: 12,
                padding: '14px 18px',
                textAlign: 'left',
              }}
            >
              <Sparkles size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 14, color: '#e0c878', lineHeight: 1.5, margin: 0 }}>
                {currentTeachCard.mnemonicHint}
              </p>
            </motion.div>
          </motion.div>

          {/* Got it button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: cubicEase }}
            style={{ marginTop: 32 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleGotIt}
              icon={<CheckCircle size={18} />}
            >
              Got it
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (phase === 'practice' && currentQuiz) {
    const quizProgress = ((quizIndex + 1) / quizItems.length) * 100;
    const isCorrect = selectedAnswer === currentQuiz.correctIndex;

    return (
      <motion.div
        key={`quiz-${quizIndex}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: cubicEase }}
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: baseFont,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
          }}
        >
          <button
            onClick={handleExit}
            style={{
              background: 'none',
              border: 'none',
              color: '#9999b0',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: baseFont,
            }}
          >
            Exit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={16} color="#a78bfa" />
            <span style={{ color: '#9999b0', fontSize: 13 }}>
              Quiz &middot; {quizIndex + 1}/{quizItems.length}
            </span>
          </div>
          <ProgressRing progress={overallProgress} size={36} strokeWidth={3} color="#a78bfa">
            <span style={{ fontSize: 10, color: '#9999b0' }}>{overallProgress}%</span>
          </ProgressRing>
        </div>

        {/* Quiz progress bar */}
        <div style={{ padding: '0 24px', marginBottom: 8 }}>
          <div
            style={{
              height: 3,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${quizProgress}%` }}
              transition={{ duration: 0.4, ease: cubicEase }}
              style={{ height: '100%', background: '#a78bfa', borderRadius: 2 }}
            />
          </div>
        </div>

        {/* Quiz content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 24px 40px',
            maxWidth: 560,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: springEase }}
            style={{ width: '100%', textAlign: 'center', marginBottom: 32 }}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: '#f0f0f5',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {currentQuiz.question}
            </h2>
          </motion.div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentQuiz.options.map((option, idx) => {
              let borderColor = 'rgba(255,255,255,0.08)';
              let bgColor = 'rgba(255,255,255,0.03)';
              let textColor = '#c8c8d8';

              if (showFeedback) {
                if (idx === currentQuiz.correctIndex) {
                  borderColor = '#34d399';
                  bgColor = 'rgba(52,211,153,0.08)';
                  textColor = '#34d399';
                } else if (idx === selectedAnswer && idx !== currentQuiz.correctIndex) {
                  borderColor = '#ef4444';
                  bgColor = 'rgba(239,68,68,0.08)';
                  textColor = '#ef4444';
                }
              }

              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.1 + idx * 0.07,
                    ease: cubicEase,
                  }}
                  whileTap={showFeedback ? undefined : { scale: 0.98 }}
                  onClick={() => handleAnswerSelect(idx)}
                  style={{
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    borderRadius: 14,
                    padding: '16px 20px',
                    textAlign: 'left',
                    cursor: showFeedback ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    transition: 'border-color 0.25s, background 0.25s',
                    fontFamily: baseFont,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: showFeedback && idx === currentQuiz.correctIndex
                        ? 'rgba(52,211,153,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: textColor,
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span style={{ fontSize: 15, color: textColor, lineHeight: 1.5 }}>
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback section */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: cubicEase }}
              style={{
                width: '100%',
                marginTop: 28,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 18,
                  fontWeight: 600,
                  color: isCorrect ? '#34d399' : '#ef4444',
                }}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle size={22} />
                    Correct!
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 22 }}>&#10005;</span>
                    Not quite
                  </>
                )}
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleNextQuiz}
                icon={<ArrowRight size={16} />}
              >
                Continue
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  if (phase === 'summary') {
    const accuracy =
      sessionResult.quizTotal > 0
        ? sessionResult.quizCorrect / sessionResult.quizTotal
        : 0;
    const accuracyPct = Math.round(accuracy * 100);
    const minutes = Math.floor(sessionResult.duration / 60);
    const seconds = sessionResult.duration % 60;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: cubicEase }}
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          fontFamily: baseFont,
        }}
      >
        {/* Trophy animation */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: springEase }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Trophy size={40} color="#f59e0b" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: cubicEase }}
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#f0f0f5',
            margin: '0 0 8px',
          }}
        >
          Session Complete!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45, ease: cubicEase }}
          style={{
            color: '#9999b0',
            fontSize: 15,
            textAlign: 'center',
            maxWidth: 380,
            marginBottom: 36,
            lineHeight: 1.6,
          }}
        >
          {getEncouragement(accuracy)}
        </motion.p>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: cubicEase }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
            maxWidth: 400,
            width: '100%',
            marginBottom: 32,
          }}
        >
          {/* Cards learned */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <BookOpen size={20} color="#4f8ef7" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f0f0f5' }}>
              {sessionResult.cardsLearned.length}
            </div>
            <div style={{ fontSize: 12, color: '#9999b0', marginTop: 4 }}>Cards Learned</div>
          </div>

          {/* Accuracy */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <Brain size={20} color="#a78bfa" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f0f0f5' }}>
              {accuracyPct}%
            </div>
            <div style={{ fontSize: 12, color: '#9999b0', marginTop: 4 }}>Quiz Accuracy</div>
          </div>

          {/* XP earned */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <Star size={20} color="#f59e0b" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f0f0f5' }}>
              {sessionResult.xpEarned}
            </div>
            <div style={{ fontSize: 12, color: '#9999b0', marginTop: 4 }}>XP Earned</div>
          </div>

          {/* Duration */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <Clock size={20} color="#34d399" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f0f0f5' }}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div style={{ fontSize: 12, color: '#9999b0', marginTop: 4 }}>Duration</div>
          </div>
        </motion.div>

        {/* Cards reviewed list */}
        {sessionResult.cardsLearned.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: cubicEase }}
            style={{
              maxWidth: 400,
              width: '100%',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '20px',
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#9999b0',
                textTransform: 'uppercase' as const,
                letterSpacing: 1,
                marginBottom: 14,
              }}
            >
              Terms Covered
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sessionResult.cardsLearned.map((card) => (
                <div
                  key={card.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <CheckCircle size={14} color="#34d399" />
                  <span style={{ fontSize: 14, color: '#c8c8d8', flex: 1 }}>
                    {card.term}
                  </span>
                  {card.hebrew && (
                    <span
                      style={{
                        fontSize: 14,
                        fontFamily: hebrewFont,
                        color: '#9999b0',
                      }}
                    >
                      {card.hebrew}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8, ease: cubicEase }}
          style={{ display: 'flex', gap: 12 }}
        >
          <Button variant="secondary" size="lg" onClick={handleExit}>
            Done
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={startSession}
            icon={<ArrowRight size={18} />}
          >
            Study Again
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Fallback: if phase is teaching but no card (shouldn't happen), go to summary
  if (phase === 'teaching' || phase === 'practice') {
    setPhase('summary');
  }

  return null;
}
