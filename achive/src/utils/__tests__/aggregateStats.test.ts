import { aggregateStats } from '../aggregateStats';
import type { Feedback } from '../../types';

describe('aggregateStats', () => {
  it('should return zeros when the array is empty', () => {
    const result = aggregateStats([]);
    expect(result).toEqual({ positive: 0, neutral: 0, negative: 0 });
  });

  it('should produce correct counts for mixed feedbacks', () => {
    const feedbacks: Feedback[] = [
      {
        id: '1',
        author: 'John Doe',
        category: 'positive',
        message: 'Great work!',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        author: 'Jane Smith',
        category: 'negative',
        message: 'Needs improvement',
        timestamp: '2023-01-02T00:00:00Z'
      },
      {
        id: '3',
        author: 'Bob Johnson',
        category: 'positive',
        message: 'Excellent!',
        timestamp: '2023-01-03T00:00:00Z'
      },
      {
        id: '4',
        author: 'Alice Brown',
        category: 'neutral',
        message: 'It was okay',
        timestamp: '2023-01-04T00:00:00Z'
      },
      {
        id: '5',
        author: 'Charlie Wilson',
        category: 'positive',
        message: 'Outstanding performance',
        timestamp: '2023-01-05T00:00:00Z'
      }
    ];

    const result = aggregateStats(feedbacks);
    expect(result).toEqual({ positive: 3, neutral: 1, negative: 1 });
  });

  it('should work correctly when all feedbacks are of one category', () => {
    const positiveFeedbacks: Feedback[] = [
      {
        id: '1',
        author: 'User 1',
        category: 'positive',
        message: 'Fantastic!',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        author: 'User 2',
        category: 'positive',
        message: 'Amazing work!',
        timestamp: '2023-01-02T00:00:00Z'
      },
      {
        id: '3',
        author: 'User 3',
        category: 'positive',
        message: 'Keep it up!',
        timestamp: '2023-01-03T00:00:00Z'
      }
    ];

    const result = aggregateStats(positiveFeedbacks);
    expect(result).toEqual({ positive: 3, neutral: 0, negative: 0 });
  });

  it('should work correctly with all negative feedbacks', () => {
    const negativeFeedbacks: Feedback[] = [
      {
        id: '1',
        author: 'Critic 1',
        category: 'negative',
        message: 'Poor performance',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        author: 'Critic 2',
        category: 'negative',
        message: 'Needs major improvement',
        timestamp: '2023-01-02T00:00:00Z'
      }
    ];

    const result = aggregateStats(negativeFeedbacks);
    expect(result).toEqual({ positive: 0, neutral: 0, negative: 2 });
  });

  it('should work correctly with all neutral feedbacks', () => {
    const neutralFeedbacks: Feedback[] = [
      {
        id: '1',
        author: 'Observer 1',
        category: 'neutral',
        message: 'Average work',
        timestamp: '2023-01-01T00:00:00Z'
      }
    ];

    const result = aggregateStats(neutralFeedbacks);
    expect(result).toEqual({ positive: 0, neutral: 1, negative: 0 });
  });
});
