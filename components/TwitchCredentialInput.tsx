import React, { useState } from 'react'
import { FaCheckCircle, FaRedo } from 'react-icons/fa'

interface TwitchCredentialInputProps {
  label: string
  value: string | null
  setValue: (value: string) => void
  resetValue: () => void
  placeholder: string
}

const TwitchCredentialInput: React.FC<TwitchCredentialInputProps> = ({ label, value, setValue, resetValue, placeholder }) => {
  const [inputValue, setInputValue] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSetClick = () => {
    setValue(inputValue)
  }

  return (
    <div className="flex-1">
      {value ? (
        <div className="bg-white p-2 rounded shadow flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="font-bold text-gray-700">{label}:</p>
            <FaCheckCircle className="text-green-500" />
          </div>
          <button 
            onClick={resetValue}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
          >
            <FaRedo />
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <input
            type="password"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
            className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button 
            onClick={handleSetClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Set
          </button>
        </div>
      )}
    </div>
  )
}

export default TwitchCredentialInput