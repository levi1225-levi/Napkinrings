import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Copy, Check, Trophy, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { cards as allCards } from '../../data/cards';

interface ChallengeData {
  cardIds: string[];
  challengerName: string;
  challengerScore: number;
  challengerAccuracy: number;
  timestamp: number;
}

function encodeChallenge(data: ChallengeData): string {
  const json = JSON.stringify(data);
  return btoa(encodeURIComponent(json));
}

function decodeChallenge(encoded: string): ChallengeData | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function ChallengeMode() {
  const { data, setStudyMode } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [challengeLink, setChallengeLink] = useState<string | null>(null);
  const [incomingChallenge, setIncomingChallenge] = useState<ChallengeData | null>(null);

  // Check URL for incoming challenge
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challengeParam = params.get('challenge');
    if (challengeParam) {
      const decoded = decodeChallenge(challengeParam);
      if (decoded) {
        setIncomingChallenge(decoded);
      }
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('challenge');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Generate challenge from last session
  const handleCreateChallenge = useCallback(() => {
    const sessions = data.sessions ?? [];
    const lastQuiz = [...sessions].reverse().find(
      (s) => s.mode === 'quiz' || s.mode === 'speed',
    );

    if (!lastQuiz) return;

    const challengeData: ChallengeData = {
      cardIds: (lastQuiz as any).cardIds?.slice(0, 20) ??
        allCards.slice(0, 10).map((c) => c.id),
      challengerName: data.profile.name || 'A friend',
      challengerScore: lastQuiz.correctCount,
      challengerAccuracy: lastQuiz.correctCount + lastQuiz.incorrectCount > 0
        ? Math.round(
            (lastQuiz.correctCount /
              (lastQuiz.correctCount + lastQuiz.incorrectCount)) *
              100,
          )
        : 0,
      timestamp: Date.now(),
    };

    const encoded = encodeChallenge(challengeData);
    const url = `${window.location.origin}${window.location.pathname}?challenge=${encoded}`;
    setChallengeLink(url);
  }, [data.sessions, data.profile.name]);

  const handleCopy = useCallback(() => {
    if (!challengeLink) return;
    navigator.clipboard.writeText(challengeLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [challengeLink]);

  const handleAcceptChallenge = useCallback(() => {
    // Store challenge in sessionStorage for the quiz to pick up
    if (incomingChallenge) {
      sessionStorage.setItem(
        'kinneret-challenge',
        JSON.stringify(incomingChallenge),
      );
      setStudyMode('quiz');
    }
  }, [incomingChallenge, setStudyMode]);

  return (
    <div className="space-y-4">
      {/* Incoming challenge */}
      {incomingChallenge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(255,159,10,0.12), rgba(255,69,58,0.08))',
            borderRadius: 16,
            border: '1px solid rgba(255,159,10,0.2)',
            padding: 20,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Swords size={20} color="#ff9f0a" />
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Challenge Received!
            </h3>
          </div>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            <strong>{incomingChallenge.challengerName}</strong> scored{' '}
            <strong>{incomingChallenge.challengerAccuracy}%</strong> accuracy on a{' '}
            {incomingChallenge.cardIds.length}-card quiz. Can you beat them?
          </p>
          <button
            onClick={handleAcceptChallenge}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold w-full justify-center"
            style={{
              background: 'rgba(255,159,10,0.15)',
              color: '#ff9f0a',
              borderRadius: 10,
              border: '1px solid rgba(255,159,10,0.3)',
              cursor: 'pointer',
            }}
          >
            Accept Challenge
            <ArrowRight size={16} />
          </button>
        </motion.div>
      )}

      {/* Create challenge */}
      <div
        style={{
          background: 'var(--bg-elevated)',
          borderRadius: 16,
          border: '1px solid var(--bg-border)',
          padding: 20,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} color="#ff9f0a" />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Challenge a Friend
          </h3>
        </div>
        <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Share your last quiz as a challenge. Your friend takes the same quiz and compares scores!
        </p>

        {!challengeLink ? (
          <button
            onClick={handleCreateChallenge}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium w-full justify-center"
            style={{
              background: 'rgba(255,159,10,0.1)',
              color: '#ff9f0a',
              borderRadius: 10,
              border: '1.5px solid rgba(255,159,10,0.3)',
              cursor: 'pointer',
            }}
          >
            <Swords size={16} />
            Create Challenge
          </button>
        ) : (
          <div className="space-y-2">
            <div
              className="text-xs p-2 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{
                background: 'var(--bg-base)',
                borderRadius: 8,
                color: 'var(--text-tertiary)',
                border: '1px solid var(--bg-border)',
              }}
            >
              {challengeLink}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium w-full justify-center"
              style={{
                background: copied
                  ? 'rgba(52,199,89,0.1)'
                  : 'rgba(255,159,10,0.1)',
                color: copied ? '#34c759' : '#ff9f0a',
                borderRadius: 10,
                border: `1.5px solid ${copied ? 'rgba(52,199,89,0.3)' : 'rgba(255,159,10,0.3)'}`,
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
