'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import useUserStore from '@/stores/userStore'

const NavBar = () => {
  const router = useRouter()
  const { setUser, setIsLogged } = useUserStore()

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
      <button 
        onClick={handleLogout} 
        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
      >
        Logout
      </button>
    </div>
  )
}

export default NavBar
