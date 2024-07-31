import React, { ChangeEvent } from 'react'
import useProvidersStore from '@/stores/providersStore'

const VercelAI: React.FC = () => {
  const { updateTime, setUpdateTime, increaseUpdateTime, decreaseUpdateTime } = useProvidersStore()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value)) {
      setUpdateTime(value)
    }
  }

  return (
    <div className="flex p-6 bg-gray-100 rounded-lg shadow-lg w-full items-center justify-between">
      <h2 className="font-bold text-2xl">AI</h2>

      <div className="flex gap-4 items-center">
        <p>Procesar cada</p>
        <input 
          type="number" 
          className="w-24 text-center border rounded px-2 py-1" 
          value={updateTime} 
          onChange={handleChange} 
        />
        <p>segundos</p>
        <div className="flex gap-2">
          <button 
            onClick={decreaseUpdateTime} 
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-bold"
          >
            -
          </button>
          <button 
            onClick={increaseUpdateTime} 
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition font-bold"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default VercelAI
