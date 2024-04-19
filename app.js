"use strict";
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

// const jsonschema = require("jsonschema");
// const schemaName = require("../schemas/schemaName.json");

const express = require("express");
// const morgan = require("morgan");

const { NotFoundError } = require("./expressError");
// const { authenticateJWT } = require("./middleware/auth");

const gameRoutes = require("./routes/games");
const apiRoutes = require("./routes/api");

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/games", gameRoutes);
app.use("/api", cors(), apiRoutes);

// app.use(authenticateJWT);
// app.use(morgan('dev'));

// ... ROUTES ...

app.use(function (req, res) { throw new NotFoundError(); });

app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const message = err.message;
    if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
    return res.status(status).json({ error: { message, status } });
});

module.exports = app;