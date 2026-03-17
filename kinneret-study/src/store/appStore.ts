import { create } from 'zustand';
import type { CardState, SM2Grade } from '../lib/sm2';
import {
  processGrade,
  createInitialCardState,
  getStudyQueue,
  isCardDue,
} from '../lib/sm2';
import type { AppData, StudySession, UserSettings } from '../lib/storage';
import {
  loadAppData,
  saveAppData,
  getDefaultSettings,
  getDefaultProfile,
} from '../lib/storage';
import { getSession } from '../lib/auth';
import {
  calculateXPForReview,
  calculateSessionBonusXP,
  getLevelInfo,
} from '../lib/xp';
import { checkAchievements, ACHIEVEMENTS } from '../lib/achievements';
import { CARDS } from '../data/cards';

interface AppStore {
  // Data
  data: AppData;
  initialized: boolean;

  // Current session state
  currentSession: StudySession | null;
  currentCardIndex: number;
  studyQueue: string[];
  isFlipped: boolean;
  sessionStartTime: number;
  cardStartTime: number;

  // Quiz state
  quizAnswers: Record<string, { selectedIndex: number; correct: boolean; timeMs: number }>;

  // Speed round state
  speedScore: number;
  speedCombo: number;
  speedHighScore: number;

  // AI state
  aiTutorMessages: { role: 'user' | 'assistant'; content: string }[];
  aiTutorLoading: boolean;
  aiInsight: string | null;

  // UI state
  activeTab: 'home' | 'study' | 'analytics' | 'sources' | 'settings';
  studyMode: 'flashcard' | 'quiz' | 'speed' | 'guided' | 'practice-test' | null;
  showSessionComplete: boolean;
  toasts: { id: string; message: string; type: 'success' | 'error' | 'achievement' | 'xp'; icon?: string }[];
  showAITutor: boolean;
  showLevelUp: boolean;
  newLevel: number | null;

  // Actions
  initialize: () => void;
  setActiveTab: (tab: AppStore['activeTab']) => void;
  setStudyMode: (mode: AppStore['studyMode']) => void;

  startFlashcardSession: () => void;
  flipCard: () => void;
  gradeCard: (grade: SM2Grade) => void;
  nextCard: () => void;
  endSession: () => void;

  startQuizSession: () => void;
  answerQuiz: (questionIndex: number, selectedIndex: number, correct: boolean, timeMs: number, relatedCardId?: string) => void;
  endQuizSession: () => void;

  startSpeedRound: () => void;
  speedAnswer: (correct: boolean) => void;
  endSpeedRound: () => void;

  updateSettings: (settings: Partial<UserSettings>) => void;
  updateProfile: (profile: Partial<AppData['profile']>) => void;
  resetProgress: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;

  toggleAITutor: () => void;
  sendAITutorMessage: (message: string) => void;
  setAIInsight: (insight: string) => void;

