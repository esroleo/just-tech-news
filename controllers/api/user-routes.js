const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
        attributes: {exclude : ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
      /* Full story. 
       Step 1 - Give me all attributes of user table/model without password.
       Step 2 - Gie me an array of objects with the joint data of table post.
       incuding specif fields.
       Step 3 - Give me all the votes_posts of specific users by matching their upvotes
       through trough the vote table to the posts. 
       This means that I will receive the upvote information based on the post_id/user_id
       */
      attributes: { exclude: ['password'] },
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Post,
          attributes: ['id',
          'title',
          'post_url',
          'created_at']
        },
            // comments model includes
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'created_at'],
          include: {
            model: Post,
            attributes: ['title']
          }
        },
        {/*
          So now when we query a single user, we'll receive the
          title information of every post they've ever voted on.
          This would be handy for building a front end with a 
          user profile page, as it'll allow us to provide more 
          information for that user. Notice how we had to make 
          this happen, though. We had to include the Post model,
          as we did before; but this time we had to contextualize 
          it by going through the Vote table.
          
          Now when we query a user, we can see which posts a user has
          created and which posts a user has voted on, which will come
          under the property name voted_posts, so that we know which 
          set of data is which.
          
     
          
          This is needed when trying to display data across tables
          E.g. User table <------> Vote Table <------> Post
          Give me the post title where it matches the post_id / user_id of/(through)
          the vote table
          */
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ]
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// POST /api/users - equal to insert
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
      
        res.json(dbUserData);
      });
    })
    /*
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
      */
  });

// Authenticate user

router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(dbUserData => { // User retrived from the database
        if (!dbUserData) {
          res.status(400).json({ message: 'No user with that email address!' });
          return;
        }
        //req.body.password comes from the front end as json
        //that is compared with the password with the password generated for the user
        //at user creation as plaintext.
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
          }
          
     
        //res.json({ user: dbUserData });
    
        // Verify user
        req.session.save(() => {
          // declare session variables
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
          console.log("log in status: " +  req.session.loggedIn)
    
          res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    
      });  
    });
    
// PUT /api/users/1
// update
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        // Allows the set up beforeUpdate lifecycle "hook" functionality
        // @ Modules User.js
        individualHooks: true,   
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// user log logout
router.post('/logout', (req, res) => {
  //console.log(req.session.loggedIn)
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
     // res.status(204)
      
    });
  }
  else {
    res.status(404).end();
    //document.location.replace('/');
    //res.status(404)
  }
});

module.exports = router;