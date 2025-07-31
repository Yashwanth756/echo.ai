import React, { useRef, useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { MessageSquare, User, Mic, MicOff, AlertOctagon, Volume, VolumeX, Send, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useIsMobile } from '@/hooks/use-mobile';

type ConversationEntry = {
  speaker: 'ai' | 'user';
  text: string;
};

interface ConversationDisplayProps {
  conversationHistory: ConversationEntry[];
  currentQuestion: string;
  isProcessing: boolean;
  isListening: boolean;
  transcript: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSpeakMessage?: (text: string) => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
  hasApiError?: boolean;
  onTextSubmit?: (text: string) => void;
  lastUserSentence?: string;
  correctedSentence?: string;
}

const ConversationDisplay = ({
  conversationHistory,
  currentQuestion,
  isProcessing,
  isListening,
  transcript,
  onStartRecording,
  onStopRecording,
  onSpeakMessage,
  isSpeaking,
  onStopSpeaking,
  hasApiError,
  onTextSubmit,
  lastUserSentence,
  correctedSentence
}: ConversationDisplayProps) => {
  const historyEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Auto-scroll to the bottom of the conversation
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);

  return (
    <Card>
      <CardHeader className={isMobile ? 'p-4 pb-2' : ''}>
        <CardTitle className={isMobile ? 'text-lg' : ''}>Chat with Iyraa</CardTitle>
        <CardDescription className={isMobile ? 'text-sm' : ''}>
          Practice your English in a natural conversation with Iyraa, your friendly AI tutor
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-4 pt-2' : ''}>
        {hasApiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertOctagon className="h-4 w-4" />
            <AlertDescription>
              There was an error connecting to the AI. Please try again or check your API key in Settings.
            </AlertDescription>
          </Alert>
        )}
        <div className={`${isMobile ? 'h-64' : 'h-96'} overflow-y-auto border rounded-lg p-2 md:p-4`}>
          {conversationHistory.map((entry, index) => (
            <div key={index} className={`flex mb-3 ${entry.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex ${isMobile ? 'max-w-[90%]' : 'max-w-[80%]'} ${entry.speaker === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex items-center justify-center ${isMobile ? 'h-6 w-6' : 'h-8 w-8'} rounded-full ${isMobile ? 'mr-1' : 'mr-2'} ${
                  entry.speaker === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}>
                  {entry.speaker === 'ai' ? <MessageSquare className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} /> : <User className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />}
                </div>
                <div className={`${isMobile ? 'p-2 pr-8' : 'p-3 pr-12'} rounded-lg relative ${
                  entry.speaker === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                }`}>
                  <span className={`block ${isMobile ? 'text-sm' : ''}`}>{entry.text}</span>
                  {entry.speaker === 'ai' && onSpeakMessage && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} absolute ${isMobile ? 'top-1 right-1' : 'top-2 right-2'} rounded-full bg-accent text-accent-foreground shadow-glow-accent hover:scale-105 transition-transform hover:bg-accent/90 active:scale-100 focus:ring-2 focus:ring-accent`}
                      onClick={() => entry.text && onSpeakMessage(entry.text)}
                      title="Listen to this message"
                    >
                      <Volume className={`${isMobile ? 'h-3 w-3' : 'h-5 w-5'}`} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex mb-3 justify-start">
              <div className={`flex ${isMobile ? 'max-w-[90%]' : 'max-w-[80%]'} flex-row`}>
                <div className={`flex items-center justify-center ${isMobile ? 'h-6 w-6 mr-1' : 'h-8 w-8 mr-2'} rounded-full bg-primary text-primary-foreground`}>
                  <MessageSquare className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </div>
                <div className={`${isMobile ? 'p-2' : 'p-3'} rounded-lg bg-muted`}>
                  <div className="flex items-center gap-2">
                    <div className={`animate-pulse ${isMobile ? 'text-sm' : ''}`}>Thinking</div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={historyEndRef} />
        </div>
      </CardContent>
      <CardFooter className={`border-t ${isMobile ? 'p-3' : 'p-4'} flex-col`}>
        <RecordingControls
          isListening={isListening}
          isProcessing={isProcessing}
          currentQuestion={currentQuestion}
          transcript={transcript}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          isSpeaking={isSpeaking}
          onStopSpeaking={onStopSpeaking}
          onTextSubmit={onTextSubmit}
          lastUserSentence={lastUserSentence}
          correctedSentence={correctedSentence}
          isMobile={isMobile}
        />
      </CardFooter>
    </Card>
  );
};

// Internal component for recording controls
const RecordingControls = ({
  isListening,
  isProcessing,
  currentQuestion,
  transcript,
  onStartRecording,
  onStopRecording,
  isSpeaking,
  onStopSpeaking,
  onTextSubmit,
  lastUserSentence,
  correctedSentence,
  isMobile
}: {
  isListening: boolean;
  isProcessing: boolean;
  currentQuestion: string;
  transcript: string;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
  onTextSubmit?: (text: string) => void;
  lastUserSentence?: string;
  correctedSentence?: string;
  isMobile?: boolean;
}) => {
  const [textInput, setTextInput] = useState('');

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && onTextSubmit && !isProcessing) {
      onTextSubmit(textInput);
      setTextInput('');
    }
  };

  return (
    <>
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'} w-full ${isMobile ? 'mb-3' : 'mb-4'}`}>
        <div className={`${isMobile ? 'text-sm' : 'text-lg'} font-medium flex items-center gap-2 ${isMobile ? 'justify-center text-center' : ''}`}>
          {isListening ? 'Listening...' : 
           currentQuestion ? currentQuestion : "Type or speak your message"}
          {isSpeaking && (
            <Button 
              onClick={onStopSpeaking} 
              variant="outline"
              size="sm"
              className={`${isMobile ? 'ml-1' : 'ml-2'} flex items-center gap-1`}
            >
              <VolumeX className="h-4 w-4" /> 
              {!isMobile && <span>Stop</span>}
            </Button>
          )}
        </div>
        <Button
          onClick={isListening ? onStopRecording : onStartRecording}
          variant={isListening ? "destructive" : "default"}
          className={`rounded-full ${isMobile ? 'h-14 w-14' : 'h-12 w-12'} p-0 flex items-center justify-center ${isMobile ? 'mx-auto' : ''}`}
          disabled={isProcessing}
          title={isListening ? "Stop recording" : "Start recording"}
        >
          {isListening ? <MicOff className={`${isMobile ? 'h-7 w-7' : 'h-6 w-6'}`} /> : <Mic className={`${isMobile ? 'h-7 w-7' : 'h-6 w-6'}`} />}
        </Button>
      </div>
      
      {isListening && (
        <div className={`w-full text-center font-medium bg-muted/30 ${isMobile ? 'p-2 text-sm' : 'p-2'} rounded-md animate-pulse`}>
          {transcript ? transcript : 'Waiting for you to speak...'}
        </div>
      )}
      
      <form onSubmit={handleTextSubmit} className={`w-full ${isMobile ? 'mt-3' : 'mt-4'} flex gap-2`}>
        <div className="flex-1">
          <Input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type your message here..."
            disabled={isProcessing || isListening}
            className={`w-full ${isMobile ? 'text-base' : ''}`}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!textInput.trim() || isProcessing || isListening}
          size="icon"
          title="Send message"
          className={isMobile ? 'h-10 w-10' : ''}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {lastUserSentence && correctedSentence && !isListening && !isProcessing && (
        <div className={`${isMobile ? 'mt-3 p-2' : 'mt-4 p-3'} border rounded-md bg-green-50`}>
          <div className={`flex items-center gap-2 ${isMobile ? 'mb-1' : 'mb-1.5'} text-green-700`}>
            <Check className="h-4 w-4" />
            <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Sentence Correction</span>
          </div>
          {lastUserSentence === correctedSentence ? (
            <p className={`text-green-700 ${isMobile ? 'text-sm' : ''}`}>Perfect! Your sentence was grammatically correct.</p>
          ) : (
            <div className="space-y-1">
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>Your sentence: <span className="font-medium text-foreground">{lastUserSentence}</span></p>
              <p className={`text-green-700 ${isMobile ? 'text-sm' : ''}`}>Corrected: <span className="font-medium">{correctedSentence}</span></p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ConversationDisplay;