import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lightbulb, ChevronDown, ChevronUp, Link2, Volume2 } from 'lucide-react';
import { useAudioPronunciation } from '../../hooks/useAudioPronunciation';
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
  const { speak, isSpeaking } = useAudioPronunciation();

  const toggleNotes = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setNotesOpen((prev) => !prev);
  }, []);

  const catColor = CATEGORY_COLORS[card.category] ?? '#4f8ef7';
  const diff = difficultyBadge[cardState.difficulty];

  return (
    <div
      className="w-full max-w-[440px] mx-auto select-none"
      style={{ perspective: '1200px', minHeight: 360 }}
      role="region"
      aria-label="Flashcard"
    >
      {/* ── Flip wrapper ────────────────────────────────────────── */}
      <motion.div
        className="relative w-full cursor-pointer"
        style={{ minHeight: 360, transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={flipSpring}
        onClick={!isFlipped ? onFlip : undefined}
        aria-live="polite"
      >
        {/* ── FRONT FACE ────────────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            boxShadow: 'var(--shadow-lg)',
            padding: '24px 28px 40px',
          }}
        >
          {/* Top bar: Timer + Category */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
            {showTimer ? (
              <span
                className="flex items-center gap-1.5 text-[11px] tabular-nums"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <Clock size={12} strokeWidth={2.2} />
                {formatTime(elapsedTime)}
              </span>
            ) : (
              <span />
            )}
            <span
              className="px-3 py-1 rounded-lg text-[11px] font-semibold tracking-wide uppercase"
              style={{ background: catColor + '18', color: catColor }}
            >
              {card.category}
            </span>
          </div>

          {/* Difficulty badge */}
          <span
            className="absolute bottom-4 right-4 text-[10px] font-medium px-2 py-0.5 rounded-md"
            style={{ background: diff.color + '14', color: diff.color }}
          >
            {diff.label}
          </span>

          {/* Subcategory */}
          {card.subcategory && (
            <span
              className="text-[12px] font-medium tracking-wide mb-2 uppercase"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {card.subcategory}
            </span>
          )}

          {/* Term — the question */}
          <span
            className="text-[18px] font-semibold text-center leading-relaxed px-4"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              maxWidth: '100%',
              lineHeight: 1.5,
            }}
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
            Tap to reveal answer
          </motion.span>
        </div>

        {/* ── BACK FACE ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            boxShadow: 'var(--shadow-lg)',
            padding: '20px 24px',
          }}
        >
          {/* Term header with read-aloud button */}
          <div className="flex items-start gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: catColor }}
              >
                {card.category}
              </span>
              <h3
                className="text-[15px] font-semibold mt-0.5"
                style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}
              >
                {card.term}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(card.definition, 'en-US');
              }}
              aria-label="Read answer aloud"
              style={{
                background: 'rgba(79,142,247,0.12)',
                border: 'none',
                borderRadius: '50%',
                width: 34,
                height: 34,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <Volume2
                size={16}
                strokeWidth={2.2}
                style={{ color: isSpeaking ? '#34c759' : '#4f8ef7' }}
              />
            </button>
          </div>

          {/* Answer/Definition */}
          <div
            className="rounded-xl p-4 mb-4"
            style={{
              background: `${catColor}08`,
              border: `1px solid ${catColor}20`,
            }}
          >
            <p
              className="text-[15px] leading-relaxed"
              style={{ color: 'var(--text-primary)', lineHeight: 1.7 }}
            >
              {card.definition}
            </p>
          </div>

          {/* Extended notes (collapsible) */}
          {card.extendedNotes && (
            <div className="mb-3">
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
                <span className="group-hover:underline">More Details</span>
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
                        borderColor: catColor + '40',
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
              className="flex items-start gap-2.5 p-3 rounded-xl mb-3"
              style={{ background: 'rgba(255,214,10,0.06)' }}
            >
              <Lightbulb
                size={15}
                strokeWidth={2.2}
                style={{ color: '#ffd60a', flexShrink: 0, marginTop: 2 }}
              />
              <p
                className="text-[12px] italic leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {card.mnemonicHint}
              </p>
            </div>
          )}

          {/* Related cards — clickable navigation chips */}
          {card.relatedCards && card.relatedCards.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 mt-auto pt-3">
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
                      window.dispatchEvent(new CustomEvent('kinneret-navigate-card', { detail: rcId }));
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md truncate max-w-[140px] transition-colors"
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
