// app/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { askAuthorization } from '@/actions/twitch/askAuthorization';
import useStateStore from '@/stores/userStore';
import { getTokens_user } from '@/actions/firestore/getTokens_user';
import { sendMessage } from '@/actions/twitch/sendMessage';

const Home = () => {
  const { accesToken, refreshToken, setAccessToken, setRefreshToken } = useStateStore();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
      sendMessage(process.env.NEXT_PUBLIC_TWITCH_BOT_USERNAME, accesToken, message);
    } else {
      console.error('No access token available');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Connect with Twitch</h1>
      <a href="#" onClick={() => handleAskAuthorization()}>Connect</a>

      <div>
        <h2>Access Token</h2>
        <p>{accesToken}</p>

        <h2>Refresh Token</h2>
        <p>{refreshToken}</p>
      </div>

      <div>
        <h2>Send Message</h2>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message"
          className='text-black'
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Home;
