import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatAPI, formatMessage, validateMessageLength, sanitizeMessage } from '../utils/api.js';
import { useLocalStorage } from './useLocalStorage.js';
import { STORAGE_KEYS, UI_CONFIG, API_CONFIG } from '../utils/constants.js';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use permanent API key
  const apiKey = API_CONFIG.PERMANENT_API_KEY;
  const [selectedModel, setSelectedModel] = useLocalStorage(STORAGE_KEYS.CHAT_MODEL, 'gemini-2.0-flash');
  
  const chatAPI = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize API client with permanent key
  useEffect(() => {
    chatAPI.current = new ChatAPI(apiKey);
  }, [apiKey]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }, UI_CONFIG.AUTO_SCROLL_DELAY);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Send message function
  const sendMessage = useCallback(async (content) => {
    if (!content?.trim() || !chatAPI.current || isLoading) {
      return;
    }

    const sanitizedContent = sanitizeMessage(content);
    
    if (!validateMessageLength(sanitizedContent)) {
      setError('Message is too long. Please keep it under 30,000 characters.');
      return;
    }

    // Clear any previous errors
    setError(null);
    
    // Add user message
    const userMessage = formatMessage(sanitizedContent, 'user');
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for API (include conversation history)
      const conversationMessages = [...messages, userMessage];
      
      const response = await chatAPI.current.sendMessage(
        conversationMessages,
        { model: selectedModel }
      );

      // Add AI response
      const aiMessage = formatMessage(
        response.choices[0].message.content,
        'ai',
        Date.now() + 1
      );
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      setError(error.message);
      
      // Add error message to chat
      const errorMessage = formatMessage(
        `Sorry, I encountered an error: ${error.message}`,
        'ai',
        Date.now() + 1
      );
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setIsLoading(false);
    }
  }, [messages, selectedModel, isLoading]);

  // Copy message to clipboard
  const copyMessage = useCallback(async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      console.log('Message copied to clipboard');
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  }, []);

  // Clear conversation
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Export chat history
  const exportChat = useCallback(() => {
    const chatData = {
      messages,
      exportDate: new Date().toISOString(),
      model: selectedModel,
      provider: 'Google Gemini 2.0'
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-2.0-chat-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [messages, selectedModel]);

  return {
    // State
    messages,
    isLoading,
    error,
    apiKey: true, // Always true since we have permanent key
    selectedModel,
    
    // Actions
    sendMessage,
    clearMessages,
    copyMessage,
    setSelectedModel,
    exportChat,
    setError,
    
    // Refs
    messagesEndRef,
  };
};
