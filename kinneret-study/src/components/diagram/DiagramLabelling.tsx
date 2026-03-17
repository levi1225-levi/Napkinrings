import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Tag,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DiagramLabel {
  number: number;
  correct: string;
  x: number;
  y: number;
}

export interface DiagramData {
  id: string;
  title: string;
  system: 'digestive' | 'respiratory' | 'circulatory';
  labels: DiagramLabel[];
  wordBank: string[];
}

type Mode = 'study' | 'practice';

interface DiagramLabellingProps {
  diagram: DiagramData;
  onComplete?: (score: number, total: number) => void;
}

// ─── Diagram Datasets ───────────────────────────────────────────────────────

export const DIGESTIVE_SYSTEM: DiagramData = {
  id: 'digestive-system',
  title: 'Digestive System',
  system: 'digestive',
  labels: [
    { number: 1, correct: 'Oral cavity', x: 50, y: 5 },
    { number: 2, correct: 'Salivary glands', x: 72, y: 8 },
    { number: 3, correct: 'Pharynx', x: 50, y: 13 },
    { number: 4, correct: 'Esophagus', x: 50, y: 22 },
    { number: 5, correct: 'Liver', x: 35, y: 35 },
    { number: 6, correct: 'Stomach', x: 62, y: 40 },
    { number: 7, correct: 'Gallbladder', x: 30, y: 42 },
    { number: 8, correct: 'Pancreas', x: 62, y: 50 },
    { number: 9, correct: 'Small intestine', x: 50, y: 60 },
    { number: 10, correct: 'Large intestine', x: 30, y: 55 },
    { number: 11, correct: 'Appendix', x: 25, y: 70 },
    { number: 12, correct: 'Rectum', x: 50, y: 80 },
    { number: 13, correct: 'Anus', x: 50, y: 88 },
  ],
  wordBank: [
    'Oral cavity', 'Salivary glands', 'Pharynx', 'Esophagus', 'Liver',
    'Stomach', 'Gallbladder', 'Pancreas', 'Small intestine', 'Large intestine',
    'Appendix', 'Rectum', 'Anus',
  ],
};

export const RESPIRATORY_SYSTEM: DiagramData = {
  id: 'respiratory-system',
  title: 'Respiratory System',
  system: 'respiratory',
  labels: [
    { number: 1, correct: 'Nasal cavity', x: 48, y: 5 },
    { number: 2, correct: 'Epiglottis', x: 52, y: 14 },
    { number: 3, correct: 'Trachea', x: 50, y: 25 },
    { number: 4, correct: 'Right lung', x: 28, y: 48 },
    { number: 5, correct: 'Right bronchus', x: 35, y: 35 },
    { number: 6, correct: 'Sternum', x: 50, y: 42 },
    { number: 7, correct: 'Diaphragm', x: 50, y: 80 },
    { number: 8, correct: 'Pharynx', x: 52, y: 10 },
    { number: 9, correct: 'Larynx', x: 50, y: 19 },
    { number: 10, correct: 'Bronchiole', x: 68, y: 50 },
    { number: 11, correct: 'Alveoli', x: 72, y: 60 },
    { number: 12, correct: 'Left lung', x: 72, y: 48 },
    { number: 13, correct: 'Left bronchus', x: 65, y: 35 },
  ],
  wordBank: [
    'Nasal cavity', 'Epiglottis', 'Trachea', 'Right lung', 'Right bronchus',
    'Sternum', 'Diaphragm', 'Pharynx', 'Larynx', 'Bronchiole', 'Alveoli',
    'Left lung', 'Left bronchus',
  ],
};

