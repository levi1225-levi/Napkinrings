// SM-2 Spaced Repetition Algorithm
// Based on the SuperMemo 2 algorithm by Piotr Wozniak

export interface CardState {
  id: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate: string | null;
  totalReviews: number;
  correctReviews: number;
  incorrectReviews: number;
  averageResponseTime: number;
  responseTimeSamples: number[];
  streak: number;
  difficulty: 'new' | 'learning' | 'review' | 'mastered';
  lastGrade: 0 | 1 | 2 | 3 | 4 | 5 | null;
}

export type SM2Grade = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Create the initial state for a new card that has never been studied.
 */
export function createInitialCardState(id: string): CardState {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    id,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: today.toISOString(),
    lastReviewDate: null,
    totalReviews: 0,
    correctReviews: 0,
    incorrectReviews: 0,
    averageResponseTime: 0,
    responseTimeSamples: [],
    streak: 0,
    difficulty: 'new',
    lastGrade: null,
  };
}

/**
 * Process a grade for a card using the SM-2 algorithm.
 * Returns a new CardState (immutable update).
 *
 * SM-2 formula:
 * - If grade >= 3 (correct):
 *   - repetitions 0 -> interval = 1
 *   - repetitions 1 -> interval = 6
 *   - otherwise -> interval = round(interval * easeFactor)
 *   - easeFactor += 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)
 *   - easeFactor clamped to minimum 1.3
 *   - repetitions += 1
 * - If grade < 3 (incorrect):
 *   - repetitions = 0, interval = 1, easeFactor unchanged
 */
export function processGrade(
  state: CardState,
  grade: SM2Grade,
  responseTime: number
): CardState {
  const now = new Date();
  const todayStr = now.toISOString();

  let newEaseFactor = state.easeFactor;
  let newInterval = state.interval;
  let newRepetitions = state.repetitions;
  let newStreak = state.streak;
  let newCorrectReviews = state.correctReviews;
  let newIncorrectReviews = state.incorrectReviews;

  if (grade >= 3) {
    // Correct response
    if (newRepetitions === 0) {
      newInterval = 1;
    } else if (newRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(newInterval * newEaseFactor);
    }

    // Update ease factor
    newEaseFactor =
      newEaseFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }

    newRepetitions += 1;
    newStreak += 1;
    newCorrectReviews += 1;
  } else {
    // Incorrect response
    newRepetitions = 0;
    newInterval = 1;
    // easeFactor unchanged on incorrect
    newStreak = 0;
    newIncorrectReviews += 1;
  }

  // Calculate next review date
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + newInterval);
  nextReview.setHours(0, 0, 0, 0);

  // Update response time tracking (keep last 20 samples)
  const newSamples = [...state.responseTimeSamples, responseTime].slice(-20);
  const newAverageResponseTime =
    newSamples.reduce((sum, t) => sum + t, 0) / newSamples.length;

  const newTotalReviews = state.totalReviews + 1;

  const updated: CardState = {
    ...state,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate: nextReview.toISOString(),
    lastReviewDate: todayStr,
    totalReviews: newTotalReviews,
    correctReviews: newCorrectReviews,
    incorrectReviews: newIncorrectReviews,
    averageResponseTime: newAverageResponseTime,
    responseTimeSamples: newSamples,
    streak: newStreak,
    lastGrade: grade,
  };

  // Reclassify difficulty after update
  updated.difficulty = classifyDifficulty(updated);

  return updated;
}

/**
 * Classify a card's difficulty level based on its review history.
 *
 * - New: never studied (totalReviews === 0)
 * - Learning: repetitions < 2 OR more incorrect than correct recently
 * - Mastered: repetitions >= 5, easeFactor >= 2.0, interval >= 21 days
 * - Review: everything else that's been studied
 */
