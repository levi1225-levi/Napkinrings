import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Star } from 'lucide-react';
import SettingsPanel from '../components/settings/SettingsPanel';
import { useAppStore } from '../store/appStore';
import { getLevelInfo } from '../lib/xp';

export default function Settings() {
  const { data } = useAppStore();
  const profile = data.profile;

  // Support both store shapes (xp field or totalXP field)
  const totalXP =
    (profile as unknown as { xp?: number }).xp ??
    (profile as unknown as { totalXP?: number }).totalXP ??
    0;

  const levelInfo = getLevelInfo(totalXP);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
      style={{ padding: '24px 24px 32px', maxWidth: '960px', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}
    >
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background:
              'linear-gradient(135deg, rgba(153,153,176,0.15), rgba(85,85,106,0.15))',
          }}
        >
          <SettingsIcon size={20} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Settings
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Customize your experience
          </p>
        </div>
      </div>

      {/* Profile card */}
      <div
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: '16px',
          border: '1px solid var(--bg-border)',
          padding: '20px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="flex items-center justify-center text-lg font-bold shrink-0"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background:
                'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              color: '#fff',
            }}
          >
            L
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2
              className="text-base font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Levi
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              TanenbaumCHAT &bull; Grade 10
            </p>

            {/* Level badge */}
            <div className="flex items-center gap-2 mt-2">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1"
                style={{
                  borderRadius: '20px',
                  background:
                    'linear-gradient(135deg, rgba(255,214,10,0.12), rgba(255,159,10,0.12))',
                  border: '1px solid rgba(255,214,10,0.2)',
                }}
              >
                <Star
                  size={12}
                  style={{ color: 'var(--accent-gold)' }}
                  fill="var(--accent-gold)"
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Level {levelInfo.level} &mdash; {levelInfo.title}
                </span>
              </div>
            </div>
          </div>

          {/* XP count */}
          <div className="text-right shrink-0">
            <p
              className="text-lg font-bold"
              style={{ color: 'var(--accent-blue)' }}
            >
              {totalXP.toLocaleString()}
            </p>
            <p
              className="text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Total XP
            </p>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Level {levelInfo.level}
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {levelInfo.maxXP === Infinity
                ? 'Max Level'
                : `${totalXP} / ${levelInfo.maxXP} XP`}
            </span>
          </div>
          <div
            className="relative w-full overflow-hidden"
            style={{
              height: '6px',
              borderRadius: '3px',
              backgroundColor: 'var(--bg-base)',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progress * 100}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                borderRadius: '3px',
                background:
                  'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
              }}
            />
          </div>
        </div>
      </div>

      {/* Settings panel */}
      <SettingsPanel />
    </motion.div>
  );
}
