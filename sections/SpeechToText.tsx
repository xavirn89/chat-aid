import React, { useCallback } from 'react'
import { FaMicrophone, FaMicrophoneSlash, FaPlay, FaStop } from 'react-icons/fa'

interface SpeechToTextProps {
  transcriptRef: React.MutableRefObject<string | undefined>
  resetTranscript: () => void
  listening: boolean
  stopListening: () => void
  startListening: (options?: { continuous: boolean, language: string }) => void
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ transcriptRef, resetTranscript, listening, stopListening, startListening }) => {
  const handleListening = useCallback(() => {
    if (listening) {
      stopListening()
      resetTranscript()
    } else {
      startListening({ continuous: true, language: 'es-ES' })
    }
  }, [listening, stopListening, resetTranscript, startListening])

  return (
    <div className="flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg w-full h-full space-y-4">
      <div className="flex justify-between w-full items-center border-b pb-3">
        <h2 className="font-bold text-2xl">Speech to Text</h2>
        <button
          onClick={handleListening}
          className={`flex items-center space-x-2 px-4 py-2 rounded transition ${
            listening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {listening ? <FaStop /> : <FaPlay />}
          <span>{listening ? "Detener" : "Grabar"}</span>
        </button>
      </div>

      {listening && (
        <div className="bg-white p-4 rounded-lg shadow w-full h-full">
          <p className="text-gray-700">{transcriptRef.current}</p>
        </div>
      )}
    </div>
  )
}

export default SpeechToText
