import Twitter from 'twitter';
import config from './config';

const client = new Twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.token,
  access_token_secret: config.token_secret
});

export default {
  text(tweetText) {
    client.post('statuses/update', { status: tweetText }, (error, tweet, response) => {
      if (!error) {
        console.log('Success: ' + tweet.text);
      }
      else {
        console.log('Error posting tweet: ' + JSON.stringify(error));
      }
    });
  },

  image(tweetText, tweetImg) {
    client.post('media/upload', { media_data: tweetImg }, (error, media, response) => {
      if (!error) {
        const status = {
          status: tweetText,
          media_ids: media.media_id_string
        };

        client.post('statuses/update', status, (error, tweet, response) => {
          if (!error) {
            console.log(tweet.text);
          }
          else {
            console.log('Error posting tweet: ' + JSON.stringify(error));
          }
        });
      }
      else {
        console.log('Error uploading media: ' + JSON.stringify(error));
      }
    });
  }
};
