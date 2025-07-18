import { GoogleGenerativeAI } from "@google/generative-ai";

// List of API keys to rotate
const API_KEYS = [
  'AIzaSyCp8okCQjCZ7iCeItLgfeLh5v0a6nIE2Jo',
  'AIzaSyAUjUvHX8WrTtfeoLQQks5zxAyXbYkLBww',
  'AIzaSyBERkzxfo0L9qg8uWPt5YScDqmmIcvIkF4',
  "AIzaSyCc0ZYxEuoocwAZ5jKM8fWQEd0wz6sh4uI",
  'AIzaSyCRk2Yipn_lreY__-KFoCI0Uvi8XAQlVyM'
  // Add more keys here if needed
];

let currentApiKeyIndex = 0; // Index of the currently active API key
let chatInstance: any; // Type declaration for chatInstance
let currentTopic = ''; // Track topic to force reset if topic changes

// Model configuration with updated models that have better compatibility
const MODELS = {
  PRIMARY: "gemini-1.5-flash", // Updated as recommended for better compatibility
  FALLBACK: "gemini-2.0-flash",     // Legacy model as fallback (consider removing if not truly needed)
};

// Function to get the next API key in the rotation
const getNextApiKey = (): string => {
  const userProvidedKey = localStorage.getItem("gemini-api-key");
  if (userProvidedKey !== null) {
    // If user has saved an API key, always use it and don't rotate from the predefined list.
    // This assumes the user's key takes precedence and they manage its rotation if needed.
    return userProvidedKey.trim();
  }

  // Rotate through the predefined API keys
  const apiKey = API_KEYS[currentApiKeyIndex];
  currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length; // Cycle through keys
  return apiKey;
};

