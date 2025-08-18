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

// Sample topics for the speaking practice select dropdown
const sampleTopics = [
  "Daily Life",
  "Travel",
  "Work and Career",
  "Food & Cooking",
  "Education",
  "Relationships",
  "Technology",
];

export default function Speaking() {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [randomTopic, setRandomTopic] = useState<any | null>(null);
  const [topicLoading, setTopicLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
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
  const [apiKey, setApiKey] = useState<string | null>(null);
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

  // Display error messages from speech recognition
  // useEffect(() => {
  //   if (lastError) {
  //     toast.error(`Speech recognition error: ${lastError}`, {
  //       duration: 3000,
  //     });
  //      // If an error occurs (e.g., mic permission denied), stop the recording state
  //      setRecording(false);
  //   }
  // }, [lastError]);

  // Load the API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (!savedApiKey || savedApiKey.trim() === '') {
      toast.warning(
        "No API key found. Please set your Gemini API key in Settings",
        {
          action: {
            label: "Go to Settings",
            onClick: () => navigate('/settings')
          },
          duration: 10000,
        }
      );
    } else {
      setApiKey(savedApiKey);
    }
  }, [navigate]);

  // Start recording (live transcript only)
  const handleStart = () => {
    // Don't reset transcript here - allow continuation
    if (isListening) {
      stopListening();
      setRecording(false);
    } else {
    
      resetTranscript();
      setRecording(true);
      startListening();
      // toast({
      //   title: "Listening...",
      //   description: "Speak now. Your speech will be converted to text."
      // });
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
  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error("No transcript available. Please record some speech first.");
      return;
    }
    
    // Check if we have an API key
    // if (!apiKey) {
    //   toast.error("No Gemini API key found. Please add one in settings.", {
    //     action: {
    //       label: "Settings",
    //       onClick: () => navigate('/settings')
    //     }
    //   });
    //   return;
    // }
    
    setLoading(true);
    try {
      const speechText = text;
      
      // Enhanced Gemini Prompt with explicit instructions for Theme Relevance and Content Accuracy & Depth:
      const prompt = [
        {
          parts: [{
            text: `
You are an expert English language coach with years of experience in teaching and providing detailed feedback. I am building a website to help users improve their English speaking skills using AI.

I will provide you with a transcript of what the user has spoken. Based on that transcript, give a detailed, structured, and VERY ACCURATE feedback report with these sections:

1. **Corrected Version**: Rewrite the user's speech with proper grammar, vocabulary, and sentence structure. Be meticulous about accuracy.

2. **Highlight Mistakes**: List each mistake, the correction, and explain the grammar/vocabulary rule behind it in simple but precise terms. Each mistake must include a 'type' field: grammar, vocabulary, pronunciation, or fluency.

3. **Grammar, Vocabulary, Pronunciation, and Fluency Scores**:
  - Provide scores out of 100 for each category.
  - Categorize the score: 0-60 = Needs Improvement, 61-80 = Average, 81-100 = Good.
  - Explain why the score was given and what to improve with specific examples.

4. **Pronunciation Analysis**:
  - Identify any difficult or mispronounced words with high precision.
  - Give detailed phonetic tips and mouth movement advice.
  - Provide 2-3 similar words to practice with the same phonetic pattern.

5. **Fluency Feedback**:
  - Count exact number of filler words used ("um", "like", "uh").
  - Identify specific unnatural pauses or abrupt stops.
  - Suggest concrete techniques for smoother speech flow.

6. **Vocabulary Enhancement**:
  - Identify basic or overused words in the transcript.
  - Suggest 2-3 better alternatives with sample sentences showing proper usage.

7. **Theme Relevance**:
  - Score out of 100 for how well the user's speech matches the topic/theme.
  - Explanation of the score.
  - List of key points covered (array).
  - List of missing key points (array).

8. **Content Accuracy & Depth**:
  - Score out of 100 for accuracy and depth of content.
  - Strengths (string).
  - Improvements (string).
  - Model Example (string): a model answer for the topic.
  - Practice Advice (string): advice for improving content depth and accuracy.

9. **Communication Tips**:
  - Give 3 personalized tips to help the user improve based on their specific speech pattern.
  - Make these tips actionable and specific to their current level.

10. **Final Summary**:
  - Provide an overall score and label (Beginner, Intermediate, Advanced).
  - Give clear next steps and suggest if the user should retry or move to the next level.

Please make the feedback positive, constructive, educational, and HIGHLY ACCURATE. Format everything clearly so it can be easily displayed in a dashboard.

Transcript:
"${speechText}"

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
      console.log("API key data:", data);
      setApiKey(data.apiKey);
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
        `https://generativelanguage.googleapis.com/v1beta/models/`+geminiModel+`:generateContent?key=${apiKey}`,
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

  return (<AppLayout>
  <div className="container mx-auto max-w-2xl py-8 sm:py-12 px-4 sm:px-6 w-full">
    <Card className="mb-6 shadow-xl animate-fade-in rounded-2xl">
      <CardHeader>
        <h2 className="text-xl font-bold font-playfair text-primary">Speaking Practice</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Topic Selection */}
        <div className="mb-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <label className="font-semibold block mb-2">Topic Selection</label>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="text"
              className="border rounded px-3 py-2 w-full sm:w-2/3"
              placeholder="Enter a custom topic..."
              value={customTopic}
              onChange={e => { setCustomTopic(e.target.value); setSelectedTopic(e.target.value); }}
            />
            <select
              className="border rounded px-2 py-2 w-full sm:w-auto"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              aria-label="Select difficulty"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <Button
              variant="outline"
              onClick={handleGenerateTopic}
              disabled={topicLoading}
              className={topicLoading ? "animate-pulse" : ""}
              aria-label="Generate Random Topic"
            >
              {topicLoading ? "Generating..." : "Random Topic"}
            </Button>
          </div>
          {randomTopic && !randomTopic.parsing_error && (
            <div className="mt-4 p-3 rounded bg-white border border-blue-100">
              <div className="font-bold text-blue-700 text-lg mb-1">{randomTopic.title}</div>
              <div className="mb-2 text-sm text-gray-700">{randomTopic.description}</div>
              <div className="mb-2">
                <b>Key Points:</b>
                <ul className="list-disc ml-6 text-sm">
                  {Array.isArray(randomTopic.key_points) ? randomTopic.key_points.map((kp:string,i:number)=>(<li key={i}>{kp}</li>)) : null}
                </ul>
              </div>
              <div className="mb-2">
                <b>Sample Response:</b>
                <div className="bg-blue-50 rounded p-2 text-xs font-mono">{randomTopic.sample_response}</div>
              </div>
              <Button
                variant="default"
                onClick={() => { setSelectedTopic(randomTopic.title); setCustomTopic(""); }}
                className="mt-2"
              >Use This Topic</Button>
            </div>
          )}
          {randomTopic && randomTopic.parsing_error && (
            <div className="mt-2 text-red-600 text-xs">Could not parse topic: <pre>{randomTopic.raw}</pre></div>
          )}
        </div>

        {/* Browser Support Warning */}
        {!supported && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-700">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">
              Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for best experience.
            </span>
          </div>
        )}

        {/* Recorder */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={handleStart}
            disabled={recording || !supported || (!selectedTopic && !customTopic)}
            variant="default"
            className="flex gap-2 w-full sm:w-auto"
            aria-label="Start Speaking"
          >
            <Mic className="w-5 h-5" />
            {recording ? "Recording..." : (supported ? "Continue Speaking" : "Not Supported")}
          </Button>
          <Button
            onClick={handleStart}
            disabled={!recording}
            variant="secondary"
            className="flex gap-2 w-full sm:w-auto"
            aria-label="Stop Recording"
          >
            <CircleStop className="w-5 h-5" />
            Stop
          </Button>
          <Button
            onClick={handleClearTranscript}
            disabled={!text || recording}
            variant="outline"
            className="flex gap-2 w-full sm:w-auto"
            aria-label="Clear Transcript"
          >
            <VolumeX className="w-5 h-5" />
            Clear
          </Button>
          <Button
            onClick={handleAnalyze}
            disabled={!text || loading  || (!selectedTopic && !customTopic)}
            variant="outline"
            className={`flex gap-2 w-full sm:w-auto ${loading ? "animate-pulse" : ""}`}
            aria-label="Analyze"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="ml-auto"
            title="Settings"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {/* Recording Status */}
        {recording && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span>Recording... Speak clearly. Speech will continue even during pauses. (Auto-stops after 2min silence)</span>
          </div>
        )}

        {/* Transcript */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Speech Transcript (Continuous)</label>
            {isListening && (
              <span className="text-xs text-primary animate-pulse">Listening...</span>
            )}
          </div>
          <Textarea
            className="text-base min-h-[120px] w-full resize-y"
            value={text}
            readOnly
            placeholder="Transcript will build continuously as you speak, including during pauses..."
          />
          {text && (
            <div className="text-xs text-gray-500 mt-1">
              Word count: {text.trim().split(/\s+/).length} words
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Loading */}
    {loading && (
      <div className="mt-4 flex justify-center">
        <div className="animate-pulse text-primary flex items-center gap-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-ping"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
          <span className="ml-2">Analyzing your speech...</span>
        </div>
      </div>
    )}

    {/* Feedback */}
    {feedback && (
      <div className="space-y-6">
        {feedback.parsing_error && (
          <Card className="rounded-xl border border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">Analysis Error</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700 mb-2">
                There was an error processing the AI response. Please try again with a different speech sample.
              </p>
              <div className="text-xs text-red-500 overflow-auto max-h-[200px] p-2 bg-red-100 rounded">
                <pre className="overflow-x-auto whitespace-pre-wrap">{feedback.raw}</pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleAnalyze} className="text-red-600 border-red-200">
                Try Again
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Your Speech Section */}
        <Card className="rounded-xl border-0 bg-white shadow">
          <CardHeader>
            <span className="font-bold text-blue-700">Your Speech</span>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-base text-gray-800 whitespace-pre-line">{text}</div>
          </CardContent>
        </Card>

        {/* Corrected Version with highlights */}
        {feedback.corrected_version && (
          <Card className="rounded-xl border-0 bg-green-50 shadow">
            <CardHeader>
              <span className="font-bold text-green-700">Corrected Version</span>
            </CardHeader>
            <CardContent>
              <div className="font-mono" dangerouslySetInnerHTML={{
                __html: highlightErrors(feedback.corrected_version, feedback.mistakes)
              }} />
            </CardContent>
          </Card>
        )}

        {/* Highlight Mistakes Section */}
        {/* Mistakes (Categorized) Section */}
        <Card className="rounded-xl bg-amber-50 border border-amber-200 shadow">
          <CardHeader>
            <span className="font-semibold text-amber-900">Highlight Mistakes (Categorized)</span>
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
        {/* Theme Relevance Section */}
        <Card className="rounded-xl bg-blue-50 border-0">
          <CardHeader>
            <span className="font-bold text-blue-700">Theme Relevance</span>
          </CardHeader>
          <CardContent>
            <div>
              <b>Score:</b> <span className="text-blue-700 font-bold">{feedback.theme_relevance?.score ?? '-'}</span>
            </div>
            <div>
              <b>Explanation:</b> <span>{feedback.theme_relevance?.explanation ?? 'No explanation provided.'}</span>
            </div>
            <div>
              <b>Covered Key Points:</b>
              <ul className="list-disc ml-6">
                {Array.isArray(feedback.theme_relevance?.covered_points) && feedback.theme_relevance.covered_points.length > 0 ? (
                  feedback.theme_relevance.covered_points.map((kp: string, i: number) => (
                    <li key={i}>{kp}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No key points covered.</li>
                )}
              </ul>
            </div>
            <div>
              <b>Missing Key Points:</b>
              <ul className="list-disc ml-6">
                {Array.isArray(feedback.theme_relevance?.missing_points) && feedback.theme_relevance.missing_points.length > 0 ? (
                  feedback.theme_relevance.missing_points.map((kp: string, i: number) => (
                    <li key={i}>{kp}</li>
                  ))
                ) : (
                  <li className="text-gray-500">No missing key points.</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Content Accuracy & Depth Section */}
        <Card className="rounded-xl bg-indigo-50 border-0">
          <CardHeader>
            <span className="font-bold text-indigo-700">Content Accuracy & Depth</span>
          </CardHeader>
          <CardContent>
            <div>
              <b>Score:</b> <span className="text-indigo-700 font-bold">{feedback.content_accuracy?.score ?? '-'}</span>
            </div>
            <div>
              <b>Strengths:</b> <span>{feedback.content_accuracy?.strengths ?? 'No strengths provided.'}</span>
            </div>
            <div>
              <b>Improvements:</b> <span>{feedback.content_accuracy?.improvements ?? 'No improvements provided.'}</span>
            </div>
            <div>
              <b>Model Example:</b> <span className="font-mono text-xs bg-indigo-100 rounded p-2 block">{feedback.content_accuracy?.model_example ?? 'No example provided.'}</span>
            </div>
            <div>
              <b>Practice Advice:</b> <span>{feedback.content_accuracy?.practice_advice ?? 'No advice provided.'}</span>
            </div>
          </CardContent>
        </Card>

        {(feedback.scores?.grammar || feedback.scores?.vocabulary || feedback.scores?.pronunciation || feedback.scores?.fluency) && (
          <Card className="shadow rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary font-playfair">Score Breakdown</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderScoreSection("Grammar", feedback.scores.grammar)}
                {renderScoreSection("Vocabulary", feedback.scores.vocabulary)}
                {renderScoreSection("Pronunciation", feedback.scores.pronunciation)}
                {renderScoreSection("Fluency", feedback.scores.fluency)}
              </div>
            </CardContent>
          </Card>
        )}

        {feedback.pronunciation_feedback && (
          <Card className="rounded-xl border-0 bg-blue-50">
            <CardHeader>
              <span className="font-bold text-blue-700">Pronunciation Analysis</span>
            </CardHeader>
            <CardContent>
              <div className="mb-1">
                <b>Difficult or mispronounced words: </b>
                <span>
                  {feedback.pronunciation_feedback.difficult_words?.map((w: string, i: number) => (
                    <span key={i} className="mr-2 inline-block">{w}</span>
                  )) || "None"}
                </span>
              </div>
              <div className="mb-1">
                <b>Phonetic tips & mouth advice:</b>{" "}
                <span>{feedback.pronunciation_feedback.tips || ''}</span>
              </div>
              <div>
                <b>Try practicing: </b>
                <span>
                  {feedback.pronunciation_feedback.example_words?.map((w: string, i: number) => (
                    <span key={i} className="mr-2 inline-block">{w}</span>
                  )) || null}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {feedback.fluency_feedback && (
          <Card className="rounded-xl bg-purple-50 border-0">
            <CardHeader>
              <span className="font-bold text-purple-700">Fluency Feedback</span>
            </CardHeader>
            <CardContent>
              <div>
                <b>Filler words used:</b> <span className="font-bold text-purple-700">{feedback.fluency_feedback.filler_words_count || 0}</span>
              </div>
              <div>
                <b>Unnatural pauses:</b> <span className="text-red-700">{feedback.fluency_feedback.unnatural_pauses || "None"}</span>
              </div>
              <div>
                <b>Suggestions for smoother speech:</b> <span className="text-green-700">{feedback.fluency_feedback.suggestions || ''}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {feedback.vocabulary_enhancement && (
          <Card className="rounded-xl bg-yellow-50 border-0">
            <CardHeader>
              <span className="font-bold text-yellow-700">Vocabulary Enhancement</span>
            </CardHeader>
            <CardContent>
              <div>
                <b>Basic/overused words:</b> {Array.isArray(feedback.vocabulary_enhancement.basic_words) ? (
                  feedback.vocabulary_enhancement.basic_words.map((w: string, i: number) => (
                    <span key={i} className="mr-2 text-yellow-800 font-semibold bg-yellow-100 px-2 py-0.5 rounded inline-block">{w}</span>
                  ))
                ) : null}
              </div>
              {Array.isArray(feedback.vocabulary_enhancement.alternatives) && feedback.vocabulary_enhancement.alternatives.length > 0 ? (
                <div className="mt-2">
                  <b>Better alternatives & samples:</b>
                  <ul className="list-disc ml-4">
                    {feedback.vocabulary_enhancement.alternatives.map((alt: any, i: number) => (
                      <li key={i}>
                        <b className="text-yellow-700">{alt.word}:</b> <span className="text-green-700">{Array.isArray(alt.alternatives) ? alt.alternatives.join(", ") : ''}</span>
                        {Array.isArray(alt.samples) && (
                          <>
                            <br /><span className="text-xs text-muted-foreground">{alt.samples.join(" – ")}</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {feedback.communication_tips && (
          <Card className="rounded-xl border-0" style={{ backgroundColor: '#ffe4ef' }}>
            <CardHeader>
              <span className="font-semibold text-pink-700">Communication Tips</span>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-6 text-gray-700">
                {feedback.communication_tips.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}

        {feedback.overall_summary && (
          <Card className="rounded-xl bg-green-50 border-0">
            <CardHeader>
              <span className="font-bold text-green-700">Final Summary</span>
            </CardHeader>
            <CardContent>
              <div>
                <b>Overall Score:</b> <span className="text-green-700 font-bold">
                  {feedback.overall_summary.score || ''} {feedback.overall_summary.level ? `(${feedback.overall_summary.level})` : ''}
                </span>
              </div>
              <div>
                <b>Recommendation:</b> {feedback.overall_summary.recommendation || ''}
              </div>
            </CardContent>
          </Card>
        )}

        {feedback.raw && !feedback.parsing_error && (
          <Card className="rounded-xl">
            <CardHeader>Gemini Response</CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap overflow-x-auto">{feedback.raw}</pre>
            </CardContent>
          </Card>
        )}
        {/* Practice Again Button */}
        <div className="flex justify-center mt-4">
          <Button
            variant="default"
            onClick={() => { setText(""); setFeedback(null); resetTranscript(); }}
            aria-label="Practice Again"
          >
            Practice Again
          </Button>
        </div>
      </div>
    )}

    {!apiKey && (
      <Card className="mt-4 border-yellow-300 bg-yellow-50">
        <CardContent className="p-4 text-center">
          <p className="text-yellow-800">
            Please add your Gemini API key in the Settings page to use the analysis feature.
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate('/settings')} 
            className="mt-2 border-yellow-500 text-yellow-700 hover:bg-yellow-100"
          >
            Go to Settings
          </Button>
        </CardContent>
      </Card>
    )}
  </div>
</AppLayout>
);
}