import React from 'react'
import tmi from 'tmi.js'
import { generateResponseToQuestion } from '@/utils/ai-sdk/functions'
import useProvidersStore from '@/stores/providersStore'

interface useTwitchBotProps {
  transcriptRef: React.MutableRefObject<string | undefined>
  chatMessagesRef: React.MutableRefObject<string[]>
  resetTranscript: () => void
  clientRef: React.MutableRefObject<tmi.Client | null>
  setBotRunning: (running: boolean) => void
}

const useTwitchBot = ({ transcriptRef, chatMessagesRef, resetTranscript, clientRef, setBotRunning }: useTwitchBotProps) => {

  const { twitchChannel, twitchAccessToken, addChatMessage, resetChatMessages, openaiModel, updateTime } = useProvidersStore()

  const handleStartBot = async () => {
    if (!twitchChannel) {
      console.error('Channel is not set')
      return
    }

    if (!twitchAccessToken) {
      console.error('Access token is not set')
      return
    }

    const mainChannel = twitchChannel
    try {
      const client = new tmi.Client({
        options: { debug: true },
        identity: {
          username: 'ChatAid',
          password: 'oauth:' + twitchAccessToken,
        },
        channels: [mainChannel],
      })

      client.connect()

      client.on('message', (twitchChannel, tags, message, self) => {
        if (self) return

        if (message) {
          const usermessage = tags.username
          const text = message
          addChatMessage(`${usermessage}: ${text}`)
        }
      })

      const intervalId = setInterval(async () => {
        if (!transcriptRef.current) return
        const response = await generateResponseToQuestion(chatMessagesRef.current, transcriptRef.current, resetChatMessages, openaiModel)
        if (response) {
          client.say(mainChannel, response)
        }
        resetTranscript()
      }, updateTime * 1000)

      clientRef.current = client
      setBotRunning(true)

      // Cleanup function to clear the interval when the bot stops
      return () => clearInterval(intervalId)
    } catch (error) {
      console.error('Error starting bot:', error)
    }
  }

  const handleStopBot = () => {
    if (clientRef.current) {
      clientRef.current.disconnect()
      clientRef.current = null
      setBotRunning(false)
    }
  }

  return { handleStartBot, handleStopBot }
}

export default useTwitchBot