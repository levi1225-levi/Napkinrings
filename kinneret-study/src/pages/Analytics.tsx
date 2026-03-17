import React, { Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { useAppStore } from '../store/appStore';
import { cards } from '../data/cards';
import { createInitialCardState, type CardState } from '../lib/sm2';

/* -------------------------------------------------------------------------- */
/*  Lazy-loaded heavy components                                               */
/* -------------------------------------------------------------------------- */

const StatsOverview = React.lazy(
  () => import('../components/analytics/StatsOverview'),
);
const ActivityHeatmap = React.lazy(
  () => import('../components/analytics/ActivityHeatmap'),
);
const CardStatsTable = React.lazy(
  () => import('../components/analytics/CardStatsTable'),
);
const AIInsights = React.lazy(
  () => import('../components/analytics/AIInsights'),
);

/* -------------------------------------------------------------------------- */
/*  Design tokens                                                              */
/* -------------------------------------------------------------------------- */

const COLORS = {
  bgBase: 'var(--bg-base)',
  bgElevated: 'var(--bg-elevated)',
  bgOverlay: 'var(--bg-overlay)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textTertiary: 'var(--text-tertiary)',
  accentBlue: '#4f8ef7',
  accentGreen: '#34c759',
  accentRed: '#ff453a',
  accentOrange: '#ff9f0a',
  accentGold: '#ffd60a',
  accentPurple: '#bf5af2',
  grid: 'var(--bg-border)',
};

const STATUS_COLORS: Record<string, string> = {
  New: COLORS.accentBlue,
  Learning: COLORS.accentOrange,
  Review: COLORS.accentPurple,
  Mastered: COLORS.accentGreen,
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function countCards(cs: number | string[] | undefined): number {
  if (Array.isArray(cs)) return cs.length;
  if (typeof cs === 'number') return cs;
  return 0;
}

/** Custom Recharts tooltip */
function CustomTooltip({
  active,
  payload,
  label,
}: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: COLORS.bgOverlay,
        border: '1px solid var(--bg-border-strong)',
        borderRadius: 10,
        padding: '10px 14px',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <p className="text-xs mb-1" style={{ color: COLORS.textTertiary }}>
        {label}
      </p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(entry.name === 'Accuracy' || entry.name === 'accuracy' ? 1 : 0) : entry.value}
        </p>
      ))}
    </div>
  );
}

/** Section loading fallback */
function SectionSkeleton({ h = 200 }: { h?: number }) {
  return (
    <div
      className="animate-pulse"
      style={{
        background: COLORS.bgElevated,
        borderRadius: 16,
        height: h,
        border: '1px solid var(--bg-border)',
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Chart card wrapper                                                         */
/* -------------------------------------------------------------------------- */

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: COLORS.bgElevated,
        borderRadius: 16,
        border: '1px solid var(--bg-border)',
        padding: '20px 20px 12px',
      }}
    >
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: COLORS.textPrimary }}
      >
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stagger animation variants                                                 */
/* -------------------------------------------------------------------------- */

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

