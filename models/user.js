"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { sqlForPartialUpdate } = require("../utils.js");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(`
            SELECT username,
                password,
                first_name AS "firstName",
                last_name  AS "lastName",
                email,
                is_admin   AS "isAdmin"
            FROM users
            WHERE username = $1`, [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register(data) {
    const duplicateCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1`, [data.username],
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate username: ${data.username}`);
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    const result = await db.query(`
            INSERT INTO users (username,
                               password,
                               first_name,
                               last_name,
                               email,
                               is_admin)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                username,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"`,
      [data.username,
        hashedPassword,
      data.firstName,
      data.lastName,
      data.email,
      data.isAdmin]
    );

    const user = result.rows[0];
    delete user.password;
    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, firstName, lastName, email, isAdmin }, ...]
   **/

  static async findAll() {
    const result = await db.query(`
        SELECT username,
               first_name AS "firstName",
               last_name  AS "lastName",
               email,
               is_admin   AS "isAdmin"
        FROM users
        ORDER BY username`,
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, applications }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(`
        SELECT username,
               first_name AS "firstName",
               last_name  AS "lastName",
               email,
               is_admin   AS "isAdmin"
        FROM users
        WHERE username = $1`, [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    // TODO: Don't like this solution, need to come up with another one.
    const { setCols, values } = sqlForPartialUpdate(
      data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });
    const usernameVarIdx = `$${values.length + 1}`;

    const querySql = `
      UPDATE users
      SET ${setCols}
      WHERE username = ${usernameVarIdx}
      RETURNING
          username,
          first_name AS "firstName",
          last_name AS "lastName",
          email,
          is_admin AS "isAdmin";
    `;

    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    const result = await db.query(`
            DELETE
            FROM users
            WHERE username = $1;`,
      [username]
    );

    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}


module.exports = User;