import { useState, useCallback, useRef, useEffect } from 'react';

interface EnhancedSpeechHook {
  isListening: boolean;
  transcript: string;
  confidence: number;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  resetTranscript: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export const useEnhancedSpeech = (): EnhancedSpeechHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const handleStartRecording = useCallback(() => {
    if (!isSupported) {
      console.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Enhanced configuration for better accuracy
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US'; // Changed back to US English for better accuracy
    recognitionRef.current.maxAlternatives = 1;
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      let confidenceScore = 0;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          confidenceScore = Math.max(confidenceScore, result[0].confidence || 0.5);
        }
      }
      
      if (finalTranscript) {
        setTranscript(prev => {
          const newTranscript = prev + ' ' + finalTranscript.trim();
          return newTranscript.trim();
        });
        setConfidence(confidenceScore);
      }

      // Reset timeout on new speech
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Auto-stop after 3 seconds of silence
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
      }, 3000);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognitionRef.current.start();
  }, [isSupported, isListening]);

  const handleStopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
  }, []);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isListening]);

  return {
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
  };
};