  addToast: (toast: Omit<AppStore['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
  dismissLevelUp: () => void;

  updateStreak: () => void;

  // Bookmarks
  toggleBookmark: (cardId: string) => void;
  isBookmarked: (cardId: string) => boolean;

  // Undo
  undoLastGrade: () => void;
  lastGradeAction: { cardId: string; previousState: CardState; previousXP: number } | null;

  // Cram mode
  startCramSession: () => void;

  getDueCardCount: () => number;
  getMasteredCount: () => number;
  getCardState: (cardId: string) => CardState;
  getTodayXP: () => number;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function isSameDayStr(a: string, b: string): boolean {
  return a.slice(0, 10) === b.slice(0, 10);
}

function isYesterdayStr(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr.slice(0, 10) === yesterday.toISOString().split('T')[0];
}

/** Apply visual settings (font size, animation speed, theme) to the DOM */
function applyVisualSettings(settings: UserSettings): void {
  const root = document.documentElement;

  // Theme
  if (settings.darkMode) {
    root.classList.remove('light');
  } else {
    root.classList.add('light');
  }

  // Font scale
  const fontScales: Record<string, string> = { small: '0.875', medium: '1', large: '1.125' };
  root.style.setProperty('--font-scale', fontScales[settings.fontSize] ?? '1');

  // Animation speed
  if (settings.animationSpeed === 'none') {
    root.style.setProperty('--anim-duration', '0.01ms');
    root.classList.add('reduce-motion');
  } else if (settings.animationSpeed === 'reduced') {
    root.style.setProperty('--anim-duration', '0.15s');
    root.classList.add('reduce-motion');
  } else {
    root.style.removeProperty('--anim-duration');
    root.classList.remove('reduce-motion');
  }
}

function createEmptySession(mode: StudySession['mode']): StudySession {
  return {
    id: generateId(),
    startTime: new Date().toISOString(),
    endTime: null,
    mode,
    cardsStudied: [],
    correctCount: 0,
    incorrectCount: 0,
    averageTime: 0,
    xpEarned: 0,
  };
}

// Build a proper default AppData matching the storage interface
function buildDefaultData(): AppData {
  return {
    version: 1,
    userId: generateId(),
    profile: getDefaultProfile(),
    cardStates: Object.fromEntries(
      CARDS.map((c) => [c.id, createInitialCardState(c.id)])
    ),
    sessions: [],
    aiCache: {},
    settings: getDefaultSettings(),
    bookmarkedCards: [],
  };
}

export const useAppStore = create<AppStore>((set, get) => ({
  data: buildDefaultData(),
  initialized: false,

  currentSession: null,
  currentCardIndex: 0,
  studyQueue: [],
  isFlipped: false,
  sessionStartTime: 0,
  cardStartTime: 0,

  quizAnswers: {},

  speedScore: 0,
  speedCombo: 1,
  speedHighScore: 0,

  aiTutorMessages: [],
  aiTutorLoading: false,
  aiInsight: null,

  activeTab: 'home',
  studyMode: null,
  showSessionComplete: false,
  toasts: [],
  showAITutor: false,
  showLevelUp: false,
  newLevel: null,
  lastGradeAction: null,

  initialize: () => {
    const data = loadAppData();

    // Ensure all card IDs from CARDS exist in cardStates
    for (const card of CARDS) {
      if (!data.cardStates[card.id]) {
        data.cardStates[card.id] = createInitialCardState(card.id);
      }
    }

    // Sync profile name from auth session
    const sessionUser = getSession();
    if (sessionUser && !data.profile.name) {
      data.profile.name = sessionUser;
      saveAppData(data);
    }

    // Apply all visual settings (theme, font size, animation speed)
    applyVisualSettings(data.settings);

    // Load persisted speed high score from sessions
    const speedSessions = data.sessions.filter((s) => s.mode === 'speed');
    const speedHighScore = speedSessions.reduce((max, s) => Math.max(max, s.correctCount), 0);

    // Daily login streak check and bonus
    const today = todayStr();
    const lastDay = data.profile.lastStudyDate?.slice(0, 10) || '';

    if (lastDay && !isSameDayStr(lastDay, today)) {
      if (isYesterdayStr(lastDay)) {
        // Consecutive day — increment streak and award daily XP bonus
        const newStreak = (data.profile.streak || 0) + 1;
        const dailyBonus = Math.min(50, 10 + newStreak * 2);
        data.profile.streak = newStreak;
        data.profile.xp = (data.profile.xp || 0) + dailyBonus;
        if (newStreak > (data.profile.longestStreak || 0)) {
          data.profile.longestStreak = newStreak;
        }
        data.profile.lastStudyDate = new Date().toISOString();
        saveAppData(data);

        // Notify after state is set
        setTimeout(() => {
          get().addToast({ message: `Daily login bonus: +${dailyBonus} XP`, type: 'xp' });
        }, 300);

        if (newStreak > 0 && newStreak % 7 === 0) {
          setTimeout(() => {
            get().addToast({ message: `🔥 ${newStreak}-day streak! Keep it up!`, type: 'success' });
          }, 800);
        }
      } else {
        // More than 1 day gap — reset streak
        data.profile.streak = 0;
        saveAppData(data);
      }
    }

    set({ data, initialized: true, speedHighScore });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setStudyMode: (mode) => set({ studyMode: mode, showSessionComplete: false }),

  // === FLASHCARD ACTIONS ===

  startFlashcardSession: () => {
    const { data } = get();
    const queue = getStudyQueue(data.cardStates);
    const limit = data.settings.dailyCardLimit === 999 ? queue.length : data.settings.dailyCardLimit;
    const limited = queue.slice(0, limit);

    if (limited.length === 0) {
      // Add new cards if no due cards
      const newCards = CARDS
        .filter((c) => data.cardStates[c.id]?.difficulty === 'new')
        .slice(0, data.settings.newCardsPerDay)
        .map((c) => c.id);
      limited.push(...newCards);
    }

    set({
      currentSession: createEmptySession('flashcard'),
      studyQueue: limited,
      currentCardIndex: 0,
      isFlipped: false,
      sessionStartTime: Date.now(),
      cardStartTime: Date.now(),
      showSessionComplete: false,
    });
  },

  flipCard: () => set({ isFlipped: true }),

  gradeCard: (grade: SM2Grade) => {
    const state = get();
    const { data, studyQueue, currentCardIndex, currentSession, cardStartTime } = state;
    if (!currentSession || currentCardIndex >= studyQueue.length) return;

    const cardId = studyQueue[currentCardIndex];
    const currentCardState = data.cardStates[cardId] || createInitialCardState(cardId);
    const responseTime = Date.now() - cardStartTime;

    // Save state for undo
    const previousState = { ...currentCardState };
    const previousXP = data.profile.xp;

    const oldLevel = getLevelInfo(data.profile.xp).level;

    // Process grade with response time
    const updatedCardState = processGrade(currentCardState, grade, responseTime);

    // Calculate XP (only takes grade)
    const xpEarned = calculateXPForReview(grade);

    const newCardStates = { ...data.cardStates, [cardId]: updatedCardState };
    const newProfile = {
      ...data.profile,
      xp: data.profile.xp + xpEarned,
      lastStudyDate: new Date().toISOString(),
    };

    const newData: AppData = { ...data, cardStates: newCardStates, profile: newProfile };

    // Check level up
    const newLevelInfo = getLevelInfo(newProfile.xp);
    let showLevelUp = false;
    let newLevel: number | null = null;
    if (newLevelInfo.level > oldLevel) {
      showLevelUp = true;
      newLevel = newLevelInfo.level;
    }

    // Check achievements
    const newAchievements = checkAchievements(newData);
    const unlockedAchievements = newAchievements.filter(
      (a) => !data.profile.achievements.includes(a)
    );
    newData.profile.achievements = [...new Set([...data.profile.achievements, ...newAchievements])];
    newData.profile.level = newLevelInfo.level;

    // Update session
    const isCorrect = grade >= 3;
    const updatedSession: StudySession = {
      ...currentSession,
      cardsStudied: [...currentSession.cardsStudied, cardId],
      correctCount: currentSession.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: currentSession.incorrectCount + (isCorrect ? 0 : 1),
      xpEarned: currentSession.xpEarned + xpEarned,
    };

    saveAppData(newData);

    if (xpEarned > 0) {
      get().addToast({ message: `+${xpEarned} XP`, type: 'xp' });
    }

    for (const achievementId of unlockedAchievements) {
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (achievement) {
        get().addToast({
          message: `Achievement: ${achievement.title}`,
          type: 'achievement',
          icon: achievement.icon,
        });
      }
    }

    const isLastCard = currentCardIndex >= studyQueue.length - 1;

    set({ data: newData, currentSession: updatedSession, showLevelUp, newLevel, lastGradeAction: { cardId, previousState, previousXP } });

    if (isLastCard) {
      get().endSession();
    } else {
      get().nextCard();
    }
  },

  nextCard: () => {
    set((s) => ({
      currentCardIndex: s.currentCardIndex + 1,
      isFlipped: false,
      cardStartTime: Date.now(),
    }));
  },

  endSession: () => {
    const { currentSession, data, sessionStartTime } = get();
    if (!currentSession) return;

    // Calculate average time per card
    const totalTime = Date.now() - sessionStartTime;
    const cardCount = currentSession.cardsStudied.length || 1;
    const avgTime = Math.round(totalTime / cardCount);

    // Calculate session bonus XP
    const totalAnswered = currentSession.correctCount + currentSession.incorrectCount;
    const bonusXP = calculateSessionBonusXP(currentSession.correctCount, totalAnswered);

    const finalizedSession: StudySession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      averageTime: avgTime,
      xpEarned: currentSession.xpEarned + bonusXP,
    };

    const sessions = [...data.sessions, finalizedSession].slice(-90);

    const newProfile = {
      ...data.profile,
      xp: data.profile.xp + bonusXP,
      lastStudyDate: todayStr(),
      totalStudyTime: data.profile.totalStudyTime + Math.round(totalTime / 60000),
    };

    // Update streak if not already studied today
    const today = todayStr();
    const lastStudyDay = data.profile.lastStudyDate?.slice(0, 10) || '';
    if (lastStudyDay !== today) {
      const newStreak = (newProfile.streak || 0) + 1;
      newProfile.streak = newStreak;
      if (newStreak > (newProfile.longestStreak || 0)) {
        newProfile.longestStreak = newStreak;
      }

      // Streak milestone toast every 7 days
      if (newStreak > 0 && newStreak % 7 === 0) {
        setTimeout(() => {
          get().addToast({ message: `🔥 ${newStreak}-day streak! Keep it up!`, type: 'success' });
        }, 500);
      }
    }

    const newData: AppData = { ...data, sessions, profile: newProfile };
    saveAppData(newData);

    if (bonusXP > 0) {
      get().addToast({ message: `Session bonus: +${bonusXP} XP`, type: 'xp' });
    }

    set({
      data: newData,
      currentSession: finalizedSession,
      showSessionComplete: true,
    });
  },

  // === QUIZ ACTIONS ===

  startQuizSession: () => {
    set({
      currentSession: createEmptySession('quiz'),
      quizAnswers: {},
      sessionStartTime: Date.now(),
      showSessionComplete: false,
    });
  },

  answerQuiz: (questionIndex, selectedIndex, correct, timeMs, relatedCardId) => {
    const { data, currentSession } = get();
    if (!currentSession) return;

    const questionKey = questionIndex.toString();

    // Use the relatedCardId passed from QuizSession, or fall back to CARDS lookup
    const card = relatedCardId
      ? CARDS.find((c) => c.id === relatedCardId)
      : CARDS[questionIndex];
    if (card) {
      const cardState = data.cardStates[card.id] || createInitialCardState(card.id);
      const grade: SM2Grade = correct ? 3 : 0;
      const updatedCardState = processGrade(cardState, grade, timeMs);
      const xpEarned = calculateXPForReview(grade);

      const newCardStates = { ...data.cardStates, [card.id]: updatedCardState };
      const newProfile = {
        ...data.profile,
        xp: data.profile.xp + xpEarned,
        lastStudyDate: new Date().toISOString(),
      };

      const newData: AppData = { ...data, cardStates: newCardStates, profile: newProfile };
      const newAchievements = checkAchievements(newData);
      newData.profile.achievements = [...new Set([...data.profile.achievements, ...newAchievements])];
      saveAppData(newData);

      const updatedSession: StudySession = {
        ...currentSession,
        cardsStudied: [...currentSession.cardsStudied, card.id],
        correctCount: currentSession.correctCount + (correct ? 1 : 0),
        incorrectCount: currentSession.incorrectCount + (correct ? 0 : 1),
        xpEarned: currentSession.xpEarned + xpEarned,
      };

      set({
        data: newData,
        currentSession: updatedSession,
        quizAnswers: { ...get().quizAnswers, [questionKey]: { selectedIndex, correct, timeMs } },
      });

      if (xpEarned > 0) {
        get().addToast({ message: `+${xpEarned} XP`, type: 'xp' });
      }
    } else {
      set({
        quizAnswers: { ...get().quizAnswers, [questionKey]: { selectedIndex, correct, timeMs } },
      });
    }
  },

  endQuizSession: () => get().endSession(),

  // === SPEED ROUND ===

  startSpeedRound: () => {
    set({
      currentSession: createEmptySession('speed'),
      speedScore: 0,
      speedCombo: 1,
      sessionStartTime: Date.now(),
      showSessionComplete: false,
    });
  },

  speedAnswer: (correct) => {
    const { speedScore, speedCombo, speedHighScore, currentSession, data } = get();
    if (!currentSession) return;

    let newScore = speedScore;
    let newCombo = speedCombo;
    let xpEarned = 0;

    if (correct) {
      newScore += 1 * speedCombo;
      newCombo = Math.min(speedCombo + 1, 3);
      xpEarned = 2 * speedCombo; // XP scales with combo
    } else {
      newCombo = 1;
    }

    const newHighScore = Math.max(speedHighScore, newScore);

    // Award XP to profile
    const newProfile = {
      ...data.profile,
      xp: data.profile.xp + xpEarned,
      lastStudyDate: new Date().toISOString(),
    };

    const newData: AppData = { ...data, profile: newProfile };

    const updatedSession: StudySession = {
      ...currentSession,
      cardsStudied: [...currentSession.cardsStudied, `speed-${Date.now()}`],
      correctCount: currentSession.correctCount + (correct ? 1 : 0),
      incorrectCount: currentSession.incorrectCount + (correct ? 0 : 1),
      xpEarned: currentSession.xpEarned + xpEarned,
    };

    saveAppData(newData);

    set({
      data: newData,
      speedScore: newScore,
      speedCombo: newCombo,
      speedHighScore: newHighScore,
      currentSession: updatedSession,
    });
  },

  endSpeedRound: () => get().endSession(),

  // === SETTINGS ===

  updateSettings: (settings) => {
    const { data } = get();
    const newSettings = { ...data.settings, ...settings };
    const newData: AppData = { ...data, settings: newSettings };

    applyVisualSettings(newSettings);
    saveAppData(newData);
    set({ data: newData });

    // Show toast for meaningful changes
    if (settings.darkMode !== undefined) {
      get().addToast({ message: settings.darkMode ? 'Dark mode enabled' : 'Light mode enabled', type: 'success' });
    } else if (settings.fontSize !== undefined) {
      get().addToast({ message: `Font size: ${settings.fontSize}`, type: 'success' });
    } else if (settings.animationSpeed !== undefined) {
      get().addToast({ message: `Animations: ${settings.animationSpeed}`, type: 'success' });
    }
  },

  updateProfile: (profile) => {
    const { data } = get();
    const newProfile = { ...data.profile, ...profile };
    const newData: AppData = { ...data, profile: newProfile };
    saveAppData(newData);
    set({ data: newData });
  },

  resetProgress: () => {
    const { data } = get();
    const newData: AppData = {
      ...data,
      cardStates: Object.fromEntries(
        CARDS.map((c) => [c.id, createInitialCardState(c.id)])
      ),
      sessions: [],
      aiCache: {},
      profile: {
        ...getDefaultProfile(),
        name: data.profile.name,
        school: data.profile.school,
        grade: data.profile.grade,
        testDate: data.profile.testDate,
      },
    };
    saveAppData(newData);
    set({ data: newData, speedHighScore: 0 });
    get().addToast({ message: 'Progress has been reset', type: 'success' });
  },

  exportData: () => JSON.stringify(get().data, null, 2),

  importData: (json: string) => {
    try {
      const parsed = JSON.parse(json) as AppData;
      if (parsed.version !== 1 || !parsed.cardStates || !parsed.settings) {
        get().addToast({ message: 'Invalid backup file', type: 'error' });
        return false;
      }
      // Ensure all card IDs exist
      for (const card of CARDS) {
        if (!parsed.cardStates[card.id]) {
          parsed.cardStates[card.id] = createInitialCardState(card.id);
        }
      }
      parsed.settings = { ...getDefaultSettings(), ...parsed.settings };
      parsed.profile = { ...getDefaultProfile(), ...parsed.profile };

      saveAppData(parsed);
      applyVisualSettings(parsed.settings);
      set({ data: parsed });
      get().addToast({ message: 'Progress restored from backup', type: 'success' });
      return true;
    } catch {
      get().addToast({ message: 'Failed to parse backup file', type: 'error' });
      return false;
    }
  },

  // === AI ===

  toggleAITutor: () => set((s) => ({ showAITutor: !s.showAITutor })),

  sendAITutorMessage: (message) => {
    const { aiTutorMessages } = get();
    set({
      aiTutorMessages: [...aiTutorMessages, { role: 'user', content: message }],
      aiTutorLoading: true,
    });
  },

  setAIInsight: (insight) => set({ aiInsight: insight }),

  // === TOASTS ===

  addToast: (toast) => {
    const id = generateId();
    const fullToast = { ...toast, id };
    set((s) => ({ toasts: [...s.toasts, fullToast] }));
    setTimeout(() => get().removeToast(id), 3000);
  },

  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  dismissLevelUp: () => set({ showLevelUp: false, newLevel: null }),

  // === STREAK ===

  updateStreak: () => {
    const { data } = get();
    const { lastStudyDate } = data.profile;

    if (!lastStudyDate) return;

    const today = todayStr();
    if (isSameDayStr(lastStudyDate, today)) return;
    if (isYesterdayStr(lastStudyDate)) return; // streak is fine, will increment on next study

    // More than 1 day gap — reset streak
    const newProfile = { ...data.profile, streak: 0 };
    // longestStreak stays as-is (it was already recorded)
    const newData: AppData = { ...data, profile: newProfile };
    saveAppData(newData);
    set({ data: newData });
  },

  // === BOOKMARKS ===

  toggleBookmark: (cardId: string) => {
    const { data } = get();
    const bookmarks = data.bookmarkedCards || [];
    const isCurrentlyBookmarked = bookmarks.includes(cardId);
    const newBookmarks = isCurrentlyBookmarked
      ? bookmarks.filter((id) => id !== cardId)
      : [...bookmarks, cardId];
    const newData = { ...data, bookmarkedCards: newBookmarks };
    saveAppData(newData);
    set({ data: newData });
    get().addToast({
      message: isCurrentlyBookmarked ? 'Bookmark removed' : 'Card bookmarked',
      type: 'success',
    });
  },

  isBookmarked: (cardId: string) => {
    return (get().data.bookmarkedCards || []).includes(cardId);
  },

  // === UNDO ===

  undoLastGrade: () => {
    const { lastGradeAction, data, currentSession, currentCardIndex } = get();
    if (!lastGradeAction || !currentSession) return;

    const { cardId, previousState, previousXP } = lastGradeAction;

    // Restore card state and XP
    const newCardStates = { ...data.cardStates, [cardId]: previousState };
    const newProfile = { ...data.profile, xp: previousXP };
    const newData: AppData = { ...data, cardStates: newCardStates, profile: newProfile };

    // Remove the card from session's cardsStudied
    const updatedSession: StudySession = {
      ...currentSession,
      cardsStudied: currentSession.cardsStudied.filter((id) => id !== cardId),
      correctCount: Math.max(0, currentSession.correctCount - 1),
      incorrectCount: currentSession.incorrectCount,
    };

    saveAppData(newData);

    // Go back to previous card
    set({
      data: newData,
      currentSession: updatedSession,
      currentCardIndex: Math.max(0, currentCardIndex - 1),
      isFlipped: false,
      lastGradeAction: null,
      showSessionComplete: false,
      cardStartTime: Date.now(),
    });

    get().addToast({ message: 'Grade undone', type: 'success' });
  },

  // === CRAM MODE ===

  startCramSession: () => {
    // Cram mode: review ALL cards regardless of SRS schedule, weakest first
    const { data } = get();
    const allCardIds = CARDS.map((c) => c.id);

    // Sort by ease factor (weakest first), then new cards
    const sorted = [...allCardIds].sort((a, b) => {
      const stateA = data.cardStates[a];
      const stateB = data.cardStates[b];
      const easeA = stateA?.easeFactor ?? 2.5;
      const easeB = stateB?.easeFactor ?? 2.5;
      return easeA - easeB;
    });

    const limit = data.settings.dailyCardLimit === 999 ? sorted.length : data.settings.dailyCardLimit;

    set({
      currentSession: createEmptySession('flashcard'),
      studyQueue: sorted.slice(0, limit),
      currentCardIndex: 0,
      isFlipped: false,
      sessionStartTime: Date.now(),
      cardStartTime: Date.now(),
      showSessionComplete: false,
      lastGradeAction: null,
    });
  },

  // === HELPERS ===

  getDueCardCount: () => {
    const { data } = get();
    return CARDS.filter((card) => {
      const cardState = data.cardStates[card.id];
      if (!cardState) return true;
      return isCardDue(cardState);
    }).length;
  },

  getMasteredCount: () => {
    const { data } = get();
    return Object.values(data.cardStates).filter(
      (cs) => cs.difficulty === 'mastered'
    ).length;
  },

  getCardState: (cardId: string) => {
    const { data } = get();
    return data.cardStates[cardId] || createInitialCardState(cardId);
  },

  getTodayXP: () => {
    const { data } = get();
    const today = todayStr();
    return data.sessions
      .filter((s) => s.startTime.slice(0, 10) === today)
      .reduce((sum, s) => sum + s.xpEarned, 0);
  },
}));
