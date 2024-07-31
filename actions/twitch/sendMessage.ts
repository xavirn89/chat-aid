// ./actions/twitch/sendMessage.ts
import tmi from 'tmi.js';
import 'regenerator-runtime/runtime'

export async function sendMessage(username: string, twitchAccessToken: string) {
  if (!username || !twitchAccessToken || !process.env.NEXT_PUBLIC_TWITCH_CHANNEL) return;

  try {
    const client = new tmi.Client({
      options: { debug: true },
      identity: {
        username: "ChatAid",
        password: 'oauth:' + twitchAccessToken
      },
      channels: [ process.env.NEXT_PUBLIC_TWITCH_CHANNEL ]
    });
    
    client.connect();

    // Respond to messages
    client.on('message', (twitchChannel, tags, message, self) => {
      // Ignore echoed messages.
      if(self) return;
    
      if(message.toLowerCase() === '!hello') {
        // "@alca, heya!"
        client.say(twitchChannel, `@${tags.username}, heya!`);
      }
    });

    // Send a message every 10 seconds
    setInterval(() => {
      const twitchChannel = process.env.NEXT_PUBLIC_TWITCH_CHANNEL;
      if (twitchChannel) client.say(twitchChannel, 'Reloj');
    }, 10000); // 10000 ms = 10 seconds

  } catch (error) {
    console.error('Error sending message:', error);
  }
}
