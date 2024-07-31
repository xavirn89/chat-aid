'use server'
import { cookies } from 'next/headers'
import { CookieOptions } from '@/types/global'

export const getCookie = async (name: string): Promise<string | undefined> => {
  const cookie = cookies().get(name)
  return cookie ? cookie.value : undefined
}
