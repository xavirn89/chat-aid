// app/api/twitch/oauth/route.ts
'use server'
import { NextRequest, NextResponse } from 'next/server'
import useProvidersStore from '@/stores/providersStore';
import { CookieOptions } from '@/types/global'
import { setCookie } from '@/actions/cookies/setCookie';
import { getCookie } from '@/actions/cookies/getCookie';

const options: CookieOptions = {
  path: '/',
  secure: true,
  httpOnly: false,
  maxAge: 3600
}

export async function GET(request: NextRequest) {
  console.log("Request:", JSON.stringify(request, null, 2));
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const { twitchClientID ,twitchClientSecret } = useProvidersStore.getState();

  if (!code || !state) return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });

  const clientId = await getCookie('TwitchClientID');
  const clientSecret = await getCookie('TwitchClientSecret');
  const redirectUri = process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) return NextResponse.json({ error: 'Missing client ID, client secret, or redirect URI' }, { status: 400 });

  const tokenUrl = 'https://id.twitch.tv/oauth2/token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
    
    const data = await response.json();
    if (!data) return NextResponse.json({ error: 'Failed to parse token' }, { status: 500 });

    const { access_token, refresh_token } = data;
    
    setCookie('twitchAccessToken', access_token, options);
    setCookie('twitchRefreshToken', refresh_token, options);

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch token', details: error.message }, { status: 500 });
  }
}
