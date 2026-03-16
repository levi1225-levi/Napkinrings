import { motion } from 'framer-motion';

interface ChainNode {
  hebrew: string;
  english: string;
  dates: string;
  note?: string;
}

const CHAIN_NODES: ChainNode[] = [
  { hebrew: 'משה', english: 'Moshe (Moses)', dates: 'c. 1400 BCE' },
  { hebrew: 'יהושע', english: 'Yehoshua (Joshua)', dates: 'c. 1350 BCE' },
  { hebrew: 'זקנים', english: 'Zekenim (Elders)', dates: 'c. 1300\u20131000 BCE' },
  { hebrew: 'נביאים', english: "Nevi'im (Prophets)", dates: 'c. 1000\u2013400 BCE' },
  {
    hebrew: 'אנשי כנסת הגדולה',
    english: 'Anshei Knesset HaGedolah (Great Assembly)',
    dates: 'c. 400\u2013200 BCE',
  },
  { hebrew: 'זוגות', english: 'Zugot (Pairs)', dates: 'c. 200 BCE\u201310 CE' },
  {
    hebrew: 'תנאים',
    english: "Tana'im (Mishnaic Sages)",
    dates: 'c. 10\u2013220 CE',
  },
  {
    hebrew: 'רבי יהודה הנשיא',
    english: 'Rabbi Yehudah HaNasi',
    dates: 'c. 200 CE',
    note: 'Compiled the Mishnah',
  },
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
      {CHAIN_NODES.map((node, i) => (
        <div key={node.english} className="flex flex-col items-center w-full">
          {/* Connector line from previous node */}
          {i > 0 && (
            <div className="relative w-[2px] h-10 overflow-hidden">
              {/* Static line */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: 'var(--bg-border-strong)' }}
              />
              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 0%, #ffd60a 40%, #ff9f0a 60%, transparent 100%)',
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
              border: '1px solid var(--bg-border-strong)',
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
                background:
                  i === 0
                    ? 'linear-gradient(135deg, #ffd60a, #ff9f0a)'
                    : i === CHAIN_NODES.length - 1
                      ? 'linear-gradient(135deg, #4f8ef7, #bf5af2)'
                      : 'var(--bg-overlay)',
                color:
                  i === 0 || i === CHAIN_NODES.length - 1
                    ? '#0a0a0f'
                    : 'var(--text-secondary)',
                border: '2px solid var(--bg-base)',
                fontSize: '11px',
              }}
            >
              {i + 1}
            </div>

            {/* Hebrew name */}
            <p
              lang="he"
              dir="rtl"
              className="text-center font-semibold"
              style={{
                fontFamily: "var(--font-hebrew)",
                fontSize: '18px',
                color: 'var(--text-primary)',
                lineHeight: 1.3,
              }}
            >
              {node.hebrew}
            </p>

            {/* English name */}
            <p
              className="text-center text-sm mt-0.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              {node.english}
            </p>

            {/* Date */}
            <p
              className="text-center text-xs mt-1"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {node.dates}
            </p>

            {/* Special note */}
            {node.note && (
              <p
                className="text-center text-xs mt-1.5 font-medium"
                style={{ color: 'var(--accent-gold)' }}
              >
                {node.note}
              </p>
            )}
          </motion.div>
        </div>
      ))}

      {/* Final arrow indicator */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-4 text-center"
      >
        <p
          className="text-xs font-medium"
          style={{ color: 'var(--accent-blue)', letterSpacing: '0.05em' }}
        >
          THE MISHNAH IS WRITTEN DOWN
        </p>
      </motion.div>
    </div>
  );
}
