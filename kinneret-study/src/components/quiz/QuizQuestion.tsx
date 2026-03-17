import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { QuizQuestion as QuizQuestionType } from '../../data/quizQuestions';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedIndex: number) => void;
  answered: boolean;
  selectedIndex: number | null;
  showTimer?: boolean;
  timeRemaining?: number;
  timeTotal?: number;
}

const difficultyConfig: Record<
  1 | 2 | 3,
  { color: string; label: string; glow: string }
> = {
  1: { color: '#34c759', label: 'Easy', glow: 'rgba(52,199,89,0.3)' },
  2: { color: '#ff9f0a', label: 'Medium', glow: 'rgba(255,159,10,0.3)' },
  3: { color: '#ff453a', label: 'Hard', glow: 'rgba(255,69,58,0.3)' },
};

const optionLabels = ['A', 'B', 'C', 'D'];

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  answered,
  selectedIndex,
  showTimer = false,
  timeRemaining = 0,
  timeTotal = 30,
}: QuizQuestionProps) {
  const progress = (questionNumber / totalQuestions) * 100;
  const diff = difficultyConfig[question.difficulty];
  const timerProgress = timeTotal > 0 ? (timeRemaining / timeTotal) * 100 : 0;

  function getOptionState(index: number) {
    if (!answered) return 'idle';
    if (index === question.correctIndex) return 'correct';
    if (index === selectedIndex && index !== question.correctIndex) return 'wrong';
    return 'dimmed';
  }

  function getOptionStyle(state: string) {
    switch (state) {
      case 'correct':
        return {
          bg: 'rgba(52,199,89,0.15)',
          border: '#34c759',
          text: '#34c759',
          shadow: '0 0 20px rgba(52,199,89,0.2)',
        };
      case 'wrong':
        return {
          bg: 'rgba(255,69,58,0.15)',
          border: '#ff453a',
          text: '#ff453a',
          shadow: '0 0 20px rgba(255,69,58,0.2)',
        };
      case 'dimmed':
        return {
          bg: 'var(--bg-overlay)',
          border: 'var(--bg-border)',
          text: 'var(--text-tertiary)',
          shadow: 'none',
        };
      default:
        return {
          bg: 'var(--bg-elevated)',
          border: 'var(--bg-border-strong)',
          text: 'var(--text-primary)',
          shadow: '0 2px 12px rgba(0,0,0,0.2)',
        };
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Timer bar */}
      {showTimer && (
        <div
          className="w-full overflow-hidden"
          style={{
            height: '3px',
            backgroundColor: 'var(--bg-border-strong)',
            borderRadius: '2px',
          }}
        >
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${timerProgress}%` }}
            transition={{ duration: 0.5, ease: 'linear' }}
            style={{
              height: '100%',
              backgroundColor:
                timerProgress > 30 ? '#4f8ef7' : timerProgress > 10 ? '#ff9f0a' : '#ff453a',
              borderRadius: '2px',
            }}
          />
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full">
        <div
          className="w-full overflow-hidden"
          style={{
            height: '4px',
            backgroundColor: 'var(--bg-border-strong)',
            borderRadius: '2px',
          }}
        >
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #4f8ef7, #6ba0ff)',
              borderRadius: '2px',
            }}
          />
        </div>
        <div
          className="flex items-center justify-between mt-2"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            {questionNumber} of {totalQuestions}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Question header */}
      <div className="flex items-center gap-3">
        <span
          className="font-semibold"
          style={{
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
          }}
        >
          Question {questionNumber}
        </span>
        <span
          className="inline-flex items-center gap-1.5"
          style={{
            padding: '3px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            color: diff.color,
            backgroundColor: `${diff.color}18`,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: diff.color,
              boxShadow: `0 0 6px ${diff.glow}`,
            }}
          />
          {diff.label}
        </span>
        <span
          style={{
            color: 'var(--text-tertiary)',
            fontSize: '12px',
            fontFamily: 'var(--font-ui)',
            marginLeft: 'auto',
          }}
        >
          {question.type}
        </span>
      </div>

      {/* Question text */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          color: 'var(--text-primary)',
          fontSize: '22px',
          fontWeight: 600,
          lineHeight: 1.4,
          fontFamily: 'var(--font-ui)',
          letterSpacing: '-0.01em',
        }}
      >
        {question.question}
      </motion.h2>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const state = getOptionState(index);
          const style = getOptionStyle(state);
          const isSelected = selectedIndex === index;
          const isCorrect = index === question.correctIndex;

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                backgroundColor: style.bg,
                borderColor: style.border,
              }}
              transition={{
                delay: index * 0.08,
                duration: 0.35,
                ease: 'easeOut',
                backgroundColor: { duration: 0.4 },
                borderColor: { duration: 0.4 },
              }}
              whileHover={
                answered
                  ? undefined
                  : {
                      scale: 1.02,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }
              }
              whileTap={answered ? undefined : { scale: 0.98 }}
              onClick={() => {
                if (!answered) onAnswer(index);
              }}
              disabled={answered}
              className="relative flex items-start gap-3 text-left w-full"
              style={{
                padding: '16px',
                borderRadius: '14px',
                border: `1px solid ${style.border}`,
                boxShadow: style.shadow,
                cursor: answered ? 'default' : 'pointer',
                fontFamily: 'var(--font-ui)',
                outline: 'none',
              }}
              aria-label={`Option ${optionLabels[index]}: ${option}`}
              aria-pressed={isSelected}
            >
              {/* Option label */}
              <span
                className="flex-shrink-0 flex items-center justify-center font-semibold"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  backgroundColor:
                    answered && isCorrect
                      ? 'rgba(52,199,89,0.2)'
                      : answered && isSelected && !isCorrect
                        ? 'rgba(255,69,58,0.2)'
                        : 'var(--bg-border-strong)',
                  color:
                    answered && isCorrect
                      ? '#34c759'
                      : answered && isSelected && !isCorrect
                        ? '#ff453a'
                        : 'var(--text-secondary)',
                }}
              >
                {optionLabels[index]}
              </span>

              {/* Option text */}
              <span
                className="flex-1 pt-0.5"
                style={{
                  color: style.text,
                  fontSize: '15px',
                  lineHeight: 1.4,
                }}
              >
                {option}
              </span>

              {/* Feedback icon */}
              {answered && isCorrect && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 25,
                    delay: 0.15,
                  }}
                  className="flex-shrink-0"
                >
                  <CheckCircle size={20} color="#34c759" />
                </motion.span>
              )}
              {answered && isSelected && !isCorrect && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 25,
                    delay: 0.15,
                  }}
                  className="flex-shrink-0"
                >
                  <XCircle size={20} color="#ff453a" />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation (shown after answering) */}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
          style={{
            backgroundColor: 'rgba(79,142,247,0.08)',
            borderRadius: '14px',
            border: '1px solid rgba(79,142,247,0.15)',
            padding: '16px 20px',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 mt-0.5"
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'rgba(79,142,247,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#4f8ef7',
                fontWeight: 700,
              }}
            >
              i
            </div>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: 1.6,
                fontFamily: 'var(--font-ui)',
                margin: 0,
              }}
            >
              {question.explanation}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
