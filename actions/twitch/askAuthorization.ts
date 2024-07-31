'use client'
import 'regenerator-runtime/runtime'

export async function askAuthorization(twitchClientID: string | undefined, state: string) {
  if (!twitchClientID) {
    console.error('Missing Twitch Client ID')
    return
  }
  if (typeof window === 'undefined') {
    console.error('window is not defined')
    return
  }

  console.log('id:', twitchClientID)
  console.log('Asking for authorization')
  const clientId = twitchClientID
  const redirectUri = process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI
  const scope = 'chat%3Aedit+chat%3Aread'

  const url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`
  window.location.href = url
}
