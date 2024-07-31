export enum AuthSignType {
  SignIn = "SignIn",
  SignUp = "SignUp"
}

export interface TwitchMessage {
  user: string;
  text: string;
}

export interface CookieOptions {
  secure?: boolean
  httpOnly?: boolean
  path?: string
  maxAge?: number
  expires?: Date
}
