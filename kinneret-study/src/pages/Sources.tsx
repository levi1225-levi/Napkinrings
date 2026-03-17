import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search } from 'lucide-react';
import SourceViewer from '../components/sources/SourceViewer';
import CardBrowser from '../components/sources/CardBrowser';

export default function Sources() {
  const [tab, setTab] = useState<'sources' | 'cards'>('sources');

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
            background: 'linear-gradient(135deg, rgba(255,214,10,0.15), rgba(255,159,10,0.15))',
          }}
        >
          <BookOpen size={20} style={{ color: 'var(--accent-gold)' }} />
        </div>
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {tab === 'sources' ? 'Primary Sources' : 'Card Browser'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {tab === 'sources' ? 'Key texts from your studies' : 'Search and browse all study cards'}
          </p>
        </div>
      </div>

      {/* Tab switcher */}
      <div
        className="flex gap-1 p-1"
        style={{
          backgroundColor: 'var(--bg-overlay)',
          borderRadius: '12px',
          border: '1px solid var(--bg-border)',
        }}
      >
        {([
          { id: 'sources' as const, label: 'Sources', icon: BookOpen },
          { id: 'cards' as const, label: 'Cards', icon: Search },
        ]).map(({ id, label, icon: Icon }) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5"
              style={{
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                fontFamily: 'var(--font-ui)',
                backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === 'sources' ? <SourceViewer /> : <CardBrowser />}
    </motion.div>
  );
}
