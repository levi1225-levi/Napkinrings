import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Wind,
  Utensils,
  Microscope,
  ArrowRightLeft,
} from 'lucide-react';
import ChainDiagram from './ChainDiagram';

type TabId = 'organization' | 'digestive' | 'respiratory' | 'circulatory' | 'interactions';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'organization', label: 'Organization' },
  { id: 'digestive', label: 'Digestive' },
  { id: 'respiratory', label: 'Respiratory' },
  { id: 'circulatory', label: 'Circulatory' },
  { id: 'interactions', label: 'Interactions' },
];

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

export default function SourceViewer() {
  const [activeTab, setActiveTab] = useState<TabId>('organization');
  const [direction, setDirection] = useState(0);

  const handleTabChange = (tab: TabId) => {
    const oldIndex = TABS.findIndex((t) => t.id === activeTab);
    const newIndex = TABS.findIndex((t) => t.id === tab);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Scrollable tab selector */}
      <div
        className="flex gap-1 p-1 overflow-x-auto"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: '12px',
          border: '1px solid var(--bg-border)',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className="relative flex-shrink-0 z-10 py-2.5 px-4 text-[13px] font-medium transition-colors duration-200"
            style={{
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '10px',
              whiteSpace: 'nowrap',
            }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="source-tab-pill"
                className="absolute inset-0"
                style={{
                  backgroundColor: 'var(--bg-overlay)',
                  borderRadius: '10px',
                  border: '1px solid var(--bg-border-strong)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="relative overflow-hidden" style={{ minHeight: '400px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'organization' && <OrganizationTab />}
            {activeTab === 'digestive' && <DigestiveTab />}
            {activeTab === 'respiratory' && <RespiratoryTab />}
            {activeTab === 'circulatory' && <CirculatoryTab />}
            {activeTab === 'interactions' && <InteractionsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Shared section card ── */
function SectionCard({ icon: Icon, iconColor, title, children }: {
  icon: typeof Heart;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderRadius: '16px',
        border: '1px solid var(--bg-border)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} style={{ color: iconColor }} />
        <h3 className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function KeyPoint({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-3 py-2">
      <span className="text-[13px] font-semibold shrink-0" style={{ color: 'var(--accent-blue)', minWidth: 90 }}>
        {label}
      </span>
      <span className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {text}
      </span>
    </div>
  );
}

/* ── Tab 1: Levels of Organization ── */
function OrganizationTab() {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard icon={Microscope} iconColor="#bf5af2" title="The Four Tissue Types">
        <div className="flex flex-col gap-3">
          {[
            { name: 'Epithelial', desc: 'Covers/protects body, secretes mucus, oils, enzymes. Found lining mouth, stomach, trachea, alveoli.', color: '#4f8ef7' },
            { name: 'Muscle', desc: 'Skeletal (voluntary, bones), Smooth (involuntary, organs), Cardiac (involuntary, heart only).', color: '#ff453a' },
            { name: 'Connective', desc: 'Holds body parts together. Cartilage, tendons (muscle→bone), ligaments (bone→bone), blood.', color: '#ff9f0a' },
            { name: 'Nervous', desc: 'Made of neurons. Communication between body structures. Brain, spinal cord, peripheral nerves.', color: '#34c759' },
          ].map((t) => (
            <div key={t.name} className="p-3 rounded-xl" style={{ background: `${t.color}08`, border: `1px solid ${t.color}20` }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: t.color }}>{t.name} Tissue</p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={Microscope} iconColor="#bf5af2" title="Levels of Organization">
        <ChainDiagram />
      </SectionCard>
    </div>
  );
}

/* ── Tab 2: Digestive ── */
function DigestiveTab() {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard icon={Utensils} iconColor="#ff9f0a" title="Digestive System Overview">
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          Digestion takes 24-33 hours. The digestive tract is a system of tubes from mouth to anus.
        </p>
        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--bg-border)' }}>
          <KeyPoint label="Mouth" text="Physical + chemical digestion begin. Teeth/tongue + salivary amylase (breaks carbs). Forms bolus." />
          <KeyPoint label="Esophagus" text="NO digestion. Peristalsis (smooth muscle contractions) pushes food down. Mucus lubricates." />
          <KeyPoint label="Stomach" text="Mechanical (churning) + chemical (HCl + pepsin → proteins). Produces chyme. Mucus protects lining." />
          <KeyPoint label="Small Intestine" text="MOST digestion + absorption. Pancreas/liver/gallbladder help. Villi increase surface area." />
          <KeyPoint label="Large Intestine" text="NO digestion. Reabsorbs water + vitamins B & K. Fecal matter → rectum → anus." />
        </div>
      </SectionCard>

      <SectionCard icon={Utensils} iconColor="#ff9f0a" title="Accessory Organs">
        <div className="flex flex-col gap-3">
          {[
            { name: 'Pancreas', desc: 'Digestive enzymes + hormones insulin & glucagon (blood sugar regulation)', color: '#ff9f0a' },
            { name: 'Liver', desc: 'Produces bile (emulsifies fats for physical digestion). Also removes alcohol.', color: '#ff453a' },
            { name: 'Gallbladder', desc: 'Stores bile. Releases it when a fatty meal is eaten.', color: '#34c759' },
          ].map((organ) => (
            <div key={organ.name} className="p-3 rounded-xl" style={{ background: `${organ.color}08`, border: `1px solid ${organ.color}20` }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: organ.color }}>{organ.name}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{organ.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Tab 3: Respiratory ── */
function RespiratoryTab() {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard icon={Wind} iconColor="#4f8ef7" title="Respiratory System Overview">
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          We breathe to bring O₂ to cells for cellular respiration (producing ATP). CO₂ waste returns to lungs for exhalation.
        </p>
        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--bg-border)' }}>
          <KeyPoint label="Nasal Cavity" text="Filters, warms, moistens air. Nose hairs + mucus trap particles." />
          <KeyPoint label="Epiglottis" text="Cartilage flap covering trachea during swallowing. Prevents choking." />
          <KeyPoint label="Larynx" text="Voice box with vocal cords. Between pharynx and trachea." />
          <KeyPoint label="Trachea" text="C-shaped cartilage rings keep it open. Cilia + mucus filter particles." />
          <KeyPoint label="Bronchi" text="Two branches from trachea, one to each lung. Mucus-lined." />
          <KeyPoint label="Bronchioles" text="Small branched tubes with smooth muscle. End in alveoli." />
          <KeyPoint label="Alveoli" text="Thin-walled air sacs (1 cell thick). Gas exchange by diffusion with capillaries." />
          <KeyPoint label="Diaphragm" text="SKELETAL muscle. Contracts (down) = inhale. Relaxes (up) = exhale." />
        </div>
      </SectionCard>

      <SectionCard icon={Wind} iconColor="#4f8ef7" title="Air Flow Path">
        <div className="flex flex-wrap items-center gap-2 py-2">
          {['Nasal Cavity', 'Pharynx', 'Epiglottis', 'Larynx', 'Trachea', 'Bronchi', 'Bronchioles', 'Alveoli'].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-2">
              <span className="text-[13px] font-medium px-3 py-1.5 rounded-lg" style={{ background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)' }}>
                {step}
              </span>
              {i < arr.length - 1 && <span style={{ color: 'var(--text-tertiary)' }}>→</span>}
            </span>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Tab 4: Circulatory ── */
function CirculatoryTab() {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard icon={Heart} iconColor="#ff453a" title="Circulatory System Overview">
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          3 parts: pump (heart), tubes (blood vessels), fluid (blood). Humans have a closed, double circulatory system.
        </p>
        <div className="flex flex-col divide-y" style={{ borderColor: 'var(--bg-border)' }}>
          <KeyPoint label="Heart" text="4 chambers: RA, RV, LA, LV. Septum divides sides. 60-80 bpm." />
          <KeyPoint label="Arteries" text="Away from heart. Thick, elastic, muscular walls. Usually oxygenated." />
          <KeyPoint label="Veins" text="Toward heart. Thinner walls with VALVES (prevent backflow). Usually deoxygenated." />
          <KeyPoint label="Capillaries" text="Smallest vessels. 1 cell thick walls. Exchange materials by DIFFUSION." />
        </div>
      </SectionCard>

      <SectionCard icon={Heart} iconColor="#ff453a" title="Blood Path Through Heart">
        <div className="flex flex-wrap items-center gap-2 py-2">
          {['Vena Cava', 'RA', 'RV', 'Pulm. Artery', 'Lungs', 'Pulm. Vein', 'LA', 'LV', 'Aorta'].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-2">
              <span className="text-[13px] font-medium px-3 py-1.5 rounded-lg" style={{
                background: i <= 3 ? 'var(--accent-blue-dim)' : i === 4 ? 'var(--accent-purple-dim)' : 'var(--accent-red-dim)',
                color: i <= 3 ? 'var(--accent-blue)' : i === 4 ? 'var(--accent-purple)' : 'var(--accent-red)',
              }}>
                {step}
              </span>
              {i < arr.length - 1 && <span style={{ color: 'var(--text-tertiary)' }}>→</span>}
            </span>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(255,159,10,0.06)', border: '1px solid rgba(255,159,10,0.15)' }}>
          <p className="text-[13px] font-medium" style={{ color: 'var(--accent-orange)' }}>Key Exceptions:</p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>
            Pulmonary arteries carry DEOXYGENATED blood (to lungs). Pulmonary veins carry OXYGENATED blood (from lungs).
          </p>
        </div>
      </SectionCard>

      <SectionCard icon={Heart} iconColor="#ff453a" title="Blood Components">
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Plasma (55%)', desc: 'Liquid: water, ions, proteins, nutrients', color: '#ffd60a' },
            { name: 'RBCs (44%)', desc: 'Carry O₂ via hemoglobin', color: '#ff453a' },
            { name: 'WBCs', desc: 'Fight infection and disease', color: '#4f8ef7' },
            { name: 'Platelets (1%)', desc: 'Blood clotting', color: '#34c759' },
          ].map((c) => (
            <div key={c.name} className="p-3 rounded-xl" style={{ background: `${c.color}08`, border: `1px solid ${c.color}20` }}>
              <p className="text-[12px] font-semibold" style={{ color: c.color }}>{c.name}</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ── Tab 5: System Interactions ── */
function InteractionsTab() {
  return (
    <div className="flex flex-col gap-5">
      <SectionCard icon={ArrowRightLeft} iconColor="#34c759" title="Respiratory + Circulatory = Oxygenated Blood">
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Respiratory system brings O₂ to lungs. At alveoli, O₂ loads onto hemoglobin in RBCs (diffusion).
          Heart pumps oxygenated blood through arteries to body tissues. CO₂ waste returns to lungs via veins for exhalation.
        </p>
      </SectionCard>

      <SectionCard icon={ArrowRightLeft} iconColor="#34c759" title="Digestive + Respiratory + Circulatory = ATP">
        <div className="flex flex-col gap-2">
          {[
            { sys: 'Digestive', action: 'Breaks food into nutrients that enter bloodstream', color: '#ff9f0a' },
            { sys: 'Respiratory', action: 'Brings O₂ into blood at alveoli', color: '#4f8ef7' },
            { sys: 'Circulatory', action: 'Delivers O₂ and nutrients to body cells', color: '#ff453a' },
            { sys: 'In cells', action: 'Mitochondria use O₂ + nutrients → ATP (energy) + CO₂ (waste)', color: '#34c759' },
          ].map((item) => (
            <div key={item.sys} className="flex gap-3 items-start p-3 rounded-xl" style={{ background: `${item.color}08` }}>
              <span className="text-[12px] font-semibold shrink-0 mt-0.5" style={{ color: item.color, minWidth: 80 }}>{item.sys}</span>
              <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{item.action}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={ArrowRightLeft} iconColor="#34c759" title="Example: Walking to Class">
        <div className="flex flex-col gap-2">
          {[
            { sys: 'Nervous', action: 'Brain sends signals to leg muscles via peripheral nerves' },
            { sys: 'Musculoskeletal', action: 'Skeletal muscles contract, moving bones at joints' },
            { sys: 'Circulatory', action: 'Heart pumps O₂-rich blood to active muscles' },
            { sys: 'Respiratory', action: 'Lungs provide O₂ that blood carries to muscles' },
          ].map((item) => (
            <div key={item.sys} className="flex gap-3 items-start py-2">
              <span className="text-[13px] font-semibold shrink-0" style={{ color: 'var(--accent-green)', minWidth: 100 }}>{item.sys}</span>
              <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{item.action}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
