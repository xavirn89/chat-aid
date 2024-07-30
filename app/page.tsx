'use client'
import React, { useEffect, useRef, useState } from 'react'
import NavBar from '@/sections/NavBar'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import useUserStore from '@/stores/userStore'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import useProvidersStore from '@/stores/providersStore'
import { getTokens_user } from '@/actions/firestore/getTokens_user'
import TwitchVariables from '@/sections/TwitchVariables'
import SpeechToText from '@/sections/SpeechToText'
import VercelAI from '@/sections/VercelAI'
import TwitchBot from '@/sections/TwitchBot'
import OpenAIVariables from '@/sections/OpenAIVariables'

const Home = () => {
  const router = useRouter()
  const { user, setUser, setIsLogged } = useUserStore()
  const {
    twitchAccessToken, twitchRefreshToken, setTwitchAccessToken,
    setTwitchRefreshToken, chatMessages
  } = useProvidersStore()

  const [loading, setLoading] = useState(true)
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()
  
  const transcriptRef = useRef(transcript)
  const chatMessagesRef = useRef(chatMessages)
  const [isClient, setIsClient] = useState(false)

  // Actualiza el valor de transcriptRef cada vez que cambia transcript
  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  // Actualiza el valor de chatMessagesRef cada vez que cambia chatMessages
  useEffect(() => {
    chatMessagesRef.current = chatMessages
  }, [chatMessages])

  // Establece que el componente se está ejecutando en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Observa el estado de autenticación del usuario
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

  // Obtiene los tokens de usuario si el usuario está autenticado
  useEffect(() => {
    const fetchTokens = async () => {
      if (user?.email && (!twitchAccessToken || !twitchRefreshToken)) {
        try {
          const tokenResult = await getTokens_user(user.email)
          if (tokenResult.success) {
            setTwitchAccessToken(tokenResult.data?.twitchAccessToken)
            setTwitchRefreshToken(tokenResult.data?.twitchRefreshToken)
          } else {
            console.error('Error obteniendo tokens:', tokenResult.error)
          }
        } catch (error) {
          console.error('Error obteniendo tokens:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [twitchAccessToken, twitchRefreshToken, setTwitchAccessToken, setTwitchRefreshToken, user])

  if (!isClient) {
    return null
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>El navegador no soporta reconocimiento de voz.</span>
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <div className='flex flex-col flex-1 w-screen h-full min-h-screen'>
      <NavBar />
      <div className='flex flex-col w-full h-full max-w-6xl mx-auto mt-4 pb-10'>
        <TwitchVariables />
        <OpenAIVariables />
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
