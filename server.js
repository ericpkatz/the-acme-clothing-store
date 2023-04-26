const express = require('express');
const app = express();
const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_clothing_db');

app.get('/', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT *
      FROM products;
    `;
    const response = await client.query(SQL); 
    const products = response.rows;
    res.send(products);

  }
  catch(ex){
    next(ex);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, async()=> {
  try {
    console.log(`listening on port ${port}`);
    await client.connect();
    console.log('connected to database');
    const SEED = `
      DROP TABLE IF EXISTS products;
      CREATE TABLE products(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
      );
      INSERT INTO products(name) VALUES('foo');
      INSERT INTO products(name) VALUES('bar');
      INSERT INTO products(name) VALUES('bazz');
      INSERT INTO products(name) VALUES('quq');
    `;
    await client.query(SEED);
    console.log('seeded');
  }
  catch(ex){
    console.log(ex);
  }
});
