import React, { useEffect } from 'react'
import Image from 'next/image'
import CredentialInput from '@/components/CredentialInput'
import useProvidersStore from '@/stores/providersStore'

const OpenAIVariables: React.FC = () => {
  const { openaiKey, setOpenaiKey, resetOpenaiKey, openaiModel, setOpenaiModel } = useProvidersStore()

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOpenaiModel(e.target.value)
  }
  
  // TO-DO: Delete
  // Estable el valor de openaikey desde la variable de entorno
  useEffect(() => {
    const envOpenaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    if (envOpenaiKey) setOpenaiKey(envOpenaiKey)
  }, [setOpenaiKey])

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
          setValue={setOpenaiKey}
          resetValue={resetOpenaiKey}
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
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default OpenAIVariables
