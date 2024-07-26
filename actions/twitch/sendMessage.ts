// ./actions/twitch/sendMessage.ts
import tmi from 'tmi.js';

export async function sendMessage(username: string, accessToken: string, message: string) {

  if (!username || !accessToken || !message || !process.env.NEXT_PUBLIC_TWITCH_CHANNEL) return;

  try {
    const client = new tmi.Client({
      options: { debug: true },
      identity: {
        username,
        password: `oauth:${accessToken}`
      },
      channels: [process.env.NEXT_PUBLIC_TWITCH_CHANNEL]
    });

    await client.connect();

    client.on('connected', (address, port) => {
      console.log(`Connected to ${address}:${port}`);
      client.say(process.env.NEXT_PUBLIC_TWITCH_CHANNEL ?? '', message)
        .then(() => {
          console.log(`Message sent: ${message}`);
        })
        .catch(err => {
          console.error('Error sending message:', err);
        });
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
  }
}
