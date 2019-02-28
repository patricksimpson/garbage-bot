import { postMessage } from './postMessage'
import { authBot } from './authBot'

var prompt = require('prompt');

const bot = authBot();

 //
  // Start the prompt
  //
  prompt.start();
 
  //
  // Get two properties from the user: username and email
  //
  prompt.get([{name: 'message'},{ name: 'channel', default: '#random'}], function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  message: ' + result.message);
    console.log('  channel: ' + result.channel);
    postMessage(bot, result.channel, result.message);
  });


