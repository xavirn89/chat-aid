import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaMicrophoneSlash, FaPlay, FaStop } from 'react-icons/fa';

const SpeechToText = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg w-full space-y-4">
      <div className="flex items-center space-x-2 text-lg">
        <p className="font-semibold">Microphone:</p>
        {listening ? (
          <FaMicrophone className="text-green-500" />
        ) : (
          <FaMicrophoneSlash className="text-red-500" />
        )}
      </div>
      <div className="flex space-x-4">
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
      <div className="bg-white p-4 rounded-lg shadow w-full">
        <p className="text-gray-700">{transcript}</p>
      </div>
    </div>
  );
};

export default SpeechToText;
