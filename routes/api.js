const express = require('express');
const cors = require('cors');
const router = express.Router();
const axios = require('axios');

// CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from example.com
  methods: 'GET',                  // Allow GET requests
  allowedHeaders: 'Content-Type',  // Allow Content-Type header
};

const API_KEY = "f6e5b9785044d3d47cec1ea6429fcd05d3c08b52";
const GAMES_API = `https://www.giantbomb.com/api/search/?api_key=${API_KEY}&` +
                  `format=json&query="{{ searchTerm }}"&resources=game&field` +
                  `_list=platforms,image,name,deck,original_release_date`;

const placeholderImage = "https://www.reddit.com/media?url=https%3A%2F%2Fpre" +
                         "view.redd.it%2Fgro3eit0s1k41.png%3Fauto%3Dwebp%26s" +
                         "%3D3cc31279a43359fc4874a2e3c71f736c3633cfc7";


router.get('/games', cors({ ...corsOptions, headers: {
    'Content-Type': 'application/json'
  }
}), async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm;
    const url = GAMES_API.replace(`{{ searchTerm }}`, searchTerm);
    const response = await axios.get(url);
    const results = filterApiResults(response.data.results);

    console.log("RESULTS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", results);

    res.json(results);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


function filterApiResults(results) {
  const filteredResults = [];

  for (let result of results) {
    const name = result.name;
    const description = result.deck;
    const releaseDate = result.original_release_date || "Unknown";
    const platforms = result.platforms?.map(platformData => platformData.name) || [];
    const image = "image" in result
      ? result.image.original_url
      : placeholderImage;

    filteredResults.push({ description, image, name, platforms, releaseDate });
  }

  return filteredResults.sort(sortByReleaseDate);
}

function sortByReleaseDate(a, b) {
  // Convert releaseDate strings to Date objects for comparison
  const dateA = new Date(a.releaseDate);
  const dateB = new Date(b.releaseDate);

  // Compare dates and return the result
  if (dateA > dateB) return -1; // dateA comes before dateB (most recent first)
  if (dateA < dateB) return 1; // dateA comes after dateB
  return 0; // dates are equal
};

 /*

{
  "results": [
    {
      "deck": "description",
      "image": { "icon_url": "https://www.url.com ", ..." },
      "name": "Prince of Persia",
      "original_release_date": "2008-12-02",
      "platforms": [ { url1, id, name, url2, abbreviation }, ...],
      "resource_type": "game"
    },
    { deck, image, name, original_release_date, platforms, resource_type }, ...
  ]
}


  FILTERED RESPONSE:

  { results: [{
      "name": "Prince of Persia",
      "description": "Brief description of game.",
      "image": "https://www.url.com",
      "original_release_date": "2008-12-02",
      "platforms": [
        "Mac",
        "Xbox 360",
        "PlayStation 3"
      ],
    }, { description, image, name, releaseDate, platforms }, ... ]


 "results": [
  {
    "deck": "Brief description of game.",

    "image": {
      "icon_url": "https://www.url.com",
      "medium_url": "https://www.url.com",
      "screen_url": "https://www.url.com",
      "screen_large_url": "https://www.url.com",
      "small_url": "https://www.url.com",
      "super_url": "https://www.url.com",
      "thumb_url": "https://www.url.com",
      "tiny_url": "https://www.url.com",
      "original_url": "https://www.url.com",
      "image_tags": "All Images, Box Art"
    },

    "name": "Prince of Persia",

    "original_release_date": "2008-12-02",

    "platforms": [
      {
        "api_detail_url": "https://www.url.com",
        "id": 17,
        "name": "Mac",
        "site_detail_url": "https://www.url.com",
        "abbreviation": "MAC"
      },
      {
        "api_detail_url": "https://www.url.com",
        "id": 20,
        "name": "Xbox 360",
        "site_detail_url": "https://www.url.com",
        "abbreviation": "X360"
      },
      {
        "api_detail_url": "https://www.url.com",
        "id": 35,
        "name": "PlayStation 3",
        "site_detail_url": "https://www.url.com",
        "abbreviation": "PS3"
      },
      {
        "api_detail_url": "https://www.url.com",
        "id": 86,
        "name": "Xbox 360 Games Store",
        "site_detail_url": "https://www.url.com",
        "abbreviation": "XBGS"
      },
      {
        "api_detail_url": "https://www.url.com",
        "id": 88,
        "name": "PlayStation Network (PS3)",
        "site_detail_url": "https://www.url.com",
        "abbreviation": "PS3N"
      },
      {
        "api_detail_url": "https://www.url.com",
        "id": 94,
        "name": "PC",
        "site_detail_url": "https://www.url.com",
        "abbreviation": "PC"
      }
    ],

    "resource_type": "game"
  },
 */