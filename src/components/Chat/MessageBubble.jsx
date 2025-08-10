import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, User, Bot, Check } from 'lucide-react';

export const MessageBubble = ({ message, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';
  
  const handleCopy = async () => {
    await onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
          : 'bg-gradient-to-br from-gray-200 to-gray-300'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-gray-600" />
        )}
      </div>
      
      {/* Message Content */}
      <div className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${
        isUser ? 'text-right' : 'text-left'
      }`}>
        <div className={`inline-block px-4 py-3 rounded-2xl relative group shadow-sm hover:shadow-md transition-shadow duration-200 ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md' 
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
        }`}>
          {/* Message Text */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* Copy Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className={`absolute -top-2 -right-2 p-2 rounded-full shadow-lg transition-all duration-200 ${
              isUser 
                ? 'bg-blue-400 hover:bg-blue-300 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            } opacity-0 group-hover:opacity-100`}
            onClick={handleCopy}
            whileTap={{ scale: 0.9 }}
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </motion.button>
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 px-1 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  );
};
