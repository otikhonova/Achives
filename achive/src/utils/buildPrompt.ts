import type { Feedback } from '../types';

/**
 * Builds a natural language prompt for image generation based on full feedback texts.
 * @param employeeName - The employee's name.
 * @param feedbacks - Array of feedback objects.
 * @returns A string prompt for DALL·E or similar AI image generator.
 */
export function buildPrompt(employeeName: string, feedbacks: Feedback[]): string {
  // Group feedbacks by category
  const hardSkills = feedbacks.filter(f => f.category === 'hard');
  const softSkills = feedbacks.filter(f => f.category === 'soft');
  const englishSkills = feedbacks.filter(f => f.category === 'english');

  let prompt = `Create a flat 512×512 transparent achievement badge for employee: ${employeeName}.\n\n`;

  if (hardSkills.length > 0) {
    prompt += `Hard Skills feedback:\n`;
    hardSkills.forEach(f => prompt += `- "${f.message}"\n`);
    prompt += '\n';
  }
  if (softSkills.length > 0) {
    prompt += `Soft Skills/Communication feedback:\n`;
    softSkills.forEach(f => prompt += `- "${f.message}"\n`);
    prompt += '\n';
  }
  if (englishSkills.length > 0) {
    prompt += `English Skills feedback:\n`;
    englishSkills.forEach(f => prompt += `- "${f.message}"\n`);
    prompt += '\n';
  }

  // Determine dominant category and styling
  const counts = { hard: hardSkills.length, soft: softSkills.length, english: englishSkills.length };
  const dominant = Object.keys(counts).reduce((a, b) => counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b);

  prompt += `Use the feedback above to create a badge that reflects the overall sentiment. `;
  prompt += `Dominant category appears to be ${dominant} skills. `;
  prompt += `Use modern, clean design with appropriate colors and symbols.`;

  return prompt;
}
