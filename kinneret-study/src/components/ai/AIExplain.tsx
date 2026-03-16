import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { getAIExplanation } from '../../lib/ai';

interface AIExplainProps {
  cardId: string;
  term: string;
  definition: string;
  extendedNotes?: string;
}

export default function AIExplain({
  cardId,
  term,
  definition,
  extendedNotes = '',
}: AIExplainProps) {
  const { data } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cachedExplanation = data.aiCache?.[cardId];

  const handleClick = useCallback(async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    // Check cache first
    if (cachedExplanation) {
      setExplanation(cachedExplanation);
      return;
    }

    // If we already fetched this session
    if (explanation) return;

    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      let result: string;

      if (!apiKey) {
        // Generate a local explanation when no API key
        result = buildLocalExplanation(term, definition, extendedNotes);
      } else {
        result = await getAIExplanation(cardId, term, definition, extendedNotes);

        // Cache the result in the store
        useAppStore.setState((state) => ({
          data: {
            ...state.data,
            aiCache: {
              ...(state.data as unknown as { aiCache: Record<string, string> }).aiCache,
              [cardId]: result,
            },
          },
        }));
      }

      setExplanation(result);
    } catch {
      setExplanation(
        'Unable to generate explanation right now. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  }, [isOpen, cachedExplanation, explanation, cardId, term, definition, extendedNotes]);

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 transition-all duration-200"
        style={{
          padding: '6px 12px',
          borderRadius: '20px',
          backgroundColor: isOpen
            ? 'rgba(191,90,242,0.2)'
            : 'rgba(191,90,242,0.1)',
          color: 'var(--accent-purple)',
          border: '1px solid rgba(191,90,242,0.2)',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
          fontFamily: 'var(--font-ui)',
        }}
        aria-expanded={isOpen}
        aria-label="AI Explanation"
      >
        <Sparkles size={13} />
        <span>{isOpen ? 'Hide' : 'Explain'}</span>
      </button>

      {/* Explanation panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '14px',
                border: '1px solid rgba(191,90,242,0.2)',
                padding: '16px',
                boxShadow: '0 4px 24px rgba(191,90,242,0.08)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={14}
                    style={{ color: 'var(--accent-purple)' }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: 'var(--accent-purple)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    AI EXPLANATION
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-border)',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                  }}
                  aria-label="Close explanation"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Content */}
              {loading ? (
                <div className="flex flex-col gap-2">
                  {[100, 85, 70].map((width, i) => (
                    <div
                      key={i}
                      className="skeleton-pulse"
                      style={{
                        height: '14px',
                        width: `${width}%`,
                        borderRadius: '6px',
                        backgroundColor: 'rgba(191,90,242,0.1)',
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {explanation}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Build a local explanation when no API key is available */
function buildLocalExplanation(
  term: string,
  definition: string,
  extendedNotes: string
): string {
  let text = `${term}: ${definition}`;

  if (extendedNotes) {
    text += `\n\n${extendedNotes}`;
  }

  text +=
    '\n\nFor a deeper AI-powered explanation with mnemonics and study tips, set your VITE_ANTHROPIC_API_KEY environment variable.';

  return text;
}
