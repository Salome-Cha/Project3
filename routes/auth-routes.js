const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user-model');
const passport = require('passport')



router.post('/signup', (req, res) => {
 
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.status(400).json({ message: 'Provide username and password' });
      return;
    }
    User.findOne({ username }, (err, foundUser) => {
        if(err){
            res.status(500).json({message: "Username check went bad."});
            return;
        }
        if (foundUser) {
            res.status(400).json({ message: 'Username taken. Choose another one.' });
            return;
        }
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
        const aNewUser = new User({
            username:username,
            password: hashPass
        });
        aNewUser.save(err => {
            if (err) {
                res.status(400).json({ message: 'Saving user to database went wrong.' });
                return;
            }

            res.status(200).json(aNewUser)
        });
    });
  });


  router.post('/login', (req, res) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong authenticating user' });
            return;
        }
        if (!theUser) {
            // "failureDetails" contains the error messages
            // from our logic in "LocalStrategy" { message: '...' }.
            res.status(401).json(failureDetails);
            return;
        }
        // save user in session
        req.login(theUser, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session save went bad.' });
                return;
            }
            // We are now logged in (that's why we can also send req.user)
            res.status(200).json(theUser);
        });
    })(req, res);
  })



router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    })
  );

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: `${process.env.CLIENT_HOSTNAME}/projects`,
      failureRedirect: `${process.env.CLIENT_HOSTNAME}/login`
    })
  );


module.exports = router;