const express = require('express');
const app = express();
const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_clothing_db');


app.get('/', (req, res)=> res.redirect('/products'));

app.get('/products', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT *
      FROM products
      ORDER BY name
    `;
    const response = await client.query(SQL); 
    const products = response.rows;
    res.send(`
      <html>
        <head>
          <title>Acme Clothing</title>
        </head>
        <body>
          <h1>The Acme Clothing Company</h1>
          <ul>
            ${
              products.map( product => {
                return `
                  <li>
                    <a href='/products/${product.id}'>
                      ${ product.name }
                    </a>
                  </li>`;
              }).join('')
            }
          </ul>
        </body>
      </html>
    `);

  }
  catch(ex){
    console.log(ex);
    next(ex);
  }
});

app.get('/products/:id', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT *
      FROM products
      WHERE id = $1
    `;
    const response = await client.query(SQL, [ req.params.id ]); 
    const product = response.rows[0];
    res.send(`
      <html>
        <head>
          <title>Acme Clothing</title>
        </head>
        <body>
          <h1>The Acme Clothing Company</h1>
          <h2><a href='/products'>${ product.name }</a></h2>
        </body>
      </html>
    `);

  }
  catch(ex){
    console.log(ex);
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
