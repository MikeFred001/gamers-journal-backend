"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class Game {
    static async findAll(username) {
        const usernameCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1;`,[username]);

        if (!usernameCheck.rows[0]) {
            throw new BadRequestError(`No such user: ${username}`);
        }

        const gamesRes = await db.query(`
            SELECT title,
                   description,
                   release_date,
                   preferred_system,
                   date_added,
                   note
            FROM games
            WHERE username = $1
            ORDER BY date_added;`, [username]
        );

        const games = gamesRes.rows;
        return games;
    }


    static async create(data) {
        const duplicateCheck = await db.query(`
            SELECT id
            FROM games
            WHERE title = $1;`, [data.title]);

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${data.username}`);
        }

        const result = await db.query(`
            INSERT INTO games (username,
                               title,
                               description,
                               release_date,
                               preferred_system,
                               date_added,
                               note)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)
            RETURNING username,
                      title,
                      release_date,
                      preferred_system,
                      date_added,
                      note;`,
            [data.username,
             data.title,
             data.description,
             data.releaseDate,
             data.preferredSystem,
             data.note]
        );

        const game = result.rows[0];
        return game;
    }


    static async remove(id) {
        const result = await db.query(`
            DELETE
            FROM games
            WHERE title = $1
            RETURNING title;`, [id]
        );

        const game = result.rows[0];
        if (!game) throw new NotFoundError(`No game under ID: ${id}`);
        return game;
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
//   release_date DATE, --yyyy-mm-dd
//   preferred_system VARCHAR(20),
//   date_added TIMESTAMP WITH TIME ZONE NOT NULL,
//   note TEXT
// );