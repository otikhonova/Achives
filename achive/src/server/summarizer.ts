import type { CategoryKey } from './category-map';

/**
 * Summarizes feedbacks by category using GPT-4(o)-mini.
 * @param feedbackByKey Record<CategoryKey, string[]>
 * @returns Record<CategoryKey, string>
 */
export async function summarize(feedbackByKey: Record<CategoryKey, string[]>): Promise<Record<CategoryKey, string>> {
  // TODO: Call GPT-4(o)-mini for each category, return { hard, comm, english }
  // For now, mock implementation:
  return {
    hard: feedbackByKey.hard.length ? `Summary for hard: ${feedbackByKey.hard.join('; ')}` : '',
    comm: feedbackByKey.comm.length ? `Summary for comm: ${feedbackByKey.comm.join('; ')}` : '',
    english: feedbackByKey.english.length ? `Summary for english: ${feedbackByKey.english.join('; ')}` : ''
  };
}
