import { useState, useCallback, useMemo, useEffect } from 'react';
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
import {
  questionBank,
  type MCQuestion,
  type TFQuestion,
  type FIBQuestion,
  type MatchQuestion,
} from '../../data/questions';
import type { Card } from '../../data/cards';
import Button from '../ui/Button';
import ProgressRing from '../ui/ProgressRing';
import {
  saveStudyProgress,
  loadStudyProgress,
  clearStudyProgress,
} from '../../lib/storage';

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = 'setup' | 'teaching' | 'practice' | 'summary';

type PracticeItem =
  | { kind: 'mc'; q: MCQuestion }
  | { kind: 'tf'; q: TFQuestion }
  | { kind: 'fib'; q: FIBQuestion }
  | { kind: 'match'; q: MatchQuestion };

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

/** Pick diverse practice items from the question bank for a batch of cards. */
function buildPracticeItems(batchCards: Card[]): PracticeItem[] {
  const usableTypes = ['mc', 'tf', 'fib', 'match'] as const;
  const items: PracticeItem[] = [];
  const usedIds = new Set<string>();

  // Try to pick questions that relate to the batch cards
  // Prefer onMainTest questions and mix types
  const typeBudget: Record<string, number> = { mc: 0, tf: 0, fib: 0, match: 0 };
  const targetPerCard = 2; // ~2 questions per card in batch
  const totalTarget = batchCards.length * targetPerCard;

  // Filter question bank to usable types
  const pool = questionBank.filter(
    (q) => usableTypes.includes(q.type as typeof usableTypes[number])
  ) as (MCQuestion | TFQuestion | FIBQuestion | MatchQuestion)[];

  // Score each question by relevance to the batch
  const scored = pool.map((q) => {
    let score = 0;
    const qText = q.question.toLowerCase();
    for (const card of batchCards) {
      if (qText.includes(card.term.toLowerCase())) score += 3;
      if (card.hebrew && qText.includes(card.hebrew)) score += 2;
      if (qText.includes(card.id.replace(/-/g, ' '))) score += 1;
    }
    if (q.onMainTest) score += 1;
    return { q, score };
  });

  // Sort by relevance, then shuffle within equal scores
  scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);

  // Pick top questions with type diversity
  for (const { q } of scored) {
    if (items.length >= totalTarget) break;
    if (usedIds.has(q.id)) continue;

    const t = q.type as string;
    // Limit each type to avoid monotony
    if (typeBudget[t] >= Math.ceil(totalTarget / 2)) continue;

    usedIds.add(q.id);
    typeBudget[t] = (typeBudget[t] || 0) + 1;
    items.push({ kind: q.type, q } as PracticeItem);
  }

  // If we didn't get enough, fill with random MC from the bank
  if (items.length < totalTarget) {
    const mcPool = shuffleArray(
      pool.filter((q) => q.type === 'mc' && !usedIds.has(q.id))
    );
    for (const q of mcPool) {
      if (items.length >= totalTarget) break;
      usedIds.add(q.id);
      items.push({ kind: 'mc', q: q as MCQuestion });
    }
  }

  return shuffleArray(items);
}

function getEncouragement(accuracy: number): string {
  if (accuracy >= 0.9) return 'Outstanding! You have an excellent grasp of this material.';
  if (accuracy >= 0.7) return 'Great work! You are making solid progress.';
  if (accuracy >= 0.5) return 'Good effort! Review the tricky ones and you will master them.';
  return 'Keep going! Every study session strengthens your knowledge.';
}

// ─── Sub-components for question types ──────────────────────────────────────

interface QuestionHeaderProps {
  typeLabel: string;
  typeColor: string;
  question: string;
}

function QuestionHeader({ typeLabel, typeColor, question }: QuestionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: springEase }}
      style={{ width: '100%', textAlign: 'center', marginBottom: 28 }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: `${typeColor}15`,
          border: `1px solid ${typeColor}30`,
          borderRadius: 8,
          padding: '4px 12px',
          fontSize: 11,
          fontWeight: 600,
          color: typeColor,
          marginBottom: 16,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.8,
        }}
      >
        {typeLabel}
      </div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {question}
      </h2>
    </motion.div>
  );
}

interface FeedbackBannerProps {
  correct: boolean;
  explanation: string;
  onContinue: () => void;
}

