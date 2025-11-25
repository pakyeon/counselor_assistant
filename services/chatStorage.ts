import { ChatSession, ChatMessage } from '../types';

const STORAGE_KEY = 'counselor_chat_history';

export const getSessions = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load chat history", e);
    return [];
  }
};

export const saveSession = (session: ChatSession): void => {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.id === session.id);
  
  if (index >= 0) {
    sessions[index] = session;
  } else {
    sessions.unshift(session); // Add new sessions to the top
  }
  
  // Sort by date desc
  sessions.sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const createNewSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const deleteSession = (sessionId: string): void => {
  const sessions = getSessions().filter(s => s.id !== sessionId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};
