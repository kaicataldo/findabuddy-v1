'use strict';

const request = require('request');
const base64 = require('node-base64-image');
const generateTweet = require('./generateTweet');
const TwitterClient = require('./TwitterClient');
const config = require('./config');

let requestCounter = 0;

function generateURL(petfinderKey, location) {
  const encodedLoc = encodeURIComponent(location);
  // Pick a listing at random
  const offset = Math.round(Math.random() * 1999);
  return `http://api.petfinder.com/pet.find?key=${petfinderKey}&animal=dog&location=${encodedLoc}&count=1&offset=${offset}&output=full&format=json`;
}

(function findABuddy() {
  const { PETFINDER_KEY, LOCATION } = config;
  const url = generateURL(PETFINDER_KEY, LOCATION);

  request(url, (error, response, body) => {
    requestCounter++;

    if (!error && response.statusCode === 200) {
      const parsedData = JSON.parse(body);
      const dogData = parsedData.petfinder.pets.pet;
      const tweet = generateTweet(dogData);
      const twitter = new TwitterClient(config);

      if (tweet.img) {
        base64.encode(tweet.img, { string: true }, (error, img) => {
          if (!error) {
            twitter.tweetImage(tweet.text, img);
          } else {
            console.error('Error encoding image: ' + JSON.stringify(error));
          }
        });
      } else {
        twitter.tweetText(tweet.text);
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
