import env from 'node-env-file';
import exists from 'node-file-exists';

import { WebClient } from '@slack/client';

if (exists('./.env')) {
  env('./.env');
}

const authBot = () => {
  const bot_token = process.env.slackToken || '';
  return new WebClient(bot_token);
};

export { authBot };
