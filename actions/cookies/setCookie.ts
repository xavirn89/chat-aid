'use server'
import { cookies } from 'next/headers'
import { CookieOptions } from '@/types/global'

export const setCookie = (name: string, value: string, options?: CookieOptions) => {
  cookies().set(name, value, options)
}
