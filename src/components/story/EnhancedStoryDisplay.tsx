import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Play, RefreshCcw, Volume2, CheckCircle, XCircle, RotateCcw } from "lucide-react";
// import { useEnhancedSpeech } from "@/hooks/use-enhanced-speech";
import { useEnhancedSpeech } from '@/hooks/use-enchanced-speech';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EnhancedStoryDisplayProps {
  story: string;
  onProgressUpdate: (progress: number) => void;
}

interface WordProgress {
  word: string;
  status: 'pending' | 'correct' | 'skipped';
  attempts: number;
}

export const EnhancedStoryDisplay: React.FC<EnhancedStoryDisplayProps> = ({ 
  story, 
  onProgressUpdate 
}) => {
  const [words, setWords] = useState<WordProgress[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mode, setMode] = useState<'practice' | 'listen'>('practice');
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const { 
    isListening, 
    transcript, 
    confidence,
    handleStartRecording, 
    handleStopRecording, 
    resetTranscript,
    speakText,
    stopSpeaking,
    isSpeaking,
    isSupported 
  } = useEnhancedSpeech();

  // Initialize words when story changes
  useEffect(() => {
    if (story) {
      const storyWords = story
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => ({
          word: word.toLowerCase().replace(/[^\w']/g, ''),
          status: 'pending' as const,
          attempts: 0
        }));
      
      setWords(storyWords);
      setCurrentWordIndex(0);
      setSessionStarted(false);
      onProgressUpdate(0);
      resetTranscript();
    }
  }, [story, onProgressUpdate, resetTranscript]);

  // Process speech recognition results
  useEffect(() => {
    if (!transcript || !sessionStarted || currentWordIndex >= words.length) return;

    const spokenWords = transcript.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const currentWord = words[currentWordIndex];
    
    // Check if current word was spoken
    const wordSpoken = spokenWords.some(spokenWord => {
      const similarity = calculateSimilarity(spokenWord, currentWord.word);
      return similarity > 0.7; // 70% similarity threshold
    });

    if (wordSpoken && confidence > 0.3) {
      const newWords = [...words];
      newWords[currentWordIndex] = {
        ...currentWord,
        status: 'correct',
        attempts: currentWord.attempts + 1
      };
      setWords(newWords);
      
      // Move to next word
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        toast.success(`✓ "${currentWord.word}" - Good job!`);
      } else {
        // Completed all words
        toast.success("🎉 Story completed! Amazing work!");
        setSessionStarted(false);
        handleStopRecording();
      }
      
      // Update progress
      const progress = ((currentWordIndex + 1) / words.length) * 100;
      onProgressUpdate(progress);
      
      // Clear transcript after successful match
      setTimeout(() => resetTranscript(), 500);
    }
  }, [transcript, confidence, currentWordIndex, words, sessionStarted, onProgressUpdate, resetTranscript, handleStopRecording]);

  // Calculate word similarity
  const calculateSimilarity = (word1: string, word2: string): number => {
    const longer = word1.length > word2.length ? word1 : word2;
    const shorter = word1.length > word2.length ? word2 : word1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const handleStartPractice = () => {
    if (!isSupported) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }
    
    setSessionStarted(true);
    setMode('practice');
    resetTranscript();
    handleStartRecording();
    toast.info("🎯 Start reading the highlighted word!");
  };

  const handleStopPractice = () => {
    setSessionStarted(false);
    handleStopRecording();
  };

  const handleSkipWord = () => {
    if (currentWordIndex < words.length - 1) {
      const newWords = [...words];
      newWords[currentWordIndex] = {
        ...newWords[currentWordIndex],
        status: 'skipped'
      };
      setWords(newWords);
      setCurrentWordIndex(currentWordIndex + 1);
      
      const progress = ((currentWordIndex + 1) / words.length) * 100;
      onProgressUpdate(progress);
    }
  };

  const handleReset = () => {
    const resetWords = words.map(word => ({
      ...word,
      status: 'pending' as const,
      attempts: 0
    }));
    setWords(resetWords);
    setCurrentWordIndex(0);
    setSessionStarted(false);
    onProgressUpdate(0);
    resetTranscript();
    handleStopRecording();
  };

  const handleSpeakStory = () => {
    setMode('listen');
    stopSpeaking();
    speakText(story);
  };

  const correctWords = words.filter(w => w.status === 'correct').length;
  const totalWords = words.length;
  const accuracy = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;

  if (!story || words.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-muted-foreground">
          No story available yet. Click "New Story" to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{correctWords}</div>
          <div className="text-sm text-muted-foreground">Words Read</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{Math.round(accuracy)}%</div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{currentWordIndex + 1}</div>
          <div className="text-sm text-muted-foreground">Current Position</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{totalWords}</div>
          <div className="text-sm text-muted-foreground">Total Words</div>
        </Card>
      </div>

      {/* Story Display */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        {/* Reading Progress Indicator */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-1">
            <div className={cn(
              "w-3 h-3 rounded-full transition-colors",
              currentWordIndex > 0 ? "bg-green-500" : "bg-gray-300"
            )} />
            <span className="text-sm text-muted-foreground">Words Read: {correctWords}</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="flex items-center gap-1">
            <div className={cn(
              "w-3 h-3 rounded-full transition-colors",
              sessionStarted ? "bg-blue-500 animate-pulse" : "bg-gray-300"
            )} />
            <span className="text-sm text-muted-foreground">
              {sessionStarted ? "Recording..." : "Ready"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium">
              Position: {currentWordIndex + 1} / {totalWords}
            </span>
          </div>
        </div>

        {/* Story Text with Enhanced Indicators */}
        <div className="text-lg leading-relaxed font-serif space-y-2 relative">
          {/* Reading Cursor */}
          {sessionStarted && (
            <div 
              className="absolute left-0 w-1 h-8 bg-primary/60 rounded-full transition-all duration-500 z-10"
              style={{ 
                top: `${Math.floor(currentWordIndex / 10) * 2.5}rem`,
                transform: 'translateY(-50%)'
              }}
            />
          )}
          
          {words.map((wordObj, index) => {
            const isCurrentWord = index === currentWordIndex;
            const isNextWord = index === currentWordIndex + 1;
            const isPreviousWord = index === currentWordIndex - 1;
            
            return (
              <span key={index} className="inline-block">
                <span
                  className={cn(
                    "px-2 py-1 mx-1 rounded-md cursor-pointer transition-all duration-300 relative",
                    // Current word - bright highlight
                    isCurrentWord && sessionStarted && "bg-yellow-200 dark:bg-yellow-800 border-2 border-yellow-400 shadow-lg scale-110 animate-pulse",
                    // Next word - subtle preview
                    isNextWord && sessionStarted && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700",
                    // Previous word - subtle indicator
                    isPreviousWord && "bg-gray-50 dark:bg-gray-800/50",
                    // Status-based colors
                    wordObj.status === 'correct' && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold",
                    wordObj.status === 'skipped' && "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
                    wordObj.status === 'pending' && !isCurrentWord && !isNextWord && !isPreviousWord && "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => speakText(wordObj.word)}
                  title={`Click to hear "${wordObj.word}"`}
                >
                  {story.split(/\s+/)[index]}
                  {wordObj.status === 'correct' && (
                    <CheckCircle className="inline h-3 w-3 ml-1 text-green-600" />
                  )}
                  {wordObj.status === 'skipped' && (
                    <XCircle className="inline h-3 w-3 ml-1 text-orange-600" />
                  )}
                  {/* Current word indicator arrow */}
                  {isCurrentWord && sessionStarted && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-yellow-500" />
                    </div>
                  )}
                </span>
                {' '}
              </span>
            );
          })}
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Status Display */}
          <div className="text-center">
            {sessionStarted && isListening ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold">
                  Say: "{words[currentWordIndex]?.word}" 
                  {confidence > 0 && (
                    <Badge variant="outline" className="ml-2">
                      {Math.round(confidence * 100)}% confidence
                    </Badge>
                  )}
                </span>
              </div>
            ) : sessionStarted ? (
              <div className="text-lg">Ready to continue...</div>
            ) : (
              <div className="text-lg text-muted-foreground">Click "Start Practice" to begin</div>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <Card className="p-4 bg-gray-50 dark:bg-gray-800">
              <div className="text-sm text-muted-foreground mb-1">You said:</div>
              <div className="font-mono text-lg">{transcript}</div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {!sessionStarted ? (
              <Button 
                onClick={handleStartPractice} 
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                disabled={!isSupported}
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Practice
              </Button>
            ) : (
              <Button 
                onClick={handleStopPractice} 
                size="lg"
                variant="destructive"
              >
                <MicOff className="mr-2 h-5 w-5" />
                Stop Practice
              </Button>
            )}
            
            <Button 
              onClick={() => speakText(words[currentWordIndex]?.word || '')}
              variant="outline"
              size="lg"
              disabled={!words[currentWordIndex]}
            >
              <Play className="mr-2 h-5 w-5" />
              Hear Word
            </Button>
            
            <Button 
              onClick={handleSpeakStory}
              variant="outline"
              size="lg"
              disabled={isSpeaking}
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Listen to Story
            </Button>
            
            {sessionStarted && (
              <Button 
                onClick={handleSkipWord}
                variant="ghost"
                size="lg"
                disabled={currentWordIndex >= words.length - 1}
              >
                Skip Word
              </Button>
            )}
            
            <Button 
              onClick={handleReset}
              variant="ghost"
              size="lg"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round((currentWordIndex / words.length) * 100)}%</span>
            </div>
            <Progress value={(currentWordIndex / words.length) * 100} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Practice Tips:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Click any word to hear its pronunciation</li>
          <li>• The system uses advanced recognition for better accuracy</li>
          <li>• Skip difficult words and come back to them later</li>
          <li>• Practice in a quiet environment for best results</li>
        </ul>
      </Card>
    </div>
  );
};