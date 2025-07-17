
// Mock data for the radar chart
export const grammarData = [
  { category: "Grammar", score: 80, fullMark: 100 },
  { category: "Vocabulary", score: 70, fullMark: 100 },
  { category: "Coherence", score: 85, fullMark: 100 },
  { category: "Style", score: 65, fullMark: 100 },
  { category: "Punctuation", score: 90, fullMark: 100 },
];

// Daily challenge suggestions
export const dailyChallenges = [
  "Write a paragraph using 5 different tenses.",
  "Compose three sentences using passive voice correctly.",
  "Write a short story without using any forms of 'to be'.",
  "Create five questions using different question words.",
  "Write instructions for a simple task using imperative form.",
  "Write a paragraph with at least 5 adjectives and 5 adverbs.",
  "Create sentences using homophones correctly (e.g., their/there/they're).",
  "Write a paragraph using only simple sentences (no compound or complex structures).",
  "Create a dialogue using at least 3 different modal verbs.",
  "Write a paragraph with proper noun-pronoun agreement throughout."
];

export interface GrammarError {
  original: string;
  corrected: string;
  explanation: string;
  type: string;
}

export interface PosData {
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  adverbs: string[];
  prepositions: string[];
  pronouns: string[];
  conjunctions: string[];
}

export interface PosChartData {
  name: string;
  value: number;
  count: number;
}

export interface GrammarAnalysisResult {
  score: number;
  errors: GrammarError[];
  readabilityScore: number;
  suggestion: string;
  posData: PosData;
  posChartData: PosChartData[];
}

