import useTwitchStore from '@/stores/twitchStore';
import React, { useState, useRef } from 'react';
import tmi from 'tmi.js';
import { FaPlay, FaStop, FaLink } from 'react-icons/fa';

interface TwitchBotProps {
  transcriptRef: React.MutableRefObject<string | undefined>;
  resetTranscript: () => void;
}

const TwitchBot: React.FC<TwitchBotProps> = ({ transcriptRef, resetTranscript }) => {
  const { accessToken, chatMessages, addChatMessage, channel } = useTwitchStore();

  const [botRunning, setBotRunning] = useState(false);
  const clientRef = useRef<tmi.Client | null>(null);


  const handleStartBot = async () => {
    const mainChannel = channel || (process.env.NEXT_PUBLIC_TWITCH_CHANNEL as string);
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

      setInterval(() => {
        const textToSend = transcriptRef.current ? transcriptRef.current : 'Reloj';
        client.say(mainChannel, textToSend);
        resetTranscript();
      }, 10000);

      clientRef.current = client;
      setBotRunning(true);
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

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg w-full space-y-4">
      <div className="flex space-x-4">

        <button
          onClick={toggleBot}
          className={`flex items-center space-x-2 px-4 py-2 rounded transition ${botRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          {botRunning ? <FaStop /> : <FaPlay />}
          <span>{botRunning ? 'Stop Bot' : 'Start Bot'}</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow w-full">
        <h2 className="text-lg font-semibold mb-2">Chat Messages</h2>
        <ul className="space-y-1">
          {chatMessages.map((message, index) => (
            <li key={index} className="text-gray-700">
              {message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TwitchBot;
