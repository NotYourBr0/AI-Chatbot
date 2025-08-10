import axios from 'axios';
import { API_CONFIG, ERROR_MESSAGES } from './constants.js';

export class ChatAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = API_CONFIG.GEMINI_BASE_URL;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      timeout: 30000,
    });
  }

  async sendMessage(messages, options = {}) {
    const {
      model = API_CONFIG.DEFAULT_MODEL,
      maxTokens = API_CONFIG.MAX_TOKENS,
      temperature = API_CONFIG.TEMPERATURE,
    } = options;

    try {
      // Convert messages to Gemini format
      const contents = this.convertToGeminiFormat(messages);
      
      console.log('Sending to Gemini:', JSON.stringify({ model, contents }, null, 2));
      
      const response = await this.client.post(
        `/models/${model}:generateContent`,
        {
          contents,
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature,
            topP: 0.95,
            topK: 40,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH', 
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }
      );

      console.log('Gemini response:', response.data);
      return this.formatGeminiResponse(response.data);
    } catch (error) {
      console.error('API Error:', error);
      if (error.response?.data) {
        console.error('Error response data:', error.response.data);
      }
      throw this.handleError(error);
    }
  }

  convertToGeminiFormat(messages) {
    // Convert messages to Gemini contents format with proper roles
    const contents = [];
    
    for (const message of messages) {
      // Skip system messages
      if (message.sender === 'system') continue;
      
      // Map sender to Gemini role
      const role = message.sender === 'user' ? 'user' : 'model';
      
      contents.push({
        role: role,
        parts: [
          {
            text: message.content
          }
        ]
      });
    }

    // If we only have one message and it's from user, that's fine
    // If we have multiple messages, ensure alternating user/model pattern
    if (contents.length > 1) {
      // Gemini expects alternating user/model roles
      // If we have consecutive same roles, we might need to merge them
      const merged = [];
      let current = null;
      
      for (const content of contents) {
        if (current && current.role === content.role) {
          // Same role, merge the text
          current.parts[0].text += '\n\n' + content.parts.text;
        } else {
          if (current) {
            merged.push(current);
          }
          current = { ...content };
        }
      }
      
      if (current) {
        merged.push(current);
      }
      
      return merged;
    }

    return contents;
  }

  formatGeminiResponse(data) {
    console.log('Raw Gemini response:', JSON.stringify(data, null, 2));
    
    if (!data) {
      throw new Error('No response data from Gemini API');
    }

    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      throw new Error('No candidates in Gemini response');
    }

    const candidate = data.candidates[0];
    
    if (!candidate || !candidate.content) {
      throw new Error('No content in Gemini candidate');
    }

    if (!candidate.content.parts || !Array.isArray(candidate.content.parts) || candidate.content.parts.length === 0) {
      throw new Error('No parts in Gemini content');
    }

    const firstPart = candidate.content.parts[0];
    if (!firstPart || typeof firstPart.text !== 'string') {
      throw new Error('No valid text in Gemini response part');
    }

    const content = firstPart.text;

    return {
      choices: [{
        message: {
          content: content.trim()
        }
      }],
      usage: data.usageMetadata || {}
    };
  }

  async validateApiKey() {
    try {
      const response = await this.client.post(
        '/models/gemini-2.0-flash:generateContent',
        {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: "Hello"
                }
              ]
            }
          ]
        }
      );
      
      console.log('API Key validation response:', response.data);
      return response.status === 200 && response.data.candidates && response.data.candidates.length > 0;
    } catch (error) {
      console.error('API Key validation failed:', error);
      return false;
    }
  }

  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      console.log('Error response:', { status, data });
      
      switch (status) {
        case 400:
          if (data.error?.message?.includes('role')) {
            return new Error(`Role error: ${data.error.message}`);
          }
          if (data.error?.message?.includes('API key') || data.error?.message?.includes('key')) {
            return new Error(ERROR_MESSAGES.API_KEY_INVALID);
          }
          return new Error(data.error?.message || 'Bad request - check your input');
        case 401:
        case 403:
          return new Error(ERROR_MESSAGES.API_KEY_INVALID);
        case 429:
          return new Error(ERROR_MESSAGES.RATE_LIMIT);
        case 500:
        case 502:
        case 503:
          return new Error('Google server error. Please try again later.');
        default:
          return new Error(data?.error?.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
    } else if (error.request) {
      return new Error(ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      return new Error(error.message || ERROR_MESSAGES.GENERIC_ERROR);
    }
  }
}

// Utility functions remain the same
export const formatMessage = (content, sender, id = null) => ({
  id: id || Date.now() + Math.random(),
  content: content.trim(),
  sender,
  timestamp: new Date().toISOString(),
});

export const validateMessageLength = (content) => {
  return content.length <= API_CONFIG.MAX_MESSAGE_LENGTH;
};

export const sanitizeMessage = (content) => {
  return content.trim().replace(/\s+/g, ' ');
};