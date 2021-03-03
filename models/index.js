const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

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


Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});


// Many to many relationship
// Foreign Key constraint.
User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});



module.exports = { User, Post, Vote }; // fk user_id inside Post model