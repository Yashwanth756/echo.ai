import React, { useRef, useState, useEffect } from "react";
import { Mic, CircleStop, ChartBar, LineChart, ArrowLeft, Settings, AlertTriangle, VolumeX } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, RadarChart as RChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { AlertCircle } from "lucide-react";
import { handleDailyData } from "@/data/progressData";
import { set } from "date-fns";
const backend_url = import.meta.env.VITE_backend_url

// Stories for each level
const stories = {
  basic: "The cat sat on the mat.",
  medium: "The curious cat explored the garden and chased butterflies.",
  hard: "Despite the looming thunderstorm, the adventurous cat leapt gracefully across the slippery rooftops, seeking shelter."
};

// Fix: Export correct component name
export default function StorySpeakingPractice() {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [randomTopic, setRandomTopic] = useState<any | null>(null);
  const [topicLoading, setTopicLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [level, setLevel] = useState<string>("");
  const [story, setStory] = useState<string>("");
  // Fetch random topic from Gemini API
  const handleGenerateTopic = async () => {
    setTopicLoading(true);
    setRandomTopic(null);
    try {
      // Use available API key logic
      let apikey, geminiModel;
      try {
        const response = await fetch(backend_url + "get-api-key");
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        apikey = data.apiKey;
        geminiModel = data.model;
      } catch (err: any) {
        apikey = localStorage.getItem('gemini-api-key');
        geminiModel = 'gemini-2.0-flash';
      }
      if (!apikey) throw new Error("No API key available");
      // Gemini prompt for topic generation
      const prompt = [
        {
          parts: [{
            text: `Generate a random English speaking practice topic for a language learner. Respond as clean JSON ONLY with these keys:
{
  \"title\": \"string\",
  \"description\": \"string\",
  \"key_points\": [\"string\"],
  \"sample_response\": \"string\"
}
Difficulty: ${difficulty}
`
          }]
        }
      ];
      const apiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/`+geminiModel+`:generateContent?key=${apikey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: prompt }),
        }
      );
      if (!apiRes.ok) {
        setTopicLoading(false);
        toast.error("Failed to fetch topic from Gemini API.");
        return;
      }
      const json = await apiRes.json();
      const text1 = (json?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
      let topicObj = null;
      try {
        let cleanText = text1;
        if (cleanText.startsWith("```json")) {
          cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```/, "").replace(/```$/, "").trim();
        }
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          topicObj = JSON.parse(jsonMatch[0]);
        } else {
          topicObj = JSON.parse(cleanText);
        }
      } catch (e) {
        topicObj = { raw: text1, parsing_error: true };
      }
      setRandomTopic(topicObj);
    } catch (e: any) {
      toast.error("Could not generate topic: " + (e.message || "Unknown error"));
    }
    setTopicLoading(false);
  };
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any | null>(null);
  const navigate = useNavigate();
  
  // Use the enhanced speech recognition hook
  const {
    transcript,
    resetTranscript,
    startListening,
    stopListening,
    isListening,
    supported,
    lastError
  } = useSpeechRecognition();

  // Sync the recognized text with our component state - but maintain existing transcript
  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }

  }, [transcript]);

  useEffect(() => {
    console.log('mounted Speaking component');
    return () => {
      // Cleanup: stop listening when component unmounts
      // if (isListening) {
        console.log("Stopping speech recognition on unmount");
        stopListening();
        setRecording(false);
      // }
    } }, []);



  // Start recording (live transcript only)
  const handleStart = () => {
    if (isListening) {
      stopListening();
      setRecording(false);
    } else {
    
      resetTranscript();
      setRecording(true);
      startListening();

    }
  };

  // Stop recording (live transcript only)
  const handleStop = () => {
    setRecording(false);
    
    // Stop SpeechRecognition
    stopListening();
  };

  // Clear transcript function for manual reset
  const handleClearTranscript = () => {
    resetTranscript();
    setText("");
  };

  // Enhanced analyze function with better error handling and API communication
  const normalizeText = (str: string) => str.toLowerCase().replace(/[.,!?;:'"()\[\]{}]/g, '').replace(/\s+/g, ' ').trim();

  const handleAnalyze = async () => {
    const minWords = story.trim().split(/\s+/).length;
    const transcriptWords = text.trim().split(/\s+/).length;
    if (!text.trim()) {
      toast.error("No transcript available. Please record some speech first.");
      return;
    }
    if (transcriptWords < minWords) {
      toast.error(`Please read the entire story aloud before analyzing. (${transcriptWords}/${minWords} words)`);
      return;
    }
    setLoading(true);
    try {
      const speechText = normalizeText(text);
      const normalizedStory = normalizeText(story);
      // Gemini prompt: strict word-by-word matching
      const prompt = [
        {
          parts: [{
            text: `
You are an expert English language coach with years of experience in teaching and providing detailed feedback. I am building a website to help users improve their English speaking skills using AI.

I will provide you with a transcript of what the user has spoken, and the story they were asked to read. Your analysis MUST be strict: compare the transcript to the story word-by-word, ignoring only case and punctuation. If any word is substituted, missing, or added, mark it as a vocabulary error and lower the theme relevance and content accuracy scores accordingly.

Story Theme (ignore case and punctuation):
"${normalizedStory}"

Transcript (ignore case and punctuation):
"${speechText}"

When comparing, do NOT assume meaning—require exact word matches. Penalize any mismatches, substitutions, or omissions. Highlight all differences in the feedback and do not give a perfect score unless the transcript matches the story exactly.

1. **Corrected Version**: Rewrite the user's speech with proper grammar, vocabulary, and sentence structure. Be meticulous about accuracy.
2. **Highlight Mistakes**: List each mistake, the correction, and explain the grammar/vocabulary rule behind it in simple but precise terms. Each mistake must include a 'type' field: grammar, vocabulary, pronunciation, or fluency.
3. **Grammar, Vocabulary, Pronunciation, and Fluency Scores**: Provide scores out of 100 for each category. Categorize the score: 0-60 = Needs Improvement, 61-80 = Average, 81-100 = Good. Explain why the score was given and what to improve with specific examples.
4. **Pronunciation Analysis**: If you do not have audio, clarify that feedback is text-based only. Identify any difficult or mispronounced words (if possible), give phonetic tips, and provide 2-3 similar words to practice.
5. **Fluency Feedback**: Count exact number of filler words used ("um", "like", "uh"). Identify specific unnatural pauses or abrupt stops. Suggest concrete techniques for smoother speech flow.
6. **Vocabulary Enhancement**: Identify basic or overused words in the transcript. Suggest 2-3 better alternatives with sample sentences showing proper usage. Display basic words as a comma-separated list.
7. **Theme Relevance**: Score out of 100 for how well the user's speech matches the story, based on strict word-by-word accuracy. Explanation of the score. List of key points covered (array). List of missing key points (array).
8. **Content Accuracy & Depth**: Score out of 100 for accuracy and depth of content. Strengths (string). Improvements (string). Model Example (string): a model answer for the story. Practice Advice (string): advice for improving content depth and accuracy.
9. **Communication Tips**: Give 3 personalized tips to help the user improve based on their specific speech pattern. Make these tips actionable and specific to their current level.
10. **Final Summary**: Provide an overall score and label (Beginner, Intermediate, Advanced). Give clear next steps and suggest if the user should retry or move to the next level.

Please make the feedback positive, constructive, educational, and HIGHLY ACCURATE. Format everything clearly so it can be easily displayed in a dashboard.

Respond as clean JSON ONLY, using keys:
{
  "corrected_version": "string",
  "mistakes": [{"mistake": "string", "correction": "string", "explanation": "string", "type": "string"}],
  "scores": {
    "grammar": {"score": number, "label": "string", "explanation": "string"},
    "vocabulary": {"score": number, "label": "string", "explanation": "string"},
    "pronunciation": {"score": number, "label": "string", "explanation": "string"},
    "fluency": {"score": number, "label": "string", "explanation": "string"}
  },
  "pronunciation_feedback": { "difficult_words": ["string"], "tips": "string", "example_words": ["string"] },
  "fluency_feedback": { "filler_words_count": number, "unnatural_pauses": "string", "suggestions": "string" },
  "vocabulary_enhancement": { "basic_words": ["string"], "alternatives": [{"word": "string", "alternatives": ["string"], "samples": ["string"]}] },
  "theme_relevance": {
    "score": number,
    "explanation": "string",
    "covered_points": ["string"],
    "missing_points": ["string"]
  },
  "content_accuracy": {
    "score": number,
    "strengths": "string",
    "improvements": "string",
    "model_example": "string",
    "practice_advice": "string"
  },
  "communication_tips": ["string"],
  "overall_summary": { "score": number, "level": "string", "recommendation": "string" }
}
`
          }]
        }
      ];
      let apikey, geminiModel;
      try {
      const response = await fetch(backend_url + "get-api-key");
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      // console.log("API key data:", data);
      apikey = data.apiKey;
      geminiModel = data.model;
    } catch (err: any) {
      console.error(err.message || "Unknown error occurred");
    }
    if (apikey.length === 0){
      const savedApiKey = localStorage.getItem('gemini-api-key');
      apikey = savedApiKey;
      geminiModel ='gemini-2.0-flash'
    }
      // Updated API endpoint to use the most suitable model
      const apiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/`+geminiModel+`:generateContent?key=${apikey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: prompt }),
        }
      );
      
      // Log the API call for debugging
      // console.log("API response status:", apiRes.status);
      
      if (!apiRes.ok) {
        const errorText = await apiRes.text();
        console.error("API error:", errorText);
        
        // More specific error handling based on status codes
        if (apiRes.status === 400 && errorText.includes("API key not valid")) {
          toast.error("Your API key is invalid. Please check your API key in Settings.", {
            action: {
              label: "Settings",
              onClick: () => navigate('/settings')
            }
          });
        } else if (apiRes.status === 429) {
          toast.error("API rate limit exceeded. Please try again later or use a different API key.");
        } else {
          throw new Error(`API error (${apiRes.status}): ${errorText || "Unknown error"}`);
        }
        
        setLoading(false);
        return;
      }
      
      const json = await apiRes.json();
      console.log("API response:", json);

      // More robust JSON extraction logic
      const text1 = (json?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
      let feedbackObj = null;
      try {
        // Remove markdown code fences if present
        let cleanText = text1;
        if (cleanText.startsWith("```json")) {
          cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```/, "").replace(/```$/, "").trim();
        }
        
        // Try to find valid JSON in the response
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          feedbackObj = JSON.parse(jsonMatch[0]);
        } else {
          feedbackObj = JSON.parse(cleanText);
        }
        
        // Validate the parsed JSON has the expected structure
        if (!feedbackObj.corrected_version || !feedbackObj.scores) {
          throw new Error("Invalid response format");
        }
        
      } catch (e) {
        console.error("Error parsing JSON:", e);
        toast.error("Could not parse the AI response. Please try again.");
        feedbackObj = { raw: text1, parsing_error: true };
      }
       const currDay = {
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        day: new Date().toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        speaking: feedbackObj.scores?.fluency?.score || 0,
        pronunciation: feedbackObj.scores?.pronunciation?.score || 0,
        vocabulary: feedbackObj.scores?.vocabulary?.score || 0,
        grammar: feedbackObj.scores?.grammar?.score || 0,
        story: 0,
        reflex: 0,
        totalTime: 0,
        sessionsCompleted: 0
      };
      // console.log('starting update', dailyData())
      await handleDailyData(currDay);
      // console.log("Updated daily data:", dailyData())
      
      
      setFeedback(feedbackObj);
    } catch (e: any) {
      console.error("Analysis error:", e);
      toast.error("Analysis failed: " + (e.message || "Could not reach Gemini API. Please check your connection."));
    }
    setLoading(false);
  };

  // Highlight errors in transcript: error words displayed with a tooltip
  function highlightErrors(original: string, highlighted_errors?: any[]) {
    if (!highlighted_errors?.length) return original;
    let highlighted = original;
    // Highlight both mistakes and corrections in the same color (red)
    highlighted_errors.forEach((err) => {
      if (err.mistake) {
        const regex = new RegExp(`\\b${err.mistake.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "gi");
        highlighted = highlighted.replace(
          regex,
          `<span class=\"text-red-600 font-semibold underline decoration-wavy decoration-red-500 cursor-pointer\" title=\"${err.explanation || ""}\">${err.mistake}</span>`
        );
      }
      if (err.correction) {
        const regexCorr = new RegExp(`\\b${err.correction.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "gi");
        highlighted = highlighted.replace(
          regexCorr,
          `<span class=\"text-red-600 font-semibold underline decoration-wavy decoration-red-500 cursor-pointer\" title=\"${err.explanation || ""}\">${err.correction}</span>`
        );
      }
    });
    return highlighted;
  }

  // Helper: Render grammar explanations safely
  function renderGrammarExplanation(exp: any, i: number) {
    if (typeof exp === "string") {
      return <li key={i}>{exp}</li>;
    }
    if (typeof exp === "object" && exp !== null && ("rule" in exp || "explanation" in exp)) {
      // Render rule and explanation if present
      return (
        <li key={i}>
          {exp.rule && <span className="font-semibold">{exp.rule}: </span>}
          {exp.explanation || JSON.stringify(exp)}
        </li>
      );
    }
    // fallback
    return <li key={i}>{JSON.stringify(exp)}</li>;
  }

  // Helper: Render structured score with categorization
  function renderScoreSection(title: string, data?: any) {
    if (!data) return null;
    // Validate score
    let score = typeof data.score === 'number' && !isNaN(data.score) ? data.score : 0;
    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score));
    return (
      <div className="mb-2">
        <div className="font-semibold">{title}:</div>
        <div className="flex gap-2 items-center">
          <span className={
            score >= 81
              ? "text-green-600 font-bold"
              : score >= 61
              ? "text-yellow-700 font-bold"
              : "text-red-600 font-bold"
          }>
            {score} / 100 ("{data.label ?? ""}")
          </span>
        </div>
        {data.explanation && (
          <div className="text-sm text-muted-foreground mt-1">{data.explanation}</div>
        )}
      </div>
    );
  }

  // Helper: Safe list mapping
  function safeList(arr: undefined | null | any[], f: (x:any,i:number)=>React.ReactNode) {
    if (!Array.isArray(arr)) return null;
    return arr.map(f);
  }

  // Level selection handler
  const handleLevelSelect = (lvl: string) => {
    setLevel(lvl);
    setStory(stories[lvl]);
    setText("");
    setFeedback(null);
    resetTranscript();
  };

  // Hear story button
  const handleHearStory = () => {
    if (story) {
      const utterance = new window.SpeechSynthesisUtterance(story);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Hear word button
  const handleHearWord = (word: string) => {
    const utterance = new window.SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 dark:text-blue-300 drop-shadow">Story Speaking Practice</h1>
        {/* Story Card */}
        <div className="relative mb-8">
          <div className="rounded-3xl shadow-xl bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 p-8 border-2 border-blue-200 flex flex-col items-center">
            <div className="absolute top-4 right-4">
              <img src="/public/placeholder.svg" alt="Mascot" className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold font-playfair text-primary mb-2 tracking-wide">Story Time</h2>
            <div className="text-lg font-semibold text-blue-700 mb-4">{level ? `Level: ${level.charAt(0).toUpperCase() + level.slice(1)}` : 'Choose Your Level'}</div>
            {!level ? (
              <div className="flex gap-4 mt-2">
                <Button onClick={() => handleLevelSelect('basic')} className="rounded-full px-6 py-2 text-lg font-bold bg-blue-200 hover:bg-blue-300">Basic</Button>
                <Button onClick={() => handleLevelSelect('medium')} className="rounded-full px-6 py-2 text-lg font-bold bg-pink-200 hover:bg-pink-300">Medium</Button>
                <Button onClick={() => handleLevelSelect('hard')} className="rounded-full px-6 py-2 text-lg font-bold bg-yellow-200 hover:bg-yellow-300">Hard</Button>
              </div>
            ) : (
              <>
                <div className="w-full mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-800">Read the story below:</span>
                    <Button onClick={handleHearStory} className="rounded-full bg-gradient-to-r from-blue-400 to-pink-400 text-white px-4 py-1 shadow hover:scale-105 transition-transform">Hear Story</Button>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-inner text-xl font-serif leading-relaxed tracking-wide story-text">
                    {story.split(' ').map((word, idx) => (
                      <span key={idx} className="inline-block transition-all duration-200 hover:bg-yellow-100 px-1 py-0.5 rounded cursor-pointer" style={{ marginRight: 6 }} onClick={() => handleHearWord(word)}>{word} </span>
                    ))}
                  </div>
                  <div className="mt-4 w-full h-2 bg-blue-100 rounded-full">
                    <div className="h-2 rounded-full bg-blue-400 transition-all" style={{ width: `${Math.min(100, Math.round(text.trim().split(/\s+/).length / story.trim().split(/\s+/).length * 100))}%` }}></div>
                  </div>
                  <div className="text-xs text-blue-700 mt-2">Progress: {Math.min(100, Math.round(text.trim().split(/\s+/).length / story.trim().split(/\s+/).length * 100))}%</div>
                </div>
                {/* Floating Mic Button */}
                <div className="fixed bottom-12 right-8 z-50">
                  <Button
                    onClick={recording ? handleStop : handleStart}
                    className={`rounded-full shadow-lg px-6 py-4 text-xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 text-white flex items-center gap-2 ${recording ? 'animate-pulse ring-4 ring-pink-300' : ''}`}
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
                    aria-label={recording ? 'Stop Recording' : 'Start Speaking'}
                  >
                    {recording ? <CircleStop className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                    {recording ? 'Stop' : 'Speak'}
                  </Button>
                </div>
                {/* Transcript Card */}
                <Card className="mt-8 rounded-2xl shadow-lg border-2 border-blue-100">
                  <CardHeader>
                    <span className="text-lg font-bold text-blue-700">Your Speech</span>
                  </CardHeader>
                  <CardContent>
                    <div className="font-mono text-base text-gray-800 whitespace-pre-line">{normalizeText(text)}</div>
                    <div className="text-xs text-gray-500 mt-2">Word count: {text.trim().split(/\s+/).length} / {story.trim().split(/\s+/).length}</div>
                  </CardContent>
                </Card>
                {/* Analyze & Speaking Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 w-full">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!text || loading}
                    className={`rounded-full px-8 py-3 text-lg font-bold bg-gradient-to-r from-blue-400 to-pink-400 text-white shadow-lg w-full sm:w-auto ${loading ? 'animate-pulse' : ''}`}
                    aria-label="Analyze"
                  >
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </Button>
                  <Button
                    onClick={recording ? handleStop : handleStart}
                    className={`rounded-full px-8 py-3 text-lg font-bold bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow-lg flex items-center gap-2 w-full sm:w-auto ${recording ? 'animate-pulse ring-4 ring-pink-300' : ''}`}
                    aria-label={recording ? 'Stop Recording' : 'Start Speaking'}
                  >
                    {recording ? <CircleStop className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {recording ? 'Stop' : 'Speak'}
                  </Button>
                </div>
                {/* Motivational Tips */}
                <div className="mt-8 p-4 rounded-xl bg-yellow-50 border border-yellow-200 shadow flex items-center gap-3">
                  <img src="/public/placeholder.svg" alt="Tip" className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-yellow-700">Motivational Tip</div>
                    <div className="text-sm text-yellow-800">Speak with confidence! Every story you read makes you a better communicator.</div>
                  </div>
                </div>
                {/* Feedback Sections - Structured and Accurate */}
                {feedback && (
                  <div className="space-y-6 mt-8">
                    {/* 1. Corrected Version */}
                    {feedback.corrected_version && (
                      <Card className="rounded-2xl border-0 bg-green-50 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-green-700 flex items-center gap-2"><ChartBar className="w-5 h-5" /> Corrected Version</span>
                        </CardHeader>
                        <CardContent>
                          <div className="font-mono text-base text-green-900">{feedback.corrected_version}</div>
                        </CardContent>
                      </Card>
                    )}
                    {/* 2. Highlight Mistakes */}
                    {feedback.mistakes && (
                      <Card className="rounded-2xl border-0 bg-amber-50 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-amber-700 flex items-center gap-2"><LineChart className="w-5 h-5" /> Highlight Mistakes</span>
                        </CardHeader>
                        <CardContent>
                          {['grammar', 'vocabulary', 'pronunciation', 'fluency'].map((cat) => {
                            const catMistakes = feedback.mistakes?.filter((m: any) => m.type === cat) || [];
                            return (
                              <div key={cat} className="mb-4">
                                <div className="font-bold text-amber-800 capitalize mb-2">{cat} Mistakes</div>
                                {catMistakes.length > 0 ? (
                                  <ul className="list-disc ml-4 space-y-2 text-sm">
                                    {catMistakes.map((m: any, idx: number) => (
                                      <li key={idx}>
                                        <b>Mistake:</b> <span className="text-red-600">{m.mistake}</span><br />
                                        <b>Correction:</b> <span className="text-green-700">{m.correction}</span><br />
                                        <b>Explanation:</b> <span>{m.explanation}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div className="text-sm text-gray-500 ml-4">No {cat} mistakes found.</div>
                                )}
                              </div>
                            );
                          })}
                          {/* Fallback for uncategorized mistakes */}
                          {feedback.mistakes?.filter((m: any) => !m.type).length > 0 ? (
                            <div className="mb-4">
                              <div className="font-bold text-amber-800 mb-2">Other Mistakes</div>
                              <ul className="list-disc ml-4 space-y-2 text-sm">
                                {feedback.mistakes.filter((m: any) => !m.type).map((m: any, idx: number) => (
                                  <li key={idx}>
                                    <b>Mistake:</b> <span className="text-red-600">{m.mistake}</span><br />
                                    <b>Correction:</b> <span className="text-green-700">{m.correction}</span><br />
                                    <b>Explanation:</b> <span>{m.explanation}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 ml-4">No uncategorized mistakes found.</div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                    {/* 3. Scores */}
                    {feedback.scores && (
                      <Card className="rounded-2xl border-0 bg-blue-50 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-blue-700 flex items-center gap-2"><ChartBar className="w-5 h-5" /> Scores</span>
                        </CardHeader>
                        <CardContent>
                          {['grammar', 'vocabulary', 'pronunciation', 'fluency'].map((cat) => (
                            feedback.scores[cat] && (
                              <div key={cat} className="mb-2">
                                <div className="font-semibold capitalize">{cat}:</div>
                                <span className={
                                  feedback.scores[cat].score >= 81
                                    ? "text-green-600 font-bold"
                                    : feedback.scores[cat].score >= 61
                                    ? "text-yellow-700 font-bold"
                                    : "text-red-600 font-bold"
                                }>
                                  {feedback.scores[cat].score} / 100 ("{feedback.scores[cat].label}")
                                </span>
                                <div className="text-sm text-muted-foreground mt-1">{feedback.scores[cat].explanation}</div>
                              </div>
                            )
                          ))}
                        </CardContent>
                      </Card>
                    )}
                    {/* 4. Pronunciation Analysis */}
                    {feedback.pronunciation_feedback && (
                      <Card className="rounded-2xl border-0 bg-purple-50 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-purple-700 flex items-center gap-2"><VolumeX className="w-5 h-5" /> Pronunciation Analysis</span>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2"><b>Difficult Words:</b> {feedback.pronunciation_feedback.difficult_words?.join(", ")}</div>
                          <div className="mb-2"><b>Tips:</b> {feedback.pronunciation_feedback.tips}</div>
                          <div className="mb-2"><b>Example Words:</b> {feedback.pronunciation_feedback.example_words?.join(", ")}</div>
                        </CardContent>
                      </Card>
                    )}
                    {/* 5. Fluency Feedback */}
                    {feedback.fluency_feedback && (
                      <Card className="rounded-2xl border-0 bg-pink-50 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-pink-700 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Fluency Feedback</span>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2"><b>Filler Words Count:</b> {feedback.fluency_feedback.filler_words_count}</div>
                          <div className="mb-2"><b>Unnatural Pauses:</b> {feedback.fluency_feedback.unnatural_pauses}</div>
                          <div className="mb-2"><b>Suggestions:</b> {feedback.fluency_feedback.suggestions}</div>
                        </CardContent>
                      </Card>
                    )}
                    {/* 6. Vocabulary Enhancement */}
                    {feedback.vocabulary_enhancement && (
                      <Card className="rounded-2xl border-0 bg-yellow-50 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-yellow-700 flex items-center gap-2"><ChartBar className="w-5 h-5" /> Vocabulary Enhancement</span>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2"><b>Basic Words:</b> {feedback.vocabulary_enhancement.basic_words?.join(", ")}</div>
                          <div className="mb-2"><b>Alternatives:</b></div>
                          <ul className="list-disc ml-4">
                            {feedback.vocabulary_enhancement.alternatives?.map((alt: any, idx: number) => (
                              <li key={idx}>
                                <b>{alt.word}:</b> {alt.alternatives?.join(", ")}<br />
                                <span className="text-sm">Samples: {alt.samples?.join(" | ")}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    {/* 7. Theme Relevance */}
                    {feedback.theme_relevance && (
                      <Card className="rounded-2xl border-0 bg-blue-100 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-blue-800 flex items-center gap-2"><ChartBar className="w-5 h-5" /> Theme Relevance</span>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2"><b>Score:</b> {feedback.theme_relevance.score} / 100</div>
                          <div className="mb-2"><b>Explanation:</b> {feedback.theme_relevance.explanation}</div>
                          <div className="mb-2"><b>Covered Points:</b> {feedback.theme_relevance.covered_points?.join(", ")}</div>
                          <div className="mb-2"><b>Missing Points:</b> {feedback.theme_relevance.missing_points?.join(", ")}</div>
                        </CardContent>
                      </Card>
                    )}
                    {/* 8. Content Accuracy & Depth */}
                    {feedback.content_accuracy && (
                      <Card className="rounded-2xl border-0 bg-green-100 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-green-800 flex items-center gap-2"><ChartBar className="w-5 h-5" /> Content Accuracy & Depth</span>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2"><b>Score:</b> {feedback.content_accuracy.score} / 100</div>
                          <div className="mb-2"><b>Strengths:</b> {feedback.content_accuracy.strengths}</div>
                          <div className="mb-2"><b>Improvements:</b> {feedback.content_accuracy.improvements}</div>
                          <div className="mb-2"><b>Model Example:</b> {feedback.content_accuracy.model_example}</div>
                          <div className="mb-2"><b>Practice Advice:</b> {feedback.content_accuracy.practice_advice}</div>
                        </CardContent>
                      </Card>
                    )}
                    {/* 9. Communication Tips */}
                    {feedback.communication_tips && (
                      <Card className="rounded-2xl border-0 bg-pink-100 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-pink-800 flex items-center gap-2"><Settings className="w-5 h-5" /> Communication Tips</span>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc ml-4">
                            {feedback.communication_tips.map((tip: string, idx: number) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                    {/* 10. Final Summary */}
                    {feedback.overall_summary && (
                      <Card className="rounded-2xl border-0 bg-blue-200 shadow w-full">
                        <CardHeader>
                          <span className="font-bold text-blue-900 flex items-center gap-2"><ChartBar className="w-5 h-5" /> Final Summary</span>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2"><b>Score:</b> {feedback.overall_summary.score} / 100</div>
                          <div className="mb-2"><b>Level:</b> {feedback.overall_summary.level}</div>
                          <div className="mb-2"><b>Recommendation:</b> {feedback.overall_summary.recommendation}</div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}