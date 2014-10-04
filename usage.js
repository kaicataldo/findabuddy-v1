var twitter_update_with_media = require('./twitter_update_with_media');
 
var tuwm = new twitter_update_with_media({
  consumer_key: 'cXepHhzKviY0EN4lUYS9gVp2Z',
  consumer_secret: 'Hm21dp9xQrCo7JfJ1kHvQT8v1yFQO2eZpbxU0geTjbQzAhWpOD',
  token: '2789586862-sIVGU2GNXyRlwBOByLKTvgHZXeLA8SqbHGC2mbt',
  token_secret: '8essmESqBGAZyrLmA502uIR9JuRLcgktLrbsbECI5Pq2f',
});
 
tuwm.post('This is a test', 'http://www.metrodogstop.com/cms/wp-content/uploads/2013/05/cute-dog.jpg', function(err, response) {
  if (err) {
    console.log(err);
  }
  console.log(response);
});