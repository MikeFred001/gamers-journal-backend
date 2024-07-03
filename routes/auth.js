"use strict";

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { createToken, normalizeUserData } = require("../utils");
const { BadRequestError } = require("../expressError");

const jsonschema = require("jsonschema");
const userLoginSchema = require("../schemas/userLogin.json");
const userRegisterSchema = require("../schemas/userRegister.json");


//--ROUTERS-------------------------------------------------------------------//

/* POST /auth/login:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none */
router.post("/login", async function (req, res, next) {
    const validator = jsonschema.validate(
        req.body,
        userLoginSchema,
        { required: true }
    );

    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
});


// POST /auth/register:   { user } => { token }
//
//  user must include { username, password, firstName, lastName, email }
//
//  Returns JWT token which can be used to authenticate further requests.
//
//  Authorization required: none
router.post("/register", async function (req, res, next) {
  console.log(req.body);

    const validator = jsonschema.validate(
        req.body,
        userRegisterSchema,
        { required: true }
    );

    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
    }

    const normalizedData = normalizeUserData(req.body);
    const newUser = await User.register({ ...normalizedData, isAdmin: false });
    const token = createToken(newUser);

    return res.status(201).json({ token });
});

module.exports = router;