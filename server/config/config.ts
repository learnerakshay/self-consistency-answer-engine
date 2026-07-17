import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: 'gpt-4o-mini',
  geminiModel: 'gemini-3.5-flash',
  maxPromptLength: 5000,
};

export function checkKeys() {
  const status = {
    hasGemini: !!config.geminiApiKey,
    hasOpenAI: !!config.openaiApiKey,
  };
  
  if (!status.hasGemini) {
    console.warn('⚠️ GEMINI_API_KEY environment variable is not defined.');
  }
  if (!status.hasOpenAI) {
    console.warn('⚠️ OPENAI_API_KEY environment variable is not defined.');
  }
  
  return status;
}
