// actions/twitch/askAuthorization.js
import { UUID } from 'uuidjs'

export function askAuthorization() {
  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI;
  const scope = 'channel%3Amoderate+chat%3Aedit+chat%3Aread';

  const state = UUID.generate();

  const url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  window.location.href = url;
}
