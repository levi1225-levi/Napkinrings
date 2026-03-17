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
    { number: 1, correct: 'Oral cavity', x: 50, y: 7 },
    { number: 2, correct: 'Salivary glands', x: 30, y: 10 },
    { number: 3, correct: 'Pharynx', x: 50, y: 14 },
    { number: 4, correct: 'Esophagus', x: 56, y: 22 },
    { number: 5, correct: 'Liver', x: 35, y: 38 },
    { number: 6, correct: 'Stomach', x: 65, y: 42 },
    { number: 7, correct: 'Gallbladder', x: 33, y: 48 },
    { number: 8, correct: 'Pancreas', x: 68, y: 52 },
    { number: 9, correct: 'Small intestine', x: 50, y: 68 },
    { number: 10, correct: 'Large intestine', x: 28, y: 60 },
    { number: 11, correct: 'Appendix', x: 25, y: 84 },
    { number: 12, correct: 'Rectum', x: 50, y: 90 },
    { number: 13, correct: 'Anus', x: 50, y: 95 },
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
    { number: 1, correct: 'Nasal cavity', x: 38, y: 6 },
    { number: 2, correct: 'Epiglottis', x: 55, y: 19 },
    { number: 3, correct: 'Trachea', x: 55, y: 32 },
    { number: 4, correct: 'Right lung', x: 22, y: 55 },
    { number: 5, correct: 'Right bronchus', x: 28, y: 42 },
    { number: 6, correct: 'Sternum', x: 50, y: 48 },
    { number: 7, correct: 'Diaphragm', x: 50, y: 84 },
    { number: 8, correct: 'Pharynx', x: 55, y: 14 },
    { number: 9, correct: 'Larynx', x: 55, y: 22 },
    { number: 10, correct: 'Bronchiole', x: 72, y: 53 },
    { number: 11, correct: 'Alveoli', x: 75, y: 68 },
    { number: 12, correct: 'Left lung', x: 78, y: 55 },
    { number: 13, correct: 'Left bronchus', x: 72, y: 42 },
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
    { number: 1, correct: 'Superior vena cava', x: 32, y: 25 },
    { number: 2, correct: 'Ascending aorta', x: 62, y: 25 },
    { number: 3, correct: 'Pulmonary artery', x: 27, y: 35 },
    { number: 4, correct: 'Pulmonary veins', x: 73, y: 42 },
    { number: 5, correct: 'Right atrium', x: 35, y: 40 },
    { number: 6, correct: 'Left atrium', x: 65, y: 40 },
    { number: 7, correct: 'Right ventricle', x: 38, y: 50 },
    { number: 8, correct: 'Left ventricle', x: 62, y: 50 },
    { number: 9, correct: 'Inferior vena cava', x: 35, y: 70 },
    { number: 10, correct: 'Descending aorta', x: 62, y: 70 },
    { number: 11, correct: 'Septum', x: 50, y: 45 },
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
    <svg viewBox="0 0 400 520" width="100%" height="100%" style={{ maxHeight: '100%' }}>
      <defs>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5d0b0" />
          <stop offset="100%" stopColor="#e8c4a0" />
        </linearGradient>
        <linearGradient id="liverGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b3a3a" />
          <stop offset="100%" stopColor="#6b2020" />
        </linearGradient>
        <linearGradient id="stomachGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8a0a0" />
          <stop offset="100%" stopColor="#d08080" />
        </linearGradient>
      </defs>

      {/* Body silhouette */}
      <path d="M200 10 Q170 10 160 30 Q150 50 155 70 L155 75 Q140 80 130 95 Q115 115 110 140 L105 180 Q100 220 100 260 L95 340 Q92 400 95 460 Q97 490 110 510 L290 510 Q303 490 305 460 Q308 400 305 340 L300 260 Q300 220 295 180 L290 140 Q285 115 270 95 Q260 80 245 75 L245 70 Q250 50 240 30 Q230 10 200 10Z"
        fill="url(#skinGrad)" stroke="#d4a882" strokeWidth="1.5" opacity={0.6} />

      {/* Head cross-section area */}
      <path d="M175 20 Q165 25 162 40 Q160 55 165 68 L235 68 Q240 55 238 40 Q235 25 225 20Z"
        fill="#f0c8a8" stroke="#d4a882" strokeWidth="1" opacity={0.8} />

      {/* Oral cavity */}
      <ellipse cx="200" cy="38" rx="22" ry="14" fill="#cc4455" stroke="#aa2233" strokeWidth="1.5" />
      <ellipse cx="200" cy="36" rx="16" ry="8" fill="#dd6677" stroke="none" opacity={0.5} />
      {/* Teeth hint */}
      <path d="M184 33 Q192 30 200 31 Q208 30 216 33" fill="none" stroke="#fff" strokeWidth="1" opacity={0.4} />
      <path d="M184 43 Q192 46 200 45 Q208 46 216 43" fill="none" stroke="#fff" strokeWidth="1" opacity={0.4} />
      {/* Tongue */}
      <ellipse cx="200" cy="42" rx="12" ry="5" fill="#cc5566" stroke="#aa3344" strokeWidth="0.8" />

      {/* Salivary glands */}
      <ellipse cx="172" cy="52" rx="8" ry="6" fill="#e8b090" stroke="#c89070" strokeWidth="1" />
      <ellipse cx="228" cy="52" rx="8" ry="6" fill="#e8b090" stroke="#c89070" strokeWidth="1" />
      <ellipse cx="168" cy="42" rx="5" ry="4" fill="#e8b090" stroke="#c89070" strokeWidth="0.8" />

      {/* Pharynx */}
      <path d="M192 55 Q188 65 190 75 L210 75 Q212 65 208 55Z" fill="#d88888" stroke="#b06666" strokeWidth="1.2" />

      {/* Esophagus */}
      <path d="M195 75 Q193 100 194 120 Q195 140 196 165" fill="none" stroke="#d08888" strokeWidth="8" strokeLinecap="round" opacity={0.4} />
      <path d="M205 75 Q207 100 206 120 Q205 140 204 165" fill="none" stroke="#d08888" strokeWidth="8" strokeLinecap="round" opacity={0.4} />
      <path d="M195 75 Q193 100 194 120 Q195 140 196 165" fill="none" stroke="#c07070" strokeWidth="1.5" />
      <path d="M205 75 Q207 100 206 120 Q205 140 204 165" fill="none" stroke="#c07070" strokeWidth="1.5" />

      {/* Liver */}
      <path d="M135 170 Q125 175 120 190 Q118 210 125 225 Q140 235 170 232 Q195 228 210 218 Q218 205 215 190 Q210 175 195 168 Q170 160 135 170Z"
        fill="url(#liverGrad)" stroke="#5a1818" strokeWidth="1.5" opacity={0.85} />
      {/* Liver lobes detail */}
      <path d="M170 172 Q172 195 168 225" fill="none" stroke="#4a1515" strokeWidth="0.8" opacity={0.4} />

      {/* Gallbladder */}
      <path d="M165 228 Q160 238 162 248 Q165 255 170 252 Q175 245 172 235 Q170 228 165 228Z"
        fill="#5a8a50" stroke="#3a6a30" strokeWidth="1.2" />

      {/* Stomach */}
      <path d="M210 175 Q235 170 250 185 Q260 205 255 230 Q248 250 230 260 Q210 265 200 255 Q190 240 195 215 Q198 195 210 175Z"
        fill="url(#stomachGrad)" stroke="#a06060" strokeWidth="1.5" />
      {/* Stomach folds */}
      <path d="M215 200 Q225 210 220 225 M225 195 Q235 210 230 230 M208 210 Q215 225 212 240"
        fill="none" stroke="#b07070" strokeWidth="0.8" opacity={0.5} />

      {/* Pancreas */}
      <path d="M218 265 Q240 258 260 262 Q275 268 278 278 Q275 285 260 282 Q240 278 218 282 Q210 278 212 270 Q215 265 218 265Z"
        fill="#e8d070" stroke="#c8a840" strokeWidth="1.2" opacity={0.85} />

      {/* Duodenum connection */}
      <path d="M200 258 Q195 268 198 280 Q202 290 210 288" fill="none" stroke="#c89898" strokeWidth="3" opacity={0.4} />

      {/* Large intestine (ascending, transverse, descending, sigmoid) */}
      <path d="M130 420 L130 320 Q130 295 145 295 L255 295 Q270 295 270 310 L270 420 Q270 440 255 445 Q240 448 220 445 Q200 455 180 455 Q160 458 150 448 Q135 440 130 420Z"
        fill="#d8a8a0" stroke="#b08080" strokeWidth="2" opacity={0.7} />
      {/* Haustra markings */}
      <path d="M130 330 Q125 330 130 340 M130 350 Q125 350 130 360 M130 370 Q125 370 130 380 M130 390 Q125 390 130 400"
        fill="none" stroke="#b08080" strokeWidth="1" opacity={0.5} />
      <path d="M270 330 Q275 330 270 340 M270 350 Q275 350 270 360 M270 370 Q275 370 270 380 M270 390 Q275 390 270 400"
        fill="none" stroke="#b08080" strokeWidth="1" opacity={0.5} />
      <path d="M155 295 Q155 290 165 295 M185 295 Q185 290 195 295 M215 295 Q215 290 225 295 M245 295 Q245 290 255 295"
        fill="none" stroke="#b08080" strokeWidth="1" opacity={0.5} />

      {/* Small intestine (coiled inside large intestine) */}
      <path d="M160 310 Q150 320 155 335 Q165 345 180 340 Q195 335 205 345 Q215 355 200 365 Q185 370 170 365 Q155 358 150 370 Q148 385 165 390 Q185 392 200 385 Q215 380 225 390 Q235 400 220 410 Q200 418 180 415 Q160 410 155 400 Q150 390 165 385"
        fill="none" stroke="#d09898" strokeWidth="5" strokeLinecap="round" opacity={0.5} />
      <path d="M160 310 Q150 320 155 335 Q165 345 180 340 Q195 335 205 345 Q215 355 200 365 Q185 370 170 365 Q155 358 150 370 Q148 385 165 390 Q185 392 200 385 Q215 380 225 390 Q235 400 220 410 Q200 418 180 415 Q160 410 155 400 Q150 390 165 385"
        fill="none" stroke="#c08080" strokeWidth="1.5" strokeLinecap="round" />

      {/* Appendix */}
      <path d="M130 415 Q118 425 115 440 Q114 448 118 450" fill="none" stroke="#c89090" strokeWidth="3" strokeLinecap="round" opacity={0.6} />
      <circle cx="118" cy="452" r="3" fill="#c89090" />

      {/* Rectum */}
      <path d="M195 448 Q200 460 200 475 Q200 485 198 492" fill="none" stroke="#c88888" strokeWidth="6" strokeLinecap="round" opacity={0.4} />
      <path d="M195 448 Q200 460 200 475 Q200 485 198 492" fill="none" stroke="#b07070" strokeWidth="1.5" />

      {/* Anus */}
      <ellipse cx="198" cy="498" rx="6" ry="4" fill="#b07070" stroke="#904848" strokeWidth="1.2" />
    </svg>
  );
}