export const CIRCULATORY_SYSTEM: DiagramData = {
  id: 'circulatory-system',
  title: 'Circulatory System / Heart',
  system: 'circulatory',
  labels: [
    { number: 1, correct: 'Superior vena cava', x: 30, y: 12 },
    { number: 2, correct: 'Ascending aorta', x: 55, y: 8 },
    { number: 3, correct: 'Pulmonary artery', x: 50, y: 18 },
    { number: 4, correct: 'Pulmonary veins', x: 72, y: 30 },
    { number: 5, correct: 'Right atrium', x: 28, y: 35 },
    { number: 6, correct: 'Left atrium', x: 72, y: 38 },
    { number: 7, correct: 'Right ventricle', x: 35, y: 60 },
    { number: 8, correct: 'Left ventricle', x: 65, y: 60 },
    { number: 9, correct: 'Inferior vena cava', x: 28, y: 82 },
    { number: 10, correct: 'Descending aorta', x: 72, y: 82 },
    { number: 11, correct: 'Septum', x: 50, y: 55 },
  ],
  wordBank: [
    'Superior vena cava', 'Ascending aorta', 'Pulmonary artery',
    'Pulmonary veins', 'Right atrium', 'Left atrium', 'Right ventricle',
    'Left ventricle', 'Inferior vena cava', 'Descending aorta', 'Septum',
  ],
};

export const DIAGRAM_DATA: DiagramData[] = [
  DIGESTIVE_SYSTEM,
  RESPIRATORY_SYSTEM,
  CIRCULATORY_SYSTEM,
];

// ─── SVG Diagram Renderers ──────────────────────────────────────────────────

function DigestiveSVG() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" style={{ maxHeight: '100%' }}>
      {/* Head outline */}
      <ellipse cx="150" cy="30" rx="35" ry="25" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" opacity={0.4} />
      {/* Oral cavity */}
      <ellipse cx="150" cy="28" rx="18" ry="10" fill="#e8455822" stroke="#e84558" strokeWidth="1.2" />
      {/* Salivary glands */}
      <circle cx="125" cy="35" r="6" fill="#a78bfa22" stroke="#a78bfa" strokeWidth="1" />
      <circle cx="175" cy="35" r="6" fill="#a78bfa22" stroke="#a78bfa" strokeWidth="1" />
      {/* Pharynx */}
      <rect x="143" y="45" width="14" height="14" rx="4" fill="#f59e0b22" stroke="#f59e0b" strokeWidth="1.2" />
      {/* Esophagus - tube */}
      <path d="M150 59 L150 130" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" opacity={0.5} />
      <path d="M150 59 L150 130" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      {/* Torso outline */}
      <path d="M90 70 Q80 180 85 320 Q90 350 150 360 Q210 350 215 320 Q220 180 210 70" fill="none" stroke="var(--text-muted)" strokeWidth="1" opacity={0.2} />
      {/* Liver */}
      <path d="M95 130 Q90 140 95 155 Q110 165 140 155 Q145 145 140 130 Q120 120 95 130Z" fill="#4f8ef722" stroke="#4f8ef7" strokeWidth="1.5" />
      {/* Stomach */}
      <path d="M155 135 Q175 130 190 145 Q195 165 185 180 Q170 190 155 180 Q145 165 150 145Z" fill="#e8455822" stroke="#e84558" strokeWidth="1.5" />
      {/* Gallbladder */}
      <ellipse cx="100" cy="170" rx="10" ry="14" fill="#34d39922" stroke="#34d399" strokeWidth="1.2" />
      {/* Pancreas */}
      <path d="M155 195 Q175 190 195 195 Q200 200 195 205 Q175 210 155 205 Q150 200 155 195Z" fill="#f59e0b22" stroke="#f59e0b" strokeWidth="1.2" />
      {/* Small intestine - coiled */}
      <path d="M140 215 Q120 225 130 240 Q150 250 170 240 Q180 225 160 220 Q140 225 135 240 Q140 260 160 265 Q175 260 170 245" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" opacity={0.6} />
      <path d="M140 215 Q120 225 130 240 Q150 250 170 240 Q180 225 160 220 Q140 225 135 240 Q140 260 160 265 Q175 260 170 245" fill="none" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" />
      {/* Large intestine - frame */}
      <path d="M90 215 L90 180 Q90 170 100 170 L100 170 Q105 195 100 220 L90 215Z" fill="none" stroke="#4f8ef7" strokeWidth="1" opacity={0.3} />
      <path d="M85 270 L85 200 Q85 185 95 185 L95 185 Q100 200 95 280 Q95 290 105 295 L190 295 Q200 290 200 280 L200 200 Q200 185 190 185" fill="none" stroke="#4f8ef7" strokeWidth="2.5" strokeLinecap="round" opacity={0.5} />
      <path d="M85 270 L85 200 Q85 185 95 185 Q100 200 95 280 Q95 290 105 295 L190 295 Q200 290 200 280 L200 200 Q200 185 190 185" fill="none" stroke="#4f8ef7" strokeWidth="1.2" strokeLinecap="round" />
      {/* Appendix */}
      <path d="M88 280 Q75 290 78 300" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <circle cx="78" cy="302" r="3" fill="#34d399" opacity={0.6} />
      {/* Rectum */}
      <path d="M150 300 L150 330" fill="none" stroke="#e84558" strokeWidth="4" strokeLinecap="round" opacity={0.4} />
      <path d="M150 300 L150 330" fill="none" stroke="#e84558" strokeWidth="1.5" strokeLinecap="round" />
      {/* Anus */}
      <ellipse cx="150" cy="345" rx="8" ry="5" fill="#e8455822" stroke="#e84558" strokeWidth="1.2" />
    </svg>
  );
}