function FeedbackBanner({ correct, explanation, onContinue }: FeedbackBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: cubicEase }}
      style={{
        width: '100%',
        marginTop: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 18,
          fontWeight: 600,
          color: correct ? '#34d399' : '#ef4444',
        }}
      >
        {correct ? (
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
      <p
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: 440,
          margin: 0,
        }}
      >
        {explanation}
      </p>
      <Button variant="primary" size="md" onClick={onContinue} icon={<ArrowRight size={16} />}>
        Continue
      </Button>
    </motion.div>
  );
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

  // Practice state (multi-type)
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [lastExplanation, setLastExplanation] = useState('');

  // MC/TF state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // FIB state
  const [fibInputs, setFibInputs] = useState<string[]>([]);

  // Match state
  const [matchSelections, setMatchSelections] = useState<Record<number, number>>({});
  const [matchLeftSelected, setMatchLeftSelected] = useState<number | null>(null);
  const [shuffledRights, setShuffledRights] = useState<string[]>([]);

  // Tracking
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  // Resume detection
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const saved = loadStudyProgress();
    if (saved && saved.mode === 'guided' && saved.guided) {
      setShowResume(true);
    }
  }, []);

  // ─── Save progress on phase/state changes ─────────────────────────────
  useEffect(() => {
    if (phase === 'teaching' || phase === 'practice') {
      saveStudyProgress({
        mode: 'guided',
        timestamp: Date.now(),
        guided: {
          phase: phase as 'teaching' | 'practice',
          sessionCardIds: sessionCards.map((c) => c.id),
          learnedCardIds: learnedCards.map((c) => c.id),
          currentBatchIndex,
          teachIndex,
          totalCorrect,
          totalQuestions,
          totalXP,
          selectedMinutes,
          startTime,
        },
      });
    }
  }, [phase, currentBatchIndex, teachIndex, totalCorrect, totalQuestions, totalXP, sessionCards, learnedCards, selectedMinutes, startTime]);

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

  const currentPractice = practiceItems[practiceIndex] ?? null;

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
    setShowResume(false);
    clearStudyProgress();
  }, [selectedOption]);

  const resumeSession = useCallback(() => {
    const saved = loadStudyProgress();
    if (!saved || !saved.guided) return;

    const g = saved.guided;
    const cards = g.sessionCardIds
      .map((id) => CARDS.find((c) => c.id === id))
      .filter(Boolean) as Card[];
    const learned = g.learnedCardIds
      .map((id) => CARDS.find((c) => c.id === id))
      .filter(Boolean) as Card[];

    setSessionCards(cards);
    setLearnedCards(learned);
    setCurrentBatchIndex(g.currentBatchIndex);
    setTeachIndex(g.teachIndex);
    setTotalCorrect(g.totalCorrect);
    setTotalQuestions(g.totalQuestions);
    setTotalXP(g.totalXP);
    setSelectedMinutes(g.selectedMinutes);
    setStartTime(g.startTime);
    setShowResume(false);

    if (g.phase === 'practice') {
      // Rebuild practice items for current batch
      const batchStart = g.currentBatchIndex * TEACH_BATCH_SIZE;
      const batch = cards.slice(batchStart, batchStart + TEACH_BATCH_SIZE);
      const items = buildPracticeItems(batch);
      setPracticeItems(items);
      setPracticeIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFibInputs([]);
      setMatchSelections({});
      setMatchLeftSelected(null);
    }

    setPhase(g.phase);
  }, []);

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
      // Batch complete -- practice time with diverse question types
      const items = buildPracticeItems(currentBatch);
      setPracticeItems(items);
      setPracticeIndex(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFibInputs([]);
      setMatchSelections({});
      setMatchLeftSelected(null);
      setPhase('practice');
    }
  }, [currentTeachCard, teachIndex, currentBatch, addToast]);

  const recordAnswer = useCallback(
    (correct: boolean, explanation: string) => {
      setShowFeedback(true);
      setLastAnswerCorrect(correct);
      setLastExplanation(explanation);
      setTotalQuestions((p) => p + 1);
      if (correct) {
        setTotalCorrect((p) => p + 1);
        const xp = 10;
        setTotalXP((prev) => prev + xp);
        addToast({ message: `+${xp} XP`, type: 'xp' });
      }
    },
    [addToast]
  );

  // MC answer
  const handleMCAnswer = useCallback(
    (idx: number) => {
      if (showFeedback || !currentPractice || currentPractice.kind !== 'mc') return;
      setSelectedAnswer(idx);
      const q = currentPractice.q;
      recordAnswer(idx === q.correctIndex, q.explanation);
    },
    [showFeedback, currentPractice, recordAnswer]
  );

  // TF answer
  const handleTFAnswer = useCallback(
    (answer: boolean) => {
      if (showFeedback || !currentPractice || currentPractice.kind !== 'tf') return;
      setSelectedAnswer(answer ? 1 : 0);
      const q = currentPractice.q;
      recordAnswer(answer === q.isTrue, q.explanation);
    },
    [showFeedback, currentPractice, recordAnswer]
  );

  // FIB submit
  const handleFIBSubmit = useCallback(() => {
    if (showFeedback || !currentPractice || currentPractice.kind !== 'fib') return;
    const q = currentPractice.q;
    let allCorrect = true;
    for (let i = 0; i < q.blanks.length; i++) {
      const userAnswer = (fibInputs[i] || '').trim().toLowerCase();
      const accepted = q.acceptableAnswers[i] || [q.blanks[i].toLowerCase()];
      if (!accepted.some((a) => a.toLowerCase() === userAnswer)) {
        allCorrect = false;
        break;
      }
    }
    recordAnswer(allCorrect, q.explanation);
  }, [showFeedback, currentPractice, fibInputs, recordAnswer]);

  // Match submit
  const handleMatchSubmit = useCallback(() => {
    if (showFeedback || !currentPractice || currentPractice.kind !== 'match') return;
    const q = currentPractice.q;
    let allCorrect = true;
    for (let i = 0; i < q.pairs.length; i++) {
      const selectedRightIdx = matchSelections[i];
      if (selectedRightIdx === undefined) {
        allCorrect = false;
        break;
      }
      const selectedRight = shuffledRights[selectedRightIdx];
      if (selectedRight !== q.pairs[i].right) {
        allCorrect = false;
        break;
      }
    }
    recordAnswer(allCorrect, q.explanation);
  }, [showFeedback, currentPractice, matchSelections, shuffledRights, recordAnswer]);

  const handleNextPractice = useCallback(() => {
    const nextIdx = practiceIndex + 1;
    if (nextIdx < practiceItems.length) {
      setPracticeIndex(nextIdx);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFibInputs([]);
      setMatchSelections({});
      setMatchLeftSelected(null);

      // Pre-shuffle match rights for next question if it's a match
      const next = practiceItems[nextIdx];
      if (next && next.kind === 'match') {
        setShuffledRights(shuffleArray(next.q.pairs.map((p) => p.right)));
      }
    } else {
      const nextBatchStart = (currentBatchIndex + 1) * TEACH_BATCH_SIZE;
      if (isTimeUp || nextBatchStart >= sessionCards.length) {
        clearStudyProgress();
        setPhase('summary');
      } else {
        setCurrentBatchIndex((p) => p + 1);
        setTeachIndex(0);
        setPhase('teaching');
      }
    }
  }, [practiceIndex, practiceItems, currentBatchIndex, sessionCards.length, isTimeUp]);

  // Initialize shuffledRights when practice starts
  useEffect(() => {
    if (currentPractice && currentPractice.kind === 'match') {
      setShuffledRights(shuffleArray(currentPractice.q.pairs.map((p) => p.right)));
    }
  }, [currentPractice]);

  const handleExit = useCallback(() => {
    // Save progress before exit if in middle of session
    if ((phase === 'teaching' || phase === 'practice') && sessionCards.length > 0) {
      saveStudyProgress({
        mode: 'guided',
        timestamp: Date.now(),
        guided: {
          phase: phase as 'teaching' | 'practice',
          sessionCardIds: sessionCards.map((c) => c.id),
          learnedCardIds: learnedCards.map((c) => c.id),
          currentBatchIndex,
          teachIndex,
          totalCorrect,
          totalQuestions,
          totalXP,
          selectedMinutes,
          startTime,
        },
      });
    }
    useAppStore.getState().setStudyMode(null);
  }, [phase, sessionCards, learnedCards, currentBatchIndex, teachIndex, totalCorrect, totalQuestions, totalXP, selectedMinutes, startTime]);

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

  // ─── SETUP ─────────────────────────────────────────────────────────────
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
              color: 'var(--text-primary)',
              margin: '16px 0 8px',
              fontFamily: baseFont,
            }}
          >
            Guided Study
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 400, margin: '0 auto' }}>
            Learn new terms step by step, then test yourself with multiple choice, true/false, fill-in-the-blank, and matching.
          </p>
        </motion.div>

        {/* Resume banner */}
        {showResume && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: cubicEase }}
            style={{
              background: 'rgba(79,142,247,0.08)',
              border: '1px solid rgba(79,142,247,0.2)',
              borderRadius: 16,
              padding: '16px 24px',
              maxWidth: 440,
              width: '100%',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                Resume previous session?
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                You have an unfinished guided session.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="ghost" size="sm" onClick={() => { clearStudyProgress(); setShowResume(false); }}>
                Dismiss
              </Button>
              <Button variant="primary" size="sm" onClick={resumeSession}>
                Resume
              </Button>
            </div>
          </motion.div>
        )}

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
                    : 'var(--bg-overlay)',
                  border: `1.5px solid ${isSelected ? opt.color : 'var(--bg-border-strong)'}`,
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
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {opt.minutes} min
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
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

  // ─── TEACHING ──────────────────────────────────────────────────────────
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
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: baseFont,
            }}
          >
            Exit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={16} color="#4f8ef7" />
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Learning &middot; {learnedCards.length + 1}/{sessionCards.length}
            </span>
          </div>
          <ProgressRing progress={overallProgress} size={36} strokeWidth={3} color="#4f8ef7">
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{overallProgress}%</span>
          </ProgressRing>
        </div>

        {/* Batch progress bar */}
        <div style={{ padding: '0 24px', marginBottom: 8 }}>
          <div
            style={{
              height: 3,
              borderRadius: 2,
              background: 'var(--bg-border-strong)',
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
              background: 'var(--bg-overlay)',
              border: '1px solid var(--bg-border)',
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
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}
              >
                {currentTeachCard.hebrew}
              </motion.div>
            )}

            {/* Transliteration */}
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>
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
                color: 'var(--text-primary)',
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
                background: 'var(--bg-overlay)',
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
                  color: 'var(--text-secondary)',
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

  // ─── PRACTICE ──────────────────────────────────────────────────────────
  if (phase === 'practice' && currentPractice) {
    const practiceProgress = ((practiceIndex + 1) / practiceItems.length) * 100;

    // Shared top bar + progress
    const topBar = (
      <>
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
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: baseFont,
            }}
          >
            Exit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={16} color="#a78bfa" />
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
              Practice &middot; {practiceIndex + 1}/{practiceItems.length}
            </span>
          </div>
          <ProgressRing progress={overallProgress} size={36} strokeWidth={3} color="#a78bfa">
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{overallProgress}%</span>
          </ProgressRing>
        </div>
        <div style={{ padding: '0 24px', marginBottom: 8 }}>
          <div
            style={{
              height: 3,
              borderRadius: 2,
              background: 'var(--bg-border-strong)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${practiceProgress}%` }}
              transition={{ duration: 0.4, ease: cubicEase }}
              style={{ height: '100%', background: '#a78bfa', borderRadius: 2 }}
            />
          </div>
        </div>
      </>
    );

    const contentWrapper = (children: React.ReactNode) => (
      <motion.div
        key={`practice-${practiceIndex}`}
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
        {topBar}
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
          {children}
        </div>
      </motion.div>
    );

    // ─── MC Question ──────────────────────────────────────────────────
    if (currentPractice.kind === 'mc') {
      const q = currentPractice.q;
      return contentWrapper(
        <>
          <QuestionHeader typeLabel="Multiple Choice" typeColor="#a78bfa" question={q.question} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {q.options.map((option, idx) => {
              let borderColor = 'var(--bg-border-strong)';
              let bgColor = 'var(--bg-overlay)';
              let textColor = '#c8c8d8';

              if (showFeedback) {
                if (idx === q.correctIndex) {
                  borderColor = '#34d399';
                  bgColor = 'rgba(52,211,153,0.08)';
                  textColor = '#34d399';
                } else if (idx === selectedAnswer && idx !== q.correctIndex) {
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
                  transition={{ duration: 0.35, delay: 0.1 + idx * 0.07, ease: cubicEase }}
                  whileTap={showFeedback ? undefined : { scale: 0.98 }}
                  onClick={() => handleMCAnswer(idx)}
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
                      background:
                        showFeedback && idx === q.correctIndex
                          ? 'rgba(52,211,153,0.15)'
                          : 'var(--bg-border)',
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
                  <span style={{ fontSize: 15, color: textColor, lineHeight: 1.5 }}>{option}</span>
                </motion.button>
              );
            })}
          </div>
          {showFeedback && (
            <FeedbackBanner
              correct={lastAnswerCorrect}
              explanation={lastExplanation}
              onContinue={handleNextPractice}
            />
          )}
        </>
      );
    }

    // ─── TF Question ──────────────────────────────────────────────────
    if (currentPractice.kind === 'tf') {
      const q = currentPractice.q;
      const tfOptions = [
        { label: 'True', value: true, color: '#34d399' },
        { label: 'False', value: false, color: '#ef4444' },
      ];

      return contentWrapper(
        <>
          <QuestionHeader typeLabel="True or False" typeColor="#f59e0b" question={q.question} />
          <div style={{ width: '100%', display: 'flex', gap: 16 }}>
            {tfOptions.map((opt) => {
              let borderColor = 'var(--bg-border-strong)';
              let bgColor = 'var(--bg-overlay)';
              let textColor = '#c8c8d8';

              if (showFeedback) {
                const isThisCorrect = opt.value === q.isTrue;
                const isThisSelected = selectedAnswer === (opt.value ? 1 : 0);
                if (isThisCorrect) {
                  borderColor = '#34d399';
                  bgColor = 'rgba(52,211,153,0.08)';
                  textColor = '#34d399';
                } else if (isThisSelected && !isThisCorrect) {
                  borderColor = '#ef4444';
                  bgColor = 'rgba(239,68,68,0.08)';
                  textColor = '#ef4444';
                }
              }

              return (
                <motion.button
                  key={opt.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: cubicEase }}
                  whileTap={showFeedback ? undefined : { scale: 0.96 }}
                  onClick={() => handleTFAnswer(opt.value)}
                  style={{
                    flex: 1,
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    borderRadius: 16,
                    padding: '24px 16px',
                    cursor: showFeedback ? 'default' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'border-color 0.25s, background 0.25s',
                    fontFamily: baseFont,
                  }}
                >
                  <span style={{ fontSize: 28 }}>{opt.value ? '✓' : '✗'}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: textColor }}>{opt.label}</span>
                </motion.button>
              );
            })}
          </div>
          {showFeedback && (
            <FeedbackBanner
              correct={lastAnswerCorrect}
              explanation={lastExplanation}
              onContinue={handleNextPractice}
            />
          )}
        </>
      );
    }

    // ─── FIB Question ─────────────────────────────────────────────────
    if (currentPractice.kind === 'fib') {
      const q = currentPractice.q;
      return contentWrapper(
        <>
          <QuestionHeader typeLabel="Fill in the Blank" typeColor="#4fc3f7" question={q.question} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {q.blanks.map((blank, idx) => {
              let borderColor = 'var(--bg-border-strong)';
              if (showFeedback) {
                const userAnswer = (fibInputs[idx] || '').trim().toLowerCase();
                const accepted = q.acceptableAnswers[idx] || [blank.toLowerCase()];
                const isCorrect = accepted.some((a) => a.toLowerCase() === userAnswer);
                borderColor = isCorrect ? '#34d399' : '#ef4444';
              }

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.1, ease: cubicEase }}
                >
                  <label
                    style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}
                  >
                    Blank {idx + 1}
                    {showFeedback && (
                      <span style={{ color: '#34d399', marginLeft: 8 }}>
                        Answer: {blank}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={fibInputs[idx] || ''}
                    onChange={(e) => {
                      if (showFeedback) return;
                      const updated = [...fibInputs];
                      updated[idx] = e.target.value;
                      setFibInputs(updated);
                    }}
                    disabled={showFeedback}
                    placeholder="Type your answer..."
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: 12,
                      border: `1.5px solid ${borderColor}`,
                      background: 'var(--bg-overlay)',
                      color: 'var(--text-primary)',
                      fontSize: 15,
                      fontFamily: baseFont,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !showFeedback) handleFIBSubmit();
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
          {!showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3, ease: cubicEase }}
              style={{ marginTop: 24 }}
            >
              <Button
                variant="primary"
                size="md"
                onClick={handleFIBSubmit}
                icon={<CheckCircle size={16} />}
              >
                Check Answer
              </Button>
            </motion.div>
          )}
          {showFeedback && (
            <FeedbackBanner
              correct={lastAnswerCorrect}
              explanation={lastExplanation}
              onContinue={handleNextPractice}
            />
          )}
        </>
      );
    }

    // ─── Match Question ───────────────────────────────────────────────
    if (currentPractice.kind === 'match') {
      const q = currentPractice.q;
      const allMatched = Object.keys(matchSelections).length === q.pairs.length;

      return contentWrapper(
        <>
          <QuestionHeader typeLabel="Matching" typeColor="#34d399" question={q.question} />
          <div style={{ width: '100%', display: 'flex', gap: 16 }}>
            {/* Left column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>
                Terms
              </div>
              {q.pairs.map((pair, idx) => {
                const isSelected = matchLeftSelected === idx;
                const isMatched = matchSelections[idx] !== undefined;
                let borderColor = isSelected ? '#a78bfa' : isMatched ? '#34d39960' : 'var(--bg-border-strong)';

                if (showFeedback) {
                  const rightIdx = matchSelections[idx];
                  if (rightIdx !== undefined) {
                    const selectedRight = shuffledRights[rightIdx];
                    borderColor = selectedRight === pair.right ? '#34d399' : '#ef4444';
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.06, ease: cubicEase }}
                    onClick={() => {
                      if (showFeedback) return;
                      setMatchLeftSelected(isSelected ? null : idx);
                    }}
                    style={{
                      background: isSelected ? 'rgba(167,139,250,0.08)' : 'var(--bg-overlay)',
                      border: `1.5px solid ${borderColor}`,
                      borderRadius: 12,
                      padding: '12px 16px',
                      textAlign: 'left',
                      cursor: showFeedback ? 'default' : 'pointer',
                      fontSize: 14,
                      color: 'var(--text-primary)',
                      fontFamily: baseFont,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                  >
                    {pair.left}
                  </motion.button>
                );
              })}
            </div>

            {/* Right column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>
                Definitions
              </div>
              {shuffledRights.map((right, rIdx) => {
                const isUsed = Object.values(matchSelections).includes(rIdx);
                let borderColor = isUsed ? '#34d39960' : 'var(--bg-border-strong)';

                if (showFeedback) {
                  // Find which left mapped to this right
                  const leftIdx = Object.entries(matchSelections).find(([, v]) => v === rIdx)?.[0];
                  if (leftIdx !== undefined) {
                    const correctRight = q.pairs[Number(leftIdx)].right;
                    borderColor = right === correctRight ? '#34d399' : '#ef4444';
                  }
                }

                return (
                  <motion.button
                    key={rIdx}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: rIdx * 0.06, ease: cubicEase }}
                    onClick={() => {
                      if (showFeedback || matchLeftSelected === null) return;
                      setMatchSelections((prev) => ({ ...prev, [matchLeftSelected]: rIdx }));
                      setMatchLeftSelected(null);
                    }}
                    style={{
                      background: isUsed ? 'rgba(52,211,153,0.04)' : 'var(--bg-overlay)',
                      border: `1.5px solid ${borderColor}`,
                      borderRadius: 12,
                      padding: '12px 16px',
                      textAlign: 'left',
                      cursor: showFeedback ? 'default' : 'pointer',
                      fontSize: 13,
                      color: '#c8c8d8',
                      fontFamily: baseFont,
                      lineHeight: 1.4,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                  >
                    {right}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {!showFeedback && allMatched && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: cubicEase }}
              style={{ marginTop: 24 }}
            >
              <Button
                variant="primary"
                size="md"
                onClick={handleMatchSubmit}
                icon={<CheckCircle size={16} />}
              >
                Check Matches
              </Button>
            </motion.div>
          )}

          {!showFeedback && !allMatched && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 20, textAlign: 'center' }}>
              Tap a term on the left, then tap its match on the right.
            </p>
          )}

          {showFeedback && (
            <FeedbackBanner
              correct={lastAnswerCorrect}
              explanation={lastExplanation}
              onContinue={handleNextPractice}
            />
          )}
        </>
      );
    }
  }

  // ─── SUMMARY ───────────────────────────────────────────────────────────
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
            color: 'var(--text-primary)',
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
            color: 'var(--text-secondary)',
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
          <div
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--bg-border)',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <BookOpen size={20} color="#4f8ef7" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
              {sessionResult.cardsLearned.length}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Cards Learned</div>
          </div>

          <div
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--bg-border)',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <Brain size={20} color="#a78bfa" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
              {accuracyPct}%
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Quiz Accuracy</div>
          </div>

          <div
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--bg-border)',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <Star size={20} color="#f59e0b" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
              {sessionResult.xpEarned}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>XP Earned</div>
          </div>

          <div
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--bg-border)',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
            }}
          >
            <Clock size={20} color="#34d399" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Duration</div>
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
              background: 'var(--bg-overlay)',
              border: '1px solid var(--bg-border)',
              borderRadius: 16,
              padding: '20px',
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-secondary)',
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
                    borderBottom: '1px solid var(--bg-border)',
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
                        color: 'var(--text-secondary)',
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