function RespiratorySVG() {
  return (
    <svg viewBox="0 0 400 480" width="100%" height="100%" style={{ maxHeight: '100%' }}>
      <defs>
        <linearGradient id="lungGradL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8a0a0" />
          <stop offset="100%" stopColor="#d88888" />
        </linearGradient>
        <linearGradient id="lungGradR" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8a0a0" />
          <stop offset="100%" stopColor="#d88888" />
        </linearGradient>
        <linearGradient id="skinGradR" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5d0b0" />
          <stop offset="100%" stopColor="#e8c4a0" />
        </linearGradient>
      </defs>

      {/* Body silhouette */}
      <path d="M200 5 Q170 5 160 25 Q150 45 155 75 L155 80 Q130 90 110 110 Q85 140 75 180 L70 250 Q65 320 70 380 Q72 420 85 460 L315 460 Q328 420 330 380 Q335 320 330 250 L325 180 Q315 140 290 110 Q270 90 245 80 L245 75 Q250 45 240 25 Q230 5 200 5Z"
        fill="url(#skinGradR)" stroke="#d4a882" strokeWidth="1.5" opacity={0.5} />

      {/* Head cross-section */}
      <path d="M175 10 Q160 18 155 40 Q152 60 155 80 L200 80 L245 80 Q248 60 245 40 Q240 18 225 10Z"
        fill="#f0c8a8" stroke="#d4a882" strokeWidth="1" opacity={0.7} />

      {/* Nasal cavity - cross section */}
      <path d="M178 15 Q172 22 170 35 Q168 50 172 60 L195 60 Q195 45 192 30 Q190 18 178 15Z"
        fill="#e8a0a8" stroke="#c07078" strokeWidth="1.2" />
      {/* Nasal passages/turbinates */}
      <path d="M175 25 Q185 28 190 25" fill="none" stroke="#b06068" strokeWidth="1" opacity={0.6} />
      <path d="M173 33 Q183 36 190 33" fill="none" stroke="#b06068" strokeWidth="1" opacity={0.6} />
      <path d="M172 41 Q182 44 190 41" fill="none" stroke="#b06068" strokeWidth="1" opacity={0.6} />
      {/* Sinuses */}
      <path d="M175 18 Q168 12 175 8 Q185 6 188 14" fill="none" stroke="#c88090" strokeWidth="0.8" opacity={0.5} />

      {/* Oral cavity */}
      <path d="M178 62 Q175 68 178 74 L195 74 Q198 68 195 62Z" fill="#cc5566" stroke="#aa3344" strokeWidth="1" />

      {/* Pharynx */}
      <path d="M188 60 Q185 68 186 78 Q187 85 190 90 L198 90 Q201 85 202 78 Q203 68 200 60Z"
        fill="#d89090" stroke="#b07070" strokeWidth="1.2" />

      {/* Epiglottis */}
      <path d="M190 88 Q194 95 198 88" fill="#d08080" stroke="#a06060" strokeWidth="1.5" />

      {/* Larynx */}
      <path d="M186 96 L202 96 Q205 100 204 108 Q202 115 200 118 L188 118 Q186 115 184 108 Q183 100 186 96Z"
        fill="#d8a0a0" stroke="#b08080" strokeWidth="1.2" />
      {/* Vocal cords hint */}
      <path d="M189 106 Q194 109 199 106" fill="none" stroke="#a07070" strokeWidth="0.8" />

      {/* Trachea */}
      <path d="M190 118 L190 200 Q190 205 194 205 L194 118" fill="#c8d8e8" stroke="#8899aa" strokeWidth="1" opacity={0.8} />
      <path d="M194 118 L194 200 Q194 205 198 205 L198 118" fill="#c8d8e8" stroke="#8899aa" strokeWidth="1" opacity={0.8} />
      {/* Trachea cartilage rings */}
      {[125, 133, 141, 149, 157, 165, 173, 181, 189, 197].map((y) => (
        <path key={y} d={`M190 ${y} Q194 ${y + 3} 198 ${y}`} fill="none" stroke="#8899aa" strokeWidth="1.2" opacity={0.7} />
      ))}

      {/* Right main bronchus */}
      <path d="M190 200 Q175 215 148 225 Q130 232 115 238" fill="none" stroke="#8899aa" strokeWidth="3.5" opacity={0.5} />
      <path d="M190 200 Q175 215 148 225 Q130 232 115 238" fill="none" stroke="#8899aa" strokeWidth="1.2" />

      {/* Left main bronchus */}
      <path d="M198 200 Q213 215 240 225 Q258 232 273 238" fill="none" stroke="#8899aa" strokeWidth="3.5" opacity={0.5} />
      <path d="M198 200 Q213 215 240 225 Q258 232 273 238" fill="none" stroke="#8899aa" strokeWidth="1.2" />

      {/* Right lung */}
      <path d="M80 170 Q70 200 68 260 Q68 320 85 360 Q105 390 140 395 Q158 393 165 378 Q175 350 172 260 Q170 200 160 180 Q150 165 130 160 Q105 158 80 170Z"
        fill="url(#lungGradL)" stroke="#b07070" strokeWidth="1.8" opacity={0.8} />

      {/* Left lung */}
      <path d="M310 170 Q320 200 322 260 Q322 320 305 360 Q285 390 250 395 Q232 393 225 378 Q215 350 218 260 Q220 200 230 180 Q240 165 260 160 Q285 158 310 170Z"
        fill="url(#lungGradR)" stroke="#b07070" strokeWidth="1.8" opacity={0.8} />

      {/* Bronchioles in right lung - branching tree */}
      <path d="M115 238 Q105 248 95 265" fill="none" stroke="#7788aa" strokeWidth="1.5" opacity={0.6} />
      <path d="M115 238 Q110 255 115 275" fill="none" stroke="#7788aa" strokeWidth="1.5" opacity={0.6} />
      <path d="M115 238 Q120 255 130 270" fill="none" stroke="#7788aa" strokeWidth="1.5" opacity={0.6} />
      <path d="M95 265 Q88 280 85 300" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />
      <path d="M95 265 Q100 280 95 300" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />
      <path d="M115 275 Q108 290 105 310" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />
      <path d="M115 275 Q120 290 118 310" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />
      <path d="M130 270 Q135 285 140 300" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />

      {/* Bronchioles in left lung - branching tree */}
      <path d="M273 238 Q283 248 293 265" fill="none" stroke="#7788aa" strokeWidth="1.5" opacity={0.6} />
      <path d="M273 238 Q278 255 273 275" fill="none" stroke="#7788aa" strokeWidth="1.5" opacity={0.6} />
      <path d="M273 238 Q268 255 258 270" fill="none" stroke="#7788aa" strokeWidth="1.5" opacity={0.6} />
      <path d="M293 265 Q300 280 303 300" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />
      <path d="M293 265 Q288 280 293 300" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />
      <path d="M273 275 Q280 290 283 310" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />
      <path d="M273 275 Q268 290 270 310" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />
      <path d="M258 270 Q253 285 248 300" fill="none" stroke="#7788aa" strokeWidth="1" opacity={0.4} />

      {/* Alveoli clusters - right lung */}
      {[
        [88, 320], [95, 335], [82, 340], [105, 345], [115, 330], [140, 315],
        [92, 355], [108, 358], [120, 348],
      ].map(([cx, cy], i) => (
        <g key={`r${i}`}>
          <circle cx={cx} cy={cy} r="6" fill="#e0a8a8" stroke="#c08888" strokeWidth="0.6" opacity={0.5} />
          <circle cx={Number(cx) - 2} cy={Number(cy) - 2} r="2.5" fill="#d09898" stroke="#b08080" strokeWidth="0.4" opacity={0.6} />
          <circle cx={Number(cx) + 2} cy={Number(cy) + 1} r="2.5" fill="#d09898" stroke="#b08080" strokeWidth="0.4" opacity={0.6} />
          <circle cx={Number(cx) - 1} cy={Number(cy) + 3} r="2" fill="#d09898" stroke="#b08080" strokeWidth="0.4" opacity={0.6} />
        </g>
      ))}

      {/* Alveoli clusters - left lung */}
      {[
        [300, 320], [293, 335], [308, 340], [283, 345], [273, 330], [248, 315],
        [296, 355], [280, 358], [268, 348],
      ].map(([cx, cy], i) => (
        <g key={`l${i}`}>
          <circle cx={cx} cy={cy} r="6" fill="#e0a8a8" stroke="#c08888" strokeWidth="0.6" opacity={0.5} />
          <circle cx={Number(cx) - 2} cy={Number(cy) - 2} r="2.5" fill="#d09898" stroke="#b08080" strokeWidth="0.4" opacity={0.6} />
          <circle cx={Number(cx) + 2} cy={Number(cy) + 1} r="2.5" fill="#d09898" stroke="#b08080" strokeWidth="0.4" opacity={0.6} />
          <circle cx={Number(cx) - 1} cy={Number(cy) + 3} r="2" fill="#d09898" stroke="#b08080" strokeWidth="0.4" opacity={0.6} />
        </g>
      ))}

      {/* Sternum */}
      <path d="M194 155 Q192 160 192 170 L192 300 Q192 310 194 315 Q196 310 196 300 L196 170 Q196 160 194 155Z"
        fill="#e8d8c8" stroke="#c8b8a8" strokeWidth="1" opacity={0.6} />

      {/* Ribs hint */}
      {[185, 210, 235, 260, 285, 310].map((y) => (
        <g key={y}>
          <path d={`M192 ${y} Q160 ${y - 8} 100 ${y + 5}`} fill="none" stroke="#d4c4b4" strokeWidth="1.5" opacity={0.25} />
          <path d={`M196 ${y} Q228 ${y - 8} 288 ${y + 5}`} fill="none" stroke="#d4c4b4" strokeWidth="1.5" opacity={0.25} />
        </g>
      ))}

      {/* Diaphragm */}
      <path d="M65 395 Q110 370 150 390 Q194 410 238 390 Q278 370 325 395"
        fill="none" stroke="#c87070" strokeWidth="3" strokeLinecap="round" opacity={0.7} />
      <path d="M65 395 Q110 370 150 390 Q194 410 238 390 Q278 370 325 395 L325 420 Q280 400 238 420 Q194 440 150 420 Q110 400 65 420Z"
        fill="#d8a0a0" stroke="none" opacity={0.2} />
    </svg>
  );
}

