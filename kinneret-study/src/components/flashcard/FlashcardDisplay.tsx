import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lightbulb, ChevronDown, ChevronUp, Link2 } from 'lucide-react';
import type { Card } from '../../data/cards';
import { CATEGORY_COLORS, getCardById } from '../../data/cards';
import type { CardState } from '../../lib/sm2';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface FlashcardDisplayProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
  cardState: CardState;
  showTimer: boolean;
  elapsedTime: number; // milliseconds
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${s}s`;
};

const difficultyBadge: Record<CardState['difficulty'], { label: string; color: string }> = {
  new: { label: 'New', color: '#4f8ef7' },
  learning: { label: 'Learning', color: '#ff9f0a' },
  review: { label: 'Review', color: '#bf5af2' },
  mastered: { label: 'Mastered', color: '#34c759' },
};

/* ------------------------------------------------------------------ */
/*  Spring config for the 3-D flip                                    */
/* ------------------------------------------------------------------ */
const flipSpring = { type: 'spring' as const, stiffness: 260, damping: 28, mass: 0.9 };

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function FlashcardDisplay({
  card,
  isFlipped,
  onFlip,
  cardState,
  showTimer,
  elapsedTime,
}: FlashcardDisplayProps) {
  const [notesOpen, setNotesOpen] = useState(false);

  const toggleNotes = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setNotesOpen((prev) => !prev);
  }, []);

  const catColor = CATEGORY_COLORS[card.category] ?? '#4f8ef7';
  const diff = difficultyBadge[cardState.difficulty];

  return (
    <div
      className="w-full max-w-[400px] mx-auto select-none"
      style={{ perspective: '1200px', minHeight: 400 }}
      role="region"
      aria-label="Flashcard"
    >
      {/* ── Flip wrapper ────────────────────────────────────────── */}
      <motion.div
        className="relative w-full cursor-pointer"
        style={{ minHeight: 400, transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={flipSpring}
        onClick={!isFlipped ? onFlip : undefined}
        aria-live="polite"
      >
        {/* ── FRONT FACE ────────────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center gap-1"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Category chip */}
          <span
            className="absolute top-4 right-4 px-3 py-1 rounded-lg text-[11px] font-semibold tracking-wide uppercase"
            style={{ background: catColor + '18', color: catColor }}
          >
            {card.category}
          </span>

          {/* Timer */}
          {showTimer && (
            <span
              className="absolute top-4 left-4 flex items-center gap-1.5 text-[11px] tabular-nums"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <Clock size={12} strokeWidth={2.2} />
              {formatTime(elapsedTime)}
            </span>
          )}

          {/* Difficulty badge */}
          <span
            className="absolute bottom-4 right-4 text-[10px] font-medium px-2 py-0.5 rounded-md"
            style={{ background: diff.color + '14', color: diff.color }}
          >
            {diff.label}
          </span>

          {/* Hebrew */}
          {card.hebrew && (
            <span
              lang="he"
              dir="rtl"
              className="text-[3rem] leading-tight font-bold mb-3"
              style={{
                fontFamily: '"Frank Ruhl Libre", serif',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textShadow: '0 0 40px rgba(79,142,247,0.12)',
              }}
            >
              {card.hebrew}
            </span>
          )}

          {/* Transliteration */}
          <span
            className="text-sm tracking-wide mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {card.transliteration}
          </span>

          {/* Term */}
          <span
            className="text-xl font-semibold text-center leading-snug px-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {card.term}
          </span>

          {/* Tap hint */}
          <motion.span
            className="absolute bottom-5 left-0 right-0 text-center text-[11px] tracking-wide"
            style={{ color: 'var(--text-tertiary)' }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Tap to reveal
          </motion.span>
        </div>

        {/* ── BACK FACE ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Term header */}
          <h3
            className="text-sm font-semibold uppercase tracking-wide mb-4"
            style={{ color: catColor }}
          >
            {card.term}
          </h3>

          {/* Definition */}
          <p
            className="text-[15px] leading-relaxed mb-5 flex-shrink-0"
            style={{ color: 'var(--text-primary)', lineHeight: 1.7 }}
          >
            {card.definition}
          </p>

          {/* Extended notes (collapsible) */}
          {card.extendedNotes && (
            <div className="mb-4">
              <button
                onClick={toggleNotes}
                className="flex items-center gap-1.5 text-[13px] font-medium mb-2 group"
                style={{
                  color: 'var(--text-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-expanded={notesOpen}
                aria-controls="extended-notes"
              >
                {notesOpen ? (
                  <ChevronUp size={14} strokeWidth={2.4} />
                ) : (
                  <ChevronDown size={14} strokeWidth={2.4} />
                )}
                <span className="group-hover:underline">Extended Notes</span>
              </button>

              <AnimatePresence initial={false}>
                {notesOpen && (
                  <motion.div
                    id="extended-notes"
                    key="notes"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <p
                      className="text-[13px] leading-relaxed pl-4 border-l-2 py-1"
                      style={{
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--bg-border)',
                      }}
                    >
                      {card.extendedNotes}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mnemonic hint */}
          {card.mnemonicHint && (
            <div
              className="flex items-start gap-2.5 p-3.5 rounded-xl mb-4"
              style={{ background: 'rgba(255,214,10,0.06)' }}
            >
              <Lightbulb
                size={16}
                strokeWidth={2.2}
                style={{ color: '#ffd60a', flexShrink: 0, marginTop: 2 }}
              />
              <p
                className="text-[13px] italic leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {card.mnemonicHint}
              </p>
            </div>
          )}

          {/* Related cards — clickable navigation chips */}
          {card.relatedCards && card.relatedCards.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 mt-auto pt-4">
              <Link2
                size={12}
                strokeWidth={2.4}
                style={{ color: 'var(--text-tertiary)', marginRight: 2 }}
              />
              {card.relatedCards.slice(0, 5).map((rcId) => {
                const rc = getCardById(rcId);
                return (
                  <button
                    key={rcId}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Dispatch custom event to navigate to this card
                      window.dispatchEvent(new CustomEvent('kinneret-navigate-card', { detail: rcId }));
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md truncate max-w-[120px] transition-colors"
                    style={{
                      background: 'var(--bg-overlay)',
                      color: 'var(--accent-blue)',
                      border: '1px solid rgba(79,142,247,0.2)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-ui)',
                    }}
                    title={rc?.term ?? rcId}
                    aria-label={`Go to related card: ${rc?.term ?? rcId}`}
                  >
                    {rc?.term ?? rcId}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default FlashcardDisplay;
