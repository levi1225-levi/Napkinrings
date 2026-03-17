import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Check,
  X,
  Trophy,
  Play,
  RotateCcw,
  ArrowRight,
  Flame,
  Star,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { CARDS } from '../../data/cards';
import AnimatedNumber from '../ui/AnimatedNumber';
import Button from '../ui/Button';

type Phase = 'start' | 'playing' | 'gameover';

const ROUND_DURATION = 60; // seconds

interface SpeedCard {
  cardId: string;
  hebrew: string;
  term: string;
  definition: string;
  isCorrectMatch: boolean;
}

/** Pick a random element from an array. */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate a speed card: 50% chance correct definition, 50% wrong. */
function generateSpeedCard(): SpeedCard {
  const card = pickRandom(CARDS);
  const isCorrectMatch = Math.random() < 0.5;

  if (isCorrectMatch) {
    return {
      cardId: card.id,
      hebrew: card.hebrew ?? '',
      term: card.term,
      definition: card.definition,
      isCorrectMatch: true,
    };
  }

  // Pick a different card's definition
  let other = pickRandom(CARDS);
  while (other.id === card.id) {
    other = pickRandom(CARDS);
  }

  return {
    cardId: card.id,
    hebrew: card.hebrew ?? '',
    term: card.term,
    definition: other.definition,
    isCorrectMatch: false,
  };
}

