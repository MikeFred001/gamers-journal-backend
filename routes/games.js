const express = require("express");

const Game = require("../models/game");
const { BadRequestError } = require("../expressError");

const router = express.Router();

// ROUTERS

router.get("/:username", async function (req, res, next) {
  const games = await Game.findAll(req.params.username);
  return res.json({ games });
});

//Accepts JSON body:
// { username, title, description, releaseDate, preferredSystem, note }
router.post("/", async function (req, res, next) {
  const game = await Game.create(req.body);
  return res.json({ game });
});

router.delete("/:id", async function (req, res, next) {
  const game = await Game.remove(req.params.id);
  return res.json({ game });
});

module.exports = router;