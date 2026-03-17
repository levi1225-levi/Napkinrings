// Achievement system for the Kinneret Study app

import type { AppData } from './storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (data: AppData) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-flame',
    title: 'First Flame',
    description: 'Maintain a 3-day study streak',
    icon: '🔥',
    condition: (data) => data.profile.streak >= 3,
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Maintain a 7-day study streak',
    icon: '⚡',
    condition: (data) => data.profile.streak >= 7,
  },
  {
    id: 'diamond-mind',
    title: 'Diamond Mind',
    description: 'Maintain a 30-day study streak',
    icon: '💎',
    condition: (data) => data.profile.streak >= 30,
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get 100% accuracy on a quiz session',
    icon: '🎯',
    condition: (data) => {
      return data.sessions.some(
        (s) =>
          s.mode === 'quiz' &&
          s.endTime !== null &&
          s.correctCount > 0 &&
          s.incorrectCount === 0
      );
    },
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Score 30+ in a Speed Round session',
    icon: '🏎️',
    condition: (data) => {
      return data.sessions.some(
        (s) => s.mode === 'speed' && s.correctCount >= 30
      );
    },
  },
  {
    id: 'half-way',
    title: 'Half Way There',
    description: 'Master 50% of all cards',
    icon: '🌗',
    condition: (data) => {
      const cards = Object.values(data.cardStates);
      if (cards.length === 0) return false;
      const mastered = cards.filter((c) => c.difficulty === 'mastered').length;
      return mastered >= cards.length / 2;
    },
  },
  {
    id: 'talmid-chacham',
    title: 'Biology Expert',
    description: 'Master all cards in the study set',
    icon: '👑',
    condition: (data) => {
      const cards = Object.values(data.cardStates);
      if (cards.length === 0) return false;
      return cards.every((c) => c.difficulty === 'mastered');
    },
  },
  {
    id: 'comeback-kid',
    title: 'Comeback Kid',
    description: 'Return to studying after a 3+ day break',
    icon: '🦅',
    condition: (data) => {
      if (data.sessions.length < 2) return false;

      // Sort sessions by start time
      const sorted = [...data.sessions].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      // Check if any consecutive pair of sessions has a gap of 3+ days
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1].startTime);
        const curr = new Date(sorted[i].startTime);
        const daysBetween =
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (daysBetween >= 3) {
          return true;
        }
      }

      return false;
    },
  },
  {
    id: 'deep-dive',
    title: 'Deep Dive',
    description: 'Study 30+ cards in a single session',
    icon: '🤿',
    condition: (data) => {
      return data.sessions.some((s) => s.cardsStudied.length >= 30);
    },
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Study after 10pm',
    icon: '🦉',
    condition: (data) => {
      return data.sessions.some((s) => {
        const hour = new Date(s.startTime).getHours();
        return hour >= 22;
      });
    },
  },
  {
    id: 'streak-10',
    title: 'On Fire',
    description: 'Maintain a 10-day study streak',
    icon: '🔥',
    condition: (data) => (data.profile.streak ?? 0) >= 10,
  },
  {
    id: 'streak-30',
    title: 'Dedicated Scientist',
    description: 'Maintain a 30-day study streak',
    icon: '📚',
    condition: (data) => (data.profile.streak ?? 0) >= 30,
  },
  {
    id: 'streak-100',
    title: 'Science Champion',
    description: 'Maintain a 100-day study streak',
    icon: '🏆',
    condition: (data) => (data.profile.streak ?? 0) >= 100,
  },
  {
    id: 'cards-100',
    title: 'Century Club',
    description: 'Master 100 cards',
    icon: '💯',
    condition: (data) => {
      const mastered = Object.values(data.cardStates).filter(
        (cs: any) => cs.difficulty === 'mastered',
      ).length;
      return mastered >= 100;
    },
  },
  {
    id: 'sessions-50',
    title: 'Regular',
    description: 'Complete 50 study sessions',
    icon: '📅',
    condition: (data) => (data.sessions?.length ?? 0) >= 50,
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Study before 7 AM',
    icon: '🌅',
    condition: () => new Date().getHours() < 7,
  },
];

/**
 * Check all achievements against the current app data.
 * Returns an array of achievement IDs that are newly unlocked
 * (i.e., their condition is met but they're not yet in the profile's achievements list).
 */
export function checkAchievements(data: AppData): string[] {
  const newlyUnlocked: string[] = [];
  const existing = new Set(data.profile.achievements);

  for (const achievement of ACHIEVEMENTS) {
    if (!existing.has(achievement.id) && achievement.condition(data)) {
      newlyUnlocked.push(achievement.id);
    }
  }

  return newlyUnlocked;
}
