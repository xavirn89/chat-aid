import { createOpenAI } from '@ai-sdk/openai';
import useBaseStore from '@/stores/baseStore';

export const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  compatibility: 'strict',
});

const getOpenAIClient = () => {
  const { customOpenAIKey } = useBaseStore.getState();
  const apiKey = customOpenAIKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  // const apiKey = customOpenAIKey || ''
  return createOpenAI({
    apiKey,
    compatibility: 'strict',
  });
};

export default getOpenAIClient;
