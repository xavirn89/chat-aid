'use client'
import React, { useEffect, useState } from 'react';
import { askAuthorization } from '@/actions/twitch/askAuthorization';
import useUserStore from '@/stores/userStore';
import { getTokens_user } from '@/actions/firestore/getTokens_user';
import { sendMessage } from '@/actions/twitch/sendMessage';
import useTwitchStore from '@/stores/twitchStore';

const Home = () => {
  const {  } = useUserStore();
  const { accesToken, refreshToken, setAccessToken, setRefreshToken } = useTwitchStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const userId = 'user-1234'; // Cambia esto por un identificador único real en el futuro
        const tokenResult = await getTokens_user(userId);

        if (tokenResult.success) {
          setAccessToken(tokenResult.data?.accessToken);
          setRefreshToken(tokenResult.data?.refreshToken);
        } else {
          console.log('No such document or error fetching tokens:', tokenResult.error);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!accesToken || !refreshToken) {
      fetchTokens();
    } else {
      setLoading(false);
    }
  }, [accesToken, refreshToken, setAccessToken, setRefreshToken]);

  const handleAskAuthorization = () => {
    try {
      askAuthorization();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleSendMessage = () => {
    if (accesToken && process.env.NEXT_PUBLIC_TWITCH_BOT_USERNAME) {
      sendMessage(process.env.NEXT_PUBLIC_TWITCH_BOT_USERNAME, accesToken);
    } else {
      console.error('No access token available');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-black">
        <h1 className="text-2xl font-semibold mb-4 text-center">Connect with Twitch</h1>
        <div className="flex justify-center mb-6">
          <button 
            onClick={handleAskAuthorization} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Connect
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold">Access Token</h2>
          <p className="bg-gray-100 p-2 rounded">{accesToken}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold">Refresh Token</h2>
          <p className="bg-gray-100 p-2 rounded">{refreshToken}</p>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleSendMessage} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Activate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
