import { aggregateStats } from '../aggregateStats';
import type { Feedback } from '../../types';

describe('aggregateStats', () => {
  it('should return zeros when the array is empty', () => {
    const result = aggregateStats([]);
    expect(result).toEqual({ hard: 0, soft: 0, english: 0 });
  });

  it('should produce correct counts for mixed feedbacks', () => {
    const feedbacks: Feedback[] = [
      {
        id: '1',
        author: 'John Doe',
        category: 'hard',
        message: 'Great work!',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        author: 'Jane Smith',
        category: 'soft',
        message: 'Needs improvement',
        timestamp: '2023-01-02T00:00:00Z'
      },
      {
        id: '3',
        author: 'Bob Johnson',
        category: 'hard',
        message: 'Excellent!',
        timestamp: '2023-01-03T00:00:00Z'
      },
      {
        id: '4',
        author: 'Alice Brown',
        category: 'english',
        message: 'It was okay',
        timestamp: '2023-01-04T00:00:00Z'
      },
      {
        id: '5',
        author: 'Charlie Wilson',
        category: 'soft',
        message: 'Outstanding performance',
        timestamp: '2023-01-05T00:00:00Z'
      }
    ];

    const result = aggregateStats(feedbacks);
    expect(result).toEqual({ hard: 2, soft: 2, english: 1 });
  });

  it('should work correctly when all feedbacks are of one category', () => {
    const feedbacks: Feedback[] = [
      {
        id: '1',
        author: 'User 1',
        category: 'hard',
        message: 'Fantastic!',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        author: 'User 2',
        category: 'hard',
        message: 'Amazing work!',
        timestamp: '2023-01-02T00:00:00Z'
      },
      {
        id: '3',
        author: 'User 3',
        category: 'hard',
        message: 'Keep it up!',
        timestamp: '2023-01-03T00:00:00Z'
      }
    ];

    const result = aggregateStats(feedbacks);
    expect(result).toEqual({ hard: 3, soft: 0, english: 0 });
  });

  it('should work correctly with all english feedbacks', () => {
    const feedbacks: Feedback[] = [
      {
        id: '1',
        author: 'Critic 1',
        category: 'english',
        message: 'Poor performance',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        id: '2',
        author: 'Critic 2',
        category: 'english',
        message: 'Needs major improvement',
        timestamp: '2023-01-02T00:00:00Z'
      }
    ];

    const result = aggregateStats(feedbacks);
    expect(result).toEqual({ hard: 0, soft: 0, english: 2 });
  });

  it('should work correctly with all soft feedbacks', () => {
    const feedbacks: Feedback[] = [
      {
        id: '1',
        author: 'Observer 1',
        category: 'soft',
        message: 'Average work',
        timestamp: '2023-01-01T00:00:00Z'
      }
    ];

    const result = aggregateStats(feedbacks);
    expect(result).toEqual({ hard: 0, soft: 1, english: 0 });
  });
});
