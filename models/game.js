"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");


class Game {
    static async findAll(username) {
        const usernameCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1;`, [username]
        );

        if (!usernameCheck.rows[0]) {
            throw new BadRequestError(`No such user: ${username}`);
        }

        const gamesRes = await db.query(`
            SELECT id,
                   title,
                   description,
                   image_url,
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
            SELECT title
            FROM games
            WHERE title = $1 AND username = $2;`,
            [data.title, data.username]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Game already saved: ${data.title}`);
        }

        const result = await db.query(`
            INSERT INTO games (username,
                               title,
                               description,
                               image_url,
                               release_date,
                               preferred_system,
                               note,
                               date_added)
            VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
            RETURNING id,
                      username,
                      title,
                      description,
                      release_date,
                      preferred_system,
                      note;`,
            [data.username,
            data.title,
            data.description,
            data.imageUrl,
            data.releaseDate,
            data.preferredSystem,
            data.note]
        );

        const game = result.rows[0];
        return game;
    }

    // TODO: Update method to only touch fields that are passed in. Could use
    // a lot of polishing.
    static async update(data) {
        const result = await db.query(`
            UPDATE games
            SET preferred_system = $1, note = $2
            WHERE id = $3
            RETURNING id,
                      title,
                      release_date,
                      preferred_system,
                      note;`,
            [data.preferredSystem, data.note, data.id]
        );

        const game = result.rows[0];
        if (!game) throw new NotFoundError(`No game under ID: ${data.id}`);
        return game;
    }


    static async remove(id) {
        const result = await db.query(`
            DELETE
            FROM games
            WHERE id = $1
            RETURNING id, title;`, [id]
        );

        const game = result.rows[0];
        if (!game) throw new NotFoundError(`No game under ID: ${id}`);
        return { game, deleted: true };
    }
}

module.exports = Game;