const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// JOIN ON 
// create associations
// One to many relationship
User.hasMany(Post, {
    foreignKey: 'user_id' // fk user_id inside Post model
  });

// create reverse association
// Many to one relationship
// model associations
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


Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

// Many to many relationship
// Foreign Key constraint.
// why is needed.
/*
Note that we don't have to specify Comment as a through table
 like we did for Vote. This is because we don't need to 
 access Post through Comment; we just want to see the 
 user's comment and which post it was for. Thus, the 
 query will be slightly different.

*/

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



module.exports = { User, Post, Vote, Comment }; // fk user_id inside Post model