import { postMessage } from './postMessage';
import { authBot } from './authBot';
import moment from 'moment';
import env from 'node-env-file';
import exists from 'node-file-exists';

const bot = authBot();

const announceChannel = '#-general';
const outputChannel = '#temp-garbage-bot';
const timeoutSeconds = 10;

if (exists('./.env')) {
  env('./.env');
}

var channelID = process.env.slackChannelID || ''

const timeFormat = 'MMM Do YYYY';
const sayings = [
  ':dumpster: I am not dead yet folks... I got work to do :skull:',
  ':dumpster: Hey there, I am going to look for some channels to clean up. :dusty_stick: ',
  ':dumpster: How are you doing? I am hungry for some crusty channels... :cookie:',
  ':dumpster: I am sad... no one runs me very much. Time to burn some channels :fire:',
  ':dumpster: Miss me? I am bored... time to ⚡ some channels! Woooooooo',
  ':dumpster: It\'s been a while :smile: I am going to do some work for you :robot:',
];

let linkChannel = function(id, name) {
  return `<#${id}|${name}>`;
};

let archiveChannel = function(id, name) {
  return `<https://slack.com/api/channels.archive?channel=${id}|Archive ${name}>?`;
}

const rand = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const allDone = (badChannels) => {
  postMessage(bot, outputChannel, `:dumpster: Found ${badChannels} channels, have a nice day! :wave:`);
  clearTimeout(timeout);
  timeout = null;
}

let timeout = null;

bot.channels.list({exclude_archived: 1} , async function(err, info) {
   if (err) {
       console.log('Error:', err);
   } else {
      let badChannelCount = 0;
      var channel = {};

      console.log('announce in channel', announceChannel);
      console.log('output channel', outputChannel);

      await postMessage(bot, announceChannel, sayings[rand(0, sayings.length - 1)]);
      await postMessage(bot, announceChannel, `join ${linkChannel(channelID, 'temp-garbage-bot')} to see the results!`);

      var date = new Date();
      date.setMonth(date.getMonth() - 3);
      var archiveDate = date.getTime();
      const channelHistoryHandler = async channel => {
        return async function(err, data) {
          let lastDate = new Date(data.messages[0].ts * 1000);
          if (lastDate.getTime() < archiveDate) {
            let strDate = moment(lastDate).format(timeFormat);
            let otherDate = moment(lastDate, "YYYYMMDD").fromNow();
            let text = `${linkChannel(channel.id, channel.name)} last message was on _${strDate}_, *${otherDate}*`;
            await postMessage(bot, outputChannel, text);
            badChannelCount++;
            clearTimeout(timeout);
            timeout = setTimeout(() => allDone(badChannelCount), timeoutSeconds * 1000);
          }
        }
      };
      await postMessage(bot, outputChannel, ':dumpster: Processing channels, please wait...');
      for(var i in info.channels) {
        channel = info.channels[i];
        if (channel.num_members * 1 < 2) {
          var text = linkChannel(channel.id, channel.name) + ' has ' + channel.num_members + ' members ';
          await postMessage(bot, outputChannel,  text);
          badChannelCount++;
        }
        await bot.channels.history(channel.id, {count: 1}, await channelHistoryHandler(channel));
      }
   }
});
