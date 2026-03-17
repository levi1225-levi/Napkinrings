import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, RotateCcw, ArrowRight, Trophy, Zap } from 'lucide-react';
import ProgressRing from '../ui/ProgressRing';
import AnimatedNumber from '../ui/AnimatedNumber';
import Button from '../ui/Button';
import type { QuizQuestion } from '../../data/quizQuestions';
import { CARDS } from '../../data/cards';

interface QuizAnswer {
  selectedIndex: number;
  correct: boolean;
  timeMs: number;
}

interface QuizResultsProps {
  answers: Record<string, QuizAnswer>;
  questions: QuizQuestion[];
  totalXP: number;
  onStudyWeakCards: () => void;
  onTryAgain: () => void;
  onDone: () => void;
}

const stagger = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  },
};

export default function QuizResults({
  answers,
  questions,
  totalXP,
  onStudyWeakCards,
  onTryAgain,
  onDone,
}: QuizResultsProps) {
  const stats = useMemo(() => {
    let correct = 0;
    let total = questions.length;
    const byDifficulty: Record<string, { correct: number; total: number }> = {
      '1': { correct: 0, total: 0 },
      '2': { correct: 0, total: 0 },
      '3': { correct: 0, total: 0 },
    };
    const byCategory: Record<string, { correct: number; total: number }> = {};
    const wrongQuestions: { question: QuizQuestion; answer: QuizAnswer }[] = [];
    let totalTimeMs = 0;

    questions.forEach((q, idx) => {
      const answer = answers[idx.toString()];
      if (!answer) return;

      totalTimeMs += answer.timeMs;
      const diffKey = q.difficulty.toString();
      byDifficulty[diffKey].total += 1;

      if (!byCategory[q.type]) {
        byCategory[q.type] = { correct: 0, total: 0 };
      }
      byCategory[q.type].total += 1;

      if (answer.correct) {
        correct += 1;
        byDifficulty[diffKey].correct += 1;
        byCategory[q.type].correct += 1;
      } else {
        wrongQuestions.push({ question: q, answer });
      }
    });

    const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const avgTimeS = total > 0 ? totalTimeMs / total / 1000 : 0;

    return {
      correct,
      total,
      scorePercent,
      byDifficulty,
      byCategory,
      wrongQuestions,
      avgTimeS,
    };
  }, [answers, questions]);

  const diffLabels: Record<string, { label: string; color: string }> = {
    '1': { label: 'Easy', color: 'var(--accent-green)' },
    '2': { label: 'Medium', color: 'var(--accent-orange)' },
    '3': { label: 'Hard', color: 'var(--accent-red)' },
  };

  const scoreColor =
    stats.scorePercent >= 80
      ? 'var(--accent-green)'
      : stats.scorePercent >= 60
        ? 'var(--accent-orange)'
        : 'var(--accent-red)';

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto py-6"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {/* Score ring */}
      <motion.div variants={stagger.item} className="flex flex-col items-center gap-4">
        <ProgressRing
          progress={stats.scorePercent}
          size={160}
          strokeWidth={10}
          color={scoreColor}
        >
          <div className="flex flex-col items-center">
            <span
              style={{
                fontSize: '36px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              <AnimatedNumber value={stats.scorePercent} suffix="%" />
            </span>
          </div>
        </ProgressRing>

        <div className="text-center">
          <p
            style={{
              color: 'var(--text-primary)',
              fontSize: '20px',
              fontWeight: 600,
              margin: 0,
            }}
          >
            <AnimatedNumber value={stats.correct} /> / {stats.total} correct
          </p>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              marginTop: '4px',
            }}
          >
            Avg. {stats.avgTimeS.toFixed(1)}s per question
          </p>
        </div>
      </motion.div>

      {/* XP earned */}
      <motion.div
        variants={stagger.item}
        className="flex items-center gap-2"
        style={{
          padding: '10px 20px',
          borderRadius: '12px',
          backgroundColor: 'rgba(79,142,247,0.1)',
          border: '1px solid rgba(79,142,247,0.15)',
        }}
      >
        <Zap size={18} color="var(--accent-blue)" />
        <span style={{ color: 'var(--accent-blue)', fontSize: '16px', fontWeight: 600 }}>
          +<AnimatedNumber value={totalXP} /> XP earned
        </span>
      </motion.div>

      {/* Difficulty breakdown */}
      <motion.div variants={stagger.item} className="w-full">
        <h3
          style={{
            color: 'var(--text-primary)',
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '12px',
          }}
        >
          Difficulty Breakdown
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(['1', '2', '3'] as const).map((diff) => {
            const data = stats.byDifficulty[diff];
            const config = diffLabels[diff];
            const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

            return (
              <div
                key={diff}
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: '14px',
                  border: '1px solid var(--bg-border)',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{ fontSize: '12px', fontWeight: 600, color: config.color }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: config.color,
                    }}
                  />
                  {config.label}
                </span>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '24px',
                    fontWeight: 700,
                    margin: '8px 0 2px',
                    lineHeight: 1,
                  }}
                >
                  {pct}%
                </p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', margin: 0 }}>
                  {data.correct}/{data.total}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Category breakdown */}
      <motion.div variants={stagger.item} className="w-full">
        <h3
          style={{
            color: 'var(--text-primary)',
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '12px',
          }}
        >
          Topic Accuracy
        </h3>
        <div className="flex flex-col gap-2">
          {Object.entries(stats.byCategory)
            .sort((a, b) => {
              const pctA = a[1].total > 0 ? a[1].correct / a[1].total : 0;
              const pctB = b[1].total > 0 ? b[1].correct / b[1].total : 0;
              return pctA - pctB;
            })
            .map(([category, data]) => {
              const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
              const barColor =
                pct >= 80 ? 'var(--accent-green)' : pct >= 60 ? 'var(--accent-orange)' : 'var(--accent-red)';

              return (
                <div
                  key={category}
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: '12px',
                    border: '1px solid var(--bg-border)',
                    padding: '12px 16px',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
                      {category}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {data.correct}/{data.total}
                    </span>
                  </div>
                  <div
                    className="w-full overflow-hidden"
                    style={{
                      height: '4px',
                      backgroundColor: 'var(--bg-border-strong)',
                      borderRadius: '2px',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                      style={{
                        height: '100%',
                        backgroundColor: barColor,
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </motion.div>

      {/* Wrong answers */}
      {stats.wrongQuestions.length > 0 && (
        <motion.div variants={stagger.item} className="w-full">
          <h3
            style={{
              color: 'var(--text-primary)',
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            Review Missed Questions
          </h3>
          <div className="flex flex-col gap-2">
            {stats.wrongQuestions.map(({ question, answer }) => {
              const relatedCard = CARDS.find((c) => c.id === question.relatedCardId);

              return (
                <div
                  key={question.id}
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: '14px',
                    border: '1px solid var(--bg-border)',
                    padding: '16px',
                  }}
                >
                  <p
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: 500,
                      margin: '0 0 8px',
                      lineHeight: 1.4,
                    }}
                  >
                    {question.question}
                  </p>
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-red)',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: 'var(--accent-red)', fontSize: '13px', textDecoration: 'line-through' }}>
                        {question.options[answer.selectedIndex]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-green)',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: 'var(--accent-green)', fontSize: '13px' }}>
                        {question.options[question.correctIndex]}
                      </span>
                    </div>
                  </div>
                  {relatedCard && (
                    <div
                      className="flex items-center gap-2"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(79,142,247,0.08)',
                        cursor: 'pointer',
                      }}
                    >
                      <BookOpen size={14} color="var(--accent-blue)" />
                      <span style={{ color: 'var(--accent-blue)', fontSize: '12px', fontWeight: 500 }}>
                        Study: {relatedCard.term}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Achievement badge for perfect score */}
      {stats.scorePercent === 100 && (
        <motion.div
          variants={stagger.item}
          className="flex items-center gap-3"
          style={{
            padding: '16px 24px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(255,214,10,0.12), rgba(255,159,10,0.08))',
            border: '1px solid rgba(255,214,10,0.2)',
          }}
        >
          <Trophy size={24} color="var(--accent-gold)" />
          <div>
            <p style={{ color: 'var(--accent-gold)', fontSize: '15px', fontWeight: 600, margin: 0 }}>
              Perfect Score!
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>
              You nailed every question. Outstanding work.
            </p>
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row gap-3 w-full">
        {stats.wrongQuestions.length > 0 && (
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={onStudyWeakCards}
            icon={<BookOpen size={18} />}
          >
            Study Weak Cards
          </Button>
        )}
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={onTryAgain}
          icon={<RotateCcw size={18} />}
        >
          Try Again
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="flex-1"
          onClick={onDone}
          icon={<ArrowRight size={18} />}
        >
          Done
        </Button>
      </motion.div>
    </motion.div>
  );
}
