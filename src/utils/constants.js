export const API_CONFIG = {
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
  DEFAULT_MODEL: 'gemini-2.0-flash',
  MAX_TOKENS: 2048,
  TEMPERATURE: 0.7,
  MAX_MESSAGE_LENGTH: 30720,
  // Your permanent API key
  PERMANENT_API_KEY: 'AIzaSyCtKFvPOztWTG-k9OROOvN8VX7PxR9DMtc',
};

export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TYPING_DELAY: 1000,
  AUTO_SCROLL_DELAY: 100,
};

export const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  CHAT_MODEL: 'preferred_model',
  CHAT_HISTORY: 'chat_history',
  USER_PREFERENCES: 'user_preferences',
};

export const MODELS = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Latest and fastest' },

];

export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'API configuration error',
  API_KEY_INVALID: 'API configuration error. Please refresh the page.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};