/* -------------------------------------------------------------------------- */
/*  Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function Analytics() {
  const { data } = useAppStore();

  /* ----------------------------------------------------------------------- */
  /*  1. Line chart: cards studied per day (last 30 days)                     */
  /* ----------------------------------------------------------------------- */
  const lineData = useMemo(() => {
    const today = startOfDay(new Date());
    const sessions = data.sessions ?? [];

    // Build date -> count map
    const map = new Map<string, number>();
    for (const s of sessions) {
      const key = format(startOfDay(new Date(s.startTime)), 'yyyy-MM-dd');
      map.set(key, (map.get(key) ?? 0) + countCards((s as any).cardsStudied));
    }

    const result: { date: string; cards: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = subDays(today, i);
      const key = format(d, 'yyyy-MM-dd');
      result.push({ date: format(d, 'MMM d'), cards: map.get(key) ?? 0 });
    }
    return result;
  }, [data.sessions]);

  /* ----------------------------------------------------------------------- */
  /*  2. Bar chart: accuracy by category                                      */
  /* ----------------------------------------------------------------------- */
  const categoryAccuracyData = useMemo(() => {
    const cardStates = data.cardStates ?? {};
    const catMap = new Map<
      string,
      { correct: number; incorrect: number }
    >();

    for (const card of cards) {
      const cs: CardState =
        cardStates[card.id] ?? createInitialCardState(card.id);
      const cat = card.category;
      if (!catMap.has(cat)) catMap.set(cat, { correct: 0, incorrect: 0 });
      const entry = catMap.get(cat)!;
      entry.correct += cs.correctReviews;
      entry.incorrect += cs.incorrectReviews;
    }

    return Array.from(catMap.entries())
      .map(([category, { correct, incorrect }]) => {
        const total = correct + incorrect;
        return {
          category: category.length > 16 ? category.slice(0, 14) + '\u2026' : category,
          fullCategory: category,
          accuracy: total > 0 ? (correct / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.accuracy - a.accuracy);
  }, [data.cardStates]);

  /* ----------------------------------------------------------------------- */
  /*  3. Donut chart: card status distribution                                */
  /* ----------------------------------------------------------------------- */
  const statusData = useMemo(() => {
    const cardStates = data.cardStates ?? {};
    const counts: Record<string, number> = {
      New: 0,
      Learning: 0,
      Review: 0,
      Mastered: 0,
    };

    for (const card of cards) {
      const cs: CardState =
        cardStates[card.id] ?? createInitialCardState(card.id);
      switch (cs.difficulty) {
        case 'new':
          counts.New++;
          break;
        case 'learning':
          counts.Learning++;
          break;
        case 'review':
          counts.Review++;
          break;
        case 'mastered':
          counts.Mastered++;
          break;
      }
    }

    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [data.cardStates]);

  /* ----------------------------------------------------------------------- */
  /*  4. Histogram: ease factor distribution                                  */
  /* ----------------------------------------------------------------------- */
  const easeHistData = useMemo(() => {
    const cardStates = data.cardStates ?? {};
    const buckets = [
      { range: '1.3-1.6', min: 1.3, max: 1.6, count: 0, color: COLORS.accentRed },
      { range: '1.6-1.9', min: 1.6, max: 1.9, count: 0, color: COLORS.accentOrange },
      { range: '1.9-2.2', min: 1.9, max: 2.2, count: 0, color: COLORS.accentBlue },
      { range: '2.2-2.5', min: 2.2, max: 2.5, count: 0, color: COLORS.accentGreen },
      { range: '2.5+', min: 2.5, max: Infinity, count: 0, color: COLORS.accentGreen },
    ];

    for (const card of cards) {
      const cs: CardState =
        cardStates[card.id] ?? createInitialCardState(card.id);
      for (const b of buckets) {
        if (cs.easeFactor >= b.min && cs.easeFactor < b.max) {
          b.count++;
          break;
        }
        // Handle exactly 2.5 or above in last bucket
        if (b.max === Infinity && cs.easeFactor >= b.min) {
          b.count++;
          break;
        }
      }
    }

    return buckets;
  }, [data.cardStates]);

  /* ----------------------------------------------------------------------- */
  /*  Render                                                                   */
  /* ----------------------------------------------------------------------- */

  return (
    <motion.div
      className="w-full mx-auto pb-8 pt-6"
      style={{ maxWidth: '960px', padding: '24px 24px 32px' }}
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      {/* Page header */}
      <motion.div variants={sectionVariant} className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: COLORS.textPrimary, fontFamily: 'var(--font-ui)' }}
        >
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
          Track your progress
        </p>
      </motion.div>

      {/* Stats overview */}
      <motion.div variants={sectionVariant} className="mb-6">
        <Suspense fallback={<SectionSkeleton h={130} />}>
          <StatsOverview />
        </Suspense>
      </motion.div>

      {/* Empty state message when no sessions exist */}
      {(data.sessions ?? []).length === 0 && (
        <motion.div
          variants={sectionVariant}
          className="mb-6"
          style={{
            background: COLORS.bgElevated,
            borderRadius: 16,
            border: '1px solid var(--bg-border)',
            padding: '40px 24px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 32, marginBottom: 12 }} role="img" aria-label="chart">
            📊
          </p>
          <p style={{ color: COLORS.textPrimary, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
            No data yet
          </p>
          <p style={{ color: COLORS.textSecondary, fontSize: 14 }}>
            Complete your first study session to see your analytics here.
          </p>
        </motion.div>
      )}

      {/* Line chart: cards per day — full width */}
      <motion.div variants={sectionVariant} className="mb-6">
        <ChartCard title="Cards Studied (Last 30 Days)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS.grid}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: COLORS.textTertiary, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: COLORS.textTertiary, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="cards"
                name="Cards"
                stroke={COLORS.accentBlue}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: COLORS.accentBlue,
                  stroke: COLORS.bgElevated,
                  strokeWidth: 2,
                }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Accuracy by category — full width */}
      <motion.div variants={sectionVariant} className="mb-6">
        <ChartCard title="Accuracy by Category">
          <ResponsiveContainer width="100%" height={Math.max(280, categoryAccuracyData.length * 36)}>
            <BarChart data={categoryAccuracyData} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS.grid}
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: COLORS.textTertiary, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fill: COLORS.textTertiary, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="accuracy"
                name="Accuracy"
                radius={[0, 6, 6, 0]}
                barSize={20}
                animationDuration={800}
              >
                {categoryAccuracyData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={
                      entry.accuracy >= 75
                        ? COLORS.accentGreen
                        : entry.accuracy >= 50
                          ? COLORS.accentOrange
                          : COLORS.accentRed
                    }
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Two-column: donut + ease histogram */}
      <motion.div
        variants={sectionVariant}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        {/* Donut: card status distribution */}
        <ChartCard title="Card Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                animationDuration={800}
              >
                {statusData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name] ?? COLORS.textTertiary}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Histogram: ease factor distribution */}
        <ChartCard title="Ease Factor Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={easeHistData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS.grid}
                vertical={false}
              />
              <XAxis
                dataKey="range"
                tick={{ fill: COLORS.textTertiary, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: COLORS.textTertiary, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Cards"
                radius={[6, 6, 0, 0]}
                animationDuration={800}
              >
                {easeHistData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Activity heatmap */}
      <motion.div variants={sectionVariant} className="mb-6">
        <Suspense fallback={<SectionSkeleton h={200} />}>
          <ActivityHeatmap />
        </Suspense>
      </motion.div>

      {/* AI Insights */}
      <motion.div variants={sectionVariant} className="mb-6">
        <Suspense fallback={<SectionSkeleton h={280} />}>
          <AIInsights />
        </Suspense>
      </motion.div>

      {/* Card stats table */}
      <motion.div variants={sectionVariant}>
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: COLORS.textPrimary }}
        >
          All Cards
        </h3>
        <Suspense fallback={<SectionSkeleton h={400} />}>
          <CardStatsTable />
        </Suspense>
      </motion.div>
    </motion.div>
  );
}
