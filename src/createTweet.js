export default function(dogData) {
  const dogAttrs = setup(dogData);
  const [startPhrase, dogAttrsEnd] = beginningOfSentence(dogAttrs);
  const endPhrase = endOfSentence(dogAttrsEnd);

  return {
    text: startPhrase + endPhrase + ' ' + dogAttrs.petFinderUrl,
    img: dogAttrs.imgUrl
  };
}

function setup(dogData) {
  const dogAttrs = {
    oneDoggie: '',
    name: formatName(dogData.name.$t),
    sex: whichSex(dogData.sex.$t),
    breed: pickBreed(dogData.breeds.breed),
    petFinderUrl: link(dogData.id.$t),
    imgUrl: pickImg(dogData.media.photos.photo)
  };
  dogAttrs.mix = whichMix(dogData.mix.$t, dogAttrs.breed);

  return dogAttrs;
}

function beginningOfSentence(dogAttrs) {
  const { name, sex, breed, mix } = dogAttrs;
  let startPhrase = '';

  if (name.indexOf('&') > -1 || name.indexOf(' and ') > -1) {
    if (name.indexOf('-') > -1 || name.indexOf('~') > -1 || name.indexOf('(') > -1 && name.indexOf(')') > -1) {
      dogAttrs.oneDoggie = true;
      startPhrase = name + ' is a ' + sex + ' ' + breed + mix;
    }
    else {
      dogAttrs.oneDoggie = false;
      startPhrase = name + ' are doggies';
    }
  }
  else {
    dogAttrs.oneDoggie = true;
    startPhrase = name + ' is a ' + sex + ' ' + breed + mix;
  }

  return [startPhrase, dogAttrs];
}

function endOfSentence({ oneDoggie }) {
  let phrases = [];
  let endPhrase = '';

  if (oneDoggie) {
    phrases = [' who needs a loving home!', ' looking for a new family!', ' looking for a furever home!', ' who needs a new best friend!', ' who needs a place to call home!', ' looking for a forever home!', ' who wants to be your buddy!', ' looking for a loving family!', ' in need of love!', ' in need of a loving home!', ' looking for a new home!', ' who needs some lovin\'!', ' who could be your new buddy!'];
  }
  else {
    phrases = [' who need a loving home!', ' looking for a new family!', ' looking for a furever home!', ' who need a new best friend!', ' who need a place to call home!', ' looking for a forever home!', ' who want to be your buddies!', ' looking for a loving family!', ' in need of love!', ' in need of a loving home!', ' looking for a new home!', ' who need some lovin\'!', ' who could be your new buddies!'];
  }

  endPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  return endPhrase;
}

function pickImg(photos) {
  for (let photo of photos) {
    if (photo['@size'] === 'x') {
      return photo.$t;
    }
  }

  return false; // return false if no large image found
}

function formatName(petName) {
  petName = petName.replace(/{.*?}|\[.*?\]|<.*?>|\(.*?\)/g, '');

  if (petName.match(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|zzz|[0-9]|#/gi) !== null) {
    petName = petName.replace(/zzcourtesy|zzzcourtesy|zz courtesy|zzz courtesy|coutesy|courtesy|listing|posting|post|zzz|[0-9]|#/gi, '');

    if (petName.match(/\/|[(]|[)]|[\[\]]|-|–|—|[*]/gi) !== null) {
      petName = petName.replace(/dob |\/|[(]|[)]|[\[\]]|-|–|—|[*]/gi, '');
    }
  }

  petName = petName.replace(/\s{2,}/g, ' ');
  petName = petName.trim();
  return petName;
}

function pickBreed(breed) {
  let singleBreed = true;
  let breedString = '';

  if (breed.length > 1) {
    singleBreed = false;

    for (let i = 0; i < breed.length; i++) {
      if (i === breed.length - 1) {
        breedString += breed[i].$t;
      }
      else {
        breedString += breed[i].$t + '/';
      }
    }
  }

  if (singleBreed) {
    breedString = breed.$t ? breed.$t : 'doggie';
  }

  return breedString;
}

function link(idNumber) {
  return `http://www.petfinder.com/petdetail/${idNumber}`;
}

function whichSex(sex) {
  if (sex === 'F') {
    return 'female';
  }
  else {
    return 'male';
  }
}

function whichMix(isMix, breed) {
  if (isMix === 'yes' && breed !== 'doggie') {
    return ' mix';
  }
  else {
    return '';
  }
}
