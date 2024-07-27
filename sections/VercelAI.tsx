import React, { useState } from 'react'

import useTwitchStore from '@/stores/twitchStore'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const VercelAI = () => {

  const [runTime, setRunTime] = useState<number>(10)

  return (
    <div className='flex flex-col w-24 items-center'>
      <h2 className='font-bold text-2xl'>AI</h2>
      <input type='number' className='w-12' value={runTime} onChange={(e) => setRunTime(parseInt(e.target.value))} />
    </div>
  )
}

export default VercelAI