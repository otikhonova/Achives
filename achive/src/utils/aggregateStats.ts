import type { Feedback } from '../types';

/**
 * Count how many feedbacks of each skill category exist.
 */
export function aggregateStats(feedbacks: Feedback[]): {
  hard: number;
  soft: number;
  english: number;
} {
  let hard = 0;
  let soft = 0;
  let english = 0;

  for (const feedback of feedbacks) {
    switch (feedback.category) {
      case 'hard':
        hard++;
        break;
      case 'soft':
        soft++;
        break;
      case 'english':
        english++;
        break;
    }
  }
  return { hard, soft, english };
}
