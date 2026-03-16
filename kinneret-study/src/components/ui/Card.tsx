import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: boolean;
}

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = true,
  padding = true,
}: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={
        hoverable
          ? {
              scale: 1.02,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`${className}`}
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderRadius: '16px',
        border: '1px solid var(--bg-border)',
        padding: padding ? '20px' : '0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
