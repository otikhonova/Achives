// Centralized category mapping and type
export const CATEGORY_MAP = {
  "Hard Skills": "hard",
  "Soft Skills / Communication": "comm",
  "English": "english"
} as const;

export type CategoryKey = typeof CATEGORY_MAP[keyof typeof CATEGORY_MAP]; // 'hard' | 'comm' | 'english'
