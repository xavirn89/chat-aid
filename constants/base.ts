import { CookieOptions } from "@/types/global";

export const baseCookieOptions: CookieOptions = {
  path: '/',
  secure: true,
  httpOnly: false,
  maxAge: 3600
}