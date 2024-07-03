const express = require("express");

const Game = require("../models/Game");
const { BadRequestError } = require("../expressError");
const { ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");

const router = express.Router();

// ROUTERS

// Retrieves all wishlisted games for user based on username in URL.
// Returns JSON:
// { games: [ { id,
//              title,
//              imageUrl,
//              description,
//              releaseDate,
//              preferredSystem,
//              note }, ... ] }
router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    const games = await Game.findAll(req.params.username);
    return res.json({ games });
});


// Accepts JSON body:
//   { title, imageUrl, description, releaseDate, preferredSystem, note }
//     - username is taken from URL.
//
// Returns JSON:
//   { game: { id, username, title, description, releaseDate, preferredSystem, note } }
router.post("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    const username = req.params.username;
    const game = await Game.create({ username, ...req.body });
    return res.json({ game });
});


router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    const game = await Game.update({id: req.params.id, ...req.body });
    return res.json({ game });
});


// Accepts game id from URL.
// Returns undefined.
// Returns JSON: { game: { game }, deleted: true }
// TODO: Needs better authorization middleware.
router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
    const game = await Game.remove(req.params.id);
    return res.json(game);
});

module.exports = router;