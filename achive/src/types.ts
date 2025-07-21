export interface Feedback {
  id: string;
  author: string;
  category: 'positive' | 'neutral' | 'negative';
  message: string;
  timestamp: string;
}
