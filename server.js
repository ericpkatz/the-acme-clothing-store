const express = require('express');
const app = express();
const client = require('./db');

app.use(express.urlencoded());

app.get('/', (req, res)=> res.redirect('/products'));

app.use('/products', require('./routes/products'));



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
