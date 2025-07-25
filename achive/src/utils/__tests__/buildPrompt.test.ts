import { CATEGORY_MAP } from '../categoryMap';
import type { CategoryKey } from '../categoryMap';
import { buildPrompt } from '../buildPrompt';

describe('buildPrompt (summary-aware, new algorithm)', () => {
  it('builds a prompt using mapped categories and summaries', () => {
    type Feedback = {
      id: string;
      author: string;
      category: CategoryKey;
      message: string;
      timestamp: string;
    };
    const feedbacks: Feedback[] = [
      { id: '1', author: 'A', category: CATEGORY_MAP["Hard Skills"], message: 'Great coding', timestamp: '2025-07-25T00:00:00Z' },
      { id: '2', author: 'B', category: CATEGORY_MAP["Communication (Soft Skills)"], message: 'Excellent teamwork', timestamp: '2025-07-25T00:00:00Z' },
      { id: '3', author: 'C', category: CATEGORY_MAP["English Proficiency"], message: 'Clear communication', timestamp: '2025-07-25T00:00:00Z' }
    ];
    const prompt = buildPrompt('Jane Doe', feedbacks);
    expect(prompt).toContain('Jane Doe');
    expect(prompt).toContain('Great coding');
    expect(prompt).toContain('Excellent teamwork');
    expect(prompt).toContain('Clear communication');
    // Should not use any magic strings for category keys
    expect(prompt).not.toMatch(/soft/);
  });
});