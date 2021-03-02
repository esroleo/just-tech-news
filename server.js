const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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