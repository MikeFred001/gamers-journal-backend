const express = require("express");

const Game = require("../models/game");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

// ROUTERS

router.get("/", async function (req, res, next) {
  const games = await Game.findAll();

  return res.json({ games });
});

router.post("/", async function(req, res, next) {
  const game = await Game.create(req.body);

  return res.json({ game });
});

module.exports = router;