import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {config} from 'dotenv';

// Load environment variables from .env file for local development.
config();

const plugins: any[] = [];

// Only initialize the googleAI plugin if the API key is available.
// This prevents a crash on startup in production environments where the key might not be set.
if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
} else {
  // In a production/deployment environment, log a warning if the key is missing.
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      'GEMINI_API_KEY is not set. AI features will be disabled.'
    );
  }
}

export const ai = genkit({
  plugins: plugins,
  model: 'googleai/gemini-1.5-flash-latest',
});
