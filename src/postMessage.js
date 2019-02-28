import { WebClient } from '@slack/client';
import env from 'node-env-file';
import exists from 'node-file-exists';

const postMessage = (bot, channel, msg, opts = {}) => {
  opts.as_user = true;
   bot.chat.postMessage(channel, msg, opts, function(err, res) {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Message sent!', res);
    }
  });
};

export { postMessage };
