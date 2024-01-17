"use strict";
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

// const jsonschema = require("jsonschema");
// const schemaName = require("../schemas/schemaName.json");

// const routeFile = require("./routeFile");

const express = require("express");
const morgan = require("morgan");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");\

const app = express();

app.use(express.json());
app.use(express.urlencoded());
// app.use(authenticateJWT);
// app.use(morgan('dev'));
app.use('/baseEndpoint', routeImportVarName /* routeFile in this case */);

// ... ROUTES ...

app.use(function (req, res) { throw new NotFoundError(); });

app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const message = err.message;
    if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
    return res.status(status).json({ error: { message, status } });
});

module.exports = app;