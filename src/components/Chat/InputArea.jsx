import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../UI/Button';
import { API_CONFIG } from '../../utils/constants';

export const InputArea = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Limit message length
    if (value.length <= API_CONFIG.MAX_MESSAGE_LENGTH) {
      setMessage(value);
    }
    
    // Auto-resize textarea
    autoResize(e.target);
  };

  const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const isOverLimit = message.length > API_CONFIG.MAX_MESSAGE_LENGTH * 0.9;
  const canSend = message.trim() && !disabled && message.length <= API_CONFIG.MAX_MESSAGE_LENGTH;

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          {/* File Attachment Button (placeholder) */}
          
          
          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "AI is thinking..." : "Type your message..."}
              disabled={disabled}
              className={`textarea min-h-[44px] max-h-[120px] resize-none pr-16 ${
                isOverLimit ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              rows="1"
            />
            
            {/* Character Count */}
            <div className={`absolute bottom-2 right-2 text-xs ${
              isOverLimit ? 'text-red-500' : 'text-gray-400'
            }`}>
              {message.length}/{API_CONFIG.MAX_MESSAGE_LENGTH}
            </div>
          </div>
          
          {/* Send Button */}
          <Button
            type="submit"
            variant="primary"
            disabled={!canSend}
            loading={disabled}
            className="p-3"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Helper Text */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          {disabled ? (
            <span className="text-blue-600">AI is typing...</span>
          ) : (
            <span>Press Enter to send • Shift+Enter for new line</span>
          )}
        </div>
      </form>
    </div>
  );
};