function RespiratorySVG() {
  return (
    <svg viewBox="0 0 300 380" width="100%" height="100%" style={{ maxHeight: '100%' }}>
      {/* Head/nose outline */}
      <path d="M140 10 Q135 25 138 40 Q142 45 150 45 Q158 45 162 40 Q165 25 160 10" fill="none" stroke="var(--text-muted)" strokeWidth="1" opacity={0.3} />
      {/* Nasal cavity */}
      <path d="M142 15 Q140 28 143 38 Q150 42 157 38 Q160 28 158 15" fill="#a78bfa22" stroke="#a78bfa" strokeWidth="1.5" />
      {/* Pharynx */}
      <rect x="144" y="46" width="12" height="12" rx="3" fill="#f59e0b22" stroke="#f59e0b" strokeWidth="1.2" />
      {/* Epiglottis */}
      <path d="M146 58 Q150 63 154 58" fill="none" stroke="#e84558" strokeWidth="2" strokeLinecap="round" />
      {/* Larynx */}
      <path d="M143 68 L157 68 L155 80 L145 80 Z" fill="#34d39922" stroke="#34d399" strokeWidth="1.2" />
      {/* Trachea */}
      <path d="M148 80 L148 135 M152 80 L152 135" fill="none" stroke="#4f8ef7" strokeWidth="1.5" />
      {/* Trachea rings */}
      {[88, 96, 104, 112, 120, 128].map((y) => (
        <line key={y} x1="147" y1={y} x2="153" y2={y} stroke="#4f8ef7" strokeWidth="1" opacity={0.6} />
      ))}
      {/* Bronchi split */}
      <path d="M150 135 Q130 150 105 155" fill="none" stroke="#4f8ef7" strokeWidth="2" />
      <path d="M150 135 Q170 150 195 155" fill="none" stroke="#4f8ef7" strokeWidth="2" />
      {/* Right lung */}
      <path d="M60 130 Q55 160 58 230 Q60 270 80 290 Q110 305 125 285 Q135 260 130 155 Q128 130 110 125 Q85 122 60 130Z" fill="#4f8ef722" stroke="#4f8ef7" strokeWidth="1.8" />
      {/* Left lung */}
      <path d="M240 130 Q245 160 242 230 Q240 270 220 290 Q190 305 175 285 Q165 260 170 155 Q172 130 190 125 Q215 122 240 130Z" fill="#4f8ef722" stroke="#4f8ef7" strokeWidth="1.8" />
      {/* Bronchioles in right lung */}
      <path d="M105 155 Q95 165 90 180 M105 155 Q100 175 105 195 M105 155 Q90 170 85 200" fill="none" stroke="#a78bfa" strokeWidth="1" opacity={0.6} />
      {/* Bronchioles in left lung */}
      <path d="M195 155 Q205 165 210 180 M195 155 Q200 175 195 195 M195 155 Q210 170 215 200" fill="none" stroke="#a78bfa" strokeWidth="1" opacity={0.6} />
      {/* Alveoli clusters */}
      {[
        [88, 220], [78, 235], [98, 240], [85, 255],
        [212, 220], [222, 235], [202, 240], [215, 255],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="#a78bfa22" stroke="#a78bfa" strokeWidth="0.8" />
      ))}
      {/* Sternum */}
      <rect x="146" y="150" width="8" height="80" rx="3" fill="#f59e0b15" stroke="#f59e0b" strokeWidth="1" opacity={0.7} />
      {/* Diaphragm */}
      <path d="M55 300 Q100 280 150 310 Q200 280 245 300" fill="none" stroke="#e84558" strokeWidth="2.5" strokeLinecap="round" opacity={0.6} />
      <path d="M55 300 Q100 280 150 310 Q200 280 245 300" fill="#e8455811" stroke="none" />
    </svg>
  );
}

