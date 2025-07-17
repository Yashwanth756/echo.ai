
export const motivationalTips = [
  "Small daily improvements lead to stunning results.",
  "Mistakes are proof you're trying. Keep speaking!",
  "Today's effort is tomorrow's fluency.",
  "Don't be afraid to sound silly – that's how you learn!",
  "Every word you try is a step closer to fluency.",
  "Confidence in your voice, power in your words.",
  "Practice makes progress, not perfection.",
  "Celebrate your small wins!",
  "Learning a language is a journey. Enjoy every step.",
  "Speak boldly, even when you're unsure.",
  "Language learning is a marathon, not a sprint.",
  "Listen carefully, speak bravely.",
  "Learning a language opens doors to new worlds.",
  "Communication over perfection – just express yourself!",
  "Your accent is a sign of your bravery.",
  "Fluency comes from consistent practice.",
  "Immerse yourself in the language daily.",
  "Five minutes of practice is better than no practice.",
  "Growth happens outside your comfort zone.",
  "The more you speak, the more confident you'll become."
];

export function getRandomMotivationalTip() {
  return motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
}

// Added helper functions for progress tracking
export function calculateStreak(datesCompleted: string[]): number {
  if (!datesCompleted.length) return 0;
  
  // Sort dates in ascending order
  const sortedDates = [...datesCompleted].sort();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if user completed activity today
  const hasCompletedToday = sortedDates.includes(today);
  
  if (!hasCompletedToday) {
    // Check if user completed activity yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    if (!sortedDates.includes(yesterdayString)) {
      return 0;
    }
  }
  
  let streak = hasCompletedToday ? 1 : 0;
  let currentDate = new Date();
  
  if (!hasCompletedToday) {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  while (true) {
    currentDate.setDate(currentDate.getDate() - 1);
    const dateString = currentDate.toISOString().split('T')[0];
    
    if (sortedDates.includes(dateString)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
