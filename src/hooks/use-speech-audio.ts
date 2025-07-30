
import { useState, useCallback, useRef } from 'react';

interface SpeechAudioHook {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  setTranscript: (value: string) => void;
  isSpeaking: boolean;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  resetTranscript: () => void;
}

export const useSpeechAudio = (): SpeechAudioHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  // Ref to control the continuous listening behavior
  const forceKeepAlive = useRef(false);

  const processResult = (event: any) => {
    let finalTranscript = '';
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const resultTranscript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += resultTranscript + ' ';
      } else {
        interim += resultTranscript;
      }
    }
    
    if (finalTranscript) {
      setTranscript(prev => prev +' '+ finalTranscript);
    }
    setInterimTranscript(interim);
  };

  const startRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }
    
    // Only create a new instance if one doesn't exist
    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = processResult;

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        // If the user hasn't manually stopped, try to restart on common, recoverable errors
        if (forceKeepAlive.current && (event.error === 'no-speech' || event.error === 'network')) {
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

      recognitionRef.current.onend = () => {
        // If the user hasn't clicked stop, keep the recognition going
        if (forceKeepAlive.current) {
          try {
            recognitionRef.current.start();
          } catch(e) {
            console.error("Error restarting recognition on end:", e);
            setIsListening(false);
          }
        } else {
          setIsListening(false);
          setInterimTranscript('');
        }
      };
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
        console.error("Could not start recognition:", e);
    }
  }, []);

  const handleStartRecording = useCallback(() => {
    // Set the flag to true to enable continuous listening
    forceKeepAlive.current = true;
    startRecognition();
  }, [startRecognition]);

  const handleStopRecording = useCallback(() => {
    // Set the flag to false to disable restarting
    forceKeepAlive.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
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

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    setTranscript,
    isSpeaking,
    handleStartRecording,
    handleStopRecording,
    speakText,
    stopSpeaking,
    resetTranscript
  };
};