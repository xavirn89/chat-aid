import React, { useEffect } from 'react'
import { FaCheckCircle, FaRedo, FaLink } from 'react-icons/fa'
import useProvidersStore from '@/stores/providersStore'
import Image from 'next/image'
import { askAuthorization } from '@/actions/twitch/askAuthorization'
import CredentialInput from '@/components/CredentialInput'
import { CookieOptions } from '@/types/global'
import { setCookie } from '@/actions/cookies/setCookie'
import { deleteCookie } from '@/actions/cookies/deleteCookie'
import { getCookie } from '@/actions/cookies/getCookie'

const options: CookieOptions = {
  path: '/',
  secure: true,
  httpOnly: false,
  maxAge: 3600
}

const TwitchVariables: React.FC = () => {
  const { 
    twitchClientID, setTwitchClientID, resetTwitchClientID, 
    twitchClientSecret, setTwitchClientSecret, resetTwitchClientSecret, 
    twitchAccessToken, twitchRefreshToken 
  } = useProvidersStore()

  const flagToConnect: boolean = !!(twitchClientID && twitchClientSecret)
  const flagIsConnected: boolean = !!(twitchAccessToken && twitchRefreshToken)

  useEffect(() => {
    const fetchCookies = async () => {
      const cookieTwitchClientID = await getCookie('TwitchClientID')
      if (cookieTwitchClientID) setTwitchClientID(cookieTwitchClientID)

      const cookieTwitchClientSecret = await getCookie('TwitchClientSecret')
      if (cookieTwitchClientSecret) setTwitchClientSecret(cookieTwitchClientSecret)
    }

    fetchCookies()
  }, [setTwitchClientID, setTwitchClientSecret])

  const handleSetTwitchClientID = (value: string) => {
    setCookie('TwitchClientID', value, options)
    setTwitchClientID(value)
  }

  const handleResetTwitchClientID = () => {
    deleteCookie('TwitchClientID')
    resetTwitchClientID()
  }

  const handleSetTwitchClientSecret = (value: string) => {
    setCookie('TwitchClientSecret', value, options)
    setTwitchClientSecret(value)
  }

  const handleResetTwitchClientSecret = () => {
    deleteCookie('TwitchClientSecret')
    resetTwitchClientSecret()
  }

  const handleAskAuthorization = async () => {
    console.log('Solicitar Autorización')
    try {
      const cookieTwitchClientID = await getCookie('TwitchClientID')
      askAuthorization(cookieTwitchClientID, "chataid")
    } catch (error: any) {
      console.error('Error solicitando autorización:', error.message)
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
          className="w-auto h-auto"
        />
      </div>

      <div className='flex w-3/6 gap-4'>
        <CredentialInput 
          label="Client ID"
          value={twitchClientID || ''}
          setValue={handleSetTwitchClientID}
          resetValue={handleResetTwitchClientID}
          placeholder="Twitch Client ID"
        />
        <CredentialInput 
          label="Client Secret"
          value={twitchClientSecret || ''}
          setValue={handleSetTwitchClientSecret}
          resetValue={handleResetTwitchClientSecret}
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
