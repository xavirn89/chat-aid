import 'regenerator-runtime/runtime'

import React, { useEffect } from 'react';
import { FaCheckCircle, FaRedo, FaLink } from 'react-icons/fa';
import useProvidersStore from '@/stores/providersStore';
import Image from 'next/image';
import { askAuthorization } from '@/actions/twitch/askAuthorization';
import CredentialInput from '@/components/CredentialInput';
import { setCookie } from '@/actions/cookies/setCookie';
import { deleteCookie } from '@/actions/cookies/deleteCookie';
import { getCookie } from '@/actions/cookies/getCookie';
import { baseCookieOptions } from '@/constants/base';

const TwitchVariables: React.FC = () => {
  const { 
    twitchClientID, setTwitchClientID, resetTwitchClientID, 
    twitchClientSecret, setTwitchClientSecret, resetTwitchClientSecret, 
    twitchAccessToken, twitchRefreshToken 
  } = useProvidersStore();

  const flagToConnect = !!(twitchClientID && twitchClientSecret);
  const flagIsConnected = !!(twitchAccessToken && twitchRefreshToken);

  /**
   * Obtiene las cookies de los tokens de Twitch y los guarda en el estado
   * In: Cookies
   * Out: twitchClientID, twitchClientSecret
  **/
  useEffect(() => {
    const fetchCookies = async () => {
      const [cookieTwitchClientID, cookieTwitchClientSecret] = await Promise.all([
        getCookie('TwitchClientID'),
        getCookie('TwitchClientSecret')
      ]);
      if (cookieTwitchClientID) setTwitchClientID(cookieTwitchClientID);
      if (cookieTwitchClientSecret) setTwitchClientSecret(cookieTwitchClientSecret);
    };

    fetchCookies();
  }, [setTwitchClientID, setTwitchClientSecret]);

  // Setea las cookies de los tokens de Twitch
  const handleSetCookie = (name: string, value: string, setter: (value: string | null) => void) => {
    setCookie(name, value, baseCookieOptions);
    setter(value);
  };

  // Elimina las cookies de los tokens
  const handleResetCookie = (name: string, resetter: () => void) => {
    deleteCookie(name);
    resetter();
  };

  /**
   * Solicita autorización a Twitch para obtener el token de acceso
   * In: twitchClientID
   * Out: Twitch Access Token
  **/
  const handleAskAuthorization = async () => {
    try {
      const cookieTwitchClientID = await getCookie('TwitchClientID');
      if (cookieTwitchClientID) {
        askAuthorization(cookieTwitchClientID, 'chataid');
      } else {
        console.error('No Twitch Client ID found in cookies.');
      }
    } catch (error: any) {
      console.error('Error solicitando autorización:', error.message);
    }
  };

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
          setValue={(value) => handleSetCookie('TwitchClientID', value, setTwitchClientID)}
          resetValue={() => handleResetCookie('TwitchClientID', resetTwitchClientID)}
          placeholder="Twitch Client ID"
        />
        <CredentialInput 
          label="Client Secret"
          value={twitchClientSecret || ''}
          setValue={(value) => handleSetCookie('TwitchClientSecret', value, setTwitchClientSecret)}
          resetValue={() => handleResetCookie('TwitchClientSecret', resetTwitchClientSecret)}
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
  );
};

export default TwitchVariables;
