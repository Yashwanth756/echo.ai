const backend_url = import.meta.env.VITE_backend_url
import { GoogleGenerativeAI } from "@google/generative-ai";
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
  correctedText?: string;
}

// Common word lists by part of speech for demo purposes
const commonNouns = ["time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place", "work", "week", "case"];
const commonVerbs = ["be", "have", "do", "say", "get", "make", "go", "know", "take", "see", "come", "think", "look", "want", "give", "use", "find", "tell"];
const commonAdjectives = ["good", "new", "first", "last", "long", "great", "little", "own", "other", "old", "right", "big", "high", "different", "small", "large"];
const commonAdverbs = ["up", "so", "out", "just", "now", "how", "then", "more", "also", "here", "well", "only", "very", "even", "back", "there", "down"];
const commonPrepositions = ["in", "to", "of", "for", "with", "on", "at", "from", "by", "about", "as", "into", "like", "through", "after", "over", "between"];
const commonPronouns = ["i", "you", "he", "she", "it", "we", "they", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their"];
const commonConjunctions = ["and", "but", "or", "yet", "so", "because", "if", "while", "although", "since", "when", "where", "unless", "before"];

import { getGenAIInstance } from '@/lib/gemini-api';

// This now uses Gemini API for real grammar analysis
export const analyzeGrammar = async (text: string): Promise<GrammarAnalysisResult> => {
  try {
    // Get fresh instance with current API key
    let apikey, geminiModel, genAI=getGenAIInstance(), currentModel ='gemini-2.0-flash';
    if (!genAI) {
      // Fallback to mock analysis if no API key
      return getMockAnalysis(text);
    }
    let apidata = await fetch(backend_url + "get-api-key");
      if (!apidata.ok) {
        throw new Error(`Server error: ${apidata.status}`);
      }

      const data = await apidata.json();
      apikey = data.apikey;
      geminiModel = data.model;
      if(apikey.length != 0)  genAI = new GoogleGenerativeAI(apikey);
      if (!genAI) {
          console.log("something went wrong with the API key");
      }
        
      if(apikey.length != 0) currentModel = geminiModel;
      let model = genAI.getGenerativeModel({ model: currentModel });
    
    const prompt = `
      You are an expert English grammar tutor. Analyze the following text for grammar errors and provide detailed feedback.
      
      Text to analyze: "${text}"
      
      Please provide your analysis in the following JSON format:
      {
        "score": number (0-100, where 100 is perfect grammar),
        "errors": [
          {
            "original": "incorrect text",
            "corrected": "corrected text", 
            "explanation": "explanation of the error",
            "type": "error category (e.g., subject-verb agreement, tense, punctuation)"
          }
        ],
        "correctedText": "the fully corrected version of the text",
        "suggestion": "specific suggestion for improvement",
        "readabilityScore": number (0-100)
      }
      
      Be thorough but focus on the most important grammar issues. If the text is already correct, return an empty errors array and a high score.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();
    
    // Parse the JSON response
    let analysis;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(responseText);
      }
    } catch (e) {
      console.error("Could not parse Gemini response:", e);
      return getMockAnalysis(text);
    }

    // Generate POS data (keeping the mock implementation for now)
    const posData = generatePosData(text);
    const posChartData = generatePosChart(posData);

    return {
      score: analysis.score || 85,
      errors: analysis.errors || [],
      readabilityScore: analysis.readabilityScore || 80,
      suggestion: analysis.suggestion || "Your grammar looks good!",
      correctedText: analysis.correctedText,
      posData,
      posChartData
    };

  } catch (error) {
    console.error("Error with Gemini grammar analysis:", error);
    // Fallback to mock analysis
    return getMockAnalysis(text);
  }
};

// Helper function for mock analysis (fallback)
const getMockAnalysis = (text: string): GrammarAnalysisResult => {
  const posData = generatePosData(text);
  const posChartData = generatePosChart(posData);
  
  return {
    score: 85,
    errors: [],
    readabilityScore: 80,
    suggestion: "Consider using the Grammar Clinic with a valid API key for detailed analysis.",
    posData,
    posChartData
  };
};

// Generate Parts of Speech data
const generatePosData = (text: string): PosData => {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
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
  
  return posData;
};

// Generate chart data from POS data
const generatePosChart = (posData: PosData): PosChartData[] => {
  const total = Object.values(posData).reduce((acc, arr) => acc + arr.length, 0) || 1;
  return Object.entries(posData).map(([name, words]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: (words.length / total) * 100,
    count: words.length
  })).sort((a, b) => b.count - a.count);
};