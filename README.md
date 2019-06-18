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
One of my first projects, Find-A-Buddy is a Twitter bot that uses the PetFinder API to tweet listings of adoptable dogs in a given geographic area. To create your own Find-A-Buddy Twitter bot, all you need is your own [Petfinder API key](https://www.petfinder.com/developers/api-key), your own [Twitter app auth credentials](https://apps.twitter.com/), and a host ([Find-A-Buddy NYC](https://twitter.com/findabuddynyc) uses [Heroku](http://www.heroku.com)).

Find-A-Buddy expects the following environment variables to be set:

* `CONSUMER_KEY`: Twitter consumer API key
* `CONSUMER_SECRET`: Twitter consumer API secret key
* `TOKEN_KEY`: Twitter access token
* `TOKEN_SECRET`: Twitter access token secret
* `PETFINDER_KEY`: Petfinder API key (secret key is not needed)
* `LOCATION`: location to search (can either be the in the format of city, state - i.e. 'New York, NY' - or a ZIP code)


Lastly, you'll need to find something that runs the script at a regular interval. I used the Heroku Scheduler add-on, which runs a node command (`npm start` in this case) at whatever interval you specify. Do be careful with this - Twitter has guidelines about what they think consitutes spam. Learn more about these guidelines [here](https://dev.twitter.com/overview/terms/policy).

This project is dedicated to [Henri](https://www.instagram.com/henrisnuggles/), who reminds you to please adopt instead of buying!
