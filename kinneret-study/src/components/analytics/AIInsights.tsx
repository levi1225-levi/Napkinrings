import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, CalendarClock, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { cards } from '../../data/cards';
import { createInitialCardState, type CardState } from '../../lib/sm2';
import { getAISessionInsights, getAITestPrediction } from '../../lib/ai';

/* -------------------------------------------------------------------------- */
/*  Local fallback analysis                                                    */
/* -------------------------------------------------------------------------- */

interface LocalAnalysis {
  weakCategories: { category: string; avgEase: number }[];
  masteryPct: number;
  predictedScore: number;
  daysUntilTest: number;
  cardsPerDay: number;
  totalCards: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  avgAccuracy: number;
}

function computeLocalAnalysis(
  cardStates: Record<string, CardState>,
  testDate: string,
): LocalAnalysis {
  const totalCards = cards.length;

  // Group cards by category
  const catMap = new Map<string, { easeSum: number; count: number }>();
  let masteredCount = 0;
  let learningCount = 0;
  let newCount = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;

  for (const card of cards) {
    const cs = cardStates[card.id] ?? createInitialCardState(card.id);
    const cat = card.category;

    if (!catMap.has(cat)) catMap.set(cat, { easeSum: 0, count: 0 });
    const entry = catMap.get(cat)!;
    entry.easeSum += cs.easeFactor;
    entry.count += 1;

    totalCorrect += cs.correctReviews;
    totalIncorrect += cs.incorrectReviews;

    if (cs.difficulty === 'mastered') masteredCount++;
    else if (cs.difficulty === 'learning') learningCount++;
    else if (cs.difficulty === 'new') newCount++;
  }

  // Rank categories by weakness (lowest avg ease)
  const weakCategories = Array.from(catMap.entries())
    .map(([category, { easeSum, count }]) => ({
      category,
      avgEase: count > 0 ? easeSum / count : 2.5,
    }))
    .sort((a, b) => a.avgEase - b.avgEase);

  const totalAttempts = totalCorrect + totalIncorrect;
  const avgAccuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;
  const masteryPct = (masteredCount / totalCards) * 100;
  const predictedScore =
    ((masteredCount / totalCards) * 0.5 + avgAccuracy * 0.5) * 100;

  // Days until test
  const now = new Date();
  const test = testDate ? new Date(testDate) : new Date();
  const daysUntilTest = Math.max(
    0,
    Math.ceil((test.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );

  const unmasteredCount = totalCards - masteredCount;
  const cardsPerDay = daysUntilTest > 0 ? Math.ceil(unmasteredCount / daysUntilTest) : unmasteredCount;

  return {
    weakCategories,
    masteryPct,
    predictedScore,
    daysUntilTest,
    cardsPerDay,
    totalCards,
    masteredCount,
    learningCount,
    newCount,
    avgAccuracy: avgAccuracy * 100,
  };
}

/* -------------------------------------------------------------------------- */
/*  Skeleton loader                                                            */
/* -------------------------------------------------------------------------- */

function Skeleton({ w = '100%', h = 16 }: { w?: string | number; h?: number }) {
  return (
    <div
      className="animate-pulse rounded"
      style={{
        width: w,
        height: h,
        background: 'var(--bg-border-strong)',
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function AIInsights() {
  const { data, aiInsight, setAIInsight } = useAppStore();
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const testDate =
    data.settings?.testDate ??
    (data.profile as any)?.testDate ??
    '2026-03-20';

  const analysis = useMemo(
    () => computeLocalAnalysis(data.cardStates ?? {}, testDate),
    [data.cardStates, testDate],
  );

  /* --- Fetch AI insight on mount (if not cached) --- */
  useEffect(() => {
    if (aiInsight) return;

    let cancelled = false;
    setInsightLoading(true);

    const sessions = data.sessions ?? [];
    if (sessions.length === 0) {
      setInsightLoading(false);
      return;
    }

    const lastSession = sessions[sessions.length - 1];
    const sessionData = {
      mode: lastSession.mode,
      cardsStudied: Array.isArray((lastSession as any).cardsStudied)
        ? (lastSession as any).cardsStudied.length
        : (lastSession as any).cardsStudied ?? 0,
      correctCount: lastSession.correctCount,
      incorrectCount: lastSession.incorrectCount,
      averageTime: (lastSession as any).averageTime ?? 0,
      duration: lastSession.endTime
        ? new Date(lastSession.endTime).getTime() -
          new Date(lastSession.startTime).getTime()
        : 0,
    };

    const cardStatesPayload: Record<
      string,
      { difficulty: string; easeFactor: number; streak: number; incorrectReviews: number }
    > = {};
    for (const [id, cs] of Object.entries(data.cardStates ?? {})) {
      const c = cs as CardState;
      cardStatesPayload[id] = {
        difficulty: c.difficulty,
        easeFactor: c.easeFactor,
        streak: c.streak,
        incorrectReviews: c.incorrectReviews,
      };
    }

    getAISessionInsights(sessionData, cardStatesPayload)
      .then((result) => {
        if (!cancelled) {
          // Check if the result indicates API unavailability
          if (result.includes('unavailable') || result.includes('failed')) {
            setInsightLoading(false);
            return;
          }
          setAIInsight(result);
          setInsightLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setInsightLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* --- Predict test score --- */
  const handlePredict = useCallback(async () => {
    setPredictionLoading(true);
    try {
      const cardStatesPayload: Record<
        string,
        {
          difficulty: string;
          easeFactor: number;
          repetitions: number;
          correctReviews: number;
          incorrectReviews: number;
          interval: number;
        }
      > = {};
      for (const [id, cs] of Object.entries(data.cardStates ?? {})) {
        const c = cs as CardState;
        cardStatesPayload[id] = {
          difficulty: c.difficulty,
          easeFactor: c.easeFactor,
          repetitions: c.repetitions,
          correctReviews: c.correctReviews,
          incorrectReviews: c.incorrectReviews,
          interval: c.interval,
        };
      }

      const result = await getAITestPrediction(cardStatesPayload, testDate);

      if (result.includes('unavailable') || result.includes('failed')) {
        // Use local fallback
        setPrediction(null);
      } else {
        setPrediction(result);
      }
    } catch {
      setPrediction(null);
    } finally {
      setPredictionLoading(false);
    }
  }, [data.cardStates, testDate]);

  /* --- Build local fallback text --- */
  const localInsightText = useMemo(() => {
    const top3Weak = analysis.weakCategories.slice(0, 3);
    const weakList = top3Weak.map((c) => c.category).join(', ');

    return `Based on your study data, your weakest categories are: ${weakList}. ` +
      `You have mastered ${analysis.masteredCount} of ${analysis.totalCards} cards (${analysis.masteryPct.toFixed(0)}%). ` +
      `Your overall accuracy is ${analysis.avgAccuracy.toFixed(0)}%. ` +
      `Focus on the ${analysis.learningCount + analysis.newCount} remaining cards, ` +
      `studying roughly ${analysis.cardsPerDay} cards per day to be ready by your test date.`;
  }, [analysis]);

  const localPredictionText = useMemo(() => {
    return `Predicted score: ~${analysis.predictedScore.toFixed(0)}% | ` +
      `Mastery: ${analysis.masteryPct.toFixed(0)}% | ` +
      `Accuracy: ${analysis.avgAccuracy.toFixed(0)}% | ` +
      `${analysis.daysUntilTest} days until test. ` +
      `Study ${analysis.cardsPerDay} cards/day to cover remaining material.`;
  }, [analysis]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{
        background: 'var(--bg-elevated)',
        borderRadius: '16px',
        border: '1px solid rgba(191,90,242,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-6 py-4"
        style={{
          background:
            'linear-gradient(135deg, rgba(191,90,242,0.10) 0%, rgba(79,142,247,0.06) 100%)',
          borderBottom: '1px solid rgba(191,90,242,0.10)',
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(191,90,242,0.15)',
          }}
        >
          <Sparkles size={16} color="#bf5af2" />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          AI Insights
        </h3>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Focus Recommendations */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} color="#bf5af2" />
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#bf5af2' }}
            >
              Focus Recommendations
            </span>
          </div>

          {insightLoading ? (
            <div className="space-y-2">
              <Skeleton w="100%" h={14} />
              <Skeleton w="85%" h={14} />
              <Skeleton w="70%" h={14} />
            </div>
          ) : (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {aiInsight || localInsightText}
            </p>
          )}
        </section>

        {/* Test Countdown */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock size={14} color="#ff9f0a" />
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#ff9f0a' }}
            >
              Test Countdown
            </span>
          </div>

          <div className="flex gap-4 flex-wrap">
            <CountdownTile
              value={analysis.daysUntilTest.toString()}
              label="Days Left"
              color="#ff9f0a"
            />
            <CountdownTile
              value={`${analysis.totalCards - analysis.masteredCount}`}
              label="Cards to Master"
              color="#4f8ef7"
            />
            <CountdownTile
              value={analysis.cardsPerDay.toString()}
              label="Cards / Day"
              color="#34c759"
            />
          </div>
        </section>

        {/* Predicted Test Score */}
        <section>
          <button
            onClick={handlePredict}
            disabled={predictionLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold transition-all"
            style={{
              background: 'rgba(191,90,242,0.12)',
              color: '#bf5af2',
              borderRadius: 12,
              border: '1px solid rgba(191,90,242,0.20)',
              cursor: predictionLoading ? 'wait' : 'pointer',
            }}
          >
            {predictionLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Predict My Test Score
              </>
            )}
          </button>

          {(prediction || (!predictionLoading && prediction === null && localPredictionText)) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3"
            >
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {prediction || localPredictionText}
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Countdown tile                                                             */
/* -------------------------------------------------------------------------- */

function CountdownTile({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div
      className="flex flex-col items-center px-5 py-3 flex-1 min-w-[90px]"
      style={{
        background: 'var(--bg-overlay)',
        borderRadius: 12,
        border: '1px solid var(--bg-border)',
      }}
    >
      <span className="text-xl font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </span>
    </div>
  );
}
