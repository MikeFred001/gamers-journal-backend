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


//--CREATE JSON WEB TOKEN-----------------------------------------------------//


const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");


/** Return signed JWT from user data. */
function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}

//--SQLFORPARTIALUPDATE-------------------------------------------------------//


// TODO: I don't care if my instructors wrote this, I hate it and I'm going to
// implement a better solution at some point.
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const columns = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: columns.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { filterApiResults, createToken, sqlForPartialUpdate };
