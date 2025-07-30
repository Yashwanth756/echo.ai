
import React from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import ConversationContainer from '@/components/conversation/ConversationContainer';
import { ConversationProvider, useConversation } from '@/contexts/ConversationContext';

// Intermediate component to access the context
const ConversationContent = () => {
  const {
    activeTopic,
    conversationHistory,
    currentQuestion,
    isListening,
    isProcessing,
    transcript,
    fluencyScore,
    vocabularyScore,
    grammarScore,
    isSpeaking,
    hasApiError,
    lastUserSentence,
    correctedSentence,
    handleTopicChange,
    handleStartRecording,
    handleStopRecording,
    speakText,
    stopSpeaking,
    clearConversation,
    handleTextSubmit
  } = useConversation();

  return (
    <ConversationContainer
      activeTopic={activeTopic}
      conversationHistory={conversationHistory}
      currentQuestion={currentQuestion}
      isListening={isListening}
      isProcessing={isProcessing}
      transcript={transcript}
      fluencyScore={fluencyScore}
      vocabularyScore={vocabularyScore}
      grammarScore={grammarScore}
      onTopicChange={handleTopicChange}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onSpeakMessage={speakText}
      isSpeaking={isSpeaking}
      onStopSpeaking={stopSpeaking}
      hasApiError={hasApiError}
      onClearConversation={clearConversation}
      onTextSubmit={handleTextSubmit}
      lastUserSentence={lastUserSentence}
      correctedSentence={correctedSentence}
    />
  );
};

const ConversationAI = () => {
  return (
    <ConversationProvider>
      <AppLayout>
        <ConversationContent />
      </AppLayout>
    </ConversationProvider>
  );
};

export default ConversationAI;