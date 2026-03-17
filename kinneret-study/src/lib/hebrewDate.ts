// Date display utility
// Provides a nicely formatted date string for the app.

import { format } from 'date-fns';

/**
 * Returns a nicely formatted date display.
 *
 * Example output: "March 17, 2026"
 */
export function getHebrewDateDisplay(): string {
  const now = new Date();
  return format(now, 'MMMM d, yyyy');
}
