import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaRedo, FaPlay, FaStop, FaLink } from 'react-icons/fa';
import useTwitchStore from '@/stores/twitchStore';
import Image from 'next/image';
import { askAuthorization } from '@/actions/twitch/askAuthorization';
import useUserStore from '@/stores/userStore';

const TwitchVariables: React.FC = () => {
  const { 
    twitchClientID, setTwitchClientID, resetTwitchClientID, 
    twitchClientSecret, setTwitchClientSecret, resetTwitchClientSecret, 
    channel, setChannel, resetChannel, accessToken, refreshToken
  } = useTwitchStore();
  const { user } = useUserStore();

  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');

  const flagToConnect: boolean = !!(twitchClientID && twitchClientSecret && channel);
  const flagIsConnected: boolean = !!(accessToken && refreshToken);

  useEffect(() => {
    const envClientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    if (envClientId) {
      setClientId(envClientId);
      setTwitchClientID(envClientId);
    }

    const envClientSecret = process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET;
    if (envClientSecret) {
      setClientSecret(envClientSecret);
      setTwitchClientSecret(envClientSecret);
    }

    const envChannel = process.env.NEXT_PUBLIC_TWITCH_CHANNEL;
    if (envChannel) {
      setChannelName(envChannel);
      setChannel(envChannel);
    }
  }, [setTwitchClientID, setTwitchClientSecret, setChannel]);

  const handleAskAuthorization = () => {
    console.log('Ask Authorization');
    try {
      if (user?.email) {
        askAuthorization(user.email);
      } else {
        console.log('User email is not available');
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className='flex flex-col p-8 bg-gray-100 rounded-lg shadow-lg w-full gap-4'>
      <div className="flex items-center w-full space-x-4">
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

      <div className="flex w-full justify-end">
        {flagToConnect && (
          flagIsConnected ? (
            <div className="flex items-center gap-4 transition-opacity duration-500 ease-in opacity-100">
              <p className="text-green-500 font-semibold">Access Token</p>
              <FaCheckCircle className="text-green-500" />
              {/* Refresh */}
              <button 
                onClick={handleAskAuthorization}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform duration-300 ease-in-out transform hover:scale-105 gap-2 group"
              >
                <FaRedo className="group-hover:animate-spin" />
                <span>Refresh Token</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAskAuthorization}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              <FaLink />
              <span>Get Access Token</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default TwitchVariables;
