import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Play,
  BookOpen,
  Brain,
  ClipboardCheck,
  Zap,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

/* ────────────────────────────────────────────
 *  Types
 * ──────────────────────────────────────────── */

interface StudySchedulerProps {
  onStartSession: (mode: 'guided' | 'flashcard' | 'quiz' | 'practice-test' | 'speed') => void;
  testDate?: string; // ISO date string from settings
}

type Phase = 'learn' | 'practice' | 'test-prep' | 'final-review';
type TimeSlot = 'morning' | 'afternoon' | 'evening';
type SessionDuration = 15 | 30 | 45 | 60;

interface StudySession {
  id: string;
  date: string; // ISO date
  phase: Phase;
  activity: string;
  mode: 'guided' | 'flashcard' | 'quiz' | 'practice-test' | 'speed';
  topic: string;
  timeSlot: TimeSlot;
  duration: SessionDuration;
  completed: boolean;
}

interface ScheduleData {
  testDate: string;
  createdAt: string;
  availableDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  timeSlots: Record<number, TimeSlot[]>;
  sessionDuration: SessionDuration;
  sessions: StudySession[];
}

const STORAGE_KEY = 'science_study_schedule';

/* ────────────────────────────────────────────
 *  Constants
 * ──────────────────────────────────────────── */

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const PHASE_CONFIG: Record<Phase, {
  label: string;
  color: string;
  colorDim: string;
  icon: typeof BookOpen;
  modes: Array<'guided' | 'flashcard' | 'quiz' | 'practice-test' | 'speed'>;
  activities: string[];
}> = {
  learn: {
    label: 'Learn',
    color: '#bf5af2',
    colorDim: 'rgba(191,90,242,0.12)',
    icon: BookOpen,
    modes: ['guided', 'guided', 'guided', 'flashcard'],
    activities: [
      'Read key concepts',
      'Guided learning session',
      'Note-taking & summarising',
      'Vocabulary flashcards',
    ],
  },
  practice: {
    label: 'Practice',
    color: '#4f8ef7',
    colorDim: 'rgba(79,142,247,0.12)',
    icon: Brain,
    modes: ['flashcard', 'flashcard', 'quiz', 'guided'],
    activities: [
      'Flashcard review',
      'Fill-in-the-blank exercises',
      'Matching exercises',
      'Concept connections',
    ],
  },
  'test-prep': {
    label: 'Test Prep',
    color: '#ff9f0a',
    colorDim: 'rgba(255,159,10,0.12)',
    icon: ClipboardCheck,
    modes: ['quiz', 'quiz', 'practice-test', 'speed'],
    activities: [
      'Quiz mode',
      'Diagram labelling',
      'Timed practice test',
      'Speed round drill',
    ],
  },
  'final-review': {
    label: 'Final Review',
    color: '#ff453a',
    colorDim: 'rgba(255,69,58,0.12)',
    icon: Zap,
    modes: ['speed', 'practice-test', 'quiz', 'flashcard'],
    activities: [
      'Cram mode - weak areas',
      'Full practice test',
      'Quick-fire quiz',
      'Final flashcard sweep',
    ],
  },
};

const SCIENCE_TOPICS = [
  'Cell Biology',
  'Genetics & DNA',
  'Evolution',
  'Ecology & Ecosystems',
  'Human Body Systems',
  'Chemistry Basics',
  'Periodic Table',
  'Chemical Reactions',
  'Forces & Motion',
  'Energy & Waves',
  'Earth Science',
  'Scientific Method',
];

/* ────────────────────────────────────────────
 *  Animation variants
 * ──────────────────────────────────────────── */

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      staggerChildren: 0.05,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

/* ────────────────────────────────────────────
 *  Helpers
 * ──────────────────────────────────────────── */

function loadSchedule(): ScheduleData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ScheduleData;
  } catch {
    return null;
  }
}

