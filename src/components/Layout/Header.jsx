import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Trash2, 
  Download,
  Zap,
  Circle
} from 'lucide-react';
import { Button } from '../UI/Button';
import { MODELS } from '../../utils/constants';

export const Header = ({ 
  onClearChat, 
  onExportChat,
  messageCount = 0,
  isApiKeySet = true,
  selectedModel,
  onModelChange
}) => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                AI Assistant
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Circle className="w-2 h-2 fill-current text-green-500" />
                <span>
                  Ready to Chat
                  {messageCount > 0 && ` • ${messageCount} messages`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          

          {/* Export Chat */}
          {messageCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportChat}
              className="text-gray-600 hover:text-gray-900"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}

          {/* Clear Chat */}
          {messageCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearChat}
              className="text-gray-600 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}

          {/* Gemini 2.0 Badge */}
          <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-medium rounded-full">
            <Zap className="w-3 h-3" />
            <span>pro</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
