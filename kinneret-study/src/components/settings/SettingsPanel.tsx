import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { getSession } from '../../lib/auth';
import Modal from '../ui/Modal';

/* ────────────────────────────────────────────
 *  Reusable setting sub-components
 * ──────────────────────────────────────────── */

/** Chip-based option selector — spacious, tappable pills that wrap naturally */
function ChipSelect<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'flex-end',
      }}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <motion.button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '7px 14px',
              fontSize: '13px',
              fontWeight: isSelected ? 600 : 500,
              fontFamily: 'var(--font-ui)',
              lineHeight: '18px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
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
            }}
          >
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}

/** Custom toggle switch */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative shrink-0 transition-colors duration-200"
      style={{
        width: '48px',
        height: '28px',
        borderRadius: '14px',
        backgroundColor: checked ? 'var(--accent-green)' : 'var(--bg-base)',
        border: checked
          ? '1px solid var(--accent-green)'
          : '1px solid var(--bg-border-strong)',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <motion.div
        animate={{ x: checked ? 21 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute',
          top: '3px',
          width: '22px',
          height: '22px',
          borderRadius: '11px',
          backgroundColor: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        }}
      />
    </button>
  );
}

/** A setting row */
function SettingRow({
  label,
  description,
  children,
  id,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}) {
  const descId = id ? `${id}-desc` : undefined;
  return (
    <div className="flex items-center justify-between gap-4 py-3" role="group" aria-label={label}>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </p>
        {description && (
          <p id={descId} className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0" aria-describedby={descId}>{children}</div>
    </div>
  );
}

/** Section wrapper */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
      <h3
        className="text-xs font-semibold mb-3"
        style={{
          color: 'var(--text-tertiary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h3>
      <div
        className="divide-y"
        style={{ borderColor: 'var(--bg-border)' }}
      >
        {children}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
 *  Main SettingsPanel
 * ──────────────────────────────────────────── */

export default function SettingsPanel() {
  const { data, updateSettings, updateProfile, resetProgress, exportData, importData } = useAppStore();
  const settings = data.settings;
  const profile = data.profile;
  const currentUser = getSession();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          importData(reader.result);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [importData]);

  const handleExport = useCallback(() => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kinneret-study-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportData]);

  const handleReset = useCallback(() => {
    if (resetConfirmText.toLowerCase() === 'reset') {
      resetProgress();
      setShowResetModal(false);
      setResetConfirmText('');
    }
  }, [resetConfirmText, resetProgress]);

  // Calculate days until test
  const testDate = settings.testDate || '2026-03-20';
  const daysUntilTest = Math.max(
    0,
    Math.ceil(
      (new Date(testDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="flex flex-col gap-5">
      {/* ── Profile ── */}
      <Section title="Profile">
        <SettingRow label="Display name">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            placeholder="Your name"
            className="text-sm font-medium text-right"
            style={{
              backgroundColor: 'var(--bg-base)',
              color: 'var(--text-primary)',
              border: '1px solid var(--bg-border-strong)',
              borderRadius: '8px',
              padding: '6px 10px',
              outline: 'none',
              fontFamily: 'var(--font-ui)',
              width: '160px',
            }}
          />
        </SettingRow>
        <SettingRow label="School">
          <input
            type="text"
            value={profile.school}
            onChange={(e) => updateProfile({ school: e.target.value })}
            placeholder="School name"
            className="text-sm font-medium text-right"
            style={{
              backgroundColor: 'var(--bg-base)',
              color: 'var(--text-primary)',
              border: '1px solid var(--bg-border-strong)',
              borderRadius: '8px',
              padding: '6px 10px',
              outline: 'none',
              fontFamily: 'var(--font-ui)',
              width: '160px',
            }}
          />
        </SettingRow>
        <SettingRow label="Grade">
          <input
            type="text"
            value={profile.grade}
            onChange={(e) => updateProfile({ grade: e.target.value })}
            placeholder="e.g. 10th"
            className="text-sm font-medium text-right"
            style={{
              backgroundColor: 'var(--bg-base)',
              color: 'var(--text-primary)',
              border: '1px solid var(--bg-border-strong)',
              borderRadius: '8px',
              padding: '6px 10px',
              outline: 'none',
              fontFamily: 'var(--font-ui)',
              width: '120px',
            }}
          />
        </SettingRow>
      </Section>

      {/* ── Study Settings ── */}
      <Section title="Study Settings">
        <SettingRow label="Daily card limit">
          <ChipSelect
            value={settings.dailyCardLimit}
            onChange={(v) => updateSettings({ dailyCardLimit: v })}
            options={[
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '20', value: 20 },
              { label: '40', value: 40 },
              { label: 'All', value: 999 },
            ]}
          />
        </SettingRow>

        <SettingRow label="New cards per day">
          <ChipSelect
            value={settings.newCardsPerDay}
            onChange={(v) => updateSettings({ newCardsPerDay: v })}
            options={[
              { label: '0', value: 0 },
              { label: '5', value: 5 },
              { label: '10', value: 10 },
              { label: '20', value: 20 },
            ]}
          />
        </SettingRow>

        <SettingRow label="Session length">
          <ChipSelect
            value={settings.sessionLength}
            onChange={(v) => updateSettings({ sessionLength: v })}
            options={[
              { label: 'Quick 5m', value: 'quick' as const },
              { label: 'Standard 15m', value: 'standard' as const },
              { label: 'Deep 30m', value: 'deep' as const },
            ]}
          />
        </SettingRow>

        <SettingRow label="Timer display" description="Show countdown timer during sessions" id="timer-display">
          <Toggle
            checked={settings.showTimer}
            onChange={(v) => updateSettings({ showTimer: v })}
          />
        </SettingRow>

        <SettingRow
          label="Auto-advance after grading"
          description="Automatically move to next card"
          id="auto-advance"
        >
          <Toggle
            checked={settings.autoAdvance}
            onChange={(v) => updateSettings({ autoAdvance: v })}
          />
        </SettingRow>

        <AnimatePresence>
          {settings.autoAdvance && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <SettingRow
                label="Auto-advance delay"
                description={`${settings.autoAdvanceDelay}s`}
              >
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.5}
                  value={settings.autoAdvanceDelay}
                  onChange={(e) =>
                    updateSettings({ autoAdvanceDelay: parseFloat(e.target.value) })
                  }
                  className="w-24 accent-blue-500"
                  style={{
                    accentColor: 'var(--accent-blue)',
                  }}
                />
              </SettingRow>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* ── Test Date ── */}
      <Section title="Test Date">
        <SettingRow
          label="Your test date"
          description={
            daysUntilTest > 0
              ? `${daysUntilTest} day${daysUntilTest !== 1 ? 's' : ''} until your test`
              : 'Test date has passed'
          }
        >
          <input
            type="date"
            value={testDate}
            onChange={(e) => updateSettings({ testDate: e.target.value })}
            className="text-sm font-medium"
            style={{
              backgroundColor: 'var(--bg-base)',
              color: 'var(--text-primary)',
              border: '1px solid var(--bg-border-strong)',
              borderRadius: '8px',
              padding: '6px 10px',
              outline: 'none',
              fontFamily: 'var(--font-ui)',
              colorScheme: settings.darkMode ? 'dark' : 'light',
            }}
          />
        </SettingRow>

        {daysUntilTest > 0 && daysUntilTest <= 7 && (
          <div
            className="flex items-center gap-2 py-3"
            style={{ color: 'var(--accent-orange)' }}
          >
            <AlertTriangle size={14} />
            <p className="text-xs font-medium">
              Your test is coming up soon! Keep studying!
            </p>
          </div>
        )}
      </Section>

      {/* ── Appearance ── */}
      <Section title="Appearance">
        <SettingRow label="Theme">
          <ChipSelect
            value={settings.darkMode ? 'dark' : 'light'}
            onChange={(v) => updateSettings({ darkMode: v === 'dark' })}
            options={[
              { label: 'Dark', value: 'dark' },
              { label: 'Light', value: 'light' },
            ]}
          />
        </SettingRow>

        <SettingRow label="Font size">
          <ChipSelect
            value={settings.fontSize}
            onChange={(v) => updateSettings({ fontSize: v })}
            options={[
              { label: 'Small', value: 'small' as const },
              { label: 'Medium', value: 'medium' as const },
              { label: 'Large', value: 'large' as const },
            ]}
          />
        </SettingRow>

        <SettingRow label="Hebrew text size">
          <ChipSelect
            value={settings.hebrewFontSize}
            onChange={(v) => updateSettings({ hebrewFontSize: v })}
            options={[
              { label: 'Small', value: 'small' as const },
              { label: 'Medium', value: 'medium' as const },
              { label: 'Large', value: 'large' as const },
            ]}
          />
        </SettingRow>

        <SettingRow label="Animation speed">
          <ChipSelect
            value={settings.animationSpeed}
            onChange={(v) => updateSettings({ animationSpeed: v })}
            options={[
              { label: 'Full', value: 'full' as const },
              { label: 'Reduced', value: 'reduced' as const },
              { label: 'None', value: 'none' as const },
            ]}
          />
        </SettingRow>
      </Section>

      {/* ── Content ── */}
      <Section title="Content">
        <SettingRow
          label="Show extended notes"
          description="Display additional notes on flashcards by default"
          id="extended-notes"
        >
          <Toggle
            checked={settings.showExtendedNotes}
            onChange={(v) => updateSettings({ showExtendedNotes: v })}
          />
        </SettingRow>

        <SettingRow
          label="Show mnemonic hints"
          description="Display memory aids on flashcards by default"
          id="mnemonic-hints"
        >
          <Toggle
            checked={settings.showMnemonicHints}
            onChange={(v) => updateSettings({ showMnemonicHints: v })}
          />
        </SettingRow>
      </Section>

      {/* ── Data ── */}
      <Section title="Data">
        <div className="flex flex-col gap-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors duration-150"
              style={{
                backgroundColor: 'rgba(79,142,247,0.1)',
                color: 'var(--accent-blue)',
                borderRadius: '12px',
                border: '1.5px solid rgba(79,142,247,0.3)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
              }}
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={handleImport}
              className="flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors duration-150"
              style={{
                backgroundColor: 'var(--bg-base)',
                color: 'var(--accent-green)',
                borderRadius: '12px',
                border: '1px solid var(--bg-border-strong)',
                cursor: 'pointer',
              }}
            >
              <Upload size={16} />
              Import
            </button>
          </div>

          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium transition-colors duration-150"
            style={{
              backgroundColor: 'rgba(255,69,58,0.08)',
              color: 'var(--accent-red)',
              borderRadius: '12px',
              border: '1px solid rgba(255,69,58,0.2)',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={16} />
            Reset All Progress
          </button>
        </div>
      </Section>

      {/* ── Account ── */}
      <Section title="Account">
        {currentUser && (
          <div className="flex items-center gap-3 py-3">
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              {currentUser.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {currentUser}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Signed in
              </p>
            </div>
          </div>
        )}
        <div className="py-3">
          <button
            onClick={() => window.dispatchEvent(new Event('kinneret-logout'))}
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium transition-colors duration-150"
            style={{
              backgroundColor: 'var(--bg-base)',
              color: 'var(--text-secondary)',
              borderRadius: '12px',
              border: '1px solid var(--bg-border-strong)',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </Section>

      {/* Reset confirmation modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => {
          setShowResetModal(false);
          setResetConfirmText('');
        }}
        title="Reset All Progress"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div
            className="flex items-center gap-3 p-3"
            style={{
              backgroundColor: 'rgba(255,69,58,0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255,69,58,0.15)',
            }}
          >
            <AlertTriangle size={20} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              This will permanently delete all your study progress, session history,
              and achievements. Your settings will be preserved.
            </p>
          </div>

          <div>
            <label
              className="text-xs font-medium block mb-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Type &ldquo;reset&rdquo; to confirm
            </label>
            <input
              type="text"
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              placeholder="reset"
              className="w-full text-sm"
              style={{
                backgroundColor: 'var(--bg-base)',
                color: 'var(--text-primary)',
                border: '1px solid var(--bg-border-strong)',
                borderRadius: '10px',
                padding: '10px 14px',
                outline: 'none',
                fontFamily: 'var(--font-ui)',
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowResetModal(false);
                setResetConfirmText('');
              }}
              className="flex-1 py-2.5 text-sm font-medium"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                color: 'var(--text-secondary)',
                borderRadius: '10px',
                border: '1px solid var(--bg-border)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              disabled={resetConfirmText.toLowerCase() !== 'reset'}
              className="flex-1 py-2.5 text-sm font-medium transition-opacity"
              style={{
                backgroundColor: 'var(--accent-red)',
                color: '#fff',
                borderRadius: '10px',
                border: 'none',
                cursor:
                  resetConfirmText.toLowerCase() === 'reset'
                    ? 'pointer'
                    : 'not-allowed',
                opacity: resetConfirmText.toLowerCase() === 'reset' ? 1 : 0.4,
              }}
            >
              Reset Progress
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
