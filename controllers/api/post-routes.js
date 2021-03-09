const router = require('express').Router();
// Imported to model (tables) which are post and user tables.
const { Post, User, Vote, Comment } = require('../../models');
//To do calculations
const sequelize = require('../../config/connection');

// get all users
// select * from post
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
      // Query configuration
      order: [['created_at', 'DESC']], 
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      
      // to return everything  include:[User]
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
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
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
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
// custom static method created in models/Post.js Post.upvote (two parameters
router.put('/upvote', (req, res) => {
  // make sure the session exists first
  if (req.session) {
    // pass session id along with all destructured properties on req.body
    Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
        res.alert(errorString)
      });
  }
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