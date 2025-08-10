import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { ChatContainer } from './components/Chat/ChatContainer';
import { InputArea } from './components/Chat/InputArea';
import { useChat } from './hooks/useChat';
import './App.css';

function App() {
  const {
    messages,
    isLoading,
    error,
    apiKey,
    selectedModel,
    sendMessage,
    clearMessages,
    copyMessage,
    setSelectedModel,
    exportChat,
    setError,
    messagesEndRef,
  } = useChat();

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      clearMessages();
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <Header
        onClearChat={handleClearChat}
        onExportChat={exportChat}
        messageCount={messages.length}
        isApiKeySet={true} // Always connected
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      {/* Main Chat Area */}
      <div className="chat-layout">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          onCopyMessage={copyMessage}
          messagesEndRef={messagesEndRef}
        />

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mb-2"
          >
            <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              <div className="flex justify-between items-start">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <InputArea
          onSendMessage={sendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

export default App;
