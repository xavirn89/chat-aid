import { createOpenAI } from '@ai-sdk/openai';
import useBaseStore from '@/stores/baseStore';
import useProvidersStore from '@/stores/providersStore';

export const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  compatibility: 'strict',
});

const getOpenAIClient = () => {
  const { openaiKey } = useProvidersStore.getState();
  const apiKey = openaiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  // const apiKey = openaiKey || ''
  return createOpenAI({
    apiKey,
    compatibility: 'strict',
  });
};

export default getOpenAIClient;
