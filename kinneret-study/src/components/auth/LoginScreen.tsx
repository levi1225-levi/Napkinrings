import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { signUp, logIn, hasAccounts } from '../../lib/auth';

interface LoginScreenProps {
  onAuthenticated: () => void;
}

export default function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(
    hasAccounts() ? 'login' : 'signup'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result =
      mode === 'signup'
        ? await signUp(username, password)
        : await logIn(username, password);

    setLoading(false);

    if (result) {
      setError(result);
    } else {
      onAuthenticated();
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        fontFamily: "var(--font-ui)",
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: '380px',
        }}
      >
        {/* Logo / Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ffd60a, #ff9f0a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8,
              fontFamily: 'var(--font-hebrew)',
            }}
          >
            כִּנֶּרֶת
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Kinneret Study
          </div>
          <p
            style={{
              color: 'var(--text-tertiary)',
              fontSize: '14px',
              marginTop: '6px',
            }}
          >
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: '16px',
            border: '1px solid var(--bg-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="username"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '15px',
                  backgroundColor: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--bg-border-strong)',
                  borderRadius: '10px',
                  outline: 'none',
                  fontFamily: 'var(--font-ui)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  style={{
                    width: '100%',
                    padding: '10px 44px 10px 14px',
                    fontSize: '15px',
                    backgroundColor: 'var(--bg-base)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--bg-border-strong)',
                    borderRadius: '10px',
                    outline: 'none',
                    fontFamily: 'var(--font-ui)',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: 'var(--accent-red)',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '16px',
                  textAlign: 'center',
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || !username.trim() || !password}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'var(--font-ui)',
                backgroundColor: 'var(--accent-blue)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor:
                  loading || !username.trim() || !password
                    ? 'not-allowed'
                    : 'pointer',
                opacity:
                  loading || !username.trim() || !password ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {mode === 'login' ? (
                <>
                  <LogIn size={18} />
                  {loading ? 'Logging in...' : 'Log In'}
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  {loading ? 'Creating account...' : 'Sign Up'}
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle mode */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '13px',
              color: 'var(--text-tertiary)',
            }}
          >
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-blue)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-blue)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