function CirculatorySVG() {
  return (
    <svg viewBox="0 0 300 380" width="100%" height="100%" style={{ maxHeight: '100%' }}>
      {/* Heart outline */}
      <path
        d="M150 45 Q100 20 75 60 Q55 100 65 150 Q75 200 100 240 Q130 280 150 310 Q170 280 200 240 Q225 200 235 150 Q245 100 225 60 Q200 20 150 45Z"
        fill="#e8455812"
        stroke="#e84558"
        strokeWidth="2"
      />
      {/* Superior vena cava */}
      <path d="M95 25 L95 60 Q95 80 105 90 L105 130" fill="none" stroke="#4f8ef7" strokeWidth="4" opacity={0.5} />
      <path d="M95 25 L95 60 Q95 80 105 90 L105 130" fill="none" stroke="#4f8ef7" strokeWidth="1.5" />
      {/* Ascending aorta */}
      <path d="M180 30 Q175 40 170 55 Q168 70 175 85" fill="none" stroke="#e84558" strokeWidth="4" opacity={0.5} />
      <path d="M180 30 Q175 40 170 55 Q168 70 175 85" fill="none" stroke="#e84558" strokeWidth="1.5" />
      {/* Aortic arch */}
      <path d="M180 30 Q200 15 210 30 Q215 45 210 60" fill="none" stroke="#e84558" strokeWidth="3" opacity={0.4} />
      {/* Pulmonary artery */}
      <path d="M145 65 Q140 50 130 45 Q120 42 110 50 M160 65 Q165 50 175 45 Q185 42 195 50" fill="none" stroke="#a78bfa" strokeWidth="2.5" opacity={0.5} />
      <path d="M145 65 Q140 50 130 45 Q120 42 110 50 M160 65 Q165 50 175 45 Q185 42 195 50" fill="none" stroke="#a78bfa" strokeWidth="1.2" />
      {/* Pulmonary veins */}
      <path d="M220 100 Q210 110 195 115 M225 120 Q210 125 195 125" fill="none" stroke="#e84558" strokeWidth="1.5" opacity={0.6} />
      {/* Septum - vertical divider */}
      <path d="M150 80 L150 250" fill="none" stroke="var(--text-muted)" strokeWidth="3" strokeDasharray="4 4" opacity={0.4} />
      {/* Right atrium */}
      <path d="M100 100 Q80 110 80 135 Q80 155 100 160 Q120 155 125 135 Q125 110 100 100Z" fill="#4f8ef722" stroke="#4f8ef7" strokeWidth="1.5" />
      <text x="100" y="135" textAnchor="middle" fill="#4f8ef7" fontSize="10" fontWeight="600" opacity={0.5}>RA</text>
      {/* Left atrium */}
      <path d="M200 105 Q220 115 220 140 Q220 160 200 165 Q180 160 175 140 Q175 115 200 105Z" fill="#e8455822" stroke="#e84558" strokeWidth="1.5" />
      <text x="200" y="140" textAnchor="middle" fill="#e84558" fontSize="10" fontWeight="600" opacity={0.5}>LA</text>
      {/* Tricuspid valve */}
      <path d="M95 160 Q105 170 115 160" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" />
      {/* Mitral valve */}
      <path d="M185 165 Q195 175 205 165" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" />
      {/* Right ventricle */}
      <path d="M85 170 Q70 200 80 240 Q95 270 130 280 Q140 275 145 250 L145 180 Q140 170 125 170 Z" fill="#4f8ef715" stroke="#4f8ef7" strokeWidth="1.5" />
      <text x="110" y="230" textAnchor="middle" fill="#4f8ef7" fontSize="10" fontWeight="600" opacity={0.5}>RV</text>
      {/* Left ventricle */}
      <path d="M215 170 Q230 200 220 240 Q205 270 170 280 Q160 275 155 250 L155 180 Q160 170 175 170 Z" fill="#e8455815" stroke="#e84558" strokeWidth="1.5" />
      <text x="190" y="230" textAnchor="middle" fill="#e84558" fontSize="10" fontWeight="600" opacity={0.5}>LV</text>
      {/* Inferior vena cava */}
      <path d="M100 280 Q95 300 90 320" fill="none" stroke="#4f8ef7" strokeWidth="4" opacity={0.5} />
      <path d="M100 280 Q95 300 90 320" fill="none" stroke="#4f8ef7" strokeWidth="1.5" />
      {/* Descending aorta */}
      <path d="M200 280 Q205 300 210 320" fill="none" stroke="#e84558" strokeWidth="4" opacity={0.5} />
      <path d="M200 280 Q205 300 210 320" fill="none" stroke="#e84558" strokeWidth="1.5" />
    </svg>
  );
}

