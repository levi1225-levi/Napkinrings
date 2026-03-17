import { type ReactNode } from 'react';

interface BadgeProps {
  variant?: 'new' | 'learning' | 'review' | 'mastered' | 'default';
  children: ReactNode;
  className?: string;
}

const variantConfig: Record<string, { dot: string; text: string; bg: string }> = {
  new: {
    dot: '#4f8ef7',
    text: '#4f8ef7',
    bg: 'rgba(79,142,247,0.12)',
  },
  learning: {
    dot: '#ff9f0a',
    text: '#ff9f0a',
    bg: 'rgba(255,159,10,0.12)',
  },
  review: {
    dot: '#bf5af2',
    text: '#bf5af2',
    bg: 'rgba(191,90,242,0.12)',
  },
  mastered: {
    dot: '#34c759',
    text: '#34c759',
    bg: 'rgba(52,199,89,0.12)',
  },
  default: {
    dot: '#8888a0',
    text: 'var(--text-secondary)',
    bg: 'rgba(85,85,106,0.12)',
  },
};

export default function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  const config = variantConfig[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderRadius: '8px',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'var(--font-ui)',
        lineHeight: 1,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.dot,
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  );
}
