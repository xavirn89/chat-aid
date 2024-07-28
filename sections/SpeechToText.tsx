import HeaderWithButton from '@/components/HeaderWithButtonProps';
import React, { useCallback } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaPlay, FaStop } from 'react-icons/fa';

interface SpeechToTextProps {
  transcriptRef: React.MutableRefObject<string | undefined>;
  resetTranscript: () => void;
  listening: boolean;
  stopListening: () => void;
  startListening: (options?: any) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ transcriptRef, resetTranscript, listening, stopListening, startListening }) => {

  const handleListening = useCallback(() => {
    if (listening) {
      stopListening();
      resetTranscript();
    } else {
      startListening({ continuous: true, language: 'es-ES' });
    }
  }, [listening, stopListening, resetTranscript, startListening]);

  return (
    <div className="flex flex-col p-6 bg-gray-100 rounded-lg shadow-lg w-full h-full space-y-4">
      <HeaderWithButton
        title="Speech to Text"
        onClick={handleListening}
        condition={listening}
        textOnTrue="Detener"
        textOnFalse="Grabar"
        iconOnTrue={<FaStop />}
        iconOnFalse={<FaPlay />}
        showButton={true}
      />

      {listening && (
        <div className="bg-white p-4 rounded-lg shadow w-full h-full">
          <p className="text-gray-700">{transcriptRef.current}</p>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
