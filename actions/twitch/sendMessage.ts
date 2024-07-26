// ./actions/twitch/sendMessage.ts
import tmi from 'tmi.js';

export async function sendMessage(username: string, accessToken: string) {
  if (!username || !accessToken || !process.env.NEXT_PUBLIC_TWITCH_CHANNEL) return;

  try {
    const client = new tmi.Client({
      options: { debug: true },
      identity: {
        username: "ChatAid",
        password: 'oauth:' + accessToken
      },
      channels: [ process.env.NEXT_PUBLIC_TWITCH_CHANNEL ]
    });
    
    client.connect();

    // Respond to messages
    client.on('message', (channel, tags, message, self) => {
      // Ignore echoed messages.
      if(self) return;
    
      if(message.toLowerCase() === '!hello') {
        // "@alca, heya!"
        client.say(channel, `@${tags.username}, heya!`);
      }
    });

    // Send a message every 10 seconds
    setInterval(() => {
      const channel = process.env.NEXT_PUBLIC_TWITCH_CHANNEL;
      if (channel) client.say(channel, 'Reloj');
    }, 10000); // 10000 ms = 10 seconds

  } catch (error) {
    console.error('Error sending message:', error);
  }
}
