
import { GoogleGenAI, Part } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface ChatRequest {
  history: { role: 'user' | 'model'; text: string }[];
  message: string;
  contextData?: string;
  image?: {
    inlineData: {
      data: string;
      mimeType: string;
    }
  };
}

export const streamChatResponse = async function* (request: ChatRequest) {
  if (!process.env.API_KEY) {
    yield "API Key is missing. Please set REACT_APP_GEMINI_API_KEY.";
    return;
  }

  try {
    // Construct the prompt with context (Simulating RAG)
    const contextPrompt = request.contextData 
      ? `\n\n[CONTEXT DATA]:\n${request.contextData}\n\n[USER QUERY]: ${request.message}`
      : request.message;

    // Create chat session
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for factual medical responses
      },
      history: request.history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    // Construct the message payload (Multimodal support)
    const messageParts: Part[] = [{ text: contextPrompt }];
    
    if (request.image) {
      messageParts.push(request.image);
    }

    const result = await chat.sendMessageStream({
      message: messageParts
    });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};