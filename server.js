const express = require('express');
const path = require('path');
const routes = require('./controllers');
const sequelize = require('./config/connection');
// Start of helper functions //
const helpers = require('./utils/helpers');
// End of helper functions
// Start of handlebars libraries //
// You can pass helper functions to the handlebars
// They will in turn be part of the engine.
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers }); // helper passed handlebars
// End of handlebars libraries //
// Start of express sessions //
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// End of express sessions //


const app = express();
const PORT = process.env.PORT || 3001;

// init express session cookies
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// express. use express sessions which is connected to our database.
app.use(session(sess));

// handlebars init
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// express sessions


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sync/link to all of public paths
/* It has to go before routes
The express.static() method is a built-in Express.js 
middleware function that can take all of the contents
of a folder and serve them as static assets. This is 
useful for front-end specific files like images, style
sheets, and JavaScript files.
*/

app.use(express.static(path.join(__dirname, 'public')));


// turn on routes
app.use(routes);



// turn on connection to db and server
// .sync will create table if it does not exist
// force: true will drop and re-create all the database tables
// on start up.
// by setting to true, it will check dynamically update any table
// new associations. Enable after making changes. Check if user
// table is empty and then enable back.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});