import { type ReactNode, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: ReactNode;
  animated?: boolean;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#4f8ef7',
  bgColor = 'var(--bg-border-strong)',
  children,
  animated = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const clampedProgress = Math.min(100, Math.max(0, progress));

  const motionProgress = useMotionValue(animated ? 0 : clampedProgress);
  const springProgress = useSpring(motionProgress, {
    stiffness: 60,
    damping: 20,
    mass: 1,
  });

  useEffect(() => {
    motionProgress.set(clampedProgress);
  }, [clampedProgress, motionProgress]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: springProgress.get()
              ? undefined
              : circumference,
          }}
          initial={false}
          animate={{
            strokeDashoffset:
              circumference - (circumference * clampedProgress) / 100,
          }}
          transition={
            animated
              ? { type: 'spring', stiffness: 60, damping: 20 }
              : { duration: 0 }
          }
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
