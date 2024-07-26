'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import userStore from '@/stores/userStore';
import AuthSignSwapper from '@/components/auth/AuthSignSwapper';
import { AuthSignType } from '@/types/global';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { setUser, setIsLogged } = userStore();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);
      setIsLogged(true);
      router.push('/');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className='flex flex-col w-1/2 justify-center mt-52 gap-4'>
      <AuthSignSwapper type={AuthSignType.SignIn} />
      <div className='flex flex-col justify-between items-end w-full max-w-lg px-32 gap-2 mx-auto'>
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
        <button className="bg-blue-500 w-full hover:bg-blue-700 text-white mt-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleSignIn}>Sign In</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
