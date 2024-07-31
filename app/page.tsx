'use client'
import React, { useEffect, useRef, useState } from 'react'
import NavBar from '@/sections/NavBar'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import useProvidersStore from '@/stores/providersStore'
import TwitchVariables from '@/sections/TwitchVariables'
import SpeechToText from '@/sections/SpeechToText'
import VercelAI from '@/sections/VercelAI'
import TwitchBot from '@/sections/TwitchBot'
import OpenAIVariables from '@/sections/OpenAIVariables'
import useBaseStore from '@/stores/baseStore'
import { getCookie } from '@/actions/cookies/getCookie'

const Home: React.FC = () => {
  const { configurationOpen } = useBaseStore()
  const {
    setTwitchAccessToken,
    setTwitchRefreshToken, chatMessages
  } = useProvidersStore()

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()
  
  const transcriptRef = useRef(transcript)
  const chatMessagesRef = useRef(chatMessages)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  useEffect(() => {
    chatMessagesRef.current = chatMessages
  }, [chatMessages])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const getAppTokens = async () => {
      const cookieTwitchClientID = await getCookie('twitchAccessToken')
      if (cookieTwitchClientID) setTwitchAccessToken(cookieTwitchClientID)
      
      const cookieTwitchClientSecret = await getCookie('twitchRefreshToken')
      if (cookieTwitchClientSecret) setTwitchRefreshToken(cookieTwitchClientSecret)
    }

    getAppTokens()
  }, [setTwitchAccessToken, setTwitchRefreshToken])

  if (!isClient) {
    return null
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>El navegador no soporta reconocimiento de voz.</span>
  }

  return (
    <div className='flex flex-col flex-1 w-screen h-full min-h-screen'>
      <NavBar />
      <div className='flex flex-col w-full h-full max-w-6xl mx-auto mt-4 pb-10'>
        {configurationOpen && (
          <>
            <TwitchVariables />
            <OpenAIVariables />
          </>
        )}

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
      </div>
    </div>
  )
}

export default Home
