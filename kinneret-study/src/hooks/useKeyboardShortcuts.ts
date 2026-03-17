import { useEffect, useCallback } from 'react';

type KeyHandler = (e: KeyboardEvent) => void;

interface ShortcutMap {
  [key: string]: KeyHandler;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      // Don't trigger shortcuts when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const key = e.key.toLowerCase();
      const combo = [
        e.ctrlKey || e.metaKey ? 'ctrl+' : '',
        e.shiftKey ? 'shift+' : '',
        e.altKey ? 'alt+' : '',
        key,
      ].join('');

      // Try exact combo first, then just the key
      const handler = shortcuts[combo] || shortcuts[key];
      if (handler) {
        handler(e);
      }
    },
    [shortcuts, enabled],
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
