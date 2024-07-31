import React, { useEffect } from 'react';
import Image from 'next/image';
import CredentialInput from '@/components/CredentialInput';
import useProvidersStore from '@/stores/providersStore';
import { getCookie } from '@/actions/cookies/getCookie';
import { setCookie } from '@/actions/cookies/setCookie';
import { deleteCookie } from '@/actions/cookies/deleteCookie';
import { baseCookieOptions } from '@/constants/base';

const OpenAIVariables: React.FC = () => {
  const { openaiKey, setOpenaiKey, resetOpenaiKey, openaiModel, setOpenaiModel } = useProvidersStore();

  // Obtiene la cookie de la llave de OpenAI y la guarda en el estado
  useEffect(() => {
    const fetchCookies = async () => {
      const cookieOpenAIKey = await getCookie('OpenAIKey');
      if (cookieOpenAIKey) setOpenaiKey(cookieOpenAIKey);
    };

    fetchCookies();
  }, [setOpenaiKey]);

  // Setea la cookie de la llave de OpenAI
  const handleSetCookie = (name: string, value: string, setter: (value: string | null) => void) => {
    setCookie(name, value, baseCookieOptions);
    setter(value);
  };

  // Elimina la cookie de la llave de OpenAI
  const handleResetCookie = (name: string, resetter: () => void) => {
    deleteCookie(name);
    resetter();
  };

  // Controla el cambio del modelo de OpenAI
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOpenaiModel(e.target.value);
  };

  return (
    <div className='flex p-8 bg-gray-100 rounded-lg shadow-lg w-full h-24 gap-4 items-center mt-4'>
      <div className='flex w-1/6'>
        <Image 
          src="/images/openaiLogo.png"
          alt="Logo de OpenAI"
          width={110}
          height={100}
          className="w-auto h-auto"
        />
      </div>

      <div className='flex w-5/6 gap-4'>
        <CredentialInput 
          label="OpenAI Key"
          value={openaiKey || ''}
          setValue={(value) => handleSetCookie('OpenAIKey', value, setOpenaiKey)}
          resetValue={() => handleResetCookie('OpenAIKey', resetOpenaiKey)}
          placeholder="OpenAI Key"
        />

        <div className='flex w-full gap-4 items-center'>
          <label htmlFor="openaiModel" className="font-bold text-gray-700">OpenAI Model:</label>
          <select 
            id="openaiModel"
            value={openaiModel || ''}
            onChange={handleModelChange}
            className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>Select a model</option>
            <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
            <option value="gpt-4-turbo">GPT-4-turbo</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OpenAIVariables;
