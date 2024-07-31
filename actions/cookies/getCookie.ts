'use server'
import 'regenerator-runtime/runtime'
import { cookies } from 'next/headers'

export const getCookie = async (name: string): Promise<string | undefined> => {
  const cookie = cookies().get(name)
  return cookie ? cookie.value : undefined
}
