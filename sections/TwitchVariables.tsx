import React, { useState } from 'react';
import { FaCheckCircle, FaRedo } from 'react-icons/fa';
import useTwitchStore from '@/stores/twitchStore';
import Image from 'next/image';

const TwitchVariables: React.FC = () => {
  const { 
    twitchClientID, setTwitchClientID, resetTwitchClientID, 
    twitchClientSecret, setTwitchClientSecret, resetTwitchClientSecret, 
    channel, setChannel, resetChannel 
  } = useTwitchStore();

  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');

  return (
    <div className="flex items-center p-8 bg-gray-100 rounded-lg shadow-lg w-full space-x-4">
      
      <div className="w-fit flex items-center justify-center">
        <Image 
          src="/images/TwitchLogo.png"
          alt="Twitch Logo"
          width={100}
          height={100}
          className="rounded-lg shadow-md"
        />
      </div>
      
      <div className="flex-grow flex justify-between space-x-4">
        <div className="flex-1">
          {twitchClientID ? (
            <div className="bg-white p-2 rounded shadow flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="font-bold text-gray-700">Twitch Client ID:</p>
                <FaCheckCircle className="text-green-500" />
              </div>
              <button 
                onClick={resetTwitchClientID}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
              >
                <FaRedo />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="password"
                placeholder="Twitch Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button 
                onClick={() => setTwitchClientID(clientId)} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Set
              </button>
            </div>
          )}
        </div>

        <div className="flex-1">
          {twitchClientSecret ? (
            <div className="bg-white p-2 rounded shadow flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="font-bold text-gray-700">Twitch Client Secret:</p>
                <FaCheckCircle className="text-green-500" />
              </div>
              <button 
                onClick={resetTwitchClientSecret}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
              >
                <FaRedo />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="password"
                placeholder="Twitch Client Secret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button 
                onClick={() => setTwitchClientSecret(clientSecret)} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Set
              </button>
            </div>
          )}
        </div>

        <div className="flex-1">
          {channel ? (
            <div className="bg-white p-2 rounded shadow flex items-center justify-between">
              <div className="flex items-center space-x-2">
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
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Twitch Channel"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
      </div>
    </div>
  );
};

export default TwitchVariables;
