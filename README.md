Find-A-Buddy
==========

      ,:'/  _ ..._         ______ _           _          ____            _     _
     // ( `""-.._.'       |  ____(_)         | |   /\   |  _ \          | |   | |
     \| /    6\___        | |__   _ _ __   __| |  /  \  | |_) |_   _  __| | __| |_   _
     |     6      4       |  __| | | '_ \ / _` | / /\ \ |  _ <| | | |/ _` |/ _` | | | |
     |            /       | |    | | | | | (_| |/ ____ \| |_) | |_| | (_| | (_| | |_| |
     \_       .--'        |_|    |_|_| |_|\__,_/_/    \_\____/ \__,_|\__,_|\__,_|\__, |
     (_'---'`)                                                                    __/ |
                                                                                 |___/
One of my first projects, Find-A-Buddy is a Twitterbot that uses the PetFinder API to tweet listings of adoptable dogs in a given geographic area. To create your own Find-A-Buddy Twitterbot, all you need is your own <a href="https://www.petfinder.com/developers/api-key">Petfinder API key</a>, your own <a href="https://apps.twitter.com/">Twitter app auth credentials</a>, and a host (Find-A-Buddy NYC uses <a href="http://www.heroku.com">Heroku</a>).

A config.js file containing the aforementioned credentials as well as a location field (can either be the in the format of city, state - i.e. `'New York, NY'` or a zip code) is required in the root directory (same directory as findABuddyBot.js) in order to run the bot. This config file should look like this (with your respective values filled in):

    export default {
      consumer_key: string,
      consumer_secret: string,
      token: string,
      token_secret: string,
      petfinder_key: string,
      location: string
    };

Lastly, you'll need to find something that runs the script at a regular interval. I used the Heroku Scheduler add-on, which runs a node command (`npm start` in this case) at whatever interval you specify. Do be careful with this - Twitter has guidelines about what they think consitutes spam. Learn more about these guidelines <a href="https://dev.twitter.com/overview/terms/policy">here</a>.

This project is dedicated to Henri (<a href='https://twitter.com/henri_thoughtz'>@henri_thoughtz</a>), who reminds you to please adopt instead of buying!
