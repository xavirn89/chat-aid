import React from 'react'
import tmi from 'tmi.js'
import { generateResponseToQuestion } from '@/utils/ai-sdk/functions'
import useProvidersStore from '@/stores/providersStore'

interface useTwitchBotProps {
  twitchChannel: string | null
  twitchAccessToken: string | null
  addChatMessage: (message: string) => void
  transcriptRef: React.MutableRefObject<string | undefined>
  chatMessagesRef: React.MutableRefObject<string[]>
  resetChatMessages: () => void
  resetTranscript: () => void
  clientRef: React.MutableRefObject<tmi.Client | null>
  setBotRunning: (running: boolean) => void
  openaiModel: string | null
  updateTime: number
}

const useTwitchBot = ({ twitchChannel, twitchAccessToken, addChatMessage, transcriptRef, chatMessagesRef, resetChatMessages, resetTranscript, clientRef, setBotRunning, openaiModel, updateTime }: useTwitchBotProps) => {

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

        if (message.toLowerCase() === '!hello') {
          client.say(twitchChannel, `@${tags.username}, heya!`)
        }

        if (message) {
          const usermessage = tags.username
          const text = message
          addChatMessage(`${usermessage}: ${text}`)
        }
      })

      const intervalId = setInterval(async () => {
        console.log('Checking for new messages...')
        if (!transcriptRef.current) return
        console.log('Transcript:', transcriptRef.current)
        const response = await generateResponseToQuestion(chatMessagesRef.current, transcriptRef.current, resetChatMessages, openaiModel)
        console.log('Response:', response)
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