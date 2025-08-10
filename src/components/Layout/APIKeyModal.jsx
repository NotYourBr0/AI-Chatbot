import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Key, ExternalLink } from 'lucide-react';
import { Button } from '../UI/Button';
import { MODELS } from '../../utils/constants';

export const APIKeyModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onValidate,
  currentApiKey = '',
  currentModel = 'gemini-1.5-flash',
  isValidating = false 
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [showApiKey, setShowApiKey] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setValidationError('Please enter your API key');
      return;
    }

    setValidationError('');
    
    // Validate API key
    const isValid = await onValidate(apiKey.trim());
    
    if (isValid) {
      onSave(apiKey.trim(), selectedModel);
      onClose();
    } else {
      setValidationError('Invalid API key. Please check and try again.');
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay flex items-center justify-center"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="modal-content p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Gemini API Configuration
                </h2>
                <p className="text-sm text-gray-600">
                  Configure your Google Gemini API settings
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className={`input pr-10 ${validationError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {validationError && (
                <p className="mt-1 text-sm text-red-600">{validationError}</p>
              )}
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gemini Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="input"
              >
                {MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExternalLink className="w-5 h-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Need an API key?
                  </h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>
                      Get your free API key from{' '}
                      <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                      >
                        Google AI Studio
                      </a>
                      . Your key is stored locally and never sent to our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={isValidating}
              disabled={!apiKey.trim()}
            >
              {isValidating ? 'Validating...' : 'Save & Connect'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
