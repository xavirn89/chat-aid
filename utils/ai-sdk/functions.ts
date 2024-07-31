import { basePrompt } from '@/utils/ai-sdk/prompts';
import getOpenAIClient from '@/utils/ai-sdk/openaiProvider';
import { generateText } from 'ai';

export const generateResponseToQuestion = async (messages: string[], transcript: string, onFinish: () => void, openaiModel: string | null) => {
  console.log('Generating response to question...');
  console.log('Transcript:', transcript);
  console.log('OpenAI Model:', openaiModel);
  if (!messages || messages.length === 0) return null;
  if (!transcript) return null;
  if (!openaiModel) return null;
  console.log('---------------------')

  const allChatMessages = messages.filter((message) => !message.startsWith('ChatAid:')).join('// ');
  console.log('All chat messages:', allChatMessages);
  const finalPrompt:string  = basePrompt(allChatMessages, transcript);
  if (finalPrompt.length === 0) return null

  const openaiClient = getOpenAIClient();
  const { text } = await generateText({
    model: openaiClient(openaiModel),
    prompt: finalPrompt,
  });
  onFinish();
  return text;
};