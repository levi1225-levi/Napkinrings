import { motion } from 'framer-motion';

interface SystemNode {
  title: string;
  description: string;
  color: string;
}

const ORGANIZATION_LEVELS: SystemNode[] = [
  { title: 'Cell', description: 'The basic unit of life', color: '#4f8ef7' },
  { title: 'Tissue', description: '4 types: Epithelial, Muscle, Connective, Nervous', color: '#bf5af2' },
  { title: 'Organ', description: 'Multiple tissues working together (e.g., stomach, heart, lungs)', color: '#ff9f0a' },
  { title: 'Organ System', description: 'Organs coordinating a major function (e.g., digestive, respiratory)', color: '#ff453a' },
  { title: 'Organism', description: 'All systems working together to sustain life', color: '#34c759' },
];

const nodeVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function ChainDiagram() {
  return (
    <div className="relative flex flex-col items-center py-4">
      {ORGANIZATION_LEVELS.map((node, i) => (
        <div key={node.title} className="flex flex-col items-center w-full">
          {/* Connector line from previous node */}
          {i > 0 && (
            <div className="relative w-[2px] h-10 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{ backgroundColor: 'var(--bg-border-strong)' }}
              />
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    `linear-gradient(180deg, transparent 0%, ${node.color} 40%, ${ORGANIZATION_LEVELS[i - 1].color} 60%, transparent 100%)`,
                  backgroundSize: '100% 200%',
                }}
                animate={{ backgroundPositionY: ['0%', '200%'] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.15,
                }}
              />
            </div>
          )}

          {/* Node card */}
          <motion.div
            custom={i}
            variants={nodeVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-xs"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: `1px solid ${node.color}30`,
              borderRadius: '12px',
              padding: '14px 18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Step number badge */}
            <div
              className="absolute -left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-xs font-bold"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${node.color}, ${node.color}aa)`,
                color: '#fff',
                border: '2px solid var(--bg-base)',
                fontSize: '11px',
              }}
            >
              {i + 1}
            </div>

            {/* Title */}
            <p
              className="text-center font-semibold"
              style={{
                fontSize: '17px',
                color: node.color,
                lineHeight: 1.3,
              }}
            >
              {node.title}
            </p>

            {/* Description */}
            <p
              className="text-center text-sm mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              {node.description}
            </p>
          </motion.div>
        </div>
      ))}

      {/* Final note */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-4 text-center"
      >
        <p
          className="text-xs font-medium"
          style={{ color: 'var(--accent-blue)', letterSpacing: '0.05em' }}
        >
          LEVELS OF BIOLOGICAL ORGANIZATION
        </p>
      </motion.div>
    </div>
  );
}
