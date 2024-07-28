import { basePrompt } from '@/utils/ai-sdk/prompts';
import getOpenAIClient from '@/utils/ai-sdk/openaiProvider';
import { generateText } from 'ai';

export const generateResponseToQuestion = async (messages: string[], transcript: string, onFinish: () => void) => {
  if (!messages || messages.length === 0) return null;
  if (!transcript) return null;

  const allChatMessages = messages.filter((message) => !message.startsWith('ChatAid:')).join(', ');
  const finalPrompt:string  = basePrompt(allChatMessages, transcript);
  if (finalPrompt.length === 0) return null

  const openaiClient = getOpenAIClient();
  const { text } = await generateText({
    model: openaiClient('gpt-3.5-turbo'),
    prompt: finalPrompt,
  });
  onFinish();
  return text;
};