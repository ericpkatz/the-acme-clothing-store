const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_clothing_db');

module.exports = client;
