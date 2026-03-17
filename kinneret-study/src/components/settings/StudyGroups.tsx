import { useState, useCallback } from 'react';
import { Users, Upload, Download, Copy, Check, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface SharedData {
  version: 1;
  name: string;
  exportDate: string;
  cardStates: Record<string, { difficulty: string; easeFactor: number; correctReviews: number; incorrectReviews: number }>;
  stats: {
    totalSessions: number;
    streak: number;
    xp: number;
  };
}

export default function StudyGroups() {
  const { data } = useAppStore();
  const [exportCode, setExportCode] = useState<string | null>(null);
  const [importCode, setImportCode] = useState('');
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const handleExport = useCallback(() => {
    const cardStates: SharedData['cardStates'] = {};
    for (const [id, cs] of Object.entries(data.cardStates ?? {})) {
      const c = cs as any;
      cardStates[id] = {
        difficulty: c.difficulty,
        easeFactor: c.easeFactor,
        correctReviews: c.correctReviews,
        incorrectReviews: c.incorrectReviews,
      };
    }

    const shared: SharedData = {
      version: 1,
      name: data.profile.name || 'Student',
      exportDate: new Date().toISOString().split('T')[0],
      cardStates,
      stats: {
        totalSessions: data.sessions?.length ?? 0,
        streak: data.profile.streak ?? 0,
        xp: (data.profile as any).xp ?? (data.profile as any).totalXP ?? 0,
      },
    };

    const code = btoa(encodeURIComponent(JSON.stringify(shared)));
    setExportCode(code);
  }, [data]);

  const handleCopy = useCallback(() => {
    if (!exportCode) return;
    navigator.clipboard.writeText(exportCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [exportCode]);

  const handleImport = useCallback(() => {
    try {
      const json = decodeURIComponent(atob(importCode.trim()));
      const shared: SharedData = JSON.parse(json);

      if (!shared.version || !shared.cardStates) {
        setImportResult({ success: false, message: 'Invalid study data format.' });
        return;
      }

      // Store imported data for comparison
      const existing = JSON.parse(localStorage.getItem('kinneret-imports') ?? '[]');
      existing.push({
        ...shared,
        importedAt: new Date().toISOString(),
      });
      localStorage.setItem('kinneret-imports', JSON.stringify(existing));

      const cardCount = Object.keys(shared.cardStates).length;
      setImportResult({
        success: true,
        message: `Imported ${shared.name}'s progress (${cardCount} cards, ${shared.stats.totalSessions} sessions).`,
      });
      setImportCode('');
    } catch {
      setImportResult({ success: false, message: 'Could not decode the study code. Please check and try again.' });
    }
  }, [importCode]);

  // Load imported profiles
  const imports: (SharedData & { importedAt: string })[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('kinneret-imports') ?? '[]');
    } catch {
      return [];
    }
  })();

  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        borderRadius: 16,
        border: '1px solid var(--bg-border)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-5 py-3.5"
        style={{
          borderBottom: '1px solid var(--bg-border)',
        }}
      >
        <Users size={16} style={{ color: 'var(--accent-blue)' }} />
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Study Groups
        </h3>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Export */}
        <div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium w-full justify-center"
            style={{
              background: 'rgba(79,142,247,0.1)',
              color: '#4f8ef7',
              borderRadius: 10,
              border: '1.5px solid rgba(79,142,247,0.3)',
              cursor: 'pointer',
            }}
          >
            <Upload size={16} />
            Export My Progress
          </button>

          {exportCode && (
            <div className="mt-2 space-y-2">
              <textarea
                readOnly
                value={exportCode}
                className="w-full text-xs p-2"
                rows={3}
                style={{
                  background: 'var(--bg-base)',
                  borderRadius: 8,
                  color: 'var(--text-tertiary)',
                  border: '1px solid var(--bg-border)',
                  resize: 'none',
                  fontFamily: 'monospace',
                }}
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                style={{
                  background: copied ? 'rgba(52,199,89,0.1)' : 'rgba(79,142,247,0.08)',
                  color: copied ? '#34c759' : '#4f8ef7',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          )}
        </div>

        {/* Import */}
        <div>
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium w-full justify-center"
            style={{
              background: 'rgba(52,199,89,0.1)',
              color: '#34c759',
              borderRadius: 10,
              border: '1.5px solid rgba(52,199,89,0.3)',
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            Import Friend's Progress
          </button>

          {showImport && (
            <div className="mt-2 space-y-2">
              <textarea
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="Paste study code here..."
                className="w-full text-xs p-2"
                rows={3}
                style={{
                  background: 'var(--bg-base)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                  border: '1px solid var(--bg-border)',
                  resize: 'none',
                  fontFamily: 'monospace',
                }}
              />
              <button
                onClick={handleImport}
                disabled={!importCode.trim()}
                className="text-xs font-medium px-3 py-1.5"
                style={{
                  background: importCode.trim() ? 'rgba(52,199,89,0.12)' : 'rgba(52,199,89,0.05)',
                  color: importCode.trim() ? '#34c759' : 'var(--text-tertiary)',
                  borderRadius: 8,
                  border: 'none',
                  cursor: importCode.trim() ? 'pointer' : 'default',
                }}
              >
                Import
              </button>

              {importResult && (
                <div
                  className="flex items-start gap-2 text-xs p-2"
                  style={{
                    background: importResult.success ? 'rgba(52,199,89,0.08)' : 'rgba(255,69,58,0.08)',
                    color: importResult.success ? '#34c759' : '#ff453a',
                    borderRadius: 8,
                  }}
                >
                  {importResult.success ? <Check size={12} className="mt-0.5 shrink-0" /> : <AlertCircle size={12} className="mt-0.5 shrink-0" />}
                  {importResult.message}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Imported profiles */}
        {imports.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Imported Profiles
            </p>
            <div className="space-y-1.5">
              {imports.map((imp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs px-3 py-2"
                  style={{
                    background: 'var(--bg-base)',
                    borderRadius: 8,
                    border: '1px solid var(--bg-border)',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{imp.name}</span>
                  <span style={{ color: 'var(--text-tertiary)' }}>
                    {Object.keys(imp.cardStates).length} cards • {imp.stats.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
