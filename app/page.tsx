'use client'
import React, { useEffect, useRef, useState } from 'react'
import NavBar from '@/sections/NavBar'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import useUserStore from '@/stores/userStore'
import tmi from 'tmi.js'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import useTwitchStore from '@/stores/twitchStore'
import { askAuthorization } from '@/actions/twitch/askAuthorization'
import { getTokens_user } from '@/actions/firestore/getTokens_user'
import TwitchVariables from '@/sections/TwitchVariables'
import SpeechToText from '@/sections/SpeechToText'
import VercelAI from '@/sections/VercelAI'
import TwitchBot from '@/sections/TwitchBot'

const Home = () => {
  const router = useRouter()
  const { user, setUser, setIsLogged } = useUserStore()
  const { accessToken, refreshToken, setAccessToken, setRefreshToken, chatMessages, addChatMessage, resetChatMessages, channel } = useTwitchStore()

  const [loading, setLoading] = useState(true)

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  const transcriptRef = useRef(transcript)

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

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

    if (!accessToken || !refreshToken) {
      fetchTokens()
    } else {
      setLoading(false)
    }
  }, [accessToken, refreshToken, setAccessToken, setRefreshToken, user?.uid])

  

  

  

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex flex-col min-h-screen w-screen'>
      <NavBar />
      <div className='flex flex-col w-full max-w-6xl mx-auto mt-14'>
        <TwitchVariables />
        <div className='flex justify-between w-full mt-10 gap-4'>
          <SpeechToText />
          <VercelAI />
          <TwitchBot transcriptRef={transcriptRef} resetTranscript={resetTranscript} />
        </div>
      </div>
      
      <div className='flex flex-col items-center justify-center flex-1'>
        <h1 className='text-5xl font-black'>Welcome {user?.email}</h1>
        <h2>asda das d {user?.uuid}</h2>
        <p className='text-2xl text-neutral-500'>This is the home page</p>
        

        
      </div>
    </div>
  )
}

export default Home
