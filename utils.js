const { PLACEHOLDER_IMAGE } = require("./constants.js");

/**
 * Filters the results from the Giant Bomb API to only include the necessary data.
 * Also adds a unique id to each result.
 *
 * input: [
 *  { deck,
 *    image: { icon_url, ... },
 *    platforms: [ { name, ... }, ... ],
 *    release_date,
 *    name }
 * ]
 *
 * output: [ { id, description, image, name, platforms, releaseDate }, ... ]
 */
function filterApiResults(results) {
  const filteredResults = [];
  let id = 0;

  for (let result of results) {
    const title = result.name;
    const description = result.deck;
    const releaseDate = result.original_release_date
      ? result.original_release_date
      : null;
    const platforms = result.platforms?.map(platformData => platformData.name) || [];
    const imageUrl = "image" in result
      ? result.image.original_url
      : PLACEHOLDER_IMAGE;

    filteredResults.push({ id, description, imageUrl, title, platforms, releaseDate });
    id++;
  }

  return filteredResults;
}


//--CREATE JSON WEB TOKEN-----------------------------------------------------//

const JWT = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");


/** Return signed JWT from user data. */
function createToken(user) {
  console.assert(user.isAdmin !== undefined,
    "createToken passed user without isAdmin property");

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  return JWT.sign(payload, SECRET_KEY);
}


//--SQL FOR PARTIAL UPDATE----------------------------------------------------//

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


//--NORMALIZE FORM DATA-------------------------------------------------------//

// TODO: This function is currently used for user registration only, may need to
// update it to handle multiple forms. If not, make function name more specific.

// Normalizes form data, trimming whitespace and handling capitalization.
function normalizeFormData(data) {
  const username  = data.username.trim().toLowerCase();
  const password  = data.password.trim();
  const firstName = capitalize(data.firstName);
  const lastName  = capitalize(data.lastName);
  const email     = data.email.trim().toLowerCase();

  return { username, password, firstName, lastName, email };
}


//--CAPITALIZE----------------------------------------------------------------//

// Capitalizes the first letter of a string while lower-casing the rest of the
// string. Ignores leading white space.

// "  heLLo" >>> "  Hello"
function capitalize(str) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const trimmed = str.trim();
  if ( !alphabet.includes(trimmed[0].toLowerCase()) ) {
    throw new Error("capitalize() function error: First character is not a letter.");
  }

  return trimmed[0].toUpperCase() + trimmed.slice(1).toLowerCase();
}


//--CONVERT KEYS TO CAMEL CASE------------------------------------------------//

function toCamelCase(snakeStr) {
  return snakeStr.replace(/(_\w)/g, match => match[1].toUpperCase());
}

function convertKeysToCamelCase(obj) {
  const camelObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = toCamelCase(key);

      camelObj[camelKey] = obj[key];

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        const nestedObj = convertKeysToCamelCase(obj[key]);
        camelObj[camelKey] = nestedObj;
      }
    }
  }
  return camelObj;
}



module.exports = {
  convertKeysToCamelCase,
  sqlForPartialUpdate,
  normalizeFormData,
  filterApiResults,
  createToken,
  capitalize,
  toCamelCase
};
