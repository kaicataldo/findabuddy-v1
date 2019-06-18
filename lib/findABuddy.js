'use strict';

const request = require('request');
const base64 = require('node-base64-image');
const createTweet = require('./createTweet');
const TwitterClient = require('./TwitterClient');
const config = require('./config');

let requestCounter = 0;

(function findABuddy() {
  const { PETFINDER_KEY, LOCATION } = config;
  const location = encodeURIComponent(LOCATION);
  const offset = Math.round(Math.random() * 1999);
  const url = `http://api.petfinder.com/pet.find?key=${PETFINDER_KEY}&animal=dog&location=${location}&count=1&offset=${offset}&output=full&format=json`;

  request(url, (error, response, body) => {
    requestCounter++;

    if (!error && response.statusCode === 200) {
      const parsedData = JSON.parse(body);
      const dogData = parsedData.petfinder.pets.pet;
      const buddyTweet = createTweet(dogData);
      const twitter = new TwitterClient(config);

      if (buddyTweet.img) {
        base64.encode(buddyTweet.img, { string: true }, (error, buddyImg) => {
          if (!error) {
            twitter.tweetImage(buddyTweet.text, buddyImg);
          } else {
            console.error('Error encoding image: ' + JSON.stringify(error));
          }
        });
      } else {
        twitter.tweetText(buddyTweet.text);
      }
    } else {
      console.error('Error getting dog data: ' + JSON.stringify(error));
      if (requestCounter < 3) {
        console.error('Attempt #' + (requestCounter + 1));
        findABuddy();
      }
    }
  });
})();
