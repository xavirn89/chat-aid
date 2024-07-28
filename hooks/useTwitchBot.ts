import React from 'react'
import tmi from 'tmi.js';
import { generateResponseToQuestion } from '@/utils/ai-sdk/functions';

interface useTwitchBotProps {
  channel: string | null;
  accessToken: string | null;
  addChatMessage: (message: string) => void;
  transcriptRef: React.MutableRefObject<string | undefined>;
  chatMessagesRef: React.MutableRefObject<string[]>;
  resetChatMessages: () => void;
  resetTranscript: () => void;
  clientRef: React.MutableRefObject<tmi.Client | null>;
  setBotRunning: (running: boolean) => void;
}

const useTwitchBot = ({ channel, accessToken, addChatMessage, transcriptRef, chatMessagesRef, resetChatMessages, resetTranscript, clientRef, setBotRunning }: useTwitchBotProps) => {

  const handleStartBot = async () => {
    if (!channel) {
      console.error('Channel is not set');
      return;
    }

    if (!accessToken) {
      console.error('Access token is not set');
      return;
    }

    const mainChannel = channel;
    try {
      const client = new tmi.Client({
        options: { debug: true },
        identity: {
          username: 'ChatAid',
          password: 'oauth:' + accessToken,
        },
        channels: [mainChannel],
      });

      client.connect();

      client.on('message', (channel, tags, message, self) => {
        if (self) return;

        if (message.toLowerCase() === '!hello') {
          client.say(channel, `@${tags.username}, heya!`);
        }

        if (message) {
          const usermessage = tags.username;
          const text = message;
          addChatMessage(`${usermessage}: ${text}`);
        }
      });

      const intervalId = setInterval(async () => {
        if (!transcriptRef.current) return;
        const response = await generateResponseToQuestion(chatMessagesRef.current, transcriptRef.current, resetChatMessages);
        if (response) {
          client.say(mainChannel, response);
        }
        resetTranscript();
      }, 10000);

      clientRef.current = client;
      setBotRunning(true);

      // Cleanup function to clear the interval when the bot stops
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error('Error starting bot:', error);
    }
  };

  const handleStopBot = () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
      setBotRunning(false);
    }
  };

  return { handleStartBot, handleStopBot };
}

export default useTwitchBot