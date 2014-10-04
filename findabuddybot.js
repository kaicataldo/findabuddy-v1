var twitterAPI = require('node-twitter-api'),
    request = require('request');

var twitter = new twitterAPI({
    consumerKey: CONSUMERKEY,
    consumerSecret: CONSUMERSECRET,
    callback: 'http://localhost:8080'
});

var offset;
var dogData;
var name;
var sex;
var breed;
var mix;
var picture;
var id;
var startPhrase;
var endPhrase;
var buddyTweet;

randomizer();
var url = 'http://api.petfinder.com/pet.find?key=a6c914ff39bbb7d1cc3c0ead2efa3494&animal=dog&location=new%20york%20ny&count=1&offset=' + offset + '&output=full&format=json';

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    parsedData = JSON.parse(body);
    dogData = parsedData.petfinder.pets.pet;
    console.log(dogData);
    name = dogData.name.$t;
    sex = sex(dogData.sex.$t);
    breed = dogData.breeds.breed.$t ? dogData.breeds.breed.$t : 'doggie';
    mix = mix(dogData.mix.$t);
    id = link(dogData.id.$t);
    startPhrase = name + " is a " + sex + " " + breed + mix;
    endPhrase = endOfSentence();
    buddyTweet = startPhrase + endPhrase + " - " + id;
    postTweet();
  }
  else {
    console.log('Error!');
  }
});


function postTweet() {
  twitter.statuses("update", {
        media: [
          picture,
          stream
    ],
          status: buddyTweet
      },
      TOKEN,
      TOKENSECRET,
      function(error, data, response) {
          if (error) {
              console.log('Error!');
          } else {
              // data contains the data sent by twitter
          }
      }
  );
}

/*setInterval(function() {
  bot.tweet(dogTweet, function (err, reply) {
    if(err) return handleError(err);
  });
}, 3600000);*/

function pickPic() {

}

function link(idNumber) {
 return "https://www.petfinder.com/petdetail/" + idNumber + "/";
}

function endOfSentence() {
  var phrases = [' who needs a loving home!', ' looking for a new family!', ' looking for a furever home!', ' who needs a new best friend!', ' who needs a place to call home!', ' looking for a forever home!', ' who wants to be your buddy!', ' looking for a living family!', ' in need of love!', ' in need of a loving home!', ' looking for a new home!', ' who needs some lovin\'!', ' who could be your new buddy!'];
  endPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  return endPhrase;
}

function sex(whichSex) {
  if (whichSex === 'F') {
    return "female";
  }
  else if (whichSex === 'M') {
    return "male";
  }
}

function mix(isMix) {
  if (isMix === 'yes' && breed !== 'doggie') {
    return " mix";
  }
  else {
    return "";
  }
}

function randomizer() {
  offset = Math.round(Math.random() * 1999);
  console.log(offset);
}