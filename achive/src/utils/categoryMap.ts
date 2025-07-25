// Centralized mapping for client use
export const CATEGORY_MAP = {
  "Hard Skills": "hard",
  "Communication (Soft Skills)": "soft",
  "English Proficiency": "english"
} as const;

export type CategoryKey = typeof CATEGORY_MAP[keyof typeof CATEGORY_MAP]; // 'hard' | 'comm' | 'english'
