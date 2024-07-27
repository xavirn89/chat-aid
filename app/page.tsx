'use client'
import React, { useEffect, useRef, useState } from 'react'
import NavBar from '@/sections/NavBar'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import useUserStore from '@/stores/userStore'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useTwitchStore from '@/stores/twitchStore'
import { getTokens_user } from '@/actions/firestore/getTokens_user'
import TwitchVariables from '@/sections/TwitchVariables'
import SpeechToText from '@/sections/SpeechToText'
import VercelAI from '@/sections/VercelAI'
import TwitchBot from '@/sections/TwitchBot'

const Home = () => {
  const router = useRouter()
  const { user, setUser, setIsLogged } = useUserStore()
  const { accessToken, refreshToken, setAccessToken, setRefreshToken, resetAccessToken, resetRefreshToken, chatMessages } = useTwitchStore()

  const [loading, setLoading] = useState(true)

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  const transcriptRef = useRef(transcript)
  const chatMessagesRef = useRef(chatMessages)

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  useEffect(() => {
    chatMessagesRef.current = chatMessages
  }, [chatMessages])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setIsLogged(true)
      } else {
        router.push('/auth/sign-in')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router, setUser, setIsLogged])

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const userId = user?.email
        const tokenResult = await getTokens_user(userId)

        if (tokenResult.success) {
          setAccessToken(tokenResult.data?.accessToken)
          setRefreshToken(tokenResult.data?.refreshToken)
        } else {
          console.log('No such document or error fetching tokens:', tokenResult.error)
        }
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    if ((!accessToken || !refreshToken) && user?.email !== undefined) {
      fetchTokens()
    } else {
      setLoading(false)
    }
  }, [accessToken, refreshToken, setAccessToken, setRefreshToken, user])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex flex-col flex-1 w-screen h-full min-h-screen'>
      <NavBar />
      
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-xl font-black'>Welcome {user?.email}</h1>
      </div>

      <div className='flex flex-col w-full h-full max-w-6xl mx-auto mt-14 pb-10'>
        <TwitchVariables />

        <div className='flex flex-1 justify-between w-full mt-10 gap-4'>
          <TwitchBot 
            transcriptRef={transcriptRef} 
            chatMessagesRef={chatMessagesRef}
            resetTranscript={resetTranscript} 
            listening={listening} 
          />
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
  )
}

export default Home
