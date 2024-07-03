const express = require('express');
const router = express.Router();
const axios = require('axios');

const { filterApiResults } = require('../utils.js');

const API_KEY = process.env.GB_API_KEY;
const API_ROUTE = `https://www.giantbomb.com/api/games/?api_key=${API_KEY}&f` +
                  `ormat=json&resources=game&field_list=platforms,image,name` +
                  `,deck,original_release_date&sort=original_release_date:de` +
                  `sc&limit=10`;

router.get('/', async (req, res, next) => {
  try {
    const response = await axios.get(API_ROUTE);
    const results = filterApiResults(response.data.results);
    res.json(results);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: `Internal server error, ${error.message}` });
  }
});

module.exports = router;
