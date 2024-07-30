'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { AuthSignType } from '@/types/global';
import AuthSignSwapper from '@/components/auth/AuthSignSwapper';
import Image from 'next/image';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatedPassword, setRepeatedPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/auth/sign-in');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className='flex flex-col w-1/2 gap-4'>
      <Image src='/images/chataid.png' width={200} height={100} alt='ChatAid Logo' className='mx-auto mt-40 mb-10' />
      <AuthSignSwapper type={AuthSignType.SignUp} />
      <div className='flex flex-col justify-between items-end w-full max-w-lg px-32 gap-2 mx-auto'>
        <input
          type="text"
          placeholder="Username"
          className="bg-white w-full bg-clip-padding p-4 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none appearance-none leading-tight focus:ring-1 focus:ring-blue-600"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="bg-white w-full bg-clip-padding p-4 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none appearance-none leading-tight focus:ring-1 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-white w-full bg-clip-padding p-4 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none appearance-none leading-tight focus:ring-1 focus:ring-blue-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Repeat Password"
          className="bg-white w-full bg-clip-padding p-4 border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none appearance-none leading-tight focus:ring-1 focus:ring-blue-600"
          value={repeatedPassword}
          onChange={(e) => setRepeatedPassword(e.target.value)}
        />
        <button className="bg-blue-500 w-full hover:bg-blue-700 text-white mt-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleSignUp}>Sign Up</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
