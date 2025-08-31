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

export interface TenseMistake {
  sentence: string;
  mistake: string;
  correction: string;
  explanation: string;
  expectedTense: string;
  detectedTense: string;
}

export interface SentenceStructure {
  sentence: string;
  tenseStructure: string;
}

export interface GrammarAnalysisResult {
  score: number;
  errors: GrammarError[];
  readabilityScore: number;
  suggestion: string;
  correctedText?: string;
  posData: PosData;
  posChartData: PosChartData[];
  tenseMistakes?: TenseMistake[];
  tenseSummary?: { tense: string; count: number }[];
  sentenceStructures?: SentenceStructure[];
}

// All parts of speech analysis is now handled by Gemini API response

import { getGenAIInstance } from '@/lib/gemini-api';

// This now uses Gemini API for real grammar analysis
export const analyzeGrammar = async (text: string): Promise<GrammarAnalysisResult> => {
  try {
    let apikey = "", geminiModel = "";
    try {
      const response = await fetch(backend_url + "get-api-key");
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      apikey = data.apiKey || data.apikey || "";
      geminiModel = data.model || "gemini-2.0-flash";
    } catch (err: any) {
      console.error(err.message || "Unknown error occurred");
    }
    if (!apikey || apikey.length === 0) {
      const savedApiKey = localStorage.getItem('gemini-api-key');
      apikey = savedApiKey || "";
      geminiModel = 'gemini-2.0-flash';
    }
    if (!apikey || apikey.length === 0) {
      // No API key available, fallback to mock
      return getMockAnalysis(text);
    }

    // Enhanced prompt for full grammar, tense, POS, and mistake analysis
    const prompt = [
      {
        parts: [{
          text: `
You are an expert English grammar tutor and linguist. Analyze the following text for grammar errors, tense usage, and parts of speech. Provide a detailed, structured, and highly accurate report in JSON format. Highlight all mistakes, show the tense structure for each sentence, and provide a breakdown of parts of speech.

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
  "readabilityScore": number (0-100),
  "posData": {
    "nouns": ["string"],
    "verbs": ["string"],
    "adjectives": ["string"],
    "adverbs": ["string"],
    "prepositions": ["string"],
    "pronouns": ["string"],
    "conjunctions": ["string"]
  },
  "posChartData": [
    { "name": "string", "value": number, "count": number }
  ],
  "tenseMistakes": [
    {
      "sentence": "string",
      "mistake": "string",
      "correction": "string",
      "explanation": "string",
      "expectedTense": "string",
      "detectedTense": "string"
    }
  ],
  "tenseSummary": [
    { "tense": "string", "count": number }
  ],
  "sentenceStructures": [
    { "sentence": "string", "tenseStructure": "string" }
  ]
}

Be meticulous and accurate. If the text is already correct, return empty errors and tenseMistakes arrays and a high score. For each sentence, show the detected tense and the correct tense structure. For parts of speech, list all words and provide a chart data array. Highlight all mistakes clearly.
`
        }]
      }
    ];

    // Call Gemini API using REST endpoint
    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apikey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: prompt }),
      }
    );

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error("API error:", errorText);
      if (apiRes.status === 400 && errorText.includes("API key not valid")) {
        throw new Error("Your API key is invalid. Please check your API key in Settings.");
      } else if (apiRes.status === 429) {
        throw new Error("API rate limit exceeded. Please try again later or use a different API key.");
      } else {
        throw new Error(`API error (${apiRes.status}): ${errorText || "Unknown error"}`);
      }
    }

    const json = await apiRes.json();
    // More robust JSON extraction logic
    const text1 = (json?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
    let analysis = null;
    try {
      let cleanText = text1;
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```/, "").replace(/```$/, "").trim();
      }
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(cleanText);
      }
    } catch (e) {
      console.error("Could not parse Gemini response:", e);
      return getMockAnalysis(text);
    }

    return {
      score: analysis.score || 85,
      errors: analysis.errors || [],
      readabilityScore: analysis.readabilityScore || 80,
      suggestion: analysis.suggestion || "Your grammar looks good!",
      correctedText: analysis.correctedText,
      posData: analysis.posData || { nouns: [], verbs: [], adjectives: [], adverbs: [], prepositions: [], pronouns: [], conjunctions: [] },
      posChartData: analysis.posChartData || [],
      tenseMistakes: analysis.tenseMistakes || [],
      tenseSummary: analysis.tenseSummary || [],
      sentenceStructures: analysis.sentenceStructures || []
    };

  } catch (error: any) {
    console.error("Error with Gemini grammar analysis:", error);
    return getMockAnalysis(text);
  }
};

// Helper function for mock analysis (fallback)
const getMockAnalysis = (text: string): GrammarAnalysisResult => {
  return {
    score: 85,
    errors: [],
    readabilityScore: 80,
    suggestion: "Consider using the Grammar Clinic with a valid API key for detailed analysis.",
    posData: { nouns: [], verbs: [], adjectives: [], adverbs: [], prepositions: [], pronouns: [], conjunctions: [] },
    posChartData: [],
    tenseMistakes: [],
    tenseSummary: [],
    sentenceStructures: [],
    correctedText: text
  };
};


// POS and chart data now come directly from Gemini response