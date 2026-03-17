import { useCallback } from 'react';
import { Printer } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { cards } from '../../data/cards';
import { createInitialCardState } from '../../lib/sm2';

export default function ExportStudySheet() {
  const { data } = useAppStore();

  const handlePrint = useCallback(() => {
    const cardStates = data.cardStates ?? {};

    // Get cards sorted by weakness (lowest ease factor first)
    const sortedCards = [...cards]
      .map((card) => ({
        ...card,
        state: cardStates[card.id] ?? createInitialCardState(card.id),
      }))
      .filter((c) => c.state.difficulty !== 'mastered')
      .sort((a, b) => a.state.easeFactor - b.state.easeFactor);

    // Group by category
    const grouped = new Map<string, typeof sortedCards>();
    for (const card of sortedCards) {
      const cat = card.category;
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)!.push(card);
    }

    // Build HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Kinneret Study Sheet</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; color: #1a1a2e; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { font-size: 12px; color: #666; margin-bottom: 20px; }
    h2 { font-size: 16px; margin: 16px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #4f8ef7; color: #4f8ef7; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
    th { background: #f0f4ff; text-align: left; padding: 6px 8px; font-weight: 600; border: 1px solid #ddd; }
    td { padding: 6px 8px; border: 1px solid #ddd; vertical-align: top; }
    tr:nth-child(even) { background: #fafafa; }
    .hebrew { font-size: 14px; direction: rtl; }
    .stats { font-size: 10px; color: #888; }
    @media print {
      body { padding: 10px; }
      h2 { break-after: avoid; }
      tr { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <h1>Kinneret Study Sheet</h1>
  <p class="subtitle">Generated ${new Date().toLocaleDateString()} &bull; ${sortedCards.length} cards to review</p>
  ${Array.from(grouped.entries())
    .map(
      ([category, catCards]) => `
    <h2>${category} (${catCards.length})</h2>
    <table>
      <thead>
        <tr><th>Term</th><th>Hebrew</th><th>Definition</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${catCards
          .map(
            (c) => `
          <tr>
            <td><strong>${c.term}</strong>${c.subcategory ? `<br><span class="stats">${c.subcategory}</span>` : ''}</td>
            <td>${c.definition}</td>
            <td class="stats">${c.state.difficulty} (ease: ${c.state.easeFactor.toFixed(1)})</td>
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>`,
    )
    .join('')}
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    }
  }, [data.cardStates]);

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
      style={{
        background: 'rgba(79,142,247,0.1)',
        color: '#4f8ef7',
        borderRadius: '10px',
        border: '1.5px solid rgba(79,142,247,0.3)',
        cursor: 'pointer',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <Printer size={16} />
      Print Study Sheet
    </button>
  );
}
