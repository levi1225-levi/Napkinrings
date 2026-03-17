import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useAppStore } from '../../store/appStore';
import { cards } from '../../data/cards';
import { createInitialCardState, type CardState } from '../../lib/sm2';
import Badge from '../ui/Badge';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type SortKey =
  | 'term'
  | 'status'
  | 'easeFactor'
  | 'interval'
  | 'reviews'
  | 'accuracy'
  | 'nextReview';

type SortDir = 'asc' | 'desc';

interface RowData {
  id: string;
  term: string;
  hebrew?: string;
  definition: string;
  mnemonic: string;
  category: string;
  status: CardState['difficulty'];
  easeFactor: number;
  interval: number;
  reviews: number;
  accuracy: number;
  nextReview: string;
  responseTimeSamples: number[];
  correctReviews: number;
  incorrectReviews: number;
  totalReviews: number;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const STATUS_ORDER: Record<string, number> = {
  new: 0,
  learning: 1,
  review: 2,
  mastered: 3,
};

function easeColor(ef: number): string {
  if (ef < 1.8) return '#ff453a';
  if (ef < 2.2) return '#ff9f0a';
  return '#34c759';
}

function accuracyColor(pct: number): string {
  if (pct < 50) return '#ff453a';
  if (pct < 75) return '#ff9f0a';
  return '#34c759';
}

/* -------------------------------------------------------------------------- */
/*  Columns definition                                                         */
/* -------------------------------------------------------------------------- */

const COLUMNS: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
  { key: 'term', label: 'Term', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'easeFactor', label: 'Ease', align: 'right' },
  { key: 'interval', label: 'Interval', align: 'right' },
  { key: 'reviews', label: 'Reviews', align: 'right' },
  { key: 'accuracy', label: 'Accuracy', align: 'right' },
  { key: 'nextReview', label: 'Next Review', align: 'right' },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function CardStatsTable() {
  const { data } = useAppStore();
  const [sortKey, setSortKey] = useState<SortKey>('term');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* --- Build row data --- */
  const rows = useMemo<RowData[]>(() => {
    return cards.map((card: { id: string; term: string; hebrew?: string; definition: string; mnemonicHint: string; category: string }) => {
      const cs: CardState =
        data.cardStates[card.id] ?? createInitialCardState(card.id);
      const total = cs.correctReviews + cs.incorrectReviews;
      const accuracy = total > 0 ? (cs.correctReviews / total) * 100 : 0;

      return {
        id: card.id,
        term: card.term,
        hebrew: card.hebrew ?? '',
        definition: card.definition,
        mnemonic: card.mnemonicHint ?? '',
        category: card.category,
        status: cs.difficulty,
        easeFactor: cs.easeFactor,
        interval: cs.interval,
        reviews: cs.totalReviews,
        accuracy,
        nextReview: cs.nextReviewDate,
        responseTimeSamples: cs.responseTimeSamples ?? [],
        correctReviews: cs.correctReviews,
        incorrectReviews: cs.incorrectReviews,
        totalReviews: cs.totalReviews,
      };
    });
  }, [data.cardStates]);

  /* --- Sort --- */
  const sorted = useMemo(() => {
    const copy = [...rows];
    const dir = sortDir === 'asc' ? 1 : -1;

    copy.sort((a, b) => {
      switch (sortKey) {
        case 'term':
          return dir * a.term.localeCompare(b.term);
        case 'status':
          return dir * ((STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0));
        case 'easeFactor':
          return dir * (a.easeFactor - b.easeFactor);
        case 'interval':
          return dir * (a.interval - b.interval);
        case 'reviews':
          return dir * (a.reviews - b.reviews);
        case 'accuracy':
          return dir * (a.accuracy - b.accuracy);
        case 'nextReview':
          return (
            dir *
            (new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
          );
        default:
          return 0;
      }
    });

    return copy;
  }, [rows, sortKey, sortDir]);

  /* --- Toggle sort --- */
  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('asc');
      }
    },
    [sortKey],
  );

  /* --- Toggle expand --- */
  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div
      className="w-full overflow-x-auto"
      style={{
        background: 'var(--bg-elevated)',
        borderRadius: '16px',
        border: '1px solid var(--bg-border)',
      }}
    >
      <table className="w-full min-w-[780px] border-collapse">
        {/* Header */}
        <thead>
          <tr>
            {/* Expand chevron col */}
            <th className="w-8" />
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="cursor-pointer select-none px-4 py-3 text-xs font-semibold tracking-wide"
                style={{
                  color: 'var(--text-tertiary)',
                  textAlign: col.align,
                  borderBottom: '1px solid var(--bg-border-strong)',
                }}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key &&
                    (sortDir === 'asc' ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {sorted.map((row, idx) => (
            <RowGroup
              key={row.id}
              row={row}
              idx={idx}
              expanded={expandedId === row.id}
              onToggle={toggleExpand}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Row                                                                        */
/* -------------------------------------------------------------------------- */

function RowGroup({
  row,
  idx,
  expanded,
  onToggle,
}: {
  row: RowData;
  idx: number;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const bgBase = idx % 2 === 0 ? 'transparent' : 'var(--bg-overlay)';

  return (
    <>
      {/* Main row */}
      <tr
        onClick={() => onToggle(row.id)}
        className="cursor-pointer transition-colors hover:bg-white/[0.03]"
        style={{ background: bgBase }}
      >
        {/* Chevron */}
        <td className="pl-3 pr-0 py-2.5">
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronRight size={14} color="#8888a0" />
          </motion.div>
        </td>

        {/* Term */}
        <td
          className="px-4 py-2.5 text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {row.term}
        </td>

        {/* Status */}
        <td className="px-4 py-2.5">
          <Badge variant={row.status}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Badge>
        </td>

        {/* Ease Factor */}
        <td
          className="px-4 py-2.5 text-sm text-right tabular-nums"
          style={{ color: easeColor(row.easeFactor) }}
        >
          {row.easeFactor.toFixed(2)}
        </td>

        {/* Interval */}
        <td
          className="px-4 py-2.5 text-sm text-right tabular-nums"
          style={{ color: 'var(--text-secondary)' }}
        >
          {row.interval}d
        </td>

        {/* Reviews */}
        <td
          className="px-4 py-2.5 text-sm text-right tabular-nums"
          style={{ color: 'var(--text-secondary)' }}
        >
          {row.reviews}
        </td>

        {/* Accuracy */}
        <td
          className="px-4 py-2.5 text-sm text-right tabular-nums"
          style={{ color: row.reviews > 0 ? accuracyColor(row.accuracy) : '#8888a0' }}
        >
          {row.reviews > 0 ? `${row.accuracy.toFixed(1)}%` : '\u2014'}
        </td>

        {/* Next Review */}
        <td
          className="px-4 py-2.5 text-sm text-right tabular-nums"
          style={{ color: 'var(--text-secondary)' }}
        >
          {row.nextReview
            ? format(new Date(row.nextReview), 'MMM d')
            : '\u2014'}
        </td>
      </tr>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={8} style={{ padding: 0 }}>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="px-6 py-5 grid gap-4"
                  style={{
                    background: 'var(--bg-overlay)',
                    borderTop: '1px solid var(--bg-border)',
                    borderBottom: '1px solid var(--bg-border)',
                  }}
                >
                  {/* Top row: Hebrew + definition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span
                        className="block text-2xl mb-1"
                        style={{
                          color: 'var(--text-primary)',
                          fontFamily: "'Noto Sans Hebrew', sans-serif",
                          direction: 'rtl',
                        }}
                      >
                        {row.hebrew}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {row.definition}
                      </span>
                    </div>

                    {row.mnemonic && (
                      <div>
                        <span
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          Mnemonic
                        </span>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {row.mnemonic}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-6">
                    <MiniStat
                      label="Correct"
                      value={row.correctReviews.toString()}
                      color="#34c759"
                    />
                    <MiniStat
                      label="Incorrect"
                      value={row.incorrectReviews.toString()}
                      color="#ff453a"
                    />
                    <MiniStat
                      label="Total Reviews"
                      value={row.totalReviews.toString()}
                      color="#4f8ef7"
                    />
                    <MiniStat
                      label="Category"
                      value={row.category}
                      color="#bf5af2"
                    />
                  </div>

                  {/* Response time history */}
                  {row.responseTimeSamples.length > 0 && (
                    <div>
                      <span
                        className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        Response Times (last {row.responseTimeSamples.length})
                      </span>
                      <div className="flex items-end gap-[3px] mt-2 h-10">
                        {row.responseTimeSamples.map((t, i) => {
                          const maxT = Math.max(...row.responseTimeSamples, 1);
                          const pct = Math.max(4, (t / maxT) * 100);
                          return (
                            <div
                              key={i}
                              title={`${(t / 1000).toFixed(1)}s`}
                              style={{
                                width: 6,
                                height: `${pct}%`,
                                background:
                                  t / 1000 < 3
                                    ? '#34c759'
                                    : t / 1000 < 6
                                      ? '#ff9f0a'
                                      : '#ff453a',
                                borderRadius: 2,
                                minHeight: 2,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mini stat badge for expanded row                                           */
/* -------------------------------------------------------------------------- */

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col">
      <span
        className="text-xs uppercase tracking-wide"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {label}
      </span>
      <span className="text-sm font-semibold mt-0.5" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
