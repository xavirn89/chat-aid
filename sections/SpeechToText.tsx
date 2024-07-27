import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaPlay, FaStop } from 'react-icons/fa';

interface SpeechToTextProps {
  transcriptRef: React.MutableRefObject<string | undefined>;
  resetTranscript: () => void;
  listening: boolean;
  stopListening: () => void;
  startListening: (options?: any) => void;
}

const SpeechToText = ({ transcriptRef, resetTranscript, listening, stopListening, startListening }: SpeechToTextProps) => {

  const handleListening = () => {
    if (listening) {
      stopListening();
      resetTranscript();
    } else {
      startListening({ continuous: true, language: 'es-ES' });
    }
  };

  return (
    <div className="flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg w-full h-full space-y-4">
      <div className="flex justify-start w-full">
        <h2 className="font-bold text-2xl">Speech to Text</h2>
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <p className="font-semibold">Microphone:</p>
          {listening ? (
            <FaMicrophone className="text-green-500" />
          ) : (
            <FaMicrophoneSlash className="text-red-500" />
          )}
        </div>
        <button 
          onClick={handleListening}
          className={`flex items-center space-x-2 px-4 py-2 rounded transition ${
            listening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {listening ? <FaStop /> : <FaPlay />}
          <span>{listening ? 'Stop' : 'Start'}</span>
        </button>
      </div>

      {listening && (
        <div className="bg-white p-4 rounded-lg shadow w-full h-full">
          <p className="text-gray-700">{transcriptRef.current}</p>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
