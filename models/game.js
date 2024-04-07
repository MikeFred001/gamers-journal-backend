"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class Game {
  static async findAll() {
    const gamesRes = await db.query(`
      SELECT title,
             edition,
             retail_price,
             release_date,
             preferred_system,
             store_link,
             date_added,
             note
      FROM games
      ORDER BY date_added
    `);

    const games = gamesRes.rows;

    return games;
  }




  static async create({ title,
                        edition,
                        retail_price,
                        release_date,
                        preferred_system,
                        store_link,
                        note }) {
      const result = await db.query(`
        INSERT INTO games (title,
                           edition,
                           retail_price,
                           release_date,
                           preferred_system,
                           store_link,
                           date_added,
                           note)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7)
        RETURNING title,
                  edition,
                  retail_price,
                  release_date,
                  preferred_system,
                  store_link,
                  note`, [
        title,
        edition,
        retail_price,
        release_date,
        preferred_system,
        store_link,
        note
    ]);

    return result.rows[0];
  }

}

module.exports = Game;


// CREATE TABLE users (
//   username VARCHAR(25) PRIMARY KEY,
//   password TEXT NOT NULL,
//   first_name TEXT NOT NULL,
//   last_name TEXT NOT NULL,
//   email TEXT NOT NULL CHECK (position('@' IN email) > 1),
//   is_admin BOOLEAN NOT NULL DEFAULT FALSE
// );

// CREATE TABLE games (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
//   title TEXT NOT NULL,
//   edition TEXT DEFAULT 'Standard',
//   retail_price NUMERIC(5, 2) CHECK (retail_price > 0),
//   release_date DATE, --yyyy-mm-dd
//   preferred_system VARCHAR(20),
//   store_link TEXT,
//   date_added TIMESTAMP WITH TIME ZONE NOT NULL,
//   note TEXT
// );