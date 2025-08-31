import React, { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sendMessageToGemini } from "@/lib/gemini-api";
import { toast } from "sonner";
import { Timer } from "lucide-react";

// Quiz Levels & Timer Durations
const LEVELS = [
  { label: "Beginner", value: "beginner", time: 120 },
  { label: "Intermediate", value: "intermediate", time: 180 },
  { label: "Advanced", value: "advanced", time: 300 },
];

type Level = "beginner" | "intermediate" | "advanced";

type QuizItem = {
  question: string;
  type: string;
};

type AnswerFeedback = {
  marks: number;
  maxMarks: number;
  mistakes: string[];
  grammaticalErrors: string[];
  improvementAreas: string[];
  focusSuggestions: string[];
  examples: string[];
  summary: string;
  feedback: string;
  correctedVersion?: string;
  corrected_version?: string;
};

const skillDescriptions: Record<string, string> = {
  voice: "Active/Passive Voice",
  parts_of_speech: "Parts of Speech",
  tense_identification: "Identify Tense",
  tense_change: "Tense Change",
  paragraph: "Paragraph Analysis",
  letter: "Letter Writing",
  essay: "Essay Writing",
  creative: "Creative Grammar",
};

const instructionPrompt = (level: Level) => `
Generate a creative English grammar quiz for advanced ESL learners at the "${level}" level. Include 4 diverse, grammar-focused questions — DO NOT include spelling.
Possible question types (mix and match, do not repeat): 
- Active/passive voice transformation
- Identify sentence tense
- Convert a sentence to a requested tense
- Identify or highlight parts of speech (e.g.: adverb, conjunction, pronoun)
- Paragraph-based comprehension (ask a grammar question about a given paragraph)
- Letter or essay writing (give a prompt for a short letter or essay; topic can relate to school or daily life)
- Any innovative grammar-based question (no spelling!)

Format as a JSON array with each item having a "question" and a "type" field (example types: 'voice', 'parts_of_speech', 'tense_identification', 'tense_change', 'paragraph', 'letter', 'essay', 'creative'). DO NOT include answers.
[
  { "question": "...", "type": "..." },
  ...
]
`;

const feedbackPrompt = (quiz: QuizItem[], userAnswers: string[]) => `
Evaluate this student's English grammar quiz. Provide detailed marks and feedback as a JSON array. For each question include:
- "marks" (number): score for that answer out of maximum
- "maxMarks" (number): maximum score for this question
- "mistakes": array of specific mistakes (if any, else empty)
- "grammaticalErrors": array of grammar issues found (if any)
- "improvementAreas": what to improve for this skill
- "focusSuggestions": practice/focus advice (short)
- "examples": up to 2 sample correct answers (for open-ended Qs)
- "summary": 1-sentence review for this answer
- "feedback": short, encouraging comment

Below are the quiz questions and student answers:
${quiz.map((q, i) => `[Q${i + 1}] Type: ${q.type} | Q: ${q.question} | Student: "${userAnswers[i] || ""}"`).join('\n')}

Respond only with the JSON array [
  {...feedback for Q1...},
  {...feedback for Q2...},
  ...
]
`;

