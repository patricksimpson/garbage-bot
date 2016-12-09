import { WebClient } from '@slack/client';
import env from 'node-env-file';
import exists from 'node-file-exists';

if (exists('./.env')) {
  env('./.env');
}
const postMessage = (bot, channel, msg, opts = {}) => {
  opts.as_user = true;
  var channelID = process.env.slackChannelID || ''
   bot.chat.postMessage(channelID, msg, opts, function(err, res) {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Message sent!', res);
    }
  });
};

export { postMessage };
