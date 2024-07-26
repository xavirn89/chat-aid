'use client'
import React, { useEffect, useRef, useState } from 'react'
import NavBar from '@/sections/NavBar'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import useUserStore from '@/stores/userStore'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import tmi from 'tmi.js'
import useTwitchStore from '@/stores/twitchStore'
import { askAuthorization } from '@/actions/twitch/askAuthorization'
import { getTokens_user } from '@/actions/firestore/getTokens_user'
import TwitchVariables from '@/sections/TwitchVariables'

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

  const handleAskAuthorization = () => {
    try {
      askAuthorization(user?.email)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>
  }

  const handleStartBot = async () => {
    const mainChannel = channel || process.env.NEXT_PUBLIC_TWITCH_CHANNEL as string
    try {
      const client = new tmi.Client({
        options: { debug: true },
        identity: {
          username: "ChatAid",
          password: 'oauth:' + accessToken
        },
        channels: [mainChannel]
      })

      client.connect()

      // Respond to messages
      client.on('message', (channel, tags, message, self) => {
        // Ignore echoed messages.
        if (self) return

        if (message.toLowerCase() === '!hello') {
          client.say(channel, `@${tags.username}, heya!`)
        }

        if (message) {
          const user = tags.username
          const text = message
          addChatMessage(`${user}: ${text}`)
        }
      })

      // Send a message every 10 seconds
      // setInterval(() => {
      //   const textToSend = transcriptRef.current ? transcriptRef.current : 'Reloj'
      //   client.say(channel, textToSend)
      //   resetTranscript()
      // }, 10000) // 10000 ms = 10 seconds

    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex flex-col min-h-screen w-screen'>
      <NavBar />
      <div className='flex w-full max-w-5xl mx-auto pt-14'>
        <TwitchVariables />
      </div>
      
      <div className='flex flex-col items-center justify-center flex-1'>
        <h1 className='text-5xl font-black'>Welcome {user?.email}</h1>
        <h2>asda das d {user?.uuid}</h2>
        <p className='text-2xl text-neutral-500'>This is the home page</p>
        <div className='flex'>
          <p>Microphone: {listening ? 'on' : 'off'}</p>
          <button onClick={() => SpeechRecognition.startListening({ continuous: true, language: 'es-ES' })}>Start</button>
          <button onClick={() => SpeechRecognition.stopListening()}>Stop</button>
          <button onClick={() => resetTranscript()}>Reset</button>
          <p>{transcript}</p>
        </div>

        <div className='flex'>
          <button
            onClick={handleAskAuthorization}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Connect
          </button>
        </div>

        <div className='flex'>
          <button onClick={handleStartBot}>Start Bot</button>
        </div>

        <div>
          <h2>Chat Messages</h2>
          <ul>
            {chatMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home
