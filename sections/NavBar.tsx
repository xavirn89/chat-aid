'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import useUserStore from '@/stores/userStore'
import useBaseStore from '@/stores/baseStore'

const NavBar = () => {
  const router = useRouter()
  const { setUser, setIsLogged } = useUserStore()
  const { configurationOpen, setConfigurationOpen, toggleConfigurationOpen } = useBaseStore()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setIsLogged(false)
      router.push('/auth/sign-in')
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  return (
    <div className='flex w-full max-w-7xl h-fit justify-between items-center px-14 mx-auto py-4'>
      <Image src='/images/chataid.png' width={150} height={100} alt='ChatAid Logo' />
      <div className='flex justify-end items-center gap-4'>
        {/* button for display or hide Configuration */}
        <button 
          className='flex gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          onClick={toggleConfigurationOpen}
        >
          {configurationOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="28" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
              <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-closed" width="28" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
              <path d="M3 15l2.5 -3.8" />
              <path d="M21 14.976l-2.492 -3.776" />
              <path d="M9 17l.5 -4" />
              <path d="M15 17l-.5 -4" />
            </svg>
          )}
          Configuration
        </button>
        <button 
          onClick={handleLogout} 
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default NavBar