const SYSTEM_COLORS: Record<string, string> = {
  digestive: '#f59e0b',
  respiratory: '#4f8ef7',
  circulatory: '#e84558',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DiagramLabelling({ diagram, onComplete }: DiagramLabellingProps) {
  const [mode, setMode] = useState<Mode>('practice');
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const accentColor = SYSTEM_COLORS[diagram.system] ?? '#4f8ef7';

  const shuffledBank = useMemo(
    () => shuffleArray(diagram.wordBank),
    [diagram.wordBank],
  );

  const usedWords = useMemo(() => new Set(Object.values(assignments)), [assignments]);

  const score = useMemo(() => {
    if (!submitted) return { correct: 0, total: diagram.labels.length };
    const correct = Object.values(results).filter(Boolean).length;
    return { correct, total: diagram.labels.length };
  }, [submitted, results, diagram.labels.length]);

  const handlePointClick = useCallback(
    (labelNumber: number) => {
      if (submitted || mode === 'study') return;
      setSelectedPoint((prev) => (prev === labelNumber ? null : labelNumber));
    },
    [submitted, mode],
  );

  const handleWordClick = useCallback(
    (word: string) => {
      if (submitted || mode === 'study' || selectedPoint === null) return;

      setAssignments((prev) => {
        const next = { ...prev };
        // Remove the word from any other assignment
        for (const key of Object.keys(next)) {
          if (next[Number(key)] === word) {
            delete next[Number(key)];
          }
        }
        // If the point already has the same word, unassign it
        if (prev[selectedPoint] === word) {
          delete next[selectedPoint];
        } else {
          next[selectedPoint] = word;
        }
        return next;
      });
      setSelectedPoint(null);
    },
    [submitted, mode, selectedPoint],
  );

  const handleSubmit = useCallback(() => {
    const newResults: Record<number, boolean> = {};
    for (const label of diagram.labels) {
      newResults[label.number] =
        (assignments[label.number] ?? '').toLowerCase() === label.correct.toLowerCase();
    }
    setResults(newResults);
    setSubmitted(true);

    const correct = Object.values(newResults).filter(Boolean).length;
    onComplete?.(correct, diagram.labels.length);
  }, [assignments, diagram.labels, onComplete]);

  const handleReset = useCallback(() => {
    setAssignments({});
    setSubmitted(false);
    setResults({});
    setSelectedPoint(null);
  }, []);

  const handleModeToggle = useCallback(() => {
    setMode((prev) => (prev === 'study' ? 'practice' : 'study'));
    handleReset();
  }, [handleReset]);

  // ── Label point color logic ──
  const getPointColor = (labelNumber: number): string => {
    if (submitted) {
      return results[labelNumber] ? '#34d399' : '#e84558';
    }
    if (selectedPoint === labelNumber) return accentColor;
    if (assignments[labelNumber]) return '#a78bfa';
    return 'var(--text-muted)';
  };

  const getPointBg = (labelNumber: number): string => {
    if (submitted) {
      return results[labelNumber] ? '#34d39920' : '#e8455820';
    }
    if (selectedPoint === labelNumber) return `${accentColor}30`;
    if (assignments[labelNumber]) return '#a78bfa20';
    return 'var(--bg-elevated)';
  };

  // ── Render SVG for the system ──
  const renderDiagram = () => {
    switch (diagram.system) {
      case 'digestive':
        return <DigestiveSVG />;
      case 'respiratory':
        return <RespiratorySVG />;
      case 'circulatory':
        return <CirculatorySVG />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Tag size={18} style={{ color: accentColor }} />
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {diagram.title}
          </h2>
        </div>

        {/* Mode toggle */}
        <motion.button
          onClick={handleModeToggle}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '10px',
            border: `1px solid ${accentColor}40`,
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {mode === 'study' ? <Eye size={14} /> : <Pencil size={14} />}
          {mode === 'study' ? 'Study Mode' : 'Practice Mode'}
        </motion.button>
      </div>

      {/* ── Diagram area ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4',
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: '16px',
          border: '1px solid var(--bg-border)',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }}
      >
        {/* SVG illustration */}
        <div
          style={{
            position: 'absolute',
            inset: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.85,
          }}
        >
          {renderDiagram()}
        </div>

        {/* Label points overlay */}
        {diagram.labels.map((label) => {
          const assigned = assignments[label.number];
          const isSelected = selectedPoint === label.number;
          const displayText =
            mode === 'study'
              ? label.correct
              : submitted
                ? label.correct
                : assigned ?? null;

          return (
            <motion.div
              key={label.number}
              onClick={() => handlePointClick(label.number)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                ...(submitted && results[label.number] === false
                  ? {} : {}),
              }}
              transition={{ delay: label.number * 0.03, type: 'spring', stiffness: 400, damping: 20 }}
              style={{
                position: 'absolute',
                left: `${label.x}%`,
                top: `${label.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 20 : 10,
                cursor: mode === 'study' || submitted ? 'default' : 'pointer',
              }}
            >
              {/* Pulse ring for selected */}
              <AnimatePresence>
                {isSelected && !submitted && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: `2px solid ${accentColor}`,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Number circle */}
              <motion.div
                animate={
                  submitted
                    ? {
                        scale: [1, 1.15, 1],
                        transition: { delay: label.number * 0.05, duration: 0.3 },
                      }
                    : {}
                }
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: getPointBg(label.number),
                  border: `2px solid ${getPointColor(label.number)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: getPointColor(label.number),
                  boxShadow: isSelected
                    ? `0 0 12px ${accentColor}40`
                    : '0 1px 4px rgba(0,0,0,0.3)',
                  transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
                }}
              >
                {label.number}
              </motion.div>

              {/* Label tooltip */}
              {displayText && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '4px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    backgroundColor: submitted
                      ? results[label.number]
                        ? '#34d39925'
                        : '#e8455825'
                      : mode === 'study'
                        ? `${accentColor}20`
                        : '#a78bfa20',
                    border: `1px solid ${
                      submitted
                        ? results[label.number]
                          ? '#34d39950'
                          : '#e8455850'
                        : mode === 'study'
                          ? `${accentColor}40`
                          : '#a78bfa40'
                    }`,
                    fontSize: '10px',
                    fontWeight: 600,
                    color: submitted
                      ? results[label.number]
                        ? '#34d399'
                        : '#e84558'
                      : mode === 'study'
                        ? accentColor
                        : '#a78bfa',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                >
                  {displayText}
                  {submitted && !results[label.number] && assigned && (
                    <span style={{ display: 'block', textDecoration: 'line-through', opacity: 0.6 }}>
                      {assigned}
                    </span>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Word Bank (practice mode) ── */}
      {mode === 'practice' && !submitted && (
        <div
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '14px',
            border: '1px solid var(--bg-border)',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <p
            style={{
              margin: '0 0 10px 0',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            {selectedPoint
              ? `Assign label to point #${selectedPoint}`
              : 'Tap a numbered point, then select a word'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {shuffledBank.map((word) => {
              const isUsed = usedWords.has(word);
              return (
                <motion.button
                  key={word}
                  onClick={() => handleWordClick(word)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${
                      isUsed ? '#a78bfa40' : 'var(--bg-border-strong)'
                    }`,
                    backgroundColor: isUsed ? '#a78bfa15' : 'var(--bg-surface)',
                    color: isUsed ? '#a78bfa' : 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: selectedPoint ? 'pointer' : 'default',
                    opacity: isUsed && selectedPoint === null ? 0.5 : 1,
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {word}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      {mode === 'practice' && (
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          {!submitted ? (
            <motion.button
              onClick={handleSubmit}
              whileTap={{ scale: 0.97 }}
              disabled={Object.keys(assignments).length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: accentColor,
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor:
                  Object.keys(assignments).length === 0 ? 'not-allowed' : 'pointer',
                opacity: Object.keys(assignments).length === 0 ? 0.4 : 1,
                fontFamily: 'inherit',
              }}
            >
              <CheckCircle size={16} />
              Check Answers
            </motion.button>
          ) : (
            <motion.button
              onClick={handleReset}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '12px',
                border: `1px solid ${accentColor}40`,
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <RotateCcw size={16} />
              Try Again
            </motion.button>
          )}
        </div>
      )}

      {/* ── Score display ── */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '16px 20px',
              borderRadius: '14px',
              backgroundColor:
                score.correct === score.total ? '#34d39918' : 'var(--bg-elevated)',
              border: `1px solid ${
                score.correct === score.total ? '#34d39940' : 'var(--bg-border)'
              }`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {score.correct === score.total ? (
              <Trophy size={24} style={{ color: '#f59e0b' }} />
            ) : (
              <XCircle size={24} style={{ color: 'var(--text-secondary)' }} />
            )}
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {score.correct} / {score.total} correct
              </p>
              <p
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                }}
              >
                {score.correct === score.total
                  ? 'Perfect score! You know this system well.'
                  : score.correct >= score.total * 0.7
                    ? 'Good job! Review the ones you missed.'
                    : 'Keep studying and try again!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results breakdown (after submit) ── */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '14px',
                border: '1px solid var(--bg-border)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <p
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                Results
              </p>
              {diagram.labels.map((label) => (
                <motion.div
                  key={label.number}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: label.number * 0.04 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    backgroundColor: results[label.number]
                      ? '#34d39910'
                      : '#e8455810',
                  }}
                >
                  {results[label.number] ? (
                    <CheckCircle size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                  ) : (
                    <XCircle size={14} style={{ color: '#e84558', flexShrink: 0 }} />
                  )}
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      minWidth: '18px',
                    }}
                  >
                    {label.number}.
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: results[label.number]
                        ? '#34d399'
                        : 'var(--text-primary)',
                      flex: 1,
                    }}
                  >
                    {label.correct}
                  </span>
                  {!results[label.number] && assignments[label.number] && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#e84558',
                        textDecoration: 'line-through',
                        opacity: 0.7,
                      }}
                    >
                      {assignments[label.number]}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
