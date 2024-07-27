export enum AuthSignType {
  SignIn = "SignIn",
  SignUp = "SignUp"
}

export interface TwitchMessage {
  user: string;
  text: string;
}