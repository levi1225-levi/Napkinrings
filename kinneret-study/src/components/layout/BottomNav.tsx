import { motion } from 'framer-motion';
import { Home, BookOpen, BarChart3, ScrollText, Settings } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

type TabId = 'home' | 'study' | 'analytics' | 'sources' | 'settings';

interface TabItem {
  id: TabId;
  label: string;
  icon: typeof Home;
}

const tabs: TabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'study', label: 'Study', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'sources', label: 'Sources', icon: ScrollText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-base) 92%, transparent)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--bg-border)',
        fontFamily: 'var(--font-ui)',
      }}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2" style={{ height: '64px', maxWidth: '500px', margin: '0 auto' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 border-none bg-transparent cursor-pointer outline-none"
              style={{ height: '100%', padding: '0 4px' }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active-pill"
                  className="absolute"
                  style={{
                    width: '48px',
                    height: '32px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(79,142,247,0.12)',
                    top: '10px',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                size={20}
                style={{
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-tertiary)',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'color 0.2s',
                }}
              />
              <span
                className="text-[10px] font-medium relative z-10"
                style={{
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-tertiary)',
                  transition: 'color 0.2s',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer for notched devices */}
      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </nav>
  );
}
