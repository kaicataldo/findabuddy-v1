const Twitter = require('twitter');

module.exports = class TwitterClient {
  constructor({ CONSUMER_KEY, CONSUMER_SECRET, TOKEN_KEY, TOKEN_SECRET }) {
    this.client = new Twitter({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
      access_token_key: TOKEN_KEY,
      access_token_secret: TOKEN_SECRET
    });
  }

  tweetText(text) {
    this.client.post('statuses/update', { status: text }, (error, tweet, response) => {
      if (!error) {
        console.log(response);
      }
      else {
        console.error('Error posting tweet: ' + JSON.stringify(error));
      }
    });
  }

  tweetImage(text, image) {
    this.client.post('media/upload', { media_data: image }, (error, media, response) => {
      if (!error) {
        const status = {
          status: text,
          media_ids: media.media_id_string
        };

        this.client.post('statuses/update', status, (error, tweet, response) => {
          if (!error) {
            console.log(response);
          }
          else {
            console.error('Error posting tweet: ' + JSON.stringify(error));
          }
        });
      }
      else {
        console.error('Error uploading media: ' + JSON.stringify(error));
      }
    });
  }
};
