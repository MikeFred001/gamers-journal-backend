const { PLACEHOLDER_IMAGE } = require("./constants.js");

/**
 * Filters the results from the Giant Bomb API to only include the necessary data.
 * Also adds a unique id to each result.
 *
 * input: [
 *  { deck,
 *    image: { icon_url, ... },
 *    platforms: { platform, ... },
 *    release_date,
 *    name }
 * ]
 *
 * output: [ { id, description, image, name, platforms, releaseDate } ]
 */
function filterApiResults(results) {
  const filteredResults = [];
  let id = 0;

  for (let result of results) {
    const name = result.name;
    const description = result.deck;
    const releaseDate = result.original_release_date
        ? result.original_release_date
        : null;
    const platforms = result.platforms?.map(platformData => platformData.name) || [];
    const image = "image" in result
        ? result.image.original_url
        : PLACEHOLDER_IMAGE;

    filteredResults.push({ id, description, image, name, platforms, releaseDate });
    id++;
  }

  return filteredResults;
}

module.exports = { filterApiResults };