import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Pause,
  Play,
  ArrowRight,
  Trophy,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { quizQuestions as QUIZ_QUESTIONS } from '../../data/quizQuestions';
import type { QuizQuestion as QuizQuestionType } from '../../data/quizQuestions';
import QuizQuestion from './QuizQuestion';
import Button from '../ui/Button';

type Phase = 'setup' | 'playing' | 'paused' | 'timeup' | 'results';

interface TestAnswer {
  selectedIndex: number;
  correct: boolean;
  timeMs: number;
}

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(q: QuizQuestionType): QuizQuestionType {
  const indices = q.options.map((_, i) => i);
  const shuffled = shuffle(indices);
  const newOptions = shuffled.map((i) => q.options[i]);
  const newCorrectIndex = shuffled.indexOf(q.correctIndex);
  return { ...q, options: newOptions, correctIndex: newCorrectIndex };
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const TIME_OPTIONS = [
  { label: '5 min', value: 5, questions: 10 },
  { label: '10 min', value: 10, questions: 20 },
  { label: '15 min', value: 15, questions: 30 },
];

export default function PracticeTest() {
  const { data, setStudyMode } = useAppStore();

  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedTime, setSelectedTime] = useState(10);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, TestAnswer>>({});
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const questionStartTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const timeConfig = TIME_OPTIONS.find((t) => t.value === selectedTime) ?? TIME_OPTIONS[1];

  // Build question set
  const questions = useMemo(() => {
    const scored = QUIZ_QUESTIONS.map((q) => {
      const cardState = data.cardStates[q.relatedCardId];
      const easeFactor = cardState ? cardState.easeFactor : 2.5;
      return { question: q, easeFactor };
    });
    scored.sort((a, b) => a.easeFactor - b.easeFactor);
    const selected = scored.slice(0, timeConfig.questions);
    return shuffle(selected).map((s) => shuffleOptions(s.question));
  }, [data.cardStates, timeConfig.questions]);

  const totalQuestions = questions.length;

  // Timer logic
  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setPhase('timeup');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase]);

  const handleStart = useCallback(() => {
    setTimeRemaining(selectedTime * 60);
    setCurrentIndex(0);
    setAnswers({});
    setAnswered(false);
    setSelectedIndex(null);
    questionStartTime.current = Date.now();
    setPhase('playing');
  }, [selectedTime]);

  const handlePause = useCallback(() => {
    setPhase('paused');
  }, []);

  const handleResume = useCallback(() => {
    setPhase('playing');
  }, []);

  const handleAnswer = useCallback(
    (selected: number) => {
      if (answered) return;
      const question = questions[currentIndex];
      const correct = selected === question.correctIndex;
      const timeMs = Date.now() - questionStartTime.current;

      setSelectedIndex(selected);
      setAnswered(true);
      setAnswers((prev) => ({
        ...prev,
        [currentIndex]: { selectedIndex: selected, correct, timeMs },
      }));

      // Auto-advance after 1.2s
      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          setCurrentIndex((prev) => prev + 1);
          setAnswered(false);
          setSelectedIndex(null);
          questionStartTime.current = Date.now();
        } else {
          // All questions answered
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setPhase('results');
        }
      }, 1200);
    },
    [answered, currentIndex, totalQuestions, questions],
  );

  const handleDone = useCallback(() => {
    setStudyMode(null);
  }, [setStudyMode]);

  const handleTryAgain = useCallback(() => {
    setPhase('setup');
    setCurrentIndex(0);
    setAnswers({});
    setAnswered(false);
    setSelectedIndex(null);
  }, []);

  // Results calculation
  const results = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const avgTime =
      answeredCount > 0
        ? Math.round(
            Object.values(answers).reduce((s, a) => s + a.timeMs, 0) / answeredCount / 1000,
          )
        : 0;
    return { answeredCount, correctCount, accuracy, avgTime };
  }, [answers]);

  // ─── Setup screen ───
  if (phase === 'setup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto py-8"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(255,159,10,0.2), rgba(255,69,58,0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={32} color="#ff9f0a" />
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
            Practice Test
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '15px',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Simulate a timed test — answer as many as you can before time runs out
          </p>
        </div>

        {/* Time selection */}
        <div
          className="w-full"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '16px',
            border: '1px solid var(--bg-border)',
            padding: '20px',
          }}
        >
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              margin: '0 0 14px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Select time limit
          </p>
          <div className="flex gap-3">
            {TIME_OPTIONS.map((opt) => {
              const isSelected = selectedTime === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTime(opt.value)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-4"
                  style={{
                    borderRadius: '14px',
                    border: isSelected
                      ? '2px solid var(--accent-orange)'
                      : '2px solid var(--bg-border-strong)',
                    backgroundColor: isSelected
                      ? 'rgba(255,159,10,0.1)'
                      : 'var(--bg-overlay)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: isSelected ? 'var(--accent-orange)' : 'var(--text-primary)',
                    }}
                  >
                    {opt.label}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {opt.questions} questions
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Info card */}
        <div
          className="w-full flex items-start gap-3 p-4 rounded-xl"
          style={{
            backgroundColor: 'rgba(255,159,10,0.06)',
            border: '1px solid rgba(255,159,10,0.15)',
          }}
        >
          <AlertTriangle
            size={16}
            style={{ color: '#ff9f0a', flexShrink: 0, marginTop: 2 }}
          />
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            When time runs out, the test ends automatically. You can pause at any time, but
            the timer will stop and your total time will be recorded.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleStart}
          icon={<ArrowRight size={18} />}
        >
          Start Test
        </Button>
      </motion.div>
    );
  }

  // ─── Paused overlay ───
  if (phase === 'paused') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-16"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(255,159,10,0.15)',
              '0 0 40px rgba(255,159,10,0.25)',
              '0 0 20px rgba(255,159,10,0.15)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,159,10,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Pause size={36} color="#ff9f0a" />
        </motion.div>

        <div className="text-center">
          <h2
            style={{
              color: 'var(--text-primary)',
              fontSize: '24px',
              fontWeight: 700,
              margin: '0 0 8px',
            }}
          >
            Test Paused
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
            {formatCountdown(timeRemaining)} remaining &middot; Question{' '}
            {currentIndex + 1} of {totalQuestions}
          </p>
        </div>

        <Button variant="primary" size="lg" onClick={handleResume} icon={<Play size={18} />}>
          Resume Test
        </Button>
      </motion.div>
    );
  }

  // ─── Time's up screen ───
  if (phase === 'timeup') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-12"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,69,58,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Clock size={36} color="#ff453a" />
        </motion.div>

        <div className="text-center">
          <h2
            style={{
              color: 'var(--text-primary)',
              fontSize: '28px',
              fontWeight: 700,
              margin: '0 0 8px',
            }}
          >
            Time&apos;s Up!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
            You answered {results.answeredCount} of {totalQuestions} questions
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setPhase('results')}
          icon={<ArrowRight size={18} />}
        >
          View Results
        </Button>
      </motion.div>
    );
  }

  // ─── Results screen ───
  if (phase === 'results') {
    const gradeColor =
      results.accuracy >= 80
        ? '#34c759'
        : results.accuracy >= 60
          ? '#ff9f0a'
          : '#ff453a';
    const gradeLabel =
      results.accuracy >= 90
        ? 'Excellent!'
        : results.accuracy >= 80
          ? 'Great Job!'
          : results.accuracy >= 60
            ? 'Good Effort'
            : 'Keep Practicing';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto py-8"
        style={{ fontFamily: 'var(--font-ui)' }}
      >
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `${gradeColor}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trophy size={36} color={gradeColor} />
        </motion.div>

        <div className="text-center">
          <h2
            style={{
              color: gradeColor,
              fontSize: '24px',
              fontWeight: 700,
              margin: '0 0 4px',
            }}
          >
            {gradeLabel}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
            Practice test complete
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {[
            { label: 'Score', value: `${results.accuracy}%`, color: gradeColor },
            {
              label: 'Answered',
              value: `${results.answeredCount}/${totalQuestions}`,
              color: '#4f8ef7',
            },
            { label: 'Correct', value: String(results.correctCount), color: '#34c759' },
            { label: 'Avg Time', value: `${results.avgTime}s`, color: '#bf5af2' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 py-4"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '14px',
                border: '1px solid var(--bg-border)',
              }}
            >
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: stat.color,
                }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Question breakdown */}
        <div
          className="w-full"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '16px',
            border: '1px solid var(--bg-border)',
            padding: '16px',
          }}
        >
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              margin: '0 0 12px',
            }}
          >
            Question Breakdown
          </p>
          <div className="flex flex-col gap-2">
            {questions.slice(0, results.answeredCount).map((q, i) => {
              const answer = answers[i];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg"
                  style={{
                    backgroundColor: answer?.correct
                      ? 'rgba(52,199,89,0.06)'
                      : 'rgba(255,69,58,0.06)',
                  }}
                >
                  {answer?.correct ? (
                    <CheckCircle size={16} color="#34c759" />
                  ) : (
                    <XCircle size={16} color="#ff453a" />
                  )}
                  <span
                    className="flex-1 truncate"
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    {q.question}
                  </span>
                  <span
                    style={{
                      color: 'var(--text-tertiary)',
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {answer ? `${(answer.timeMs / 1000).toFixed(1)}s` : '—'}
                  </span>
                </div>
              );
            })}
            {results.answeredCount < totalQuestions && (
              <p
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '12px',
                  textAlign: 'center',
                  margin: '4px 0 0',
                }}
              >
                {totalQuestions - results.answeredCount} questions unanswered
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            size="md"
            onClick={handleTryAgain}
            icon={<RotateCcw size={16} />}
            className="flex-1"
          >
            Try Again
          </Button>
          <Button variant="primary" size="md" onClick={handleDone} className="flex-1">
            Done
          </Button>
        </div>
      </motion.div>
    );
  }

  // ─── Playing screen ───
  const currentQuestion = questions[currentIndex];
  const totalTime = selectedTime * 60;

  return (
    <div className="w-full max-w-2xl mx-auto py-4" style={{ fontFamily: 'var(--font-ui)' }}>
      {/* Timer bar + pause button */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <div
            className="w-full overflow-hidden"
            style={{
              height: '6px',
              backgroundColor: 'var(--bg-border-strong)',
              borderRadius: '3px',
            }}
          >
            <motion.div
              animate={{ width: `${(timeRemaining / totalTime) * 100}%` }}
              transition={{ duration: 0.5, ease: 'linear' }}
              style={{
                height: '100%',
                backgroundColor:
                  timeRemaining > totalTime * 0.3
                    ? '#ff9f0a'
                    : timeRemaining > totalTime * 0.1
                      ? '#ff6b35'
                      : '#ff453a',
                borderRadius: '3px',
              }}
            />
          </div>
        </div>
        <span
          style={{
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'var(--font-ui)',
            fontVariantNumeric: 'tabular-nums',
            color:
              timeRemaining > totalTime * 0.3
                ? 'var(--text-primary)'
                : timeRemaining > totalTime * 0.1
                  ? '#ff9f0a'
                  : '#ff453a',
            minWidth: '52px',
            textAlign: 'right',
          }}
        >
          {formatCountdown(timeRemaining)}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePause}
          style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            flexShrink: 0,
          }}
          aria-label="Pause test"
        >
          <Pause size={16} />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            onAnswer={handleAnswer}
            answered={answered}
            selectedIndex={selectedIndex}
            showTimer={false}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
