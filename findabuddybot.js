var request = require('request'),
    twitter_update_with_media = require('./twitter_update_with_media');
 
var tuwm = new twitter_update_with_media({
  consumer_key: 'cXepHhzKviY0EN4lUYS9gVp2Z',
  consumer_secret: 'Hm21dp9xQrCo7JfJ1kHvQT8v1yFQO2eZpbxU0geTjbQzAhWpOD',
  token: '2789586862-sIVGU2GNXyRlwBOByLKTvgHZXeLA8SqbHGC2mbt',
  token_secret: '8essmESqBGAZyrLmA502uIR9JuRLcgktLrbsbECI5Pq2f',
});

var offset;
var dogData;
var name;
var sex;
var breed;
var mix;
var picArray;
var picture;
var id;
var startPhrase;
var endPhrase;
var buddyTweet;

var getRequest = function() {
  randomizer();
  var url = 'http://api.petfinder.com/pet.find?key=a6c914ff39bbb7d1cc3c0ead2efa3494&animal=dog&location=new%20york%20ny&count=1&offset=' + offset + '&output=full&format=json';

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parsedData = JSON.parse(body);
      dogData = parsedData.petfinder.pets.pet;
      picArray = dogData.media.photos.photo;
      
      name = dogData.name.$t;
      sex = sex(dogData.sex.$t);
      breed = dogData.breeds.breed.$t ? dogData.breeds.breed.$t : 'doggie';
      mix = mix(dogData.mix.$t);
      id = link(dogData.id.$t);
      startPhrase = name + " is a " + sex + " " + breed + mix;
      endPhrase = endOfSentence();
      buddyTweet = startPhrase + endPhrase + " - " + id;
      pickPic(picArray);
      console.log(picture);
      postTweet(buddyTweet, picture);
    }
    else {
      console.log('Error!');
    }
  });
};
 
var postTweet = function(tweetText, tweetPic) {
tuwm.post(tweetText, tweetPic, function(err, response) {
  if (err) {
    console.log(err);
  }
  console.log(response);
});
};

function pickPic(photos) {
  photo = 0;
  while ( photos[photo]['@size'] !== 'x' ) {
      photo++;
      if ( photo === photos.length ) { 
        getRequest();
      }
      picture = photos[photo].$t;
  }
}

function link(idNumber) {
 return "https://www.petfinder.com/petdetail/" + idNumber + "/";
}

function endOfSentence() {
  var phrases = [' who needs a loving home!', ' looking for a new family!', ' looking for a furever home!', ' who needs a new best friend!', ' who needs a place to call home!', ' looking for a forever home!', ' who wants to be your buddy!', ' looking for a loving family!', ' in need of love!', ' in need of a loving home!', ' looking for a new home!', ' who needs some lovin\'!', ' who could be your new buddy!'];
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

getRequest();