// Common word lists by part of speech for demo purposes
const commonNouns = ["time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place", "work", "week", "case"];
const commonVerbs = ["be", "have", "do", "say", "get", "make", "go", "know", "take", "see", "come", "think", "look", "want", "give", "use", "find", "tell"];
const commonAdjectives = ["good", "new", "first", "last", "long", "great", "little", "own", "other", "old", "right", "big", "high", "different", "small", "large"];
const commonAdverbs = ["up", "so", "out", "just", "now", "how", "then", "more", "also", "here", "well", "only", "very", "even", "back", "there", "down"];
const commonPrepositions = ["in", "to", "of", "for", "with", "on", "at", "from", "by", "about", "as", "into", "like", "through", "after", "over", "between"];
const commonPronouns = ["i", "you", "he", "she", "it", "we", "they", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their"];
const commonConjunctions = ["and", "but", "or", "yet", "so", "because", "if", "while", "although", "since", "when", "where", "unless", "before"];

// This would be replaced with a proper API call in a real implementation
export const analyzeGrammar = (text: string): GrammarAnalysisResult => {
  // For demo purposes, we'll use a more sophisticated mock implementation
  const textLower = text.toLowerCase();
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  // Simple mock POS tagging based on common word lists
  // In a real implementation, this would use a proper NLP library
  const posData = {
    nouns: words.filter(w => {
      const clean = w.replace(/[^\w]/g, '').toLowerCase();
      return commonNouns.includes(clean);
    }),
    verbs: words.filter(w => {
      const clean = w.replace(/[^\w]/g, '').toLowerCase();
      return commonVerbs.includes(clean);
    }),
    adjectives: words.filter(w => {
      const clean = w.replace(/[^\w]/g, '').toLowerCase();
      return commonAdjectives.includes(clean);
    }),
    adverbs: words.filter(w => {
      const clean = w.replace(/[^\w]/g, '').toLowerCase();
      return commonAdverbs.includes(clean);
    }),
    prepositions: words.filter(w => {
      const clean = w.replace(/[^\w]/g, '').toLowerCase();
      return commonPrepositions.includes(clean);
    }),
    pronouns: words.filter(w => {
      const clean = w.replace(/[^\w]/g, '').toLowerCase();
      return commonPronouns.includes(clean);
    }),
    conjunctions: words.filter(w => {
      const clean = w.replace(/[^\w]/g, '').toLowerCase();
      return commonConjunctions.includes(clean);
    }),
  };
  
  // Add random words to simulate more realistic POS distribution
  // In a real implementation, this would be replaced with actual NLP analysis
  const addRandomWords = (category: keyof PosData, chance: number) => {
    words.forEach(word => {
      const clean = word.replace(/[^\w]/g, '').toLowerCase();
      if (
        !posData.nouns.includes(word) &&
        !posData.verbs.includes(word) &&
        !posData.adjectives.includes(word) &&
        !posData.adverbs.includes(word) &&
        !posData.prepositions.includes(word) &&
        !posData.pronouns.includes(word) &&
        !posData.conjunctions.includes(word) &&
        clean.length > 2 &&
        Math.random() < chance
      ) {
        posData[category].push(word);
      }
    });
  };
  
  // Add some random words to each category
  addRandomWords("nouns", 0.4);
  addRandomWords("verbs", 0.2);
  addRandomWords("adjectives", 0.1);
  addRandomWords("adverbs", 0.1);
  addRandomWords("prepositions", 0.05);
  addRandomWords("pronouns", 0.05);
  addRandomWords("conjunctions", 0.05);
  
  // Calculate percentages for the donut chart
  const total = Object.values(posData).reduce((acc, arr) => acc + arr.length, 0) || 1;
  const posChartData = Object.entries(posData).map(([name, words]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: (words.length / total) * 100,
    count: words.length
  })).sort((a, b) => b.count - a.count); // Sort by count descending
  
  // Common grammar errors
  const commonErrors = [
    {
      pattern: /\b(i|she|he|it|we|they) (is|am|are|was|were)\b/i,
      check: (text: string) => {
        const match = text.match(/\b(i|she|he|it|we|they) (is|am|are|was|were)\b/i);
        if (!match) return null;
        
        const subject = match[1].toLowerCase();
        const verb = match[2].toLowerCase();
        let corrected;
        
        if (subject === 'i' && verb !== 'am' && verb !== 'was') {
          corrected = verb === 'is' || verb === 'are' ? 'am' : 'was';
        } else if ((subject === 'she' || subject === 'he' || subject === 'it') && 
                  verb !== 'is' && verb !== 'was') {
          corrected = verb === 'am' || verb === 'are' ? 'is' : 'was';
        } else if ((subject === 'we' || subject === 'they') && 
                  verb !== 'are' && verb !== 'were') {
          corrected = verb === 'am' || verb === 'is' ? 'are' : 'were';
        } else {
          return null; // No error
        }
        
        return {
          original: match[0],
          corrected: `${match[1]} ${corrected}`,
          explanation: `Use "${corrected}" with "${match[1]}" for subject-verb agreement.`,
          type: "subject-verb agreement"
        };
      }
    },
    {
      pattern: /\b(do not|does not|did not) (likes?|wants?|needs?|goes?|sees?|has?)\b/i,
      check: (text: string) => {
        const match = text.match(/\b(do not|does not|did not) (likes?|wants?|needs?|goes?|sees?|has?)\b/i);
        if (!match) return null;
        
        const aux = match[1].toLowerCase();
        const verb = match[2].toLowerCase();
        const baseVerb = verb.endsWith('s') ? verb.slice(0, -1) : verb;
        
        return {
          original: match[0],
          corrected: `${aux} ${baseVerb}`,
          explanation: `After auxiliaries like "${aux}", use the base form of the verb without -s.`,
          type: "auxiliary verb usage"
        };
      }
    },
    {
      pattern: /\b(has|have) (went|came|ran|saw|did)\b/i,
      check: (text: string) => {
        const match = text.match(/\b(has|have) (went|came|ran|saw|did)\b/i);
        if (!match) return null;
        
        const aux = match[1];
        const verb = match[2].toLowerCase();
        let pastParticiple;
        
        if (verb === 'went') pastParticiple = 'gone';
        else if (verb === 'came') pastParticiple = 'come';
        else if (verb === 'ran') pastParticiple = 'run';
        else if (verb === 'saw') pastParticiple = 'seen';
        else if (verb === 'did') pastParticiple = 'done';
        
        return {
          original: match[0],
          corrected: `${aux} ${pastParticiple}`,
          explanation: `With "${aux}", use the past participle "${pastParticiple}" instead of the simple past "${verb}".`,
          type: "perfect tense formation"
        };
      }
    }
  ];
  
  // Check for grammar errors
  const errors: GrammarError[] = [];
  
  if (text.length > 10) {
    commonErrors.forEach(errorType => {
      if (errorType.pattern.test(text)) {
        const error = errorType.check(text);
        if (error) {
          errors.push(error);
        }
      }
    });
    
    // Add some example errors for demonstration purposes if no real errors found
    if (errors.length === 0 && text.length > 20 && Math.random() > 0.7) {
      errors.push({
        original: "She do not likes apples",
        corrected: "She does not like apples",
        explanation: "\"Do\" changes to \"does\" for third-person singular. The verb \"like\" stays in base form after \"does\".",
        type: "subject-verb agreement"
      });
    }
  }
  
  // Calculate score based on text length and errors
  let score = 100;
  if (text.length > 0) {
    // Deduct points for each error
    score -= errors.length * 15;
    
    // Deduct points for very short texts (less sophisticated)
    if (text.length < 20) {
      score -= 10;
    }
    
    // Ensure score stays in range 0-100
    score = Math.max(0, Math.min(100, score));
  } else {
    score = 0;
  }
  
  // Generate a reasonable suggestion
  let suggestion = "Your writing looks good!";
  
  if (errors.length > 0) {
    suggestion = "Focus on subject-verb agreement and verb tense consistency to improve your grammar.";
  } else if (text.length < 20 && text.length > 0) {
    suggestion = "Try writing longer sentences to demonstrate more complex grammar structures.";
  } else if (posData.adjectives.length < 2) {
    suggestion = "Consider using more descriptive adjectives to make your writing more vivid.";
  } else if (posData.adverbs.length < 2) {
    suggestion = "Adding adverbs can help modify verbs and make your writing more precise.";
  }
  
  // Return the analysis data
  return {
    score,
    errors,
    readabilityScore: Math.floor(Math.random() * 30) + 70, // Random readability score between 70-100
    suggestion,
    posData,
    posChartData
  };
};
