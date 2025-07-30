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
  // 1. Ref to control the continuous listening behavior
  const forceKeepAlive = useRef(false);

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const setupRecognition = useCallback(() => {
    if (!isSupported) {
      console.error('Speech recognition not supported');
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configuration for accuracy and continuous listening
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 1;
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      let confidenceScore = 0;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          // Use the confidence of the most recent final result
          confidenceScore = result[0].confidence || 0;
        }
      }
      
      if (finalTranscript) {
        // Append new final transcript to the existing one
        setTranscript(prev => (prev + ' ' + finalTranscript.trim()).trim());
        setConfidence(confidenceScore);
      }
    };

    // 2. The key change: onend handler now restarts recognition if needed
    recognitionRef.current.onend = () => {
      // Only restart if the user hasn't explicitly stopped it
      if (forceKeepAlive.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Error restarting recognition on end:", e);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      // Attempt to recover from common errors if keep-alive is enabled
      if (forceKeepAlive.current && (event.error === 'no-speech' || event.error === 'network' || event.error === 'audio-capture')) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Error restarting recognition on error:", e);
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };
  }, [isSupported]);

  const handleStartRecording = useCallback(() => {
    // 3. Set the flag to true to enable continuous listening
    forceKeepAlive.current = true;
    
    // Initialize recognition if it hasn't been already
    if (!recognitionRef.current) {
      setupRecognition();
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Could not start recognition:", e);
    }
  }, [setupRecognition]);

  const handleStopRecording = useCallback(() => {
    // 4. Set the flag to false to disable restarting
    forceKeepAlive.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setConfidence(0);
  }, []);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
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

  // 5. Cleanup effect to stop recognition when the component unmounts
  useEffect(() => {
    return () => {
      forceKeepAlive.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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