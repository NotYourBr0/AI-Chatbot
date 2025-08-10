import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 mb-4"
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <Bot className="w-4 h-4 text-gray-600" />
      </div>
      
      {/* Typing Animation */}
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
        <div className="flex items-center gap-1">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    </motion.div>
  );
};
