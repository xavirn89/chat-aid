import { AuthSignType } from '@/types/global'
import Link from 'next/link'
import React from 'react'

interface Props {
  type: AuthSignType
}

const AuthSignSwapper: React.FC<Props> = ({ type }) => {
  const linkClasses = (isActive: boolean) => isActive ? 'text-3xl font-black' : 'text-xl text-neutral-500';

  return (
    <div className='flex justify-between items-end w-full max-w-lg px-32 mx-auto'>
      <Link href='/auth/sign-in' className={linkClasses(type === AuthSignType.SignIn)}>Sign In</Link>
      <Link href='/auth/sign-up' className={linkClasses(type === AuthSignType.SignUp)}>Sign Up</Link>
    </div>
  )
}

export default AuthSignSwapper
