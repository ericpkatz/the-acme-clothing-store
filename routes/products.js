const express = require('express');
const app = express.Router();
const client = require('../db');

app.get('/', async(req, res, next)=> {
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
          <a href='/products/create'>Add a new product</a>
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

app.post('/', async(req, res, next)=> {
  try {
    const SQL = `
      INSERT INTO products(name) VALUES($1) RETURNING *;
    `;
    const response = await client.query(SQL, [ req.body.name ]);
    const product = response.rows[0];
    res.redirect(`/products/${product.id}`);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/create', (req, res)=> {
  console.log('here');
  res.send(`
    <html>
      <head>
        <title>The Acme Clothing Company</title>
      </head>
      <body>
        <h1><a href='/products'>The Acme Clothing Company</a></h1>
        <form method='POST' action='/products'>
          <input name='name' />
          <button>Create</button>
        </form>
      </body>
    </html>
  `);
});

app.get('/:id', async(req, res, next)=> {
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

module.exports = app;
