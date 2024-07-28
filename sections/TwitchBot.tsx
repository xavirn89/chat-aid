import useTwitchStore from '@/stores/twitchStore';
import React, { useState, useRef, useEffect } from 'react';
import tmi from 'tmi.js';
import { FaPlay, FaStop, FaRedo } from 'react-icons/fa';
import { TwitchMessage } from '@/types/global';
import getOpenAIClient from '@/utils/ai-sdk/openaiProvider';
import { generateText } from 'ai';
import { basePrompt } from '@/utils/ai-sdk/prompts';

interface TwitchBotProps {
  transcriptRef: React.MutableRefObject<string | undefined>;
  chatMessagesRef: React.MutableRefObject<string[]>;
  resetTranscript: () => void;
  listening: boolean;
}

const TwitchBot: React.FC<TwitchBotProps> = ({ transcriptRef, chatMessagesRef, resetTranscript, listening }) => {
  const { accessToken, addChatMessage, resetChatMessages, channel, setChannel, resetChannel } = useTwitchStore();
  const [botRunning, setBotRunning] = useState(false);
  const [channelName, setChannelName] = useState<string>('');
  const clientRef = useRef<tmi.Client | null>(null);
  const [twitchMessages, setTwitchMessages] = useState<TwitchMessage[]>([]);

  const generateResponseToQuestion = async (messages: string[], transcript: string) => {
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
    resetChatMessages();
    return text;
  };

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
        console.log('Fetching new joke');
        const response = await generateResponseToQuestion(chatMessagesRef.current, transcriptRef.current);
        if (response) {
          client.say(mainChannel, response);
        }
        resetTranscript();
      }, 30000);

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

  const toggleBot = () => {
    if (botRunning) {
      handleStopBot();
    } else {
      handleStartBot();
    }
  };

  useEffect(() => {
    const newMessages = chatMessagesRef.current.map((message) => {
      const [user, text] = message.split(':');
      return { user, text };
    });

    setTwitchMessages(newMessages);
  }, [chatMessagesRef.current]);

  return (
    <div className="flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg w-full h-full space-y-4">
      <div className="flex justify-start w-full">
        <h2 className='font-bold text-2xl'>Twitch Bot</h2>
      </div>

      <div className="flex w-full space-x-2">
        {channel ? (
          <div className="bg-white p-2 rounded shadow flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 w-full">
              <p className="font-bold text-gray-700">Twitch Channel:</p>
              <p className="text-gray-600">{channel}</p>
            </div>
            <button
              onClick={resetChannel}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
            >
              <FaRedo />
            </button>
          </div>
        ) : (
          <div className="flex w-full space-x-2">
            <input
              type="text"
              placeholder="Twitch Channel"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={() => setChannel(channelName)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Set
            </button>
          </div>
        )}
      </div>

      {channel && (<>
        <div className="flex justify-end w-full">
          <button
            onClick={toggleBot}
            className={`flex items-center space-x-2 px-4 py-2 rounded transition ${botRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            {botRunning ? <FaStop /> : <FaPlay />}
            <span>{botRunning ? 'Stop Bot' : 'Start Bot'}</span>
          </button>
        </div>

        {botRunning && (
          <div className="bg-white p-4 rounded-lg shadow w-full h-full">
            <h2 className="text-lg font-semibold mb-2">Chat Messages</h2>
            <ul className="space-y-1">
              {twitchMessages.map((message, index) => (
                <li key={index} className="text-gray-700">
                  <span className='text-blue-500 font-bold'>{message.user}</span>
                  <span>{message.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>)}
    </div>
  );
};

export default TwitchBot;
