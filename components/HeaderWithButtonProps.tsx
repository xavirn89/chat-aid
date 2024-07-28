import React from 'react';

interface HeaderWithButtonProps {
  title: string;
  onClick: () => void;
  condition: boolean;
  textOnTrue: string;
  textOnFalse: string;
  iconOnTrue: React.ReactNode;
  iconOnFalse: React.ReactNode;
  showButton: boolean;
}

const HeaderWithButton: React.FC<HeaderWithButtonProps> = ({ title, onClick, condition, textOnTrue, textOnFalse, iconOnTrue, iconOnFalse, showButton }) => {
  return (
    <div className="flex justify-between w-full items-center">
      <h2 className="font-bold text-2xl">{title}</h2>
      {showButton && (
        <button
          onClick={onClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded transition ${
            condition ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {condition ? iconOnTrue : iconOnFalse}
          <span>{condition ? textOnTrue : textOnFalse}</span>
        </button>
      )}
    </div>
  );
};

export default HeaderWithButton;
