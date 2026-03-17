import { lazy, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, GraduationCap } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { CARDS } from '../data/cards';
// isCardDue not needed here — due tomorrow uses direct date comparison
import DailyStatus from '../components/dashboard/DailyStatus';
import StudyModeCards from '../components/dashboard/StudyModeCards';
import WeakCardsWidget from '../components/dashboard/WeakCardsWidget';
import ProgressRing from '../components/ui/ProgressRing';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import Button from '../components/ui/Button';

const StudyScheduler = lazy(() => import('../components/scheduler/StudyScheduler'));

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      staggerChildren: 0.05,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export default function Dashboard() {
  const { data, getDueCardCount, getMasteredCount, setActiveTab, setStudyMode } =
    useAppStore();

  const dueCount = getDueCardCount();
  const masteredCount = getMasteredCount();
  const totalCards = CARDS.length;
  const masteredPercent = totalCards > 0 ? (masteredCount / totalCards) * 100 : 0;

  // Calculate overall accuracy from all sessions
  const accuracy = useMemo(() => {
    let totalCorrect = 0;
    let totalAttempts = 0;

    for (const session of data.sessions) {
      totalCorrect += session.correctCount;
      totalAttempts += session.correctCount + session.incorrectCount;
    }

    return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  }, [data.sessions]);

  // Count total cards studied (unique cards with at least one review)
  const totalStudied = useMemo(() => {
    return Object.values(data.cardStates).filter(
      (cs) => (cs as { totalReviews: number }).totalReviews > 0
    ).length;
  }, [data.cardStates]);

  // Cards due tomorrow (but NOT already due today)
  const dueTomorrow = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return CARDS.filter((card) => {
      const cs = data.cardStates[card.id];
      if (!cs) return false;
      const reviewDate = new Date(cs.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      // Due tomorrow = review date is exactly tomorrow
      return reviewDate.getTime() === tomorrow.getTime();
    }).length;
  }, [data.cardStates]);

  const handleContinueStudying = () => {
    setStudyMode('flashcard');
    setActiveTab('study');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
      style={{
        padding: '24px 24px 32px',
        maxWidth: '960px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        flex: 1,
      }}
    >
      {/* Greeting */}
      <motion.div variants={sectionVariants}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {data.profile.name ? `Hey, ${data.profile.name}` : 'Welcome back'}
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginTop: '4px',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {dueCount > 0
            ? `You have ${dueCount} card${dueCount !== 1 ? 's' : ''} to review today`
            : "You're all caught up!"}
        </p>
      </motion.div>

      {/* Continue Studying CTA */}
      <motion.div variants={sectionVariants}>
        <motion.div
          whileHover={{
            boxShadow: '0 0 32px rgba(79,142,247,0.4), 0 0 64px rgba(79,142,247,0.15)',
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(79,142,247,0.2), 0 0 40px rgba(79,142,247,0.08)',
              '0 0 28px rgba(79,142,247,0.35), 0 0 56px rgba(79,142,247,0.12)',
              '0 0 20px rgba(79,142,247,0.2), 0 0 40px rgba(79,142,247,0.08)',
            ],
          }}
          transition={{
            boxShadow: {
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Button
            variant="primary"
            size="lg"
            icon={<Play size={20} />}
            onClick={handleContinueStudying}
            className="w-full"
          >
            <span
              style={{
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              Continue Studying
            </span>
            {dueCount > 0 && (
              <span
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginLeft: '8px',
                }}
              >
                {dueCount} due
              </span>
            )}
          </Button>
        </motion.div>
      </motion.div>

      {/* Daily Status Bar */}
      <motion.div variants={sectionVariants}>
        <DailyStatus />
      </motion.div>

      {/* Test Countdown */}
      {(() => {
        const testDate = data.settings.testDate;
        if (!testDate) return null;
        const daysUntil = Math.max(0, Math.ceil((new Date(testDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        if (daysUntil <= 0 || daysUntil > 60) return null;
        return (
          <motion.div variants={sectionVariants}>
            <div
              className="flex items-center gap-4"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '16px',
                border: daysUntil <= 7
                  ? '1px solid rgba(255,159,10,0.3)'
                  : '1px solid var(--bg-border)',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  backgroundColor: daysUntil <= 7 ? 'var(--accent-orange-dim)' : 'var(--accent-purple-dim)',
                }}
              >
                <GraduationCap size={22} style={{ color: daysUntil <= 7 ? 'var(--accent-orange)' : 'var(--accent-purple)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, margin: 0, fontFamily: 'var(--font-ui)' }}>
                  {daysUntil} day{daysUntil !== 1 ? 's' : ''} until your test
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '2px 0 0', fontFamily: 'var(--font-ui)' }}>
                  {daysUntil <= 7 ? 'Focus on your weakest areas!' : 'Keep up the great work!'}
                </p>
              </div>
              {daysUntil <= 7 && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,159,10,0.15)',
                    color: 'var(--accent-orange)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Soon
                </span>
              )}
            </div>
          </motion.div>
        );
      })()}

      {/* Study Modes Section */}
      <motion.div variants={sectionVariants}>
        <h2
          style={{
            color: 'var(--text-primary)',
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'var(--font-ui)',
            marginBottom: '16px',
            letterSpacing: '-0.01em',
          }}
        >
          Study Modes
        </h2>
        <StudyModeCards />
      </motion.div>

      {/* Progress Overview */}
      <motion.div variants={sectionVariants}>
        <h2
          style={{
            color: 'var(--text-primary)',
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'var(--font-ui)',
            marginBottom: '16px',
            letterSpacing: '-0.01em',
          }}
        >
          Progress Overview
        </h2>
        <div
          className="flex flex-col items-center gap-6 sm:flex-row"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '16px',
            border: '1px solid var(--bg-border)',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Large Progress Ring */}
          <div className="flex flex-col items-center gap-2">
            <ProgressRing
              progress={masteredPercent}
              size={120}
              strokeWidth={10}
              color={masteredPercent >= 80 ? '#34c759' : '#4f8ef7'}
            >
              <div className="flex flex-col items-center">
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-ui)',
                    lineHeight: 1,
                  }}
                >
                  <AnimatedNumber
                    value={Math.round(masteredPercent)}
                    suffix="%"
                  />
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Mastered
                </span>
              </div>
            </ProgressRing>
          </div>

          {/* Stats Grid */}
          <div className="grid flex-1 grid-cols-2 gap-4">
            {/* Cards Studied */}
            <div
              className="flex flex-col"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--bg-border)',
              }}
            >
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                }}
              >
                Cards Studied
              </span>
              <span
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '28px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-ui)',
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber value={totalStudied} />
              </span>
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginTop: '4px',
                }}
              >
                of {totalCards} total
              </span>
            </div>

            {/* Overall Accuracy */}
            <div
              className="flex flex-col"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--bg-border)',
              }}
            >
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                }}
              >
                Accuracy
              </span>
              <span
                style={{
                  color:
                    accuracy >= 80
                      ? 'var(--accent-green)'
                      : accuracy >= 60
                        ? 'var(--accent-orange)'
                        : 'var(--text-primary)',
                  fontSize: '28px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-ui)',
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber value={accuracy} suffix="%" />
              </span>
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginTop: '4px',
                }}
              >
                overall
              </span>
            </div>

            {/* Mastered Count */}
            <div
              className="flex flex-col"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--bg-border)',
              }}
            >
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                }}
              >
                Mastered
              </span>
              <span
                style={{
                  color: 'var(--accent-green)',
                  fontSize: '28px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-ui)',
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber value={masteredCount} />
              </span>
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginTop: '4px',
                }}
              >
                cards
              </span>
            </div>

            {/* Sessions */}
            <div
              className="flex flex-col"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--bg-border)',
              }}
            >
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '6px',
                }}
              >
                Sessions
              </span>
              <span
                style={{
                  color: 'var(--accent-purple)',
                  fontSize: '28px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-ui)',
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber value={data.sessions.length} />
              </span>
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginTop: '4px',
                }}
              >
                completed
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weak Cards Widget */}
      <motion.div variants={sectionVariants}>
        <WeakCardsWidget />
      </motion.div>

      {/* Study Scheduler */}
      <motion.div variants={sectionVariants}>
        <h2
          style={{
            color: 'var(--text-primary)',
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'var(--font-ui)',
            marginBottom: '16px',
            letterSpacing: '-0.01em',
          }}
        >
          Study Planner
        </h2>
        <Suspense fallback={<div className="flex items-center justify-center" style={{ minHeight: '120px' }}><div className="animate-spin" style={{ width: 28, height: 28, border: '3px solid var(--bg-border-strong)', borderTopColor: '#4f8ef7', borderRadius: '50%' }} /></div>}>
          <StudyScheduler
            onStartSession={(mode) => {
              setStudyMode(mode);
              setActiveTab('study');
            }}
            testDate={data.profile.testDate}
          />
        </Suspense>
      </motion.div>

      {/* Next Review Info */}
      {dueTomorrow > 0 && (
        <motion.div variants={sectionVariants}>
          <div
            className="flex items-center gap-3"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '16px',
              border: '1px solid var(--bg-border)',
              padding: '16px 20px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                backgroundColor: 'var(--accent-purple-dim)',
              }}
            >
              <Calendar size={18} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'var(--font-ui)',
              }}
            >
              You have{' '}
              <span
                style={{
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                }}
              >
                {dueTomorrow} card{dueTomorrow !== 1 ? 's' : ''}
              </span>{' '}
              due tomorrow
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
