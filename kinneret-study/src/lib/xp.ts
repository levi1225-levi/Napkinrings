// XP and Level calculation system

import type { SM2Grade } from './sm2';

export interface LevelInfo {
  level: number;
  title: string;
  subtitle: string;
  minXP: number;
  maxXP: number;
  progress: number; // 0-1
}

export const LEVELS: {
  level: number;
  title: string;
  subtitle: string;
  minXP: number;
  maxXP: number;
}[] = [
  { level: 1, title: 'Lab Intern', subtitle: 'Beginner', minXP: 0, maxXP: 200 },
  {
    level: 2,
    title: 'Lab Technician',
    subtitle: 'Apprentice',
    minXP: 200,
    maxXP: 500,
  },
  { level: 3, title: 'Researcher', subtitle: 'Intermediate', minXP: 500, maxXP: 1000 },
  { level: 4, title: 'Scientist', subtitle: 'Advanced', minXP: 1000, maxXP: 2000 },
  {
    level: 5,
    title: 'Lead Scientist',
    subtitle: 'Expert',
    minXP: 2000,
    maxXP: 4000,
  },
  {
    level: 6,
    title: 'Nobel Laureate',
    subtitle: 'Master',
    minXP: 4000,
    maxXP: Infinity,
  },
];

/**
 * Calculate XP earned for a single card review.
 *
 * - Base: 10 XP per review
 * - Correct (grade >= 3): +5 bonus
 * - Perfect/Instant (grade 4-5): +15 bonus (on top of correct bonus)
 */
export function calculateXPForReview(grade: SM2Grade): number {
  let xp = 10; // base XP

  if (grade >= 3) {
    xp += 5; // correct bonus
  }

  if (grade >= 4) {
    xp += 15; // perfect/instant bonus
  }

  return xp;
}

/**
 * Calculate bonus XP earned at the end of a study session.
 *
 * - Session complete: +20 XP
 * - 100% accuracy: +50 XP
 */
export function calculateSessionBonusXP(
  correctCount: number,
  totalCount: number
): number {
  let bonus = 20; // session complete bonus

  if (totalCount > 0 && correctCount === totalCount) {
    bonus += 50; // perfect accuracy bonus
  }

  return bonus;
}

/**
 * Get level information for a given XP amount.
 * Returns the current level, title, XP range, and progress within the level.
 */
export function getLevelInfo(xp: number): LevelInfo {
  // Find the current level (highest level where xp >= minXP)
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXP) {
      current = level;
    } else {
      break;
    }
  }

  // Calculate progress within the current level
  let progress: number;
  if (current.maxXP === Infinity) {
    // At max level, progress is always 1
    progress = 1;
  } else {
    const range = current.maxXP - current.minXP;
    const earned = xp - current.minXP;
    progress = Math.min(1, Math.max(0, earned / range));
  }

  return {
    level: current.level,
    title: current.title,
    subtitle: current.subtitle,
    minXP: current.minXP,
    maxXP: current.maxXP,
    progress,
  };
}

/**
 * Get just the title string for a given level number.
 */
export function getLevelTitle(level: number): string {
  const found = LEVELS.find((l) => l.level === level);
  return found ? found.title : 'Lab Intern';
}
