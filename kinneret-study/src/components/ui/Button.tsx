import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<string, { bg: string; text: string; hover: string; border: string }> = {
  primary: {
    bg: 'var(--accent-blue)',
    text: '#ffffff',
    hover: '#6ba0ff',
    border: 'transparent',
  },
  secondary: {
    bg: 'var(--bg-elevated)',
    text: 'var(--text-primary)',
    hover: 'var(--bg-overlay)',
    border: 'var(--bg-border-strong)',
  },
  danger: {
    bg: 'var(--accent-red)',
    text: '#ffffff',
    hover: '#ff6961',
    border: 'transparent',
  },
  ghost: {
    bg: 'transparent',
    text: 'var(--text-secondary)',
    hover: 'var(--bg-overlay)',
    border: 'transparent',
  },
};

const sizeStyles: Record<string, { padding: string; fontSize: string; height: string; iconSize: number }> = {
  sm: { padding: '0 12px', fontSize: '13px', height: '32px', iconSize: 14 },
  md: { padding: '0 20px', fontSize: '14px', height: '40px', iconSize: 16 },
  lg: { padding: '0 28px', fontSize: '16px', height: '48px', iconSize: 18 },
};

function Spinner({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity={0.25}
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  icon,
  loading = false,
  type = 'button',
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 select-none ${className}`}
      style={{
        backgroundColor: v.bg,
        color: v.text,
        borderRadius: '12px',
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: 'var(--font-ui)',
        border: `1px solid ${v.border}`,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
      }}
      aria-disabled={isDisabled}
      aria-busy={loading}
    >
      {loading ? (
        <Spinner size={s.iconSize} />
      ) : icon ? (
        <span className="flex items-center" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </motion.button>
  );
}
