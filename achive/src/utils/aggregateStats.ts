import type { Feedback } from '../types';

/**
 * Count how many feedbacks of each category exist.
 */
export function aggregateStats(feedbacks: Feedback[]): {
  positive: number;
  neutral: number;
  negative: number;
} {
  // Initialize counters
  let positive = 0;
  let neutral = 0;
  let negative = 0;

  // Iterate over feedbacks array and count category occurrences
  for (const feedback of feedbacks) {
    switch (feedback.category) {
      case 'positive':
        positive++;
        break;
      case 'neutral':
        neutral++;
        break;
      case 'negative':
        negative++;
        break;
    }
  }

  // Return an object with counts
  return { positive, neutral, negative };
}
