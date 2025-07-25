export interface Feedback {
  id: string;
  author: string;
  category: 'hard' | 'soft' | 'english';
  message: string;
  timestamp: string;
}
