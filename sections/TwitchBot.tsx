import useProvidersStore from '@/stores/providersStore'
import React, { useState, useRef, useEffect } from 'react'
import tmi from 'tmi.js'
import { FaPlay, FaStop, FaRedo } from 'react-icons/fa'
import { TwitchMessage } from '@/types/global'
import useTwitchBot from '@/hooks/useTwitchBot'

interface TwitchBotProps {
  transcriptRef: React.MutableRefObject<string | undefined>
  chatMessagesRef: React.MutableRefObject<string[]>
  resetTranscript: () => void
  listening: boolean
}

const TwitchBot: React.FC<TwitchBotProps> = ({ transcriptRef, chatMessagesRef, resetTranscript, listening }) => {
  const { twitchChannel, setTwitchChannel, resetTwitchChannel } = useProvidersStore()
  
  const [botRunning, setBotRunning] = useState(false)
  const [channelName, setChannelName] = useState<string>('')
  const clientRef = useRef<tmi.Client | null>(null)
  const [twitchMessages, setTwitchMessages] = useState<TwitchMessage[]>([])
  
  const { handleStartBot, handleStopBot } = useTwitchBot({ transcriptRef, chatMessagesRef, resetTranscript, clientRef, setBotRunning})

  // Controla el inicio y detención del bot
  const toggleBot = () => {
    if (botRunning) {
      handleStopBot()
    } else {
      handleStartBot()
    }
  }

  // Actualiza el estado de los mensajes de chat, separando el usuario del mensaje y guardándolos en un objeto.
  useEffect(() => {
    const newMessages = chatMessagesRef.current.map((message) => {
      const [user, text] = message.split(':')
      return { user, text }
    })

    setTwitchMessages(newMessages)
  }, [chatMessagesRef.current])

  return (
    <div className="flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg w-1/2 h-full space-y-4">
      <div className="flex justify-between w-full items-center border-b pb-2">
        <h2 className="font-bold text-2xl">Twitch Bot</h2>
      </div>

      <div className='flex justify-between w-full gap-4 h-10'>
        {twitchChannel ? (
          <div className="bg-white p-2 rounded shadow flex items-center justify-between w-fit">
            <div className="flex items-center space-x-2 w-full pr-4">
              <p className="font-bold text-gray-700">Twitch Channel:</p>
              <p className="text-gray-600">{twitchChannel}</p>
            </div>
            <button
              onClick={resetTwitchChannel}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
            >
              <FaRedo />
            </button>
          </div>
        ) : (
          <div className="flex w-fit space-x-2">
            <input
              type="text"
              placeholder="Twitch Channel"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="p-2 border rounded flex-grow focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={() => setTwitchChannel(channelName)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Set
            </button>
          </div>
        )}

        <button
          onClick={toggleBot}
          className={`flex items-center space-x-2 px-4 py-2 rounded transition ${
            botRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {botRunning ? <FaStop /> : <FaPlay />}
          <span>{botRunning ? "Stop Bot" : "Start Bot"}</span>
        </button>
      </div>

      {twitchChannel && (
        <div className="bg-white p-4 rounded-lg shadow w-full h-full">
          <h2 className="text-lg font-semibold mb-2 border-b w-fit pr-4">Chat Messages</h2>
          <ul className="space-y-1">
            {twitchMessages.map((message, index) => (
              <li key={index} className="text-gray-700">
                <span className="text-blue-500 font-bold">{message.user}</span>
                <span>: {message.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TwitchBot
