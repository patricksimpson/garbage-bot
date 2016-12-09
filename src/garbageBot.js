import { postMessage } from './postMessage'
import { authBot } from './authBot'

const bot = authBot();

let linkChannel = function(id, name) {
  return '<#' + id + '|' + name + '>';
};

let archiveChannel = function(id, name) {
  return '<https://slack.com/api/channels.archive?channel='+id+'|Archive '+name+'>?';
}

bot.channels.list({exclude_archived: 1} , function(err, info) {
   if (err) {
       console.log('Error:', err);
   } else {
      var badChannelCount = 0;
      var channel = {};
      var date = new Date();
      date.setMonth(date.getMonth() - 3);
      var archiveDate = date.getTime();
      var channelHistoryHandler = function(channel) {
        return function(err, data) {
          var lastDate = new Date(data.messages[0].ts * 1000);
          if (lastDate.getTime() < archiveDate) {
            var strDate = lastDate;
            var text = linkChannel(channel.id, channel.name) + ' last message was on ' + strDate;
            var opts = {
              "unfurl_links": true
            };
            postMessage(bot, '@patrick', text);
            badChannelCount++;
          }
        }
      };
      for(var i in info.channels) {
        channel = info.channels[i];
        if (channel.num_members * 1 < 2) {
          var text = linkChannel(channel.id, channel.name) + ' has ' + channel.num_members + ' members ';
          postMessage(bot, '@patrick',  text);
        }
        bot.channels.history(channel.id, {count: 1}, channelHistoryHandler(channel));
        badChannelCount++;
      }
      postMessage(bot, '@patrick', ':dumpster: Hey there, I am going to look for some channels to clean up.');
   }
});

