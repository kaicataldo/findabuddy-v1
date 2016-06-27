import request from 'request';
import { base64encoder } from 'node-base64-image';
import createTweet from './createTweet';
import TwitterClient from './TwitterClient';
import config from '../config';

let requestCounter = 0;

(function findABuddy() {
  const { petfinder_key: key } = config;
  const location = encodeURIComponent(config.location);
  const offset = Math.round(Math.random() * 1999);
  const url = `http://api.petfinder.com/pet.find?key=${key}&animal=dog&location=${location}&count=1&offset=${offset}&output=full&format=json`;

  request(url, (error, response, body) => {
    requestCounter++;

    if (!error && response.statusCode === 200) {
      const parsedData = JSON.parse(body);
      const dogData = parsedData.petfinder.pets.pet;
      const buddyTweet = createTweet(dogData);
      const twitter = new TwitterClient(config);

      if (buddyTweet.img) {
        base64encoder(buddyTweet.img, { string: true }, (error, buddyImg) => {
          if (!error) {
            twitter.tweetImage(buddyTweet.text, buddyImg);
          }
          else {
            console.error('Error encoding image: ' + JSON.stringify(error));
          }
        });
      }
      else {
        twitter.tweetText(buddyTweet.text);
      }
    }
    else {
      console.error('Error getting dog data: ' + JSON.stringify(error));
      if (requestCounter < 3) {
        console.error('Attempt #' + (requestCounter + 1));
        findABuddy();
      }
    }
  });
})();
