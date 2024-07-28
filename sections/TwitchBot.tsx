import useTwitchStore from '@/stores/twitchStore';
import React, { useState, useRef, useEffect } from 'react';
import tmi from 'tmi.js';
import { FaPlay, FaStop, FaRedo } from 'react-icons/fa';
import { TwitchMessage } from '@/types/global';
import getOpenAIClient from '@/utils/ai-sdk/openaiProvider';
import { generateText } from 'ai';
import { basePrompt } from '@/utils/ai-sdk/prompts';
import HeaderWithButton from '@/components/HeaderWithButtonProps';
import useTwitchBot from '@/hooks/useTwitchBot';

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
  const { handleStartBot, handleStopBot } = useTwitchBot({
    channel,
    accessToken,
    addChatMessage,
    transcriptRef,
    chatMessagesRef,
    resetChatMessages,
    resetTranscript,
    clientRef,
    setBotRunning,
  });

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
      <HeaderWithButton
        title="Twitch Bot"
        onClick={toggleBot}
        condition={botRunning}
        textOnTrue="Stop Bot"
        textOnFalse="Start Bot"
        iconOnTrue={<FaStop />}
        iconOnFalse={<FaPlay />}
        showButton={true}
      />
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

      {channel && (
        <>
          <div className="bg-white p-4 rounded-lg shadow w-full h-full">
            <h2 className="text-lg font-semibold mb-2">Chat Messages</h2>
            <ul className="space-y-1">
              {twitchMessages.map((message, index) => (
                <li key={index} className="text-gray-700">
                  <span className="text-blue-500 font-bold">{message.user}</span>
                  <span>: {message.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default TwitchBot;
