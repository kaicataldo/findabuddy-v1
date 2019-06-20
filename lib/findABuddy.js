'use strict';

const request = require('request');
const base64 = require('node-base64-image');
const generateTweet = require('./generateTweet');
const TwitterClient = require('./TwitterClient');
const config = require('./config');

const MAX_REQUESTS = 3;
let requestCounter = 1;

function generateURL(petfinderKey, location) {
  const encodedLoc = encodeURIComponent(location);
  // Pick a listing at random
  const offset = Math.round(Math.random() * 1999);
  return `http://api.petfinder.com/pet.find?key=${petfinderKey}&animal=dog&location=${encodedLoc}&count=1&offset=${offset}&output=full&format=json`;
}

(function findABuddy() {
  const { PETFINDER_KEY, LOCATION } = config;
  const url = generateURL(PETFINDER_KEY, LOCATION);

  request({ url, timeout: 1000 }, (error, response, body) => {
    function handleError(error) {
      console.error(JSON.stringify(error));

      if (requestCounter < MAX_REQUESTS) {
        requestCounter++;
        console.error(`Failed. Beginning attempt #${requestCounter}...`);
        return findABuddy();
      }

      throw error;
    }

    try {
      if (error) {
        throw error;
      }

      // The Petfinder API returns a body of HTML with
      // HTTP status code of 200 when authentication fails.
      let parsedData;
      try {
        parsedData = JSON.parse(body);
      } catch (e) {
        throw new Error('Error accessing Petfinder API');
      }

      const dogData = parsedData.petfinder.pets.pet;
      const twitter = new TwitterClient(config);
      const { text, img } = generateTweet(dogData);

      if (img) {
        base64.encode(img, { string: true }, (error, encodedImg) => {
          if (error) {
            handleError(error);
          }

          twitter.postTweet({ text, img: encodedImg }, error => {
            handleError(error);
          });
        });
      } else {
        twitter.postTweet({ text }, error => {
          handleError(error);
        });
      }
    } catch (e) {
      handleError(e);
    }
  });
})();
