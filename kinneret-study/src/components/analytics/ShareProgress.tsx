import { useCallback, useState } from 'react';
import { Share2, Download, Check } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { cards } from '../../data/cards';
import { createInitialCardState } from '../../lib/sm2';
import { getLevelInfo } from '../../lib/xp';

export default function ShareProgress() {
  const { data } = useAppStore();
  const [copied, setCopied] = useState(false);

  const generateImage = useCallback((): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 600, 400);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(1, '#16213e');
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, 600, 400, 16);
    ctx.fill();

    // Header accent line
    const accentGrad = ctx.createLinearGradient(0, 0, 600, 0);
    accentGrad.addColorStop(0, '#4f8ef7');
    accentGrad.addColorStop(1, '#bf5af2');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, 0, 600, 4);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Kinneret Study Progress', 32, 48);

    // Profile
    const profile = data.profile;
    const totalXP = (profile as any).xp ?? (profile as any).totalXP ?? 0;
    const levelInfo = getLevelInfo(totalXP);

    ctx.fillStyle = '#a0a0b8';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${profile.name || 'Student'} • Level ${levelInfo.level} ${levelInfo.title}`, 32, 74);

    // Stats
    const cardStates = data.cardStates ?? {};
    const totalCards = cards.length;
    let mastered = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;

    for (const card of cards) {
      const cs = cardStates[card.id] ?? createInitialCardState(card.id);
      if (cs.difficulty === 'mastered') mastered++;
      totalCorrect += cs.correctReviews;
      totalIncorrect += cs.incorrectReviews;
    }

    const accuracy = totalCorrect + totalIncorrect > 0
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
      : 0;
    const masteryPct = Math.round((mastered / totalCards) * 100);
    const sessions = data.sessions?.length ?? 0;
    const streak = profile.streak ?? 0;

    // Stat boxes
    const stats = [
      { label: 'Mastery', value: `${masteryPct}%`, color: '#34c759' },
      { label: 'Accuracy', value: `${accuracy}%`, color: '#4f8ef7' },
      { label: 'Streak', value: `${streak}d`, color: '#ff9f0a' },
      { label: 'Sessions', value: `${sessions}`, color: '#bf5af2' },
    ];

    stats.forEach((stat, i) => {
      const x = 32 + i * 138;
      const y = 110;

      // Box background
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.roundRect(x, y, 124, 90, 12);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, 124, 90, 12);
      ctx.stroke();

      // Value
      ctx.fillStyle = stat.color;
      ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(stat.value, x + 16, y + 42);

      // Label
      ctx.fillStyle = '#a0a0b8';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(stat.label, x + 16, y + 68);
    });

    // Progress bar
    const barY = 230;
    ctx.fillStyle = '#a0a0b8';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`Cards Mastered: ${mastered} / ${totalCards}`, 32, barY);

    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.roundRect(32, barY + 10, 536, 12, 6);
    ctx.fill();

    const barGrad = ctx.createLinearGradient(32, 0, 32 + 536 * (masteryPct / 100), 0);
    barGrad.addColorStop(0, '#4f8ef7');
    barGrad.addColorStop(1, '#34c759');
    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.roundRect(32, barY + 10, Math.max(12, 536 * (masteryPct / 100)), 12, 6);
    ctx.fill();

    // XP
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${totalXP.toLocaleString()} XP`, 32, 300);

    ctx.fillStyle = '#a0a0b8';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${profile.longestStreak ?? 0} day longest streak • ${(profile.totalStudyTime ?? 0) > 3600000 ? Math.round((profile.totalStudyTime ?? 0) / 3600000) + 'h' : Math.round((profile.totalStudyTime ?? 0) / 60000) + 'm'} total study time`, 32, 322);

    // Footer
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('kinneret-study.vercel.app', 32, 376);

    return canvas;
  }, [data]);

  const handleDownload = useCallback(() => {
    const canvas = generateImage();
    const link = document.createElement('a');
    link.download = 'kinneret-progress.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [generateImage]);

  const handleShare = useCallback(async () => {
    const canvas = generateImage();

    try {
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/png'),
      );

      if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'progress.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: 'My Kinneret Study Progress',
          files: [new File([blob], 'kinneret-progress.png', { type: 'image/png' })],
        });
      } else {
        // Fallback: copy image to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback: download
      handleDownload();
    }
  }, [generateImage, handleDownload]);

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors flex-1"
        style={{
          background: 'rgba(191,90,242,0.1)',
          color: '#bf5af2',
          borderRadius: '10px',
          border: '1.5px solid rgba(191,90,242,0.3)',
          cursor: 'pointer',
          justifyContent: 'center',
        }}
      >
        {copied ? <Check size={16} /> : <Share2 size={16} />}
        {copied ? 'Copied!' : 'Share Progress'}
      </button>
      <button
        onClick={handleDownload}
        className="flex items-center justify-center px-3 py-2.5 transition-colors"
        style={{
          background: 'rgba(191,90,242,0.1)',
          color: '#bf5af2',
          borderRadius: '10px',
          border: '1.5px solid rgba(191,90,242,0.3)',
          cursor: 'pointer',
        }}
        title="Download as image"
      >
        <Download size={16} />
      </button>
    </div>
  );
}
