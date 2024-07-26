// app/api/twitch/oauth/route.ts
'use server'
import { NextRequest, NextResponse } from 'next/server'
import { saveTokens_user } from '@/actions/firestore/saveTokens_user';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });

  const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_TWITCH_CLIENT_SECRET;
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
    
    const userId = 'user-1234'; // Cambia esto por un identificador único real en el futuro
    const saveResult = await saveTokens_user(userId, access_token, refresh_token);

    if (!saveResult.success) {
      return NextResponse.json({ error: 'Failed to save tokens', details: saveResult.error }, { status: 500 });
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch token', details: error.message }, { status: 500 });
  }
}
