import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Bot } from 'lucide-react';

export const ChatContainer = ({ 
  messages, 
  isLoading, 
  onCopyMessage, 
  messagesEndRef 
}) => {
  
  // Welcome message component
  const WelcomeMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
        <Bot className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome to AI Assistant
      </h2>
      <p className="text-gray-600 max-w-md">
        I'm here to help you with questions, tasks, and conversations. 
        What would you like to talk about today?
      </p>
      
      {/* Quick Start Suggestions */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-md">
        {[
          "🤔 Ask me anything",
          "💡 Get creative ideas", 
          "📝 Help with writing",
          "🔧 Solve problems"
        ].map((suggestion, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-default"
          >
            {suggestion}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-messages">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <div className="space-y-1">
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onCopy={onCopyMessage}
                  />
                ))}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              <AnimatePresence>
                {isLoading && <TypingIndicator />}
              </AnimatePresence>
            </div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>
    </div>
  );
};