export function classifyDifficulty(state: CardState): CardState['difficulty'] {
  if (state.totalReviews === 0) {
    return 'new';
  }

  // Check mastered first (more specific)
  if (
    state.repetitions >= 5 &&
    state.easeFactor >= 2.0 &&
    state.interval >= 21
  ) {
    return 'mastered';
  }

  // Learning: low repetitions or struggling
  if (state.repetitions < 2 || state.incorrectReviews > state.correctReviews) {
    return 'learning';
  }

  return 'review';
}

/**
 * Check if a card is due for review on the given date.
 */
export function isCardDue(state: CardState, currentDate?: string): boolean {
  const now = currentDate ? new Date(currentDate) : new Date();
  now.setHours(0, 0, 0, 0);

  const reviewDate = new Date(state.nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);

  return reviewDate <= now;
}

/**
 * Get a prioritized study queue of card IDs.
 *
 * Ordering:
 * 1. Overdue cards (most overdue first)
 * 2. Due today (lowest ease factor first)
 * 3. Learning cards (most incorrect first)
 * 4. New cards (alphabetical by ID)
 */
export function getStudyQueue(
  cardStates: Record<string, CardState>,
  currentDate?: string
): string[] {
  const now = currentDate ? new Date(currentDate) : new Date();
  now.setHours(0, 0, 0, 0);
  const nowTime = now.getTime();

  const overdue: { id: string; daysOverdue: number }[] = [];
  const dueToday: { id: string; easeFactor: number }[] = [];
  const learning: { id: string; incorrectCount: number }[] = [];
  const newCards: { id: string }[] = [];

  for (const [id, state] of Object.entries(cardStates)) {
    const reviewDate = new Date(state.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    const reviewTime = reviewDate.getTime();

    if (state.difficulty === 'new') {
      newCards.push({ id });
    } else if (state.difficulty === 'learning') {
      if (reviewTime < nowTime) {
        // Overdue learning card goes to overdue
        const daysOverdue = Math.floor(
          (nowTime - reviewTime) / (1000 * 60 * 60 * 24)
        );
        overdue.push({ id, daysOverdue });
      } else if (reviewTime === nowTime) {
        learning.push({ id, incorrectCount: state.incorrectReviews });
      } else {
        // Not yet due, still include in learning queue
        learning.push({ id, incorrectCount: state.incorrectReviews });
      }
    } else if (reviewTime < nowTime) {
      // Overdue (review or mastered)
      const daysOverdue = Math.floor(
        (nowTime - reviewTime) / (1000 * 60 * 60 * 24)
      );
      overdue.push({ id, daysOverdue });
    } else if (reviewTime === nowTime) {
      // Due today
      dueToday.push({ id, easeFactor: state.easeFactor });
    }
    // Future cards are not included in the queue
  }

  // Sort each group
  overdue.sort((a, b) => b.daysOverdue - a.daysOverdue); // most overdue first
  dueToday.sort((a, b) => a.easeFactor - b.easeFactor); // lowest ease first
  learning.sort((a, b) => b.incorrectCount - a.incorrectCount); // most incorrect first
  newCards.sort((a, b) => a.id.localeCompare(b.id)); // alphabetical

  return [
    ...overdue.map((c) => c.id),
    ...dueToday.map((c) => c.id),
    ...learning.map((c) => c.id),
    ...newCards.map((c) => c.id),
  ];
}

/**
 * Get a human-readable label for an SM-2 grade.
 */
export function getGradeLabel(grade: SM2Grade): string {
  const labels: Record<SM2Grade, string> = {
    0: 'Again',
    1: 'Hard',
    2: 'Good',
    3: 'Easy',
    4: 'Perfect',
    5: 'Instant',
  };
  return labels[grade];
}

/**
 * Get a Tailwind color class for an SM-2 grade.
 */
export function getGradeColor(grade: SM2Grade): string {
  const colors: Record<SM2Grade, string> = {
    0: 'text-red-500',
    1: 'text-red-400',
    2: 'text-orange-500',
    3: 'text-blue-500',
    4: 'text-green-500',
    5: 'text-green-400',
  };
  return colors[grade];
}