export default function QuickQuiz() {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<AnswerFeedback[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [level, setLevel] = useState<Level | "">("");
  const [timer, setTimer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeUp, setTimeUp] = useState(false);

  // Start timer on quiz load
  useEffect(() => {
    if (quiz.length > 0 && level) {
      const selected = LEVELS.find(l => l.value === level);
      const duration = selected?.time ?? 120;
      setTimer(duration);
      setTimeLeft(duration);
      setTimeUp(false);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, [quiz, level]);

  // Prevent user from changing answers after time is up
  const isFormDisabled = submitted || timeUp || loading;

  const generateQuiz = async () => {
    if (!level) {
      toast.error("Please select a level first.");
      return;
    }
    setLoading(true);
    setFeedback([]);
    setAnswers([]);
    setQuiz([]);
    setSubmitted(false);
    setTimeUp(false);
    try {
      toast("Generating your Quick Quiz...");
      const raw = await sendMessageToGemini(instructionPrompt(level as Level), "quiz");
      // Extract JSON from response, ignoring markdown code fences if present
      const json = JSON.parse(raw.match(/\[.*\]/s)?.[0] ?? "[]");
      // Remove any 'spelling' type (legacy, for safety)
      const filtered = json.filter((q: QuizItem) => q.type !== "spelling");
      setQuiz(filtered.slice(0, 4));
      setAnswers(Array(filtered.length).fill(""));
    } catch (e) {
      toast.error("Could not generate quiz. Try again.");
      setQuiz([]);
    }
    setLoading(false);
  };

  const submitQuiz = async () => {
    if (isFormDisabled) return;
    setLoading(true);
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      toast("Evaluating your answers in detail...");
      const raw = await sendMessageToGemini(feedbackPrompt(quiz, answers), "quiz-feedback");
      let json = [];
      try {
        const match = raw.match(/\[.*\]/s);
        if (match) {
          json = JSON.parse(match[0]);
        } else {
          json = JSON.parse(raw);
        }
      } catch (e) {
        toast.error("Could not parse AI feedback. Showing fallback report.");
        json = quiz.map((q, i) => ({
          marks: 0,
          maxMarks: 1,
          mistakes: ["No feedback received from AI."],
          grammaticalErrors: [],
          improvementAreas: [],
          focusSuggestions: [],
          examples: [],
          summary: "No feedback received.",
          feedback: "Please try again later.",
        }));
      }
      setFeedback(json);
      setSubmitted(true);
    } catch {
      toast.error("Could not evaluate answers.");
      setFeedback(quiz.map((q, i) => ({
        marks: 0,
        maxMarks: 1,
        mistakes: ["No feedback received from AI."],
        grammaticalErrors: [],
        improvementAreas: [],
        focusSuggestions: [],
        examples: [],
        summary: "No feedback received.",
        feedback: "Please try again later.",
      })));
    }
    setLoading(false);
  };

  // Level selection screen
  if (!level) {
    return (
      <AppLayout>
        <div className="py-12 max-w-lg mx-auto text-center min-h-screen">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary mb-2">Quick Quiz: Grammar Challenge</CardTitle>
              <div className="text-muted-foreground">First, select your level to get questions tailored for you.</div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 mt-4">
                {LEVELS.map(lv => (
                  <Button
                    key={lv.value}
                    onClick={() => setLevel(lv.value as Level)}
                    className="w-full"
                  >
                    {lv.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="py-8 max-w-2xl mx-auto min-h-screen">
        <Card className="mb-8 border-2 border-blue-300 dark:border-blue-700 rounded-2xl shadow-xl bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent font-extrabold drop-shadow mb-2 dark:text-blue-200">
              Quick Quiz: {LEVELS.find(l => l.value === level)?.label}
            </CardTitle>
            <div className="text-base text-blue-700 dark:text-blue-300 font-semibold mb-2">
              Grammar challenge questions, tailored for your level.
            </div>
          </CardHeader>
          <CardContent>
            <Button disabled={loading} onClick={generateQuiz} className="mb-2 px-6 py-2 text-lg font-bold rounded-lg shadow bg-blue-500 hover:bg-blue-600 text-white">
              {loading ? "Loading Quiz..." : quiz.length > 0 ? "Try Another Quiz" : "Start Quiz"}
            </Button>
            <Button variant="ghost" className="ml-2 px-6 py-2 text-lg font-bold rounded-lg dark:text-blue-200" onClick={() => { setLevel(""); setQuiz([]); setAnswers([]); setFeedback([]); setSubmitted(false); }}>
              Change Level
            </Button>
          </CardContent>
        </Card>
        {/* Timer */}
        {(quiz.length > 0 && timer > 0) && (
          <div className="flex items-center justify-center mb-4 text-center">
            <Timer className="mr-2 text-blue-500 dark:text-blue-300" />
            <span className={`font-bold text-xl ${timeLeft <= 10 ? "text-red-500 dark:text-red-400" : "text-blue-700 dark:text-blue-300"}`}>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
            <span className="ml-2 text-blue-400 dark:text-blue-200 text-base">{timeUp ? "Time is up!" : "Time left"}</span>
          </div>
        )}
        {/* Quiz itself */}
        {quiz.length > 0 && (
          <form onSubmit={e => { e.preventDefault(); submitQuiz(); }}>
            {quiz.map((item, idx) => (
              <Card key={idx} className="mb-6 border border-blue-200 dark:border-blue-700 rounded-xl shadow bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    Q{idx + 1}. <span className="text-blue-500 dark:text-blue-200">{skillDescriptions[item.type] || item.type}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 font-medium text-gray-800 dark:text-gray-200">{item.question}</div>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 resize-y min-h-[48px] text-lg font-mono bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    disabled={isFormDisabled}
                    value={answers[idx]}
                    onChange={e => {
                      const copy = [...answers];
                      copy[idx] = e.target.value;
                      setAnswers(copy);
                    }}
                    required
                  />
                  {/* After submit: show feedback */}
                  {submitted && feedback[idx] && (
                    <div className="mt-4 text-base border-t pt-3 space-y-2 bg-blue-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <span className="font-bold text-2xl text-green-700 dark:text-green-400">{feedback[idx].marks}/{feedback[idx].maxMarks}</span>
                        <span className="ml-2 font-medium text-blue-700 dark:text-blue-300">Score</span>
                      </div>
                      <div className="font-semibold text-green-700 dark:text-green-400">Feedback: {feedback[idx].feedback}</div>
                      {Array.isArray(feedback[idx].mistakes) && feedback[idx].mistakes.length > 0 &&
                        <div className="text-red-600 dark:text-red-400"><b>Mistakes:</b> {feedback[idx].mistakes.join(", ")}</div>
                      }
                      {Array.isArray(feedback[idx].grammaticalErrors) && feedback[idx].grammaticalErrors.length > 0 &&
                        <div className="text-orange-600 dark:text-orange-400"><b>Grammatical Errors:</b> {feedback[idx].grammaticalErrors.join(", ")}</div>
                      }
                      {Array.isArray(feedback[idx].improvementAreas) && feedback[idx].improvementAreas.length > 0 &&
                        <div className="text-yellow-700 dark:text-yellow-400"><b>Areas to Improve:</b> {feedback[idx].improvementAreas.join(", ")}</div>
                      }
                      {Array.isArray(feedback[idx].focusSuggestions) && feedback[idx].focusSuggestions.length > 0 &&
                        <div className="text-blue-600 dark:text-blue-400"><b>Suggestions:</b> {feedback[idx].focusSuggestions.join(", ")}</div>
                      }
                      {Array.isArray(feedback[idx].examples) && feedback[idx].examples.length > 0 &&
                        <div className="text-slate-600 dark:text-slate-400"><b>Model Answers:</b> {feedback[idx].examples.join("; ")}</div>
                      }
                      <div className="italic text-base text-blue-400 dark:text-blue-200">Summary: {feedback[idx].summary}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {/* Buttons */}
            {!submitted && (
              <Button type="submit" className="w-full px-6 py-3 text-lg font-bold rounded-lg shadow bg-green-500 hover:bg-green-600 text-white" disabled={loading || timeUp}>
                {timeUp ? "Time's Up!" : "Submit Answers"}
              </Button>
            )}
            {submitted && (
              <>
                <div className="flex flex-col items-center mt-4 space-y-2">
                  <div className="font-bold text-2xl text-green-700 dark:text-green-400">Quiz Complete!</div>
                  <Button onClick={generateQuiz} className="px-6 py-2 text-lg font-bold rounded-lg shadow bg-blue-500 hover:bg-blue-600 text-white">Try Another Quiz</Button>
                </div>
                {/* Evaluation Report Section */}
                <Card className="mt-8 rounded-2xl shadow-lg border-2 border-green-100 dark:border-green-400 bg-green-50 dark:bg-gray-900">
                  <CardHeader>
                    <span className="font-bold text-green-700 dark:text-green-400 text-xl">Complete Evaluation Report</span>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="font-semibold text-green-800 dark:text-green-300 mb-2">Summary of Your Performance:</div>
                      {/* Overall Score Calculation */}
                      {(() => {
                        let total = 0;
                        let max = feedback.length;
                        feedback.forEach(fb => {
                          if (typeof fb.marks === 'number' && typeof fb.maxMarks === 'number') {
                            if (fb.marks === fb.maxMarks) total += 1;
                            else if (fb.marks > 0) total += 0.5;
                          }
                        });
                        return (
                          <div className="mb-4 text-lg font-bold text-green-700 dark:text-green-400">Overall Score: {total} / {max}</div>
                        );
                      })()}
                      <ul className="space-y-3">
                        {feedback.map((fb, i) => {
                          let score = 0;
                          if (typeof fb.marks === 'number' && typeof fb.maxMarks === 'number') {
                            if (fb.marks === fb.maxMarks) score = 1;
                            else if (fb.marks > 0) score = 0.5;
                          }
                          return (
                            <li key={i} className="p-3 rounded-lg bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-green-400">
                              <div className="text-base font-mono text-gray-900 dark:text-gray-200"><b>Q{i+1}:</b> {quiz[i]?.question}</div>
                              <div className="text-sm text-green-700 dark:text-green-400"><b>Score:</b> {score} / 1</div>
                              {(fb.correctedVersion || fb.corrected_version) && (
                                <div className="text-sm text-green-800 dark:text-green-300 mt-1"><b>Corrected Version:</b> {fb.correctedVersion || fb.corrected_version}</div>
                              )}
                              {Array.isArray(fb.mistakes) && fb.mistakes.length > 0 && (
                                <div className="text-red-700 dark:text-red-400 mt-1"><b>Mistakes:</b> {fb.mistakes.join(", ")}</div>
                              )}
                              {Array.isArray(fb.grammaticalErrors) && fb.grammaticalErrors.length > 0 && (
                                <div className="text-orange-700 dark:text-orange-400 mt-1"><b>Grammatical Errors:</b> {fb.grammaticalErrors.join(", ")}</div>
                              )}
                              {Array.isArray(fb.improvementAreas) && fb.improvementAreas.length > 0 && (
                                <div className="text-yellow-700 dark:text-yellow-400 mt-1"><b>Areas to Improve:</b> {fb.improvementAreas.join(", ")}</div>
                              )}
                              {Array.isArray(fb.focusSuggestions) && fb.focusSuggestions.length > 0 && (
                                <div className="text-blue-700 dark:text-blue-400 mt-1"><b>Suggestions:</b> {fb.focusSuggestions.join(", ")}</div>
                              )}
                              {Array.isArray(fb.examples) && fb.examples.length > 0 && (
                                <div className="text-slate-700 dark:text-slate-400 mt-1"><b>Model Answers:</b> {fb.examples.join("; ")}</div>
                              )}
                              <div className="italic text-sm text-blue-400 dark:text-blue-200 mt-1"><b>Summary:</b> {fb.summary}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    {/* Overall summary */}
                    <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-gray-800 border border-green-200 dark:border-green-400">
                      <div className="font-bold text-green-800 dark:text-green-300 mb-2">Overall Feedback:</div>
                      <ul className="list-disc ml-6">
                        {feedback.map((fb, i) => (
                          <li key={i} className="mb-2">
                            <span className="font-semibold">Q{i+1}:</span> {fb.feedback}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 text-green-700 dark:text-green-300 font-semibold">Keep practicing and review the suggestions above to improve your grammar skills!</div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </form>
        )}
      </div>
    </AppLayout>
  );
}
