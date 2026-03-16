import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import SourceViewer from '../components/sources/SourceViewer';

export default function Sources() {
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
            Primary Sources
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Key texts from your studies
          </p>
        </div>
      </div>

      {/* Source viewer */}
      <SourceViewer />
    </motion.div>
  );
}
