const User = require('./User');
const Post = require('./Post');


// JOIN ON 
// create associations
// One to many relationship
User.hasMany(Post, {
    foreignKey: 'user_id' // fk user_id inside Post model
  });

// create reverse association
// Many to one relationship
Post.belongsTo(User, {
foreignKey: 'user_id',
});

module.exports = { User, Post }; // fk user_id inside Post model