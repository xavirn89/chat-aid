'use client'
import 'regenerator-runtime/runtime'

import React, { useEffect, useRef, useState } from 'react';
import NavBar from '@/sections/NavBar';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useProvidersStore from '@/stores/providersStore';
import TwitchVariables from '@/sections/TwitchVariables';
import SpeechToText from '@/sections/SpeechToText';
import VercelAI from '@/sections/VercelAI';
import TwitchBot from '@/sections/TwitchBot';
import OpenAIVariables from '@/sections/OpenAIVariables';
import useBaseStore from '@/stores/baseStore';
import { getCookie } from '@/actions/cookies/getCookie';

const Home: React.FC = () => {
  const { configurationOpen, setConfigurationOpen, panelOpen, setPanelOpen } = useBaseStore();
  const { twitchAccessToken, setTwitchAccessToken, setTwitchRefreshToken, chatMessages, openaiKey, openaiModel } = useProvidersStore();
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  
  const [isClient, setIsClient] = useState(false);
  const transcriptRef = useRef(transcript);
  const chatMessagesRef = useRef(chatMessages);

  /** 
   * Obtiene las cookies de los tokens de Twitch y los guarda en el estado
   * Out: twitchAccessToken, twitchRefreshToken
  **/
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsClient(true);
      
      const [cookieAccessToken, cookieRefreshToken] = await Promise.all([
        getCookie('twitchAccessToken'),
        getCookie('twitchRefreshToken')
      ]);
      
      if (cookieAccessToken) setTwitchAccessToken(cookieAccessToken);
      if (cookieRefreshToken) setTwitchRefreshToken(cookieRefreshToken);
    };

    fetchInitialData();
  }, [setTwitchAccessToken, setTwitchRefreshToken]);  

  // Sincronización de refs con los estados
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  /**
   * Controla la visualización de los paneles de configuracion y de la aplicación segun si se han configurado las variables necesarias
   * In: openaiKey, openaiModel, twitchAccessToken
   * Out: configurationOpen, panelOpen
  **/
  useEffect(() => {
    if (openaiKey && openaiModel && twitchAccessToken) {
      setConfigurationOpen(false)
      setPanelOpen(true)
    } else {
      setConfigurationOpen(true)
      setPanelOpen(false)
    }
  }, [openaiKey, openaiModel, twitchAccessToken, setConfigurationOpen, setPanelOpen])

  if (!isClient) {
    return null;
  }

  // Si el navegador no soporta reconocimiento de voz muestra un mensaje
  if (!browserSupportsSpeechRecognition) {
    return <span>El navegador no soporta reconocimiento de voz.</span>;
  }

  return (
    <div className='flex flex-col flex-1 w-screen h-full min-h-screen'>
      <NavBar />
      <div className='flex flex-col w-full h-full max-w-6xl mx-auto pb-10'>
        {configurationOpen && (
          <div className='flex flex-col w-full mx-auto mt-4'>
            <TwitchVariables />
            <OpenAIVariables />
          </div>
        )}
        {panelOpen && (
          <div className='flex flex-1 justify-between w-full mt-10 gap-4'>
            <TwitchBot 
              transcriptRef={transcriptRef} 
              chatMessagesRef={chatMessagesRef}
              resetTranscript={resetTranscript} 
              listening={listening} 
            />
            
            <div className='flex flex-col w-1/2 gap-4'>
              <VercelAI />

              <SpeechToText 
                transcriptRef={transcriptRef} 
                resetTranscript={resetTranscript} 
                listening={listening} 
                stopListening={SpeechRecognition.stopListening} 
                startListening={SpeechRecognition.startListening} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
