import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfDay } from 'date-fns';
import { useAppStore } from '../../store/appStore';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function countCards(cs: number | string[] | undefined): number {
  if (Array.isArray(cs)) return cs.length;
  if (typeof cs === 'number') return cs;
  return 0;
}

/** Map card-count to a green opacity level */
function intensityColor(count: number): string {
  if (count === 0) return 'var(--bg-overlay)';
  if (count <= 5) return 'rgba(52,199,89,0.20)';
  if (count <= 15) return 'rgba(52,199,89,0.40)';
  if (count <= 30) return 'rgba(52,199,89,0.70)';
  return 'rgba(52,199,89,1)';
}

const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];
const CELL = 14;
const GAP = 2;
const WEEKS = 13;
const DAYS = 7;

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function ActivityHeatmap() {
  const { data } = useAppStore();

  const { grid, monthLabels } = useMemo(() => {
    const today = startOfDay(new Date());
    const sessions = data.sessions ?? [];

    // Build a day -> count map for the last 91 days
    const countMap = new Map<string, number>();
    for (const s of sessions) {
      const key = format(
        startOfDay(new Date(s.startTime)),
        'yyyy-MM-dd',
      );
      countMap.set(key, (countMap.get(key) ?? 0) + countCards((s as any).cardsStudied));
    }

    // Build grid: 13 columns (weeks) x 7 rows (days, 0=Sun)
    // The grid ends today. We need to figure out the start date so the last
    // cell lands on today and cells are aligned by day-of-week.
    const todayDow = today.getDay(); // 0=Sun
    // Last column ends at today. The row index of today is todayDow.
    // Total cells = WEEKS * DAYS = 91 but some trailing cells after today are empty.
    // Column c, row r -> date = startDate + c*7 + r
    // startDate = today - ((WEEKS-1)*7 + todayDow)
    const startDate = subDays(today, (WEEKS - 1) * 7 + todayDow);

    const cells: { date: Date; count: number; col: number; row: number }[] = [];
    for (let col = 0; col < WEEKS; col++) {
      for (let row = 0; row < DAYS; row++) {
        const actualDate = new Date(startDate);
        actualDate.setDate(startDate.getDate() + col * 7 + row);
        if (actualDate > today) continue; // skip future dates
        const key = format(actualDate, 'yyyy-MM-dd');
        cells.push({
          date: actualDate,
          count: countMap.get(key) ?? 0,
          col,
          row,
        });
      }
    }

    // Month labels: find the first cell in each column and label if new month
    const labels: { text: string; col: number }[] = [];
    let lastMonth = -1;
    for (let col = 0; col < WEEKS; col++) {
      const cell = cells.find((c) => c.col === col);
      if (cell) {
        const m = cell.date.getMonth();
        if (m !== lastMonth) {
          labels.push({ text: format(cell.date, 'MMM'), col });
          lastMonth = m;
        }
      }
    }

    return { grid: cells, monthLabels: labels };
  }, [data.sessions]);

  const LEFT_PAD = 24; // space for day labels
  const gridWidth = LEFT_PAD + WEEKS * (CELL + GAP);
  const gridHeight = DAYS * (CELL + GAP);

  return (
    <div
      className="w-full overflow-x-auto"
      style={{
        background: 'var(--bg-elevated)',
        borderRadius: '16px',
        border: '1px solid var(--bg-border)',
        padding: '24px',
      }}
    >
      <h3
        className="text-sm font-semibold mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        Study Activity
      </h3>

      <div className="relative" style={{ minWidth: gridWidth }}>
        {/* Month labels */}
        <div
          className="flex text-[10px] mb-1"
          style={{ color: 'var(--text-tertiary)', paddingLeft: LEFT_PAD }}
        >
          {monthLabels.map((ml, i) => (
            <span
              key={i}
              className="absolute"
              style={{
                left: LEFT_PAD + ml.col * (CELL + GAP),
                top: 0,
              }}
            >
              {ml.text}
            </span>
          ))}
        </div>

        {/* Grid + day labels */}
        <div className="relative" style={{ marginTop: 18 }}>
          {/* Day-of-week labels */}
          {DAY_LABELS.map((label, row) =>
            label ? (
              <span
                key={row}
                className="absolute text-[10px]"
                style={{
                  color: 'var(--text-tertiary)',
                  top: row * (CELL + GAP) + 1,
                  left: 0,
                }}
              >
                {label}
              </span>
            ) : null,
          )}

          {/* Cells */}
          <svg
            width={WEEKS * (CELL + GAP)}
            height={gridHeight}
            style={{ marginLeft: LEFT_PAD }}
          >
            {grid.map((cell, idx) => (
              <motion.rect
                key={`${cell.col}-${cell.row}`}
                x={cell.col * (CELL + GAP)}
                y={cell.row * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={3}
                ry={3}
                fill={intensityColor(cell.count)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.01, duration: 0.2 }}
              >
                <title>
                  {format(cell.date, 'MMM d, yyyy')}: {cell.count} cards
                </title>
              </motion.rect>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div
          className="flex items-center gap-1.5 mt-4 text-[10px]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <span>Less</span>
          {[0, 3, 10, 20, 35].map((v) => (
            <div
              key={v}
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: intensityColor(v),
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
