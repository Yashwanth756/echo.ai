import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Book, Mic, MicOff, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis
} from "recharts";
import PartsOfSpeechAnalysis from "@/components/grammar/PartsOfSpeechAnalysis";
import GrammarFeedback from "@/components/grammar/GrammarFeedback";
import DailyGrammarChallenge from "@/components/grammar/DailyGrammarChallenge";
import { analyzeGrammar, grammarData, dailyChallenges, GrammarAnalysisResult } from "@/services/grammarService";
import { AppLayout } from "@/components/layout/AppLayout";
const Grammar = () => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<GrammarAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)]);
  const { toast } = useToast();
  const { transcript, startListening, stopListening, isListening, resetTranscript, supported } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    console.log("Grammar component mounted");
    return () => {
    stopListening();
    console.log("Grammar component unmounted");
    }
  },[])
  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await analyzeGrammar(text);
      setAnalysis(result);

      toast({
        title: "Analysis complete",
        description: `Your grammar score: ${result.score}/100`,
      });
    } catch (error) {
      console.error("Error analyzing grammar:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      console.log("Stopped listening");
    } else {
      resetTranscript();
      console.log("Starting listening");
      startListening();
      toast({
        title: "Listening...",
        description: "Speak now. Your speech will be converted to text."
      });
    }
              {/* Comparison Mode: User vs Model Answer */}
              <Card className="mt-8 rounded-xl border-2 border-purple-200 shadow-md">
                <CardHeader>
                  <span className="font-bold text-purple-700 text-xl">Comparison Mode</span>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold text-gray-700 mb-2">Your Sentence:</div>
                      <div className="p-3 rounded bg-gray-100 text-gray-900 font-mono">{text}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-700 mb-2">Model Answer:</div>
                      <div className="p-3 rounded bg-blue-100 text-blue-900 font-mono">{analysis.correctedText}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
  };
              {/* Error Highlights */}
              {analysis && Array.isArray(analysis.errors) && analysis.errors.length > 0 && (
                <div className="mt-8">
                  <div className="font-bold text-red-700 text-xl mb-4">Error Highlights</div>
                  <ul className="space-y-4">
                    {analysis.errors.map((err, idx) => (
                      <li key={idx} className={`p-4 rounded-lg border-2 shadow ${err.type === 'tense' ? 'border-yellow-400 bg-yellow-50' : err.type === 'agreement' ? 'border-pink-400 bg-pink-50' : err.type === 'punctuation' ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                        <div className="font-semibold text-lg mb-2">Original: <span className="text-red-700">{err.original}</span></div>
                        <div className="text-sm mb-2"><b>Type:</b> <span className={`font-bold ${err.type === 'tense' ? 'text-yellow-700' : err.type === 'agreement' ? 'text-pink-700' : err.type === 'punctuation' ? 'text-blue-700' : 'text-gray-700'}`}>{err.type}</span></div>
                        <div className="text-sm mb-2"><b>Corrected:</b> <span className="text-green-700">{err.corrected}</span></div>
                        <div className="text-sm mb-2"><b>Explanation:</b> {err.explanation}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
  const handleNewChallenge = () => {
    const newChallenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
    setDailyChallenge(newChallenge);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 dark:text-blue-300 drop-shadow">Grammar Clinic</h1>
        <div className="max-w-4xl w-full">
            {/* Standardized English Tenses Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-green-700 mb-6">Essential English Tenses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Simple Present",
                    structure: "Subject + base verb (s/es for he/she/it)",
                    example: "She walks to school.",
                    explanation: "Used for habits, general truths, and routines."
                  },
                  {
                    name: "Present Continuous",
                    structure: "Subject + am/is/are + verb-ing",
                    example: "They are playing football.",
                    explanation: "Used for actions happening now or around now."
                  },
                  {
                    name: "Present Perfect",
                    structure: "Subject + have/has + past participle",
                    example: "I have finished my homework.",
                    explanation: "Used for actions that happened at an unspecified time or have relevance now."
                  },
                  {
                    name: "Present Perfect Continuous",
                    structure: "Subject + have/has been + verb-ing",
                    example: "She has been reading for two hours.",
                    explanation: "Used for actions that started in the past and continue to the present."
                  },
                  {
                    name: "Simple Past",
                    structure: "Subject + past verb",
                    example: "He visited Paris last year.",
                    explanation: "Used for actions completed in the past."
                  },
                  {
                    name: "Past Continuous",
                    structure: "Subject + was/were + verb-ing",
                    example: "We were watching TV.",
                    explanation: "Used for actions in progress at a specific time in the past."
                  },
                  {
                    name: "Past Perfect",
                    structure: "Subject + had + past participle",
                    example: "They had left before I arrived.",
                    explanation: "Used for actions completed before another action in the past."
                  },
                  {
                    name: "Past Perfect Continuous",
                    structure: "Subject + had been + verb-ing",
                    example: "He had been working all day.",
                    explanation: "Used for actions that were ongoing up to a point in the past."
                  },
                  {
                    name: "Simple Future",
                    structure: "Subject + will + base verb",
                    example: "I will call you tomorrow.",
                    explanation: "Used for actions that will happen in the future."
                  },
                  {
                    name: "Future Continuous",
                    structure: "Subject + will be + verb-ing",
                    example: "She will be traveling next week.",
                    explanation: "Used for actions that will be in progress at a specific time in the future."
                  },
                  {
                    name: "Future Perfect",
                    structure: "Subject + will have + past participle",
                    example: "We will have finished by noon.",
                    explanation: "Used for actions that will be completed before a specific time in the future."
                  },
                  {
                    name: "Future Perfect Continuous",
                    structure: "Subject + will have been + verb-ing",
                    example: "By next month, I will have been working here for a year.",
                    explanation: "Used for actions that will be ongoing up to a point in the future."
                  }
                ].map((tense, idx) => (
                  <Card key={idx} className="border-2 border-green-300 shadow">
                    <CardHeader>
                      <CardTitle className="text-green-700">{tense.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-gray-700"><b>Structure:</b> {tense.structure}</div>
                      <div className="mb-2 text-gray-700"><b>Example:</b> <span className="italic">{tense.example}</span></div>
                      <div className="text-sm text-gray-500"><b>Explanation:</b> {tense.explanation}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="mr-2 text-primary" />
                  Grammar Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Textarea 
                    placeholder="Type or paste your text here..."
                    className="min-h-[150px]"
                    value={text}
                    onChange={handleTextChange}
                  />
                  <div className="flex flex-wrap  gap-2 mt-4">
                    <Button onClick={handleAnalyze} disabled={isAnalyzing} className="max-sm:w-full">
                      {isAnalyzing ? "Analyzing..." : "Analyze Grammar"}
                    </Button>
                    {supported && (
                      <Button
                        variant="outline"
                        onClick={handleMicClick}
                      
                        className={isListening ? "bg-red-100 hover:bg-red-200 max-sm:w-full" : "max-sm:w-full"}
                      >
                        {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                        {isListening ? "Stop" : "Speak"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 text-primary" />
                  Skills Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={70} data={grammarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name="Score" 
                        dataKey="score" 
                        stroke="#9b87f5" 
                        fill="#9b87f5" 
                        fillOpacity={0.5} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {analysis && (
            <>
              <GrammarFeedback 
                text={text} 
                score={analysis.score} 
                errors={analysis.errors} 
                suggestion={analysis.suggestion}
                correctedText={analysis.correctedText}
              />

              {/* Tenses Analysis Section */}
              <Card className="mt-8 rounded-2xl shadow-lg border-2 border-blue-100">
                <CardHeader>
                  <span className="font-bold text-blue-700 text-xl">Tenses Analysis</span>
                </CardHeader>
                <CardContent>
                  {Array.isArray(analysis.sentenceStructures) && analysis.sentenceStructures.length > 0 ? (
                    <div className="mb-6">
                      <div className="font-semibold text-blue-800 mb-2">Detected Tense & Structure for Each Sentence:</div>
                      <ul className="space-y-3">
                        {analysis.sentenceStructures.map((s, i) => (
                          <li key={i} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <div className="text-base font-mono text-gray-900"><b>Sentence:</b> {s.sentence}</div>
                            <div className="text-sm text-blue-700"><b>Tense Structure:</b> {s.tenseStructure}</div>
                            {/* Highlight tense mistakes for this sentence if any */}
                            {Array.isArray(analysis.tenseMistakes) && analysis.tenseMistakes.length > 0 && (
                              analysis.tenseMistakes.filter(tm => tm.sentence === s.sentence).map((tm, idx) => (
                                <div key={idx} className="mt-2 p-2 rounded bg-red-50 border border-red-200">
                                  <div className="text-red-700 font-semibold">Tense Error:</div>
                                  <div className="text-sm"><b>Mistake:</b> {tm.mistake}</div>
                                  <div className="text-sm"><b>Correction:</b> {tm.correction}</div>
                                  <div className="text-sm"><b>Explanation:</b> {tm.explanation}</div>
                                  <div className="text-sm"><b>Expected Tense:</b> {tm.expectedTense}</div>
                                  <div className="text-sm"><b>Detected Tense:</b> {tm.detectedTense}</div>
                                </div>
                              ))
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-gray-500">No tense analysis available.</div>
                  )}

                  {/* Tense Summary */}
                  {Array.isArray(analysis.tenseSummary) && analysis.tenseSummary.length > 0 && (
                    <div className="mt-6">
                      <div className="font-semibold text-blue-800 mb-2">Tense Summary:</div>
                      <ul className="space-y-2">
                        {analysis.tenseSummary.map((ts, i) => (
                          <li key={i} className="p-2 rounded bg-blue-100 border border-blue-200">
                            <b>{ts.tense}:</b> <span className="font-bold text-blue-700">{ts.count}</span> sentence(s)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <PartsOfSpeechAnalysis 
                posData={analysis.posData} 
                posChartData={analysis.posChartData} 
              />
            </>
          )}

          <DailyGrammarChallenge 
            challenge={dailyChallenge} 
            onNewChallenge={handleNewChallenge} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Grammar;