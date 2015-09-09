'use strict';

const request = require('request');
const base64 = require('node-base64-image');
const createTweet = require('./createTweet');
const postTweet = require( './postTweet');
const config = require('./config');

let requestCounter = 0;

findABuddy();

function findABuddy() {
  const petFinderKey = config.petfinder_key;
  const offset = Math.round(Math.random() * 1999);
  const url = `http://api.petfinder.com/pet.find?key=${petFinderKey}&animal=dog&location=new%20york%20ny&count=1&offset=${offset}&output=full&format=json`;

  request(url, (error, response, body) => {
    requestCounter++;

    if (!error && response.statusCode == 200) {
      const parsedData = JSON.parse(body);
      const dogData = parsedData.petfinder.pets.pet;
      const buddyTweet = createTweet(dogData);

      if (buddyTweet.img) {
        base64.base64encoder(buddyTweet.img, { string: true }, (error, buddyImg) => {
          if (!error) {
            postTweet.image(buddyTweet.text, buddyImg);
          }
          else {
            console.log('Error encoding image: ' + JSON.stringify(error));
          }
        });
      }
      else {
        postTweet.text(buddyTweet.text);
      }
    }
    else {
      console.log('Error getting dog data: ' + JSON.stringify(error));

      if (requestCounter < 3) {
        console.log('Attempt #' + (requestCounter + 1));
        findABuddy();
      }
    }
  });
}
