const express = require('express');
const cors = require('cors');
const router = express.Router();
const axios = require('axios');

const { filterApiResults } = require('../utils.js');

const API_KEY = process.env.GB_API_KEY;
const GAMES_API = `https://www.giantbomb.com/api/search/?api_key=${API_KEY}&` +
                  `format=json&query="{{ searchTerm }}"&resources=game&field` +
                  `_list=platforms,image,name,deck,original_release_date`;

// CORS options
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET',
  allowedHeaders: 'Content-Type',
};


/**
 * GET /api/games
 * Route for retrieving games data from the Giant Bomb API based on search query.
 *
 * Input JSON: { searchTerm: "search term" }
 * Output JSON: [ { id, description, image, name, platforms, releaseDate }, {}... ]
 */
router.get('/games', cors({ ...corsOptions, headers: {
    'Content-Type': 'application/json'
  }
}), async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm;
    const url = GAMES_API.replace(`{{ searchTerm }}`, searchTerm);
    const response = await axios.get(url);
    const results = filterApiResults(response.data.results);
    res.json(results);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: `Internal server error, ${response.data.error}` });
  }
});

module.exports = router;