export default function SpeedRound() {
  const {
    speedScore,
    speedCombo,
    speedHighScore,
    startSpeedRound,
    speedAnswer,
    endSpeedRound,
    currentSession,
    data,
    addToast,
  } = useAppStore();

  const [phase, setPhase] = useState<Phase>('start');
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [currentCard, setCurrentCard] = useState<SpeedCard>(generateSpeedCard);
  const [cardKey, setCardKey] = useState(0);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalComboMax, setFinalComboMax] = useState(1);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const comboMaxRef = useRef(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const prevHighScore = useRef(speedHighScore);

  // Load score history from session data
  const storedHistory = useMemo(() => {
    return data.sessions
      .filter((s) => s.mode === 'speed')
      .slice(-5)
      .map((s) => s.correctCount ?? 0);
  }, [data.sessions]);

  const handleStart = useCallback(() => {
    startSpeedRound();
    setPhase('playing');
    setTimeLeft(ROUND_DURATION);
    setCurrentCard(generateSpeedCard());
    setCardKey(0);
    setFlashColor(null);
    comboMaxRef.current = 1;
    prevHighScore.current = speedHighScore;
    startTimeRef.current = Date.now();

    // Start timer
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, ROUND_DURATION - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        // Game over
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 50); // Update ~20fps for smooth timer
  }, [startSpeedRound, speedHighScore]);

  // Handle game over when timer hits 0
  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const score = useAppStore.getState().speedScore;
      const wasNewHigh = score > prevHighScore.current && score > 0;

      setFinalScore(score);
      setFinalComboMax(comboMaxRef.current);
      setIsNewHighScore(wasNewHigh);
      setScoreHistory([...storedHistory, score].slice(-5));

      endSpeedRound();
      setPhase('gameover');

      if (wasNewHigh) {
        addToast({ message: 'New high score!', type: 'achievement', icon: '🏆' });
      }
    }
  }, [phase, timeLeft, endSpeedRound, addToast, storedHistory]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleAnswer = useCallback(
    (userSaysCorrect: boolean) => {
      if (phase !== 'playing' || timeLeft <= 0) return;

      const isActuallyCorrect = currentCard.isCorrectMatch === userSaysCorrect;

      speedAnswer(isActuallyCorrect);

      // Track max combo
      const newCombo = useAppStore.getState().speedCombo;
      if (newCombo > comboMaxRef.current) {
        comboMaxRef.current = newCombo;
      }

      // Flash feedback
      setFlashColor(isActuallyCorrect ? '#34c759' : '#ff453a');
      setTimeout(() => setFlashColor(null), 200);

      // Next card
      setCurrentCard(generateSpeedCard());
      setCardKey((k) => k + 1);
    },
    [phase, timeLeft, currentCard, speedAnswer],
  );

  const handlePlayAgain = useCallback(() => {
    setPhase('start');
  }, []);

  const handleDone = useCallback(() => {
    useAppStore.getState().setStudyMode(null);
  }, []);

  // ─── Shared styles ───
  const fontBase: React.CSSProperties = { fontFamily: 'var(--font-ui)' };

  // Combo color
  function comboColor(combo: number) {
    if (combo >= 3) return '#ffd60a';
    if (combo >= 2) return '#ff9f0a';
    return '#4f8ef7';
  }

  // Timer color
  function timerColor(t: number) {
    if (t > 20) return '#4f8ef7';
    if (t > 10) return '#ff9f0a';
    return '#ff453a';
  }

  // ─── Start Screen ───
  if (phase === 'start') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8 w-full max-w-md mx-auto py-8"
        style={fontBase}
      >
        <div className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255,159,10,0.2), rgba(255,69,58,0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap size={36} color="#ff9f0a" />
          </motion.div>

          <h1
            style={{
              color: 'var(--text-primary)',
              fontSize: '32px',
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Speed Round
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '15px',
              textAlign: 'center',
              margin: 0,
              maxWidth: '280px',
            }}
          >
            60 seconds. Match terms to definitions. Build combos for bonus points.
          </p>
        </div>

        {/* High score */}
        <div
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '16px',
            border: '1px solid var(--bg-border)',
            padding: '20px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy size={18} color="#ffd60a" />
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
              High Score
            </span>
          </div>
          <p
            style={{
              color: speedHighScore > 0 ? '#ffd60a' : '#8888a0',
              fontSize: '40px',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1,
            }}
          >
            {speedHighScore > 0 ? speedHighScore : '—'}
          </p>
        </div>

        {/* Recent scores mini chart */}
        {storedHistory.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '16px',
              border: '1px solid var(--bg-border)',
              padding: '16px 20px',
              width: '100%',
            }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, margin: '0 0 12px' }}>
              Recent Rounds
            </p>
            <div className="flex items-end gap-2" style={{ height: '48px' }}>
              {storedHistory.map((score, i) => {
                const max = Math.max(...storedHistory, 1);
                const height = Math.max(4, (score / max) * 48);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(79,142,247,0.3)',
                        borderRadius: '4px',
                        minHeight: '4px',
                      }}
                    />
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>{score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            icon={<Play size={20} />}
          >
            GO!
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // ─── Game Over Screen ───
  if (phase === 'gameover') {
    const xpEarned = currentSession?.xpEarned ?? Math.round(finalScore * 2);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-8 w-full max-w-md mx-auto py-8"
        style={fontBase}
      >
        {/* New high score celebration */}
        {isNewHighScore && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex items-center gap-2"
            style={{
              padding: '10px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255,214,10,0.2), rgba(255,159,10,0.1))',
              border: '1px solid rgba(255,214,10,0.3)',
            }}
          >
            <Star size={20} color="#ffd60a" />
            <span style={{ color: '#ffd60a', fontSize: '16px', fontWeight: 700 }}>
              NEW HIGH SCORE!
            </span>
            <Star size={20} color="#ffd60a" />
          </motion.div>
        )}

        {/* Final score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Final Score</span>
          <div
            style={{
              color: 'var(--text-primary)',
              fontSize: '64px',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            <AnimatedNumber value={finalScore} duration={1200} />
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-3 w-full"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '14px',
              border: '1px solid var(--bg-border)',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <Flame size={18} color="#ff9f0a" style={{ margin: '0 auto 8px' }} />
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: '20px',
                fontWeight: 700,
                margin: 0,
                lineHeight: 1,
              }}
            >
              x{finalComboMax}
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', margin: '4px 0 0' }}>Max Combo</p>
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
            <Check size={18} color="#34c759" style={{ margin: '0 auto 8px' }} />
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: '20px',
                fontWeight: 700,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {currentSession?.correctCount ?? 0}
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', margin: '4px 0 0' }}>Correct</p>
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
            <Zap size={18} color="#4f8ef7" style={{ margin: '0 auto 8px' }} />
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: '20px',
                fontWeight: 700,
                margin: 0,
                lineHeight: 1,
              }}
            >
              +{xpEarned}
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', margin: '4px 0 0' }}>XP Earned</p>
          </div>
        </motion.div>

        {/* Score history bar chart */}
        {scoreHistory.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '16px',
              border: '1px solid var(--bg-border)',
              padding: '16px 20px',
              width: '100%',
            }}
          >
            <p
              style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500, margin: '0 0 12px' }}
            >
              Score History
            </p>
            <div className="flex items-end gap-3" style={{ height: '64px' }}>
              {scoreHistory.map((score, i) => {
                const max = Math.max(...scoreHistory, 1);
                const height = Math.max(6, (score / max) * 64);
                const isLast = i === scoreHistory.length - 1;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
                      style={{
                        width: '100%',
                        backgroundColor: isLast
                          ? 'rgba(79,142,247,0.5)'
                          : 'var(--bg-overlay)',
                        borderRadius: '4px',
                        border: isLast ? '1px solid rgba(79,142,247,0.6)' : 'none',
                        minHeight: '6px',
                      }}
                    />
                    <span
                      style={{
                        color: isLast ? '#4f8ef7' : '#8888a0',
                        fontSize: '11px',
                        fontWeight: isLast ? 600 : 400,
                      }}
                    >
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={handlePlayAgain}
            icon={<RotateCcw size={18} />}
          >
            Play Again
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={handleDone}
            icon={<ArrowRight size={18} />}
          >
            Done
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // ─── Playing Screen ───
  const timerPercent = (timeLeft / ROUND_DURATION) * 100;
  const tColor = timerColor(timeLeft);
  const cColor = comboColor(speedCombo);

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto py-4" style={fontBase}>
      {/* Flash overlay */}
      <AnimatePresence>
        {flashColor && (
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: flashColor,
              pointerEvents: 'none',
              zIndex: 50,
            }}
          />
        )}
      </AnimatePresence>

      {/* Timer bar */}
      <div
        className="w-full overflow-hidden"
        style={{
          height: '6px',
          backgroundColor: 'var(--bg-overlay)',
          borderRadius: '3px',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            width: `${timerPercent}%`,
            backgroundColor: tColor,
            borderRadius: '3px',
            transition: 'width 0.1s linear, background-color 0.3s ease',
          }}
        />
      </div>

      {/* Header: timer + score + combo */}
      <div className="flex items-center justify-between">
        {/* Timer display */}
        <div className="flex items-center gap-2">
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: `${tColor}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: tColor,
                fontSize: '18px',
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {Math.ceil(timeLeft)}
            </span>
          </div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>seconds</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3">
          {/* Combo badge */}
          {speedCombo > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="flex items-center gap-1"
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: `${cColor}20`,
                border: `1px solid ${cColor}40`,
              }}
            >
              <Flame size={14} color={cColor} />
              <span style={{ color: cColor, fontSize: '13px', fontWeight: 700 }}>
                x{speedCombo}
              </span>
            </motion.div>
          )}

          <div className="text-right">
            <motion.p
              key={speedScore}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                color: 'var(--text-primary)',
                fontSize: '28px',
                fontWeight: 700,
                margin: 0,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {speedScore}
            </motion.p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', margin: 0 }}>score</p>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center" style={{ minHeight: '280px' }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={cardKey}
            initial={{ x: 200, opacity: 0, rotateY: -10 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            exit={{ x: -200, opacity: 0, rotateY: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '20px',
              border: '1px solid var(--bg-border)',
              padding: '32px 24px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Hebrew */}
            <p
              style={{
                color: '#4f8ef7',
                fontSize: '36px',
                fontWeight: 600,
                textAlign: 'center',
                margin: '0 0 4px',
                lineHeight: 1.3,
              }}
              dir="rtl"
            >
              {currentCard.hebrew}
            </p>

            {/* Term */}
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: '20px',
                fontWeight: 600,
                textAlign: 'center',
                margin: '0 0 20px',
              }}
            >
              {currentCard.term}
            </p>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--bg-border)',
                margin: '0 0 20px',
              }}
            />

            {/* Definition */}
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                textAlign: 'center',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {currentCard.definition}
            </p>

            {/* Prompt */}
            <p
              style={{
                color: 'var(--text-tertiary)',
                fontSize: '13px',
                textAlign: 'center',
                margin: '16px 0 0',
                fontStyle: 'italic',
              }}
            >
              Does this definition match?
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(false)}
          className="flex items-center justify-center gap-2"
          style={{
            height: '60px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,69,58,0.1)',
            border: '1px solid rgba(255,69,58,0.2)',
            color: '#ff453a',
            fontSize: '17px',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            outline: 'none',
          }}
          aria-label="Wrong - definition does not match"
        >
          <X size={22} />
          Wrong
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleAnswer(true)}
          className="flex items-center justify-center gap-2"
          style={{
            height: '60px',
            borderRadius: '16px',
            backgroundColor: 'rgba(52,199,89,0.1)',
            border: '1px solid rgba(52,199,89,0.2)',
            color: '#34c759',
            fontSize: '17px',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            outline: 'none',
          }}
          aria-label="Correct - definition matches"
        >
          <Check size={22} />
          Correct
        </motion.button>
      </div>
    </div>
  );
}
