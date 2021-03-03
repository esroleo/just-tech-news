const router = require('express').Router();
// Imported to model (tables) which are post and user tables.
const { Post, User, Vote } = require('../../models');
//To do calculations
const sequelize = require('../../config/connection');

// get all users
// select * from post
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
      // Query configuration
      attributes: ['id', 'post_url', 'title', 'created_at'],
      order: [['created_at', 'DESC']], 
      // to return everything  include:[User]
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  
  });

// select x,y from post where x or y
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
        id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
        {
            model: User,
            attributes: ['username']
        }
        ]
    })
        .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
        })
        .catch(err => {
        console.log(err);
        res.status(500).json(err);
        });
});

// Insert record
router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// PUT /api/posts/upvote
//Make sure this PUT route is defined before the /:id PUT route,
// though. Otherwise, Express.js will think the word 
//"upvote" is a valid parameter for /:id.
router.put('/upvote', (req, res) => {
  // Vote.create({
  //   user_id: req.body.user_id,
  //   post_id: req.body.post_id
  // })
  //   .then(dbPostData => res.json(dbPostData))
  //   .catch(err => res.json(err));
  Vote.create({
    user_id: req.body.user_id,
    post_id: req.body.post_id
  })
  .then(() => { 
    // then find the post we just voted on
  return Post.findOne({
    where: {
      id: req.body.post_id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
      [
        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
        'vote_count'
      ]
    ]
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
  })
});

// Update record
router.put('/:id', (req, res) => {
    Post.update(
        {
        title: req.body.title
        },
        {
        where: {
            id: req.params.id
        }
        }
    )
        .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
        })
        .catch(err => {
        console.log(err);
        res.status(500).json(err);
        });
});

// Delete Record
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
        id: req.params.id
        }
    })
        .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
        })
        .catch(err => {
        console.log(err);
        res.status(500).json(err);
        });
});

  module.exports = router;