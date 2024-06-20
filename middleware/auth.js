"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const JWT = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate (login) user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
    const authHeader = req.headers?.authorization;
    if (authHeader) {
        const token = authHeader.replace(/^[Bb]earer /, "").trim();

        try {
            res.locals.user = JWT.verify(token, SECRET_KEY);
        } catch (err) {
            /* ignore invalid tokens (but don't store user!) */
        }
    }
    return next();
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
    if (res.locals.user?.username) return next();
    throw new UnauthorizedError();
}


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
    if (res.locals.user?.username && res.locals.user?.isAdmin === true) {
        return next();
    }
    throw new UnauthorizedError();

}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUserOrAdmin(req, res, next) {
    const user = res.locals.user;
    const username = res.locals.user?.username;

    console.log('USER', user, '\nUSERNAME', username, '\n PARAMS USERNAME', req.params.username);
    if (username && (username === req.params.username || user.isAdmin === true)) {
        return next();
    }

    throw new UnauthorizedError('Not Correct User or Admin.');
}


module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin,
};