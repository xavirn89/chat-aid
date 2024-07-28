// ./sections/TwitchVariables.tsx
import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaRedo, FaLink } from 'react-icons/fa'
import useTwitchStore from '@/stores/twitchStore'
import Image from 'next/image'
import { askAuthorization } from '@/actions/twitch/askAuthorization'
import useUserStore from '@/stores/userStore'
import TwitchCredentialInput from '@/components/TwitchCredentialInput'

const TwitchVariables: React.FC = () => {
  const { 
    twitchClientID, setTwitchClientID, resetTwitchClientID, 
    twitchClientSecret, setTwitchClientSecret, resetTwitchClientSecret, 
    accessToken, refreshToken
  } = useTwitchStore()
  const { user } = useUserStore()

  const flagToConnect: boolean = !!(twitchClientID && twitchClientSecret)
  const flagIsConnected: boolean = !!(accessToken && refreshToken)

  // TO-DO: Delete
  // Establecer valores de cliente y secreto desde las variables de entorno
  useEffect(() => {
    const envClientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID
    if (envClientId) setTwitchClientID(envClientId)
    
    const envClientSecret = process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET
    if (envClientSecret) setTwitchClientSecret(envClientSecret)
    
  }, [setTwitchClientID, setTwitchClientSecret])

  // Solicitar autorización para obtener tokens
  const handleAskAuthorization = () => {
    console.log('Solicitar Autorización')
    try {
      if (user?.email) {
        askAuthorization(user.email)
      } else {
        console.log('El correo electrónico del usuario no está disponible')
      }
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <div className='flex flex-col p-8 bg-gray-100 rounded-lg shadow-lg w-full h-fit gap-4'>
      <div className="flex items-center w-full h-full gap-4">
        <div className="w-fit flex items-center justify-center">
          <Image 
            src="/images/TwitchLogo.png"
            alt="Logo de Twitch"
            width={100}
            height={100}
            className="rounded-lg shadow-md w-full h-full"
          />
        </div>
        
        <div className="flex-grow flex justify-between space-x-4">
          <div className="flex-1">
            <TwitchCredentialInput 
              label="Twitch Client ID"
              value={twitchClientID}
              setValue={setTwitchClientID}
              resetValue={resetTwitchClientID}
              placeholder="Twitch Client ID"
            />
          </div>

          <div className="flex-1">
            <TwitchCredentialInput 
              label="Twitch Client Secret"
              value={twitchClientSecret}
              setValue={setTwitchClientSecret}
              resetValue={resetTwitchClientSecret}
              placeholder="Twitch Client Secret"
            />
          </div>

        </div>
      </div>

      {flagToConnect && (
        <div className="flex w-full justify-end">
          {flagIsConnected ? (
            <div className="flex items-center gap-4 transition-opacity duration-500 ease-in opacity-100">
              <p className="text-green-500 font-semibold">Access Token</p>
              <FaCheckCircle className="text-green-500" />
              <button 
                onClick={handleAskAuthorization}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform duration-300 ease-in-out transform hover:scale-105 gap-2 group"
              >
                <FaRedo className="group-hover:animate-spin" />
                <span>Actualizar Token</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAskAuthorization}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              <FaLink />
              <span>Obtener Access Token</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default TwitchVariables