function saveSchedule(data: ScheduleData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function todayStr(): string {
  return toDateStr(new Date());
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function generateSchedule(
  testDate: string,
  availableDays: number[],
  timeSlots: Record<number, TimeSlot[]>,
  sessionDuration: SessionDuration,
): StudySession[] {
  const today = todayStr();
  const totalDays = daysBetween(today, testDate);

  if (totalDays <= 0 || availableDays.length === 0) return [];

  // Collect all study dates
  const studyDates: { date: string; timeSlot: TimeSlot }[] = [];
  const cursor = new Date(today + 'T00:00:00');
  const end = new Date(testDate + 'T00:00:00');

  while (cursor < end) {
    const dow = cursor.getDay();
    if (availableDays.includes(dow)) {
      const dateStr = toDateStr(cursor);
      const slots = timeSlots[dow] || ['morning'];
      // Use the first time slot for that day
      studyDates.push({ date: dateStr, timeSlot: slots[0] });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (studyDates.length === 0) return [];

  // Divide into phases
  const totalSessions = studyDates.length;
  const phaseBreaks = {
    learn: Math.max(1, Math.round(totalSessions * 0.4)),
    practice: Math.max(1, Math.round(totalSessions * 0.3)),
    'test-prep': Math.max(1, Math.round(totalSessions * 0.2)),
    'final-review': Math.max(1, totalSessions), // remainder
  };

  let learnEnd = phaseBreaks.learn;
  let practiceEnd = learnEnd + phaseBreaks.practice;
  let testPrepEnd = practiceEnd + phaseBreaks['test-prep'];

  // Clamp
  if (practiceEnd > totalSessions) practiceEnd = totalSessions;
  if (testPrepEnd > totalSessions) testPrepEnd = totalSessions;

  // If very few sessions, compress phases
  if (totalSessions <= 3) {
    learnEnd = 1;
    practiceEnd = Math.min(2, totalSessions);
    testPrepEnd = totalSessions;
  }

  const sessions: StudySession[] = studyDates.map((entry, i) => {
    let phase: Phase;
    if (i < learnEnd) phase = 'learn';
    else if (i < practiceEnd) phase = 'practice';
    else if (i < testPrepEnd) phase = 'test-prep';
    else phase = 'final-review';

    const config = PHASE_CONFIG[phase];
    const activityIndex = i % config.activities.length;
    const topic = SCIENCE_TOPICS[i % SCIENCE_TOPICS.length];

    return {
      id: `session-${entry.date}-${i}`,
      date: entry.date,
      phase,
      activity: config.activities[activityIndex],
      mode: config.modes[activityIndex],
      topic,
      timeSlot: entry.timeSlot,
      duration: sessionDuration,
      completed: false,
    };
  });

  return sessions;
}

/* ────────────────────────────────────────────
 *  Sub-components
 * ──────────────────────────────────────────── */

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderRadius: '16px',
        border: '1px solid var(--bg-border)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        color: 'var(--text-tertiary)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '12px',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {children}
    </h3>
  );
}

/* ────────────────────────────────────────────
 *  Main Component
 * ──────────────────────────────────────────── */

type SchedulerView = 'setup' | 'schedule';

export default function StudyScheduler({ onStartSession, testDate: propTestDate }: StudySchedulerProps) {
  // Setup state
  const [selectedTestDate, setSelectedTestDate] = useState(propTestDate || '');
  const [availableDays, setAvailableDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default
  const [timeSlots, setTimeSlots] = useState<Record<number, TimeSlot[]>>({});
  const [sessionDuration, setSessionDuration] = useState<SessionDuration>(30);

  // Schedule state
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [view, setView] = useState<SchedulerView>('setup');
  const [weekOffset, setWeekOffset] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadSchedule();
    if (saved && saved.sessions.length > 0) {
      setSchedule(saved);
      setSelectedTestDate(saved.testDate);
      setAvailableDays(saved.availableDays);
      setTimeSlots(saved.timeSlots);
      setSessionDuration(saved.sessionDuration);
      setView('schedule');
    }
  }, []);

  // Sync propTestDate
  useEffect(() => {
    if (propTestDate && !schedule) {
      setSelectedTestDate(propTestDate);
    }
  }, [propTestDate, schedule]);

  // Default time slots for newly toggled days
  useEffect(() => {
    setTimeSlots((prev) => {
      const next = { ...prev };
      for (const day of availableDays) {
        if (!next[day]) next[day] = ['afternoon'];
      }
      return next;
    });
  }, [availableDays]);

  /* ── Derived ── */

  const today = todayStr();

  const daysUntilTest = useMemo(() => {
    if (!selectedTestDate) return -1;
    return daysBetween(today, selectedTestDate);
  }, [selectedTestDate, today]);

  const testPassed = daysUntilTest < 0;
  const testTomorrow = daysUntilTest === 1;

  const todaySession = useMemo(() => {
    if (!schedule) return null;
    return schedule.sessions.find((s) => s.date === today && !s.completed) || null;
  }, [schedule, today]);

  const completedCount = useMemo(() => {
    if (!schedule) return 0;
    return schedule.sessions.filter((s) => s.completed).length;
  }, [schedule]);

  const totalSessions = schedule?.sessions.length || 0;
  const progressPercent = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

  // Current phase
  const currentPhase = useMemo((): Phase | null => {
    if (!schedule) return null;
    const upcoming = schedule.sessions.find((s) => s.date >= today && !s.completed);
    return upcoming?.phase || null;
  }, [schedule, today]);

  // Week navigation
  const weekDates = useMemo(() => {
    const base = new Date(today + 'T00:00:00');
    base.setDate(base.getDate() - base.getDay() + weekOffset * 7); // Start of week (Sunday)
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      dates.push(toDateStr(d));
    }
    return dates;
  }, [today, weekOffset]);

  const sessionsThisWeek = useMemo(() => {
    if (!schedule) return new Map<string, StudySession>();
    const map = new Map<string, StudySession>();
    for (const s of schedule.sessions) {
      if (weekDates.includes(s.date)) {
        map.set(s.date, s);
      }
    }
    return map;
  }, [schedule, weekDates]);

  /* ── Handlers ── */

  const toggleDay = useCallback((day: number) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }, []);

  const toggleTimeSlot = useCallback((day: number, slot: TimeSlot) => {
    setTimeSlots((prev) => {
      const current = prev[day] || [];
      const has = current.includes(slot);
      const next = has ? current.filter((s) => s !== slot) : [...current, slot];
      return { ...prev, [day]: next.length > 0 ? next : ['afternoon'] };
    });
  }, []);

  const handleGenerate = useCallback(() => {
    if (!selectedTestDate || availableDays.length === 0) return;

    const sessions = generateSchedule(selectedTestDate, availableDays, timeSlots, sessionDuration);
    const data: ScheduleData = {
      testDate: selectedTestDate,
      createdAt: new Date().toISOString(),
      availableDays,
      timeSlots,
      sessionDuration,
      sessions,
    };
    setSchedule(data);
    saveSchedule(data);
    setView('schedule');
    setWeekOffset(0);
  }, [selectedTestDate, availableDays, timeSlots, sessionDuration]);

  const handleRegenerate = useCallback(() => {
    setView('setup');
  }, []);

  const handleCompleteSession = useCallback((sessionId: string) => {
    setSchedule((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === sessionId ? { ...s, completed: true } : s
        ),
      };
      saveSchedule(updated);
      return updated;
    });
  }, []);

  const handleStartSession = useCallback((session: StudySession) => {
    handleCompleteSession(session.id);
    onStartSession(session.mode);
  }, [handleCompleteSession, onStartSession]);

  const navigateWeek = useCallback((dir: number) => {
    setSlideDirection(dir);
    setWeekOffset((prev) => prev + dir);
  }, []);

  /* ── Validation ── */

  const canGenerate = selectedTestDate && availableDays.length > 0 && daysUntilTest > 0;

  /* ────────────────────────────────────────────
   *  SETUP VIEW
   * ──────────────────────────────────────────── */

  if (view === 'setup') {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-5"
        style={{
          padding: '24px 24px 32px',
          maxWidth: '960px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
        }}
      >
        {/* Header */}
        <motion.div variants={sectionVariants}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Study Scheduler
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginTop: '4px',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Plan your study sessions leading up to your test
          </p>
        </motion.div>

        {/* 1. Test Date */}
        <motion.div variants={sectionVariants}>
          <SectionCard>
            <SectionTitle>Test Date</SectionTitle>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(191,90,242,0.12)',
                }}
              >
                <Calendar size={20} style={{ color: '#bf5af2' }} />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="date"
                  value={selectedTestDate}
                  onChange={(e) => setSelectedTestDate(e.target.value)}
                  min={toDateStr(new Date(Date.now() + 86400000))}
                  style={{
                    backgroundColor: 'var(--bg-base)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--bg-border-strong)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    outline: 'none',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '14px',
                    fontWeight: 500,
                    width: '100%',
                    colorScheme: 'dark',
                  }}
                />
              </div>
            </div>
            {selectedTestDate && daysUntilTest > 0 && (
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  marginTop: '10px',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                {daysUntilTest} day{daysUntilTest !== 1 ? 's' : ''} until your test
              </p>
            )}
            {testPassed && selectedTestDate && (
              <div
                className="flex items-center gap-2"
                style={{ color: 'var(--accent-red)', marginTop: '10px' }}
              >
                <AlertTriangle size={14} />
                <p style={{ fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>
                  This date has already passed
                </p>
              </div>
            )}
            {testTomorrow && (
              <div
                className="flex items-center gap-2"
                style={{ color: '#ff9f0a', marginTop: '10px' }}
              >
                <AlertTriangle size={14} />
                <p style={{ fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>
                  Your test is tomorrow! Consider a focused cram session instead.
                </p>
              </div>
            )}
          </SectionCard>
        </motion.div>

        {/* 2. Available Days */}
        <motion.div variants={sectionVariants}>
          <SectionCard>
            <SectionTitle>Available Days</SectionTitle>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {DAY_LABELS.map((label, index) => {
                const isSelected = availableDays.includes(index);
                return (
                  <motion.button
                    key={label}
                    onClick={() => toggleDay(index)}
                    whileTap={{ scale: 0.93 }}
                    style={{
                      padding: '10px 0',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 500,
                      fontFamily: 'var(--font-ui)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: isSelected
                        ? '1.5px solid var(--accent-blue)'
                        : '1.5px solid var(--bg-border-strong)',
                      backgroundColor: isSelected
                        ? 'var(--accent-blue)'
                        : 'var(--bg-overlay)',
                      color: isSelected ? '#fff' : 'var(--text-primary)',
                      boxShadow: isSelected ? '0 2px 8px rgba(79,142,247,0.3)' : 'none',
                      transition: 'all 0.15s ease',
                      flex: '1 1 0',
                      minWidth: '44px',
                      textAlign: 'center',
                    }}
                  >
                    {label}
                  </motion.button>
                );
              })}
            </div>
            {availableDays.length === 0 && (
              <p
                style={{
                  color: 'var(--accent-orange)',
                  fontSize: '12px',
                  marginTop: '8px',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                Select at least one day
              </p>
            )}
          </SectionCard>
        </motion.div>

        {/* 3. Time Slots per Day */}
        <AnimatePresence>
          {availableDays.length > 0 && (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, height: 0 }}
            >
              <SectionCard>
                <SectionTitle>Preferred Time Slots</SectionTitle>
                <div className="flex flex-col gap-3">
                  {availableDays
                    .sort((a, b) => a - b)
                    .map((day) => (
                      <div
                        key={day}
                        className="flex items-center gap-3"
                        style={{
                          padding: '8px 0',
                          borderBottom: '1px solid var(--bg-border)',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-ui)',
                            width: '36px',
                            flexShrink: 0,
                          }}
                        >
                          {DAY_LABELS[day]}
                        </span>
                        <div
                          style={{
                            display: 'flex',
                            gap: '6px',
                            flexWrap: 'wrap',
                            flex: 1,
                          }}
                        >
                          {(['morning', 'afternoon', 'evening'] as TimeSlot[]).map((slot) => {
                            const isActive = (timeSlots[day] || []).includes(slot);
                            return (
                              <motion.button
                                key={slot}
                                onClick={() => toggleTimeSlot(day, slot)}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '11px',
                                  fontWeight: isActive ? 600 : 500,
                                  fontFamily: 'var(--font-ui)',
                                  borderRadius: '16px',
                                  cursor: 'pointer',
                                  border: isActive
                                    ? '1px solid rgba(191,90,242,0.5)'
                                    : '1px solid var(--bg-border-strong)',
                                  backgroundColor: isActive
                                    ? 'rgba(191,90,242,0.15)'
                                    : 'var(--bg-overlay)',
                                  color: isActive ? '#bf5af2' : 'var(--text-secondary)',
                                  transition: 'all 0.15s ease',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {slot}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </SectionCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Session Duration */}
        <motion.div variants={sectionVariants}>
          <SectionCard>
            <SectionTitle>Session Duration</SectionTitle>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {([15, 30, 45, 60] as SessionDuration[]).map((dur) => {
                const isSelected = sessionDuration === dur;
                const label = dur === 60 ? '1 hr' : `${dur} min`;
                return (
                  <motion.button
                    key={dur}
                    onClick={() => setSessionDuration(dur)}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 500,
                      fontFamily: 'var(--font-ui)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: isSelected
                        ? '1.5px solid var(--accent-blue)'
                        : '1.5px solid var(--bg-border-strong)',
                      backgroundColor: isSelected
                        ? 'var(--accent-blue)'
                        : 'var(--bg-overlay)',
                      color: isSelected ? '#fff' : 'var(--text-primary)',
                      boxShadow: isSelected ? '0 2px 8px rgba(79,142,247,0.3)' : 'none',
                      transition: 'all 0.15s ease',
                      flex: '1 1 0',
                      textAlign: 'center',
                    }}
                  >
                    <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                    {label}
                  </motion.button>
                );
              })}
            </div>
          </SectionCard>
        </motion.div>

        {/* Generate Button */}
        <motion.div variants={sectionVariants}>
          <motion.button
            onClick={handleGenerate}
            disabled={!canGenerate}
            whileTap={canGenerate ? { scale: 0.98 } : undefined}
            whileHover={canGenerate ? { boxShadow: '0 0 32px rgba(79,142,247,0.4)' } : undefined}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: canGenerate ? 'var(--accent-blue)' : 'var(--bg-overlay)',
              color: canGenerate ? '#fff' : 'var(--text-tertiary)',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'var(--font-ui)',
              cursor: canGenerate ? 'pointer' : 'not-allowed',
              opacity: canGenerate ? 1 : 0.5,
              boxShadow: canGenerate ? '0 0 20px rgba(79,142,247,0.2)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              letterSpacing: '-0.01em',
            }}
          >
            <Sparkles size={20} />
            Generate Study Plan
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  /* ────────────────────────────────────────────
   *  SCHEDULE VIEW
   * ──────────────────────────────────────────── */

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-5"
      style={{
        padding: '24px 24px 32px',
        maxWidth: '960px',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
      }}
    >
      {/* Header */}
      <motion.div variants={sectionVariants} className="flex items-center justify-between">
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Study Plan
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginTop: '4px',
              fontFamily: 'var(--font-ui)',
            }}
          >
            {daysUntilTest > 0
              ? `${daysUntilTest} day${daysUntilTest !== 1 ? 's' : ''} until test`
              : testPassed
                ? 'Test date has passed'
                : 'Test is today!'}
          </p>
        </div>
        <motion.button
          onClick={handleRegenerate}
          whileTap={{ scale: 0.93 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid var(--bg-border-strong)',
            backgroundColor: 'var(--bg-overlay)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} />
          Edit
        </motion.button>
      </motion.div>

      {/* Progress Bar */}
      <motion.div variants={sectionVariants}>
        <SectionCard>
          <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
            <span
              style={{
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-ui)',
              }}
            >
              Overall Progress
            </span>
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'var(--font-ui)',
              }}
            >
              {completedCount}/{totalSessions} sessions
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-base)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%',
                borderRadius: '4px',
                background: progressPercent >= 80
                  ? 'linear-gradient(90deg, #34c759, #30d158)'
                  : 'linear-gradient(90deg, #4f8ef7, #6ba3ff)',
              }}
            />
          </div>
          {/* Phase indicators */}
          <div className="flex gap-3 flex-wrap" style={{ marginTop: '12px' }}>
            {(Object.keys(PHASE_CONFIG) as Phase[]).map((phase) => {
              const config = PHASE_CONFIG[phase];
              const count = schedule?.sessions.filter((s) => s.phase === phase).length || 0;
              const done = schedule?.sessions.filter((s) => s.phase === phase && s.completed).length || 0;
              const isActive = currentPhase === phase;
              return (
                <div
                  key={phase}
                  className="flex items-center gap-1.5"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? config.colorDim : 'transparent',
                    border: isActive ? `1px solid ${config.color}30` : '1px solid transparent',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: config.color,
                      opacity: isActive ? 1 : 0.5,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? config.color : 'var(--text-tertiary)',
                      fontFamily: 'var(--font-ui)',
                    }}
                  >
                    {config.label} {done}/{count}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </motion.div>

      {/* Today's Plan */}
      <motion.div variants={sectionVariants}>
        {todaySession ? (
          <motion.div
            whileHover={{ boxShadow: '0 0 28px rgba(79,142,247,0.3)' }}
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: '16px',
              border: `1.5px solid ${PHASE_CONFIG[todaySession.phase].color}40`,
              padding: '20px',
              boxShadow: `0 0 20px ${PHASE_CONFIG[todaySession.phase].color}15`,
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: '14px' }}>
              <Target size={16} style={{ color: PHASE_CONFIG[todaySession.phase].color }} />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: PHASE_CONFIG[todaySession.phase].color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                Today&apos;s Plan
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  backgroundColor: PHASE_CONFIG[todaySession.phase].colorDim,
                }}
              >
                {(() => {
                  const Icon = PHASE_CONFIG[todaySession.phase].icon;
                  return <Icon size={24} style={{ color: PHASE_CONFIG[todaySession.phase].color }} />;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-ui)',
                    margin: 0,
                  }}
                >
                  {todaySession.activity}
                </p>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    margin: '4px 0 0',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {todaySession.topic} &middot; {todaySession.duration} min &middot;{' '}
                  <span style={{ textTransform: 'capitalize' }}>{todaySession.timeSlot}</span>
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: PHASE_CONFIG[todaySession.phase].colorDim,
                    color: PHASE_CONFIG[todaySession.phase].color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {PHASE_CONFIG[todaySession.phase].label} Phase
                </span>
              </div>
            </div>

            <motion.button
              onClick={() => handleStartSession(todaySession)}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  `0 0 16px ${PHASE_CONFIG[todaySession.phase].color}30`,
                  `0 0 28px ${PHASE_CONFIG[todaySession.phase].color}50`,
                  `0 0 16px ${PHASE_CONFIG[todaySession.phase].color}30`,
                ],
              }}
              transition={{
                boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: PHASE_CONFIG[todaySession.phase].color,
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'var(--font-ui)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                letterSpacing: '-0.01em',
              }}
            >
              <Play size={18} />
              Start Session
            </motion.button>
          </motion.div>
        ) : (
          <SectionCard>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(52,199,89,0.12)',
                }}
              >
                <CheckCircle2 size={20} style={{ color: '#34c759' }} />
              </div>
              <div>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-ui)',
                    margin: 0,
                  }}
                >
                  {schedule && schedule.sessions.every((s) => s.completed)
                    ? 'All sessions completed!'
                    : 'No session scheduled for today'}
                </p>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    margin: '2px 0 0',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {schedule && schedule.sessions.every((s) => s.completed)
                    ? 'You finished your study plan. Great job!'
                    : 'Check the calendar for upcoming sessions'}
                </p>
              </div>
            </div>
          </SectionCard>
        )}
      </motion.div>

      {/* Calendar Week View */}
      <motion.div variants={sectionVariants}>
        <SectionCard>
          {/* Week Navigation */}
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <motion.button
              onClick={() => navigateWeek(-1)}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                border: '1px solid var(--bg-border-strong)',
                backgroundColor: 'var(--bg-overlay)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={16} />
            </motion.button>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {formatDateShort(weekDates[0])} &ndash; {formatDateShort(weekDates[6])}
            </span>
            <motion.button
              onClick={() => navigateWeek(1)}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                border: '1px solid var(--bg-border-strong)',
                backgroundColor: 'var(--bg-overlay)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>

          {/* Day headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '4px',
            }}
          >
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                style={{
                  textAlign: 'center',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--font-ui)',
                  padding: '4px 0',
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={weekOffset}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
              }}
            >
              {weekDates.map((dateStr) => {
                const session = sessionsThisWeek.get(dateStr);
                const isToday = dateStr === today;
                const isPast = dateStr < today;
                const isMissed = session && !session.completed && isPast;
                const isDone = session?.completed;

                let borderColor = 'transparent';
                let bgColor = 'var(--bg-base)';

                if (isToday) {
                  borderColor = 'var(--accent-blue)';
                  bgColor = 'rgba(79,142,247,0.08)';
                }
                if (session) {
                  bgColor = PHASE_CONFIG[session.phase].colorDim;
                  if (isToday) {
                    borderColor = PHASE_CONFIG[session.phase].color;
                  }
                }

                return (
                  <div
                    key={dateStr}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '8px 2px',
                      borderRadius: '10px',
                      border: `1.5px solid ${borderColor}`,
                      backgroundColor: bgColor,
                      minHeight: '64px',
                      opacity: isPast && !session ? 0.4 : 1,
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: isToday ? 700 : 500,
                        color: isToday ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-ui)',
                      }}
                    >
                      {new Date(dateStr + 'T00:00:00').getDate()}
                    </span>
                    {session && (
                      <div
                        className="flex flex-col items-center"
                        style={{ marginTop: '4px', gap: '2px' }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: PHASE_CONFIG[session.phase].color,
                            opacity: isDone ? 0.5 : 1,
                          }}
                        />
                        {isDone && (
                          <CheckCircle2
                            size={12}
                            style={{ color: '#34c759' }}
                          />
                        )}
                        {isMissed && (
                          <XCircle
                            size={12}
                            style={{ color: 'var(--accent-red)' }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </SectionCard>
      </motion.div>

      {/* Upcoming Sessions List */}
      <motion.div variants={sectionVariants}>
        <SectionCard>
          <SectionTitle>Upcoming Sessions</SectionTitle>
          <div className="flex flex-col gap-2">
            {schedule?.sessions
              .filter((s) => s.date >= today && !s.completed)
              .slice(0, 7)
              .map((session, i) => {
                const config = PHASE_CONFIG[session.phase];
                const isToday = session.date === today;
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3"
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: isToday ? config.colorDim : 'var(--bg-base)',
                      border: isToday
                        ? `1px solid ${config.color}30`
                        : '1px solid var(--bg-border)',
                    }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        backgroundColor: config.colorDim,
                      }}
                    >
                      {(() => {
                        const Icon = config.icon;
                        return <Icon size={18} style={{ color: config.color }} />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: '13px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-ui)',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {session.activity}
                      </p>
                      <p
                        style={{
                          color: 'var(--text-tertiary)',
                          fontSize: '11px',
                          fontFamily: 'var(--font-ui)',
                          margin: '2px 0 0',
                        }}
                      >
                        {session.topic} &middot; {session.duration}m
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          color: isToday ? config.color : 'var(--text-tertiary)',
                          fontFamily: 'var(--font-ui)',
                        }}
                      >
                        {isToday ? 'Today' : formatDate(session.date)}
                      </span>
                      {isToday && (
                        <motion.button
                          onClick={() => handleStartSession(session)}
                          whileTap={{ scale: 0.93 }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: config.color,
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-ui)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Play size={10} />
                          Start
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            {schedule?.sessions.filter((s) => s.date >= today && !s.completed).length === 0 && (
              <div
                className="flex flex-col items-center gap-2"
                style={{ padding: '20px', textAlign: 'center' }}
              >
                <TrendingUp size={24} style={{ color: '#34c759' }} />
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  All sessions completed!
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* Completed / Missed sessions summary */}
      {schedule && schedule.sessions.some((s) => s.date < today) && (
        <motion.div variants={sectionVariants}>
          <SectionCard>
            <SectionTitle>Past Sessions</SectionTitle>
            <div className="flex flex-col gap-2">
              {schedule.sessions
                .filter((s) => s.date < today)
                .reverse()
                .slice(0, 5)
                .map((session) => {
                  const config = PHASE_CONFIG[session.phase];
                  return (
                    <div
                      key={session.id}
                      className="flex items-center gap-3"
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-base)',
                        border: '1px solid var(--bg-border)',
                        opacity: 0.8,
                      }}
                    >
                      {session.completed ? (
                        <CheckCircle2 size={16} style={{ color: '#34c759', flexShrink: 0 }} />
                      ) : (
                        <XCircle size={16} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '12px',
                            fontWeight: 500,
                            fontFamily: 'var(--font-ui)',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {session.activity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: config.color,
                          }}
                        />
                        <span
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-tertiary)',
                            fontFamily: 'var(--font-ui)',
                          }}
                        >
                          {formatDateShort(session.date)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </SectionCard>
        </motion.div>
      )}
    </motion.div>
  );
}
