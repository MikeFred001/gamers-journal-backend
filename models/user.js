"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class User {
    static async findAll() {
        const usersRes = await db.query(`
            SELECT username
            FROM users
            ORDER BY username
        `);
        const users = usersRes.rows;
        return users;
    }


    static async get(username) {
        const userRes = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1
        `, [username]);

        const user = userRes.rows[0];
        if (!user) throw new NotFoundError(`No such user: ${username}`);
        return user;
    }


    static async create({ username }) {
        const duplicateCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1
        `, [username]);

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const result = await db.query(`
            INSERT INTO users (username)
            VALUES ($1)
            RETURNING username
        `, [username]);

        const user = result.rows[0];
        return user;
    }


    static async remove(username) {
        const result = await db.query(`
            DELETE
            FROM users
            WHERE username = $1
            RETURNING username
        `, [username]);

        const user = result.rows[0];
        if (!user) throw new NotFoundError(`No such user: ${username}`);
        return user;
    }
}