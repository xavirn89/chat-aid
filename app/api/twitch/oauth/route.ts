// app/api/twitch/oauth/route.ts
'use server'
import 'regenerator-runtime/runtime'

import { NextRequest, NextResponse } from 'next/server'
import { setCookie } from '@/actions/cookies/setCookie';
import { getCookie } from '@/actions/cookies/getCookie';
import { baseCookieOptions } from '@/constants/base';

export async function GET(request: NextRequest) {
  // Obtiene el código y el estado de la URL de autorización de Twitch
  // Comprueba si existen los valores de código y estado. Sino, devuelve un error.
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  if (!code || !state) return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });

  // Obtiene las cookies de cliente y secreto de Twitch
  // Comprueba si existen los valores de cliente, secreto y URI de redirección. Sino, devuelve un error.
  const clientId = await getCookie('TwitchClientID');
  const clientSecret = await getCookie('TwitchClientSecret');
  const redirectUri = process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) return NextResponse.json({ error: 'Missing client ID, client secret, or redirect URI' }, { status: 400 });

  // Creamos los parametros de la solicitud del access token
  const tokenUrl = 'https://id.twitch.tv/oauth2/token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  
  try {
    // Realizamos la solicitud del access token a Twitch
    // Comprobamos si la solicitud fue exitosa. Sino, devolvemos un error.
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    if (!response.ok) return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
    
    // Parseamos la respuesta de la solicitud del access token
    const data = await response.json();
    if (!data) return NextResponse.json({ error: 'Failed to parse token' }, { status: 500 });

    // Guardamos el access token y el refresh token en cookies
    const { access_token, refresh_token } = data;
    setCookie('twitchAccessToken', access_token, baseCookieOptions);
    setCookie('twitchRefreshToken', refresh_token, baseCookieOptions);

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch token', details: error.message }, { status: 500 });
  }
}