// Create a function to get a fresh instance of the API with the current key
const getGenAIInstance = (): GoogleGenerativeAI | null => {
  const apiKey = getNextApiKey(); // Always get the next key in the cycle
  console.log(`[Gemini API] Using API Key: ${apiKey.substring(0, 5)}...`); // Log the key being used (first 5 chars for privacy)
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

// Reset the chat history for a new conversation
export const resetChatHistory = (topic: string): void => {
  chatInstance = null;
  currentTopic = topic;
  console.log(`[Gemini API] Chat reset with topic: ${topic}`);
};

// Send message to Gemini and get response
export const sendMessageToGemini = async (userMessage: string, topic: string): Promise<string> => {
  let attempts = 0;
  const maxAttempts = API_KEYS.length + 1; // Allow trying all keys + 1 for user-provided key

  while (attempts < maxAttempts) {
    try {
      console.log(`[Gemini API] Attempt ${attempts + 1} with API Key Rotation`);
      const genAI = getGenAIInstance();
      if (!genAI) {
        return "Please add your Gemini API key in the Settings page to use this feature.";
      }

      let currentModel = MODELS.PRIMARY;
      let model = genAI.getGenerativeModel({ model: currentModel });

      if (topic !== currentTopic) {
        resetChatHistory(topic);
      }

      if (!chatInstance) {
        console.log(`[Gemini API] Initializing new chat instance for topic: ${topic} and model: ${currentModel}`);
        const systemPrompt = `You are Iyraa, a warm, friendly, and intelligent English tutor AI designed to help users improve their English naturally and confidently.

        The current conversation topic is: ${topic}.
        
        ***CRITICAL INSTRUCTIONS***:
        - Respond with EXACTLY ONE conversational reply directly answering the user's message
        - NEVER provide ANY grammar assessment, feedback, or comments on their language quality
        - NEVER start with phrases like "That's a good question" or "That's well expressed" or any similar commentary
        - DO NOT split your response into multiple messages or thoughts
        - Simply respond naturally as you would in a human conversation
        - Keep responses warm, concise, and conversational
        
        Begin the conversation by introducing yourself: "Hi, I'm Iyraa, your friendly English tutor. I'm here to help you practice conversational English in a natural, supportive way!"`;

        try {
          chatInstance = model.startChat({ history: [] });
          const systemResult = await chatInstance.sendMessage(
            `System instruction (please follow these guidelines): ${systemPrompt}`
          );
          await systemResult.response;
          console.log("[Gemini API] System prompt sent after reset/init.");
        } catch (error) {
          console.error("[Gemini API] Error initializing chat with primary model:", error);
          // If initialization fails, try fallback or next key
          if (currentModel === MODELS.PRIMARY && MODELS.FALLBACK) {
            console.log("Trying fallback model for chat initialization...");
            currentModel = MODELS.FALLBACK;
            model = genAI.getGenerativeModel({ model: currentModel });
            chatInstance = model.startChat({ history: [] });
            const systemResult = await chatInstance.sendMessage(
              `System instruction (please follow these guidelines): ${systemPrompt}`
            );
            await systemResult.response;
            console.log("[Gemini API] System prompt sent with fallback model.");
          } else {
            throw error; // If fallback also fails or no fallback, rethrow to try next key
          }
        }
        currentTopic = topic;
      }

      console.log(`[Gemini API] Sending user message to ${currentModel}: "${userMessage}"`);
      const result = await chatInstance.sendMessage(userMessage);
      const response = await result.response;
      const responseText = response.text();
      console.log(`[Gemini API] Got response: "${responseText.substring(0, 50)}..."`);
      return responseText;

    } catch (error: any) {
      console.error(`Error with Gemini API (attempt ${attempts + 1}):`, error);

      // Check if it's a rate limit or API key issue
      if (error.message && (error.message.includes("429") || error.message.includes("API key") || error.message.includes("400"))) {
        console.warn("API key likely rate-limited or invalid. Rotating to next key.");
        // Reset chat instance to force re-initialization with the new key
        chatInstance = null;
        attempts++;
        if (attempts >= maxAttempts) {
          // If all keys have been tried, or max attempts reached
          console.error("All available API keys have been tried and failed.");
          if (error.message.includes("API key")) {
            return `There seems to be an issue with your API key. Please check your settings and make sure you've entered a valid Google Gemini API key.`;
          }
          if (error.message.includes("429")) {
            return `You've reached the API rate limit with all available keys. Please try again later or add more API keys in the Settings page.`;
          }
          return `Sorry, I encountered an error after trying all available API keys. Please check the Settings page or try again later.`;
        }
        // Continue to the next iteration of the while loop to try the next key
      } else {
        // If it's another type of error, re-throw immediately
        throw error;
      }
    }
  }
  // Should ideally not reach here, but as a safeguard
  return "An unexpected error occurred and all attempts to use the API failed.";
};

// Get feedback on user's speaking
export const getLanguageFeedback = async (userMessage: string): Promise<{
  feedback: string,
  fluencyScore: number,
  vocabularyScore: number,
  grammarScore: number
}> => {
  let attempts = 0;
  const maxAttempts = API_KEYS.length + 1; // Allow trying all keys + 1 for user-provided key

  while (attempts < maxAttempts) {
    try {
      console.log(`[Gemini API] Feedback Attempt ${attempts + 1} with API Key Rotation`);
      const genAI = getGenAIInstance();
      if (!genAI) {
        return {
          feedback: "Please add your Gemini API key in the Settings page to use this feature.",
          fluencyScore: 0,
          vocabularyScore: 0,
          grammarScore: 0
        };
      }

      let currentModel = MODELS.PRIMARY;
      let model = genAI.getGenerativeModel({ model: currentModel });

      try {
        console.log(`Getting language feedback using model: ${currentModel}`);

        const feedbackChat = model.startChat({
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        });

        const prompt = `
          You are Iyraa, a warm and supportive English tutor. 
          
          Analyze the following English sentence or paragraph:
          
          "${userMessage}"
          
          DO NOT provide grammar corrections or assessments. Focus ONLY on providing ONE simple, encouraging response without ANY language analysis.
          
          Your feedback must:
          - Be ONE simple conversational response with NO critique
          - NEVER mention any errors or language quality
          - NEVER include phrases like "That's well expressed" or "Good job with..."
          - Just respond naturally to what they said as if you're having a regular conversation
          
          Format your response as a JSON object with these keys exactly: 
          {
            "feedback": "your single conversational response (NO grammar comments)",
            "fluencyScore": number (0-100),
            "vocabularyScore": number (0-100),
            "grammarScore": number (0-100)
          }
        `;

        const result = await feedbackChat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text().trim();
        console.log(`Got feedback response (first 50 chars): "${text.substring(0, 50)}..."`);

        try {
          return JSON.parse(text);
        } catch (e) {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          throw new Error("Could not parse feedback response as JSON");
        }
      } catch (error: any) {
        console.error(`Error with model ${currentModel} for feedback (attempt ${attempts + 1}):`, error);

        if (error.message && (error.message.includes("429") || error.message.includes("400")) && currentModel === MODELS.PRIMARY) {
          console.log("Trying fallback model for feedback due to API error...");
          currentModel = MODELS.FALLBACK;
          model = genAI.getGenerativeModel({ model: currentModel });

          const feedbackChat = model.startChat({
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1000,
            },
          });

          const prompt = `
            You are Iyraa, a warm and supportive English tutor. 
            
            Analyze the following English sentence or paragraph:
            
            "${userMessage}"
            
            DO NOT provide grammar corrections or assessments. Focus ONLY on providing ONE simple, encouraging response without ANY language analysis.
          
            Your feedback must:
            - Be ONE simple conversational response with NO critique
            - NEVER mention any errors or language quality
            - NEVER include phrases like "That's well expressed" or "Good job with..."
            - Just respond naturally to what they said as if you're having a regular conversation
            
            Format your response as a JSON object with these keys exactly: 
            {
              "feedback": "your single conversational response (NO grammar comments)",
              "fluencyScore": number (0-100),
              "vocabularyScore": number (0-100),
              "grammarScore": number (0-100)
            }
          `;

          const fallbackResult = await feedbackChat.sendMessage(prompt);
          const fallbackResponse = await fallbackResult.response;
          const fallbackText = fallbackResponse.text().trim();

          try {
            return JSON.parse(fallbackText);
          } catch (e) {
            const jsonMatch = fallbackText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              return JSON.parse(jsonMatch[0]);
            }
            throw new Error("Could not parse feedback response as JSON from fallback model");
          }
        } else if (error.message && (error.message.includes("429") || error.message.includes("API key") || error.message.includes("400"))) {
          console.warn("API key likely rate-limited or invalid for feedback. Rotating to next key.");
          attempts++;
          if (attempts >= maxAttempts) {
            console.error("All available API keys have been tried for feedback and failed.");
            // Return a generic error object if all keys fail
            return {
              feedback: "Could not analyze your response. Please check your API key in Settings or try again later.",
              fluencyScore: 50,
              vocabularyScore: 50,
              grammarScore: 50
            };
          }
          // Continue to next iteration to try the next key
        } else {
          // If it's another type of error, re-throw immediately
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Critical error getting language feedback:", error);
      // Return a generic error object if a critical error occurs
      if (error.message && error.message.includes("API key")) {
        return {
          feedback: "Please check your API key in Settings.",
          fluencyScore: 0,
          vocabularyScore: 0,
          grammarScore: 0
        };
      }
      return {
        feedback: "Could not analyze your response. Check your API key in Settings.",
        fluencyScore: 50,
        vocabularyScore: 50,
        grammarScore: 50
      };
    }
  }
  // Should ideally not reach here for feedback, but as a safeguard
  return {
    feedback: "An unexpected error occurred and all attempts to get feedback failed.",
    fluencyScore: 50,
    vocabularyScore: 50,
    grammarScore: 50
  };
};