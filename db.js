"use strict";

/** Database setup for BizTime. */

const { Client } = require("pg");

const DB_URI = "postgresql:///gamers_journal";  // Change this to the right name

let db = new Client({ connectionString: DB_URI });

db.connect();

// MAIN

module.exports = db;