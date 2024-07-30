// ./sections/TwitchVariables.tsx
import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaRedo, FaLink } from 'react-icons/fa'
import useProvidersStore from '@/stores/providersStore'
import Image from 'next/image'
import { askAuthorization } from '@/actions/twitch/askAuthorization'
import useUserStore from '@/stores/userStore'
import CredentialInput from '@/components/CredentialInput'

const TwitchVariables: React.FC = () => {
  const { 
    twitchClientID, setTwitchClientID, resetTwitchClientID, 
    twitchClientSecret, setTwitchClientSecret, resetTwitchClientSecret, 
    twitchAccessToken, twitchRefreshToken
  } = useProvidersStore()
  const { user } = useUserStore()

  const flagToConnect: boolean = !!(twitchClientID && twitchClientSecret)
  const flagIsConnected: boolean = !!(twitchAccessToken && twitchRefreshToken)

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
    <div className='flex p-8 bg-gray-100 rounded-lg shadow-lg w-full h-24 gap-4 items-center'>
      
      <div className='flex w-1/6'>
        <Image 
          src="/images/TwitchLogo.png"
          alt="Logo de Twitch"
          width={100}
          height={100}
          className="w-[100px] h-auto"
        />
      </div>

      <div className='flex w-3/6 gap-4'>
        <CredentialInput 
          label="Client ID"
          value={twitchClientID}
          setValue={setTwitchClientID}
          resetValue={resetTwitchClientID}
          placeholder="Twitch Client ID"
        />
        <CredentialInput 
          label="Client Secret"
          value={twitchClientSecret}
          setValue={setTwitchClientSecret}
          resetValue={resetTwitchClientSecret}
          placeholder="Twitch Client Secret"
        />
      </div>

      <div className='flex w-2/6'>
        {flagToConnect && (
          <>
          {flagIsConnected ? (
            <div className="flex items-center gap-4 transition-opacity duration-500 ease-in opacity-100">
              
              <button 
                onClick={handleAskAuthorization}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-transform duration-300 ease-in-out transform hover:scale-105 gap-2 group"
              >
                <FaRedo className="group-hover:animate-spin" />
                <span>Actualizar Token</span>
              </button>
              <p className="text-green-500 font-semibold">Access Token</p>
              <FaCheckCircle className="text-green-500" />
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
          </>
        )}
      </div>

    </div>
  )
}

export default TwitchVariables
