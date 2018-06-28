const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pg = require('pg');


// Initialise postgres client
const configs = {
  user: 'root',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', (req, res) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon'

  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('query error:', err.stack);
    } else {
      console.log('query result:', result);

      let pokeAll = {pokemon : result.rows}

      res.render('Home',pokeAll);

    }
  });

});

app.get('/pokemon/new',(req, res) => {

res.render('New');
})


app.get('/pokemon/:id', (req, res) => {
  let id = parseInt(req.params.id);
  //turn id into integer
  let queryString = 'SELECT * FROM pokemon WHERE id = $1';
  const val = [id];

  pool.query(queryString, val, (err,result) => {
    if (result.row[0]===undefined) {
      res.status(404).send('pokemon not in database');
    } else {
      let pokeGet = {pokemon:result.rows[0]}
      res.render('Edit',pokeGet)
    }
  })
});  




app.post('/pokemon', (req, response) => {
  let params = req.body;

  const queryString = 'INSERT INTO pokemon(num, name, img, weight, height,) VALUES($1, $2, $3, $4, $5)'
  const values = [params.num, params.name, params.img, params.weight, params.height];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
});

app.put('/pokemon/:id',(req,res))




/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
