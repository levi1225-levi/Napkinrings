import { useEffect, useState } from 'react';
import AppShell from './components/layout/AppShell';
import LoginScreen from './components/auth/LoginScreen';
import { useAppStore } from './store/appStore';
import { getSession, clearSession } from './lib/auth';

function App() {
  const { initialize, initialized } = useAppStore();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // Check session on mount
  useEffect(() => {
    const session = getSession();
    setAuthenticated(session !== null);
  }, []);

  // Initialize store once authenticated
  useEffect(() => {
    if (authenticated && !initialized) {
      initialize();
    }
  }, [authenticated, initialized, initialize]);

  // Listen for logout events from settings
  useEffect(() => {
    const handler = () => {
      clearSession();
      setAuthenticated(false);
    };
    window.addEventListener('kinneret-logout', handler);
    return () => window.removeEventListener('kinneret-logout', handler);
  }, []);

  // Still checking session
  if (authenticated === null) return null;

  // Not logged in
  if (!authenticated) {
    return <LoginScreen onAuthenticated={() => setAuthenticated(true)} />;
  }

  // Loading app data
  if (!initialized) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-base)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4f8ef7, #34c759)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 12,
              fontFamily: 'var(--font-ui)',
            }}
          >
            SNC2D
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Biology Study
          </div>
          <div
            style={{
              marginTop: 24,
              width: 32,
              height: 32,
              border: '3px solid var(--bg-border-strong)',
              borderTopColor: 'var(--accent-blue)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '24px auto 0',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return <AppShell />;
}

export default App;
