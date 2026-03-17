import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { CARDS } from '../../data/cards';
import type { CardState } from '../../lib/sm2';

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

function getEaseColor(easeFactor: number): string {
  if (easeFactor < 1.8) return '#ff453a';
  if (easeFactor < 2.2) return '#ff9f0a';
  return '#34c759';
}

function getEaseLabel(easeFactor: number): string {
  if (easeFactor < 1.8) return 'Struggling';
  if (easeFactor < 2.2) return 'Needs work';
  return 'Getting there';
}

export default function WeakCardsWidget() {
  const { data, setActiveTab, setStudyMode } = useAppStore();

  const weakCards = useMemo(() => {
    const studiedStates: (CardState & { cardId: string })[] = [];

    for (const [id, state] of Object.entries(data.cardStates)) {
      const cs = state as CardState;
      // Exclude new cards (never studied)
      if (cs.difficulty !== 'new' && cs.totalReviews > 0) {
        studiedStates.push({ ...cs, cardId: id });
      }
    }

    // Sort by ease factor (lowest first)
    studiedStates.sort((a, b) => a.easeFactor - b.easeFactor);

    // Take top 3 weakest
    return studiedStates.slice(0, 3).map((state) => {
      const card = CARDS.find((c) => c.id === state.cardId);
      return {
        id: state.cardId,
        term: card?.term ?? state.cardId,
        easeFactor: state.easeFactor,
      };
    });
  }, [data.cardStates]);

  const handleReview = () => {
    setStudyMode('flashcard');
    setActiveTab('study');
  };

  const hasStudied = weakCards.length > 0;

  // Hide entirely when there's no data
  if (!hasStudied) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderRadius: '16px',
        border: '1px solid var(--bg-border)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2" style={{ marginBottom: '20px' }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            backgroundColor: 'var(--accent-red-dim)',
          }}
        >
          <AlertTriangle size={16} style={{ color: 'var(--accent-red)' }} />
        </div>
        <h3
          style={{
            color: 'var(--text-primary)',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'var(--font-ui)',
          }}
        >
          Focus Areas
        </h3>
      </div>

      {hasStudied && (
        <div className="flex flex-col gap-3">
          {weakCards.map((card) => {
            const easeColor = getEaseColor(card.easeFactor);
            const easeLabel = getEaseLabel(card.easeFactor);
            // Normalize ease to 0-100 scale: 1.3 (min) to 2.5 (default max)
            const easePercent = Math.min(
              100,
              Math.max(0, ((card.easeFactor - 1.3) / (2.5 - 1.3)) * 100)
            );

            return (
              <motion.div
                key={card.id}
                variants={itemVariants}
                className="flex items-center gap-4"
                style={{
                  backgroundColor: 'var(--bg-overlay)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid var(--bg-border)',
                }}
              >
                {/* Info */}
                <div className="flex flex-1 flex-col gap-1.5">
                  <span
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-ui)',
                    }}
                  >
                    {card.term}
                  </span>

                  {/* Ease factor bar */}
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        flex: 1,
                        height: '4px',
                        borderRadius: '2px',
                        backgroundColor: 'var(--bg-border-strong)',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${easePercent}%` }}
                        transition={{
                          duration: 0.8,
                          ease: [0.25, 0.46, 0.45, 0.94],
                          delay: 0.2,
                        }}
                        style={{
                          height: '100%',
                          borderRadius: '2px',
                          backgroundColor: easeColor,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: easeColor,
                        fontSize: '11px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {easeLabel}
                    </span>
                  </div>
                </div>

                {/* Review link */}
                <motion.button
                  whileHover={{ color: '#6ba0ff' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReview}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-blue)',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-ui)',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Review
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
