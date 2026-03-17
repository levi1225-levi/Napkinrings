import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { CARDS, CATEGORY_COLORS } from '../../data/cards';
import type { Card } from '../../data/cards';
import { useAppStore } from '../../store/appStore';
import type { CardState } from '../../lib/sm2';

const difficultyLabels: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: '#4f8ef7' },
  learning: { label: 'Learning', color: '#ff9f0a' },
  review: { label: 'Review', color: '#bf5af2' },
  mastered: { label: 'Mastered', color: '#34c759' },
};

const categories = [...new Set(CARDS.map((c) => c.category))].sort();

export default function CardBrowser() {
  const { data } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let results = CARDS;

    // Category filter
    if (selectedCategory) {
      results = results.filter((c) => c.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty) {
      results = results.filter((c) => {
        const cs = data.cardStates[c.id] as CardState | undefined;
        const diff = cs?.difficulty ?? 'new';
        return diff === selectedDifficulty;
      });
    }

    // Search query
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(
        (c) =>
          c.term.toLowerCase().includes(q) ||
          c.definition.toLowerCase().includes(q) ||
          (c.hebrew && c.hebrew.includes(q)) ||
          c.transliteration.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      );
    }

    return results;
  }, [query, selectedCategory, selectedDifficulty, data.cardStates]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setQuery('');
  };

  const hasActiveFilters = selectedCategory || selectedDifficulty || query.trim();

  return (
    <div className="flex flex-col gap-4" style={{ fontFamily: 'var(--font-ui)' }}>
      {/* Search bar */}
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-2"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '12px',
            border: '1px solid var(--bg-border)',
            padding: '0 14px',
          }}
        >
          <Search size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search cards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'var(--font-ui)',
              padding: '12px 0',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                padding: '4px',
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            backgroundColor: showFilters ? 'rgba(79,142,247,0.15)' : 'var(--bg-elevated)',
            border: showFilters
              ? '1px solid rgba(79,142,247,0.3)'
              : '1px solid var(--bg-border)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: showFilters ? '#4f8ef7' : 'var(--text-secondary)',
            flexShrink: 0,
          }}
        >
          <Filter size={18} />
        </motion.button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="flex flex-col gap-3"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '14px',
                border: '1px solid var(--bg-border)',
                padding: '16px',
              }}
            >
              {/* Category filter */}
              <div>
                <p
                  style={{
                    color: 'var(--text-tertiary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}
                >
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    const color = CATEGORY_COLORS[cat] ?? '#4f8ef7';
                    return (
                      <button
                        key={cat}
                        onClick={() =>
                          setSelectedCategory(isActive ? null : cat)
                        }
                        style={{
                          padding: '5px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 500,
                          fontFamily: 'var(--font-ui)',
                          backgroundColor: isActive ? `${color}20` : 'var(--bg-overlay)',
                          color: isActive ? color : 'var(--text-secondary)',
                          border: isActive
                            ? `1px solid ${color}40`
                            : '1px solid var(--bg-border)',
                          cursor: 'pointer',
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty filter */}
              <div>
                <p
                  style={{
                    color: 'var(--text-tertiary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}
                >
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(difficultyLabels).map(([key, { label, color }]) => {
                    const isActive = selectedDifficulty === key;
                    return (
                      <button
                        key={key}
                        onClick={() =>
                          setSelectedDifficulty(isActive ? null : key)
                        }
                        style={{
                          padding: '5px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 500,
                          fontFamily: 'var(--font-ui)',
                          backgroundColor: isActive ? `${color}20` : 'var(--bg-overlay)',
                          color: isActive ? color : 'var(--text-secondary)',
                          border: isActive
                            ? `1px solid ${color}40`
                            : '1px solid var(--bg-border)',
                          cursor: 'pointer',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-ui)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-red)',
                    cursor: 'pointer',
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
        {filtered.length} of {CARDS.length} cards
        {hasActiveFilters && ' (filtered)'}
      </p>

      {/* Card list */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div
            className="text-center py-12"
            style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}
          >
            No cards match your search
          </div>
        ) : (
          filtered.map((card) => (
            <CardRow
              key={card.id}
              card={card}
              cardState={data.cardStates[card.id] as CardState | undefined}
              expanded={expandedCard === card.id}
              onToggle={() =>
                setExpandedCard(expandedCard === card.id ? null : card.id)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

function CardRow({
  card,
  cardState,
  expanded,
  onToggle,
}: {
  card: Card;
  cardState: CardState | undefined;
  expanded: boolean;
  onToggle: () => void;
}) {
  const diff = cardState?.difficulty ?? 'new';
  const { label, color } = difficultyLabels[diff] ?? difficultyLabels.new;
  const catColor = CATEGORY_COLORS[card.category] ?? '#4f8ef7';

  return (
    <motion.div
      layout
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderRadius: '14px',
        border: '1px solid var(--bg-border)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggle}
        className="flex items-center gap-3 w-full text-left"
        style={{
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
        }}
      >
        {/* Hebrew */}
        {card.hebrew && (
          <span
            lang="he"
            style={{
              fontFamily: '"Frank Ruhl Libre", serif',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--accent-gold)',
              minWidth: '60px',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            {card.hebrew}
          </span>
        )}

        {/* Term + category */}
        <div className="flex-1 min-w-0">
          <p
            className="truncate"
            style={{
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {card.term}
          </p>
          <p
            style={{
              color: catColor,
              fontSize: '11px',
              fontWeight: 500,
              margin: '2px 0 0',
            }}
          >
            {card.category}
          </p>
        </div>

        {/* Status badge */}
        <span
          style={{
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 600,
            backgroundColor: `${color}15`,
            color,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>

        {/* Chevron */}
        <span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              style={{
                padding: '0 16px 16px',
                borderTop: '1px solid var(--bg-border)',
              }}
            >
              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  margin: '14px 0 0',
                }}
              >
                {card.definition}
              </p>

              {card.extendedNotes && (
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    margin: '10px 0 0',
                    paddingLeft: '12px',
                    borderLeft: '2px solid var(--bg-border)',
                  }}
                >
                  {card.extendedNotes}
                </p>
              )}

              {card.mnemonicHint && (
                <div
                  className="flex items-start gap-2 mt-3 p-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,214,10,0.06)' }}
                >
                  <span style={{ fontSize: '14px' }}>💡</span>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      fontStyle: 'italic',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {card.mnemonicHint}
                  </p>
                </div>
              )}

              {/* Stats if studied */}
              {cardState && cardState.totalReviews > 0 && (
                <div
                  className="flex gap-4 mt-3 pt-3"
                  style={{ borderTop: '1px solid var(--bg-border)' }}
                >
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                    Reviews: {cardState.totalReviews}
                  </span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                    Streak: {cardState.streak}
                  </span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                    Ease: {cardState.easeFactor.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
