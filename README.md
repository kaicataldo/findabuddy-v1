Find-A-Buddy NYC
==========



This app finds dogs in the NYC area, but could very easily be implemented in another city. To create your own Find-A-Buddy Twitter Bot, all you need is your own Petfinder API key, your own Twitter app auth credentials, and then to host the bot somewhere (I used Heroku).

To plug the keys into your bot, create a file called config.js in the root directory (same directory as findabuddybot.js), and store your own keys in this format:

     module.exports = {
          consumer_key: ' ',
       consumer_secret: ' ',
                 token: ' ',
          token_secret: ' ',
         petfinder_key: ' '
     };

To change the geographic region the app searches simply replace the location parameter (in this case, new%20york%20ny, but I believe it also accepts ZIP codes!) with another location in the Petfinder url in findabuddybot.js:

var url = 'http://api.petfinder.com/pet.find?key=' + petFinderKey + '&animal=dog&location=***new%20york%20ny***&count=1&offset=' + offset + '&output=full&format=json';

Lastly, you'll need to find something that runs the script at a regular interval. I used the Heroku Scheduler add-on, which runs a node command at whatever interval you specify. Do be careful with this - Twitter has very specific guidelines as to what consitutes spam! Learn more about these guidelines <a href="https://dev.twitter.com/overview/terms/policy">here</a>.)

Thanks for your interest!
    
          ,:'/  _ ..._
         // ( `""-.._.'
         \| /    6\___  
         |     6      4      
         |            /
         \_       .--'       ASCII Art Gallery
         (_'---'`)           http://www.ascii-art.com
    jgs / `'---`()