function CirculatorySVG() {
  return (
    <svg viewBox="0 0 400 520" width="100%" height="100%" style={{ maxHeight: '100%' }}>
      <defs>
        <linearGradient id="skinGradC" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5d0b0" />
          <stop offset="100%" stopColor="#e8c4a0" />
        </linearGradient>
        <linearGradient id="heartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c84040" />
          <stop offset="100%" stopColor="#8b2020" />
        </linearGradient>
      </defs>

      {/* Body silhouette */}
      <path d="M200 10 Q170 10 160 30 Q150 50 155 70 L155 78 Q130 88 108 110 Q85 140 80 175 L75 220 Q72 260 75 300 L78 350 Q80 400 85 440 Q88 470 95 500 L110 510 L155 510 L160 500 Q158 460 157 420 Q155 380 158 350 L160 310 Q195 315 200 310 Q205 315 240 310 L242 350 Q245 380 243 420 Q242 460 240 500 L245 510 L290 510 L305 500 Q312 470 315 440 Q320 400 322 350 L325 300 Q328 260 325 220 L320 175 Q315 140 292 110 Q270 88 245 78 L245 70 Q250 50 240 30 Q230 10 200 10Z"
        fill="url(#skinGradC)" stroke="#d4a882" strokeWidth="1" opacity={0.45} />

      {/* Head */}
      <ellipse cx="200" cy="25" rx="32" ry="25" fill="url(#skinGradC)" stroke="#d4a882" strokeWidth="1" opacity={0.45} />

      {/* Arms silhouette */}
      <path d="M80 175 Q60 180 45 200 Q30 230 25 270 Q22 300 20 340 Q18 370 15 400 L30 400 Q32 370 35 340 Q38 310 42 280 Q48 250 55 230 Q62 210 75 200Z"
        fill="url(#skinGradC)" stroke="#d4a882" strokeWidth="1" opacity={0.35} />
      <path d="M320 175 Q340 180 355 200 Q370 230 375 270 Q378 300 380 340 Q382 370 385 400 L370 400 Q368 370 365 340 Q362 310 358 280 Q352 250 345 230 Q338 210 325 200Z"
        fill="url(#skinGradC)" stroke="#d4a882" strokeWidth="1" opacity={0.35} />

      {/* ── VEINS (blue) ── */}

      {/* Jugular veins */}
      <path d="M182 50 Q180 60 178 78 Q176 95 175 110" fill="none" stroke="#4477cc" strokeWidth="4" opacity={0.6} />
      <path d="M218 50 Q220 60 222 78 Q224 95 225 110" fill="none" stroke="#4477cc" strokeWidth="3" opacity={0.5} />

      {/* Superior vena cava */}
      <path d="M185 110 Q183 130 184 150 Q185 165 188 178" fill="none" stroke="#3366bb" strokeWidth="7" opacity={0.6} />
      <path d="M185 110 Q183 130 184 150 Q185 165 188 178" fill="none" stroke="#4477cc" strokeWidth="2" />

      {/* Inferior vena cava */}
      <path d="M192 270 Q190 300 189 330 Q188 360 190 400 Q192 430 195 460" fill="none" stroke="#3366bb" strokeWidth="7" opacity={0.5} />
      <path d="M192 270 Q190 300 189 330 Q188 360 190 400 Q192 430 195 460" fill="none" stroke="#4477cc" strokeWidth="2" />

      {/* Iliac veins */}
      <path d="M192 390 Q175 410 165 440 Q158 460 155 490" fill="none" stroke="#4477cc" strokeWidth="3" opacity={0.5} />
      <path d="M192 390 Q205 410 215 440 Q222 460 225 490" fill="none" stroke="#4477cc" strokeWidth="3" opacity={0.5} />

      {/* Subclavian veins */}
      <path d="M185 115 Q160 112 135 118 Q110 125 88 140" fill="none" stroke="#4477cc" strokeWidth="3" opacity={0.5} />
      <path d="M225 115 Q250 112 275 118 Q300 125 318 140" fill="none" stroke="#4477cc" strokeWidth="3" opacity={0.5} />

      {/* Arm veins */}
      <path d="M88 140 Q68 170 55 210 Q42 260 35 310 Q30 350 28 380" fill="none" stroke="#4477cc" strokeWidth="2" opacity={0.4} />
      <path d="M318 140 Q338 170 350 210 Q362 260 368 310 Q372 350 375 380" fill="none" stroke="#4477cc" strokeWidth="2" opacity={0.4} />

      {/* ── ARTERIES (red) ── */}

      {/* Carotid arteries */}
      <path d="M195 50 Q196 65 198 85 Q200 100 200 110" fill="none" stroke="#cc3333" strokeWidth="3" opacity={0.6} />

      {/* Aortic arch */}
      <path d="M210 185 Q215 170 220 155 Q228 138 235 128 Q245 118 248 125 Q240 140 232 158 Q225 175 215 185"
        fill="none" stroke="#cc3333" strokeWidth="6" opacity={0.5} />
      <path d="M210 185 Q215 170 220 155 Q228 138 235 128 Q245 118 248 125 Q240 140 232 158 Q225 175 215 185"
        fill="none" stroke="#dd4444" strokeWidth="2" />

      {/* Ascending aorta */}
      <path d="M210 185 Q208 168 207 155 Q206 140 208 125 Q210 115 215 110"
        fill="none" stroke="#cc3333" strokeWidth="6" opacity={0.5} />
      <path d="M210 185 Q208 168 207 155 Q206 140 208 125 Q210 115 215 110"
        fill="none" stroke="#dd4444" strokeWidth="2" />

      {/* Descending aorta */}
      <path d="M212 270 Q210 300 209 330 Q208 360 210 400 Q212 430 215 460"
        fill="none" stroke="#cc3333" strokeWidth="6" opacity={0.5} />
      <path d="M212 270 Q210 300 209 330 Q208 360 210 400 Q212 430 215 460"
        fill="none" stroke="#dd4444" strokeWidth="2" />

      {/* Iliac arteries */}
      <path d="M210 400 Q220 420 230 445 Q238 465 242 490" fill="none" stroke="#cc3333" strokeWidth="3" opacity={0.5} />
      <path d="M210 400 Q200 420 190 445 Q182 465 178 490" fill="none" stroke="#cc3333" strokeWidth="3" opacity={0.5} />

      {/* Subclavian arteries */}
      <path d="M230 130 Q255 125 280 130 Q305 138 320 150" fill="none" stroke="#cc3333" strokeWidth="3" opacity={0.5} />
      <path d="M210 115 Q185 110 160 115 Q135 122 112 135" fill="none" stroke="#cc3333" strokeWidth="3" opacity={0.5} />

      {/* Arm arteries */}
      <path d="M112 135 Q90 160 72 200 Q58 245 48 295 Q40 340 35 375" fill="none" stroke="#cc3333" strokeWidth="2" opacity={0.4} />
      <path d="M320 150 Q340 175 352 215 Q362 255 368 305 Q372 340 375 375" fill="none" stroke="#cc3333" strokeWidth="2" opacity={0.4} />

      {/* Renal arteries/veins */}
      <path d="M209 330 Q190 325 170 328" fill="none" stroke="#cc3333" strokeWidth="2" opacity={0.5} />
      <path d="M209 330 Q225 325 240 328" fill="none" stroke="#cc3333" strokeWidth="2" opacity={0.5} />
      <path d="M190 335 Q175 332 165 335" fill="none" stroke="#4477cc" strokeWidth="2" opacity={0.5} />
      <path d="M190 335 Q210 332 230 335" fill="none" stroke="#4477cc" strokeWidth="2" opacity={0.5} />

      {/* Kidneys hint */}
      <ellipse cx="165" cy="332" rx="12" ry="16" fill="#cc886644" stroke="#cc8866" strokeWidth="1" opacity={0.4} />
      <ellipse cx="243" cy="332" rx="12" ry="16" fill="#cc886644" stroke="#cc8866" strokeWidth="1" opacity={0.4} />

      {/* ── HEART ── */}
      <path d="M200 178 Q170 160 158 180 Q148 200 155 225 Q162 250 180 268 Q195 282 200 290 Q205 282 220 268 Q238 250 245 225 Q252 200 242 180 Q230 160 200 178Z"
        fill="url(#heartGrad)" stroke="#6b1515" strokeWidth="2" />

      {/* Heart chambers separation */}
      <path d="M200 180 L200 280" fill="none" stroke="#5a1010" strokeWidth="1.5" opacity={0.5} />
      <path d="M160 215 L240 215" fill="none" stroke="#5a1010" strokeWidth="1" opacity={0.4} />

      {/* Pulmonary arteries */}
      <path d="M195 190 Q180 178 165 175 Q150 174 140 180 Q132 188 130 200"
        fill="none" stroke="#4477cc" strokeWidth="3" opacity={0.6} />
      <path d="M205 190 Q220 178 235 175 Q250 174 260 180 Q268 188 270 200"
        fill="none" stroke="#4477cc" strokeWidth="3" opacity={0.6} />

      {/* Pulmonary veins */}
      <path d="M130 220 Q142 225 155 222 Q165 218 170 210" fill="none" stroke="#cc3333" strokeWidth="2" opacity={0.5} />
      <path d="M270 220 Q258 225 245 222 Q235 218 230 210" fill="none" stroke="#cc3333" strokeWidth="2" opacity={0.5} />

      {/* Lung outlines (small, behind heart) */}
      <path d="M100 170 Q90 200 92 240 Q95 270 110 290 Q125 300 140 290 Q152 275 150 230 Q148 195 140 180 Q130 168 115 165 Q105 165 100 170Z"
        fill="#e8a0a044" stroke="#c08888" strokeWidth="1" opacity={0.5} />
      <path d="M300 170 Q310 200 308 240 Q305 270 290 290 Q275 300 260 290 Q248 275 250 230 Q252 195 260 180 Q270 168 285 165 Q295 165 300 170Z"
        fill="#e8a0a044" stroke="#c08888" strokeWidth="1" opacity={0.5} />
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
