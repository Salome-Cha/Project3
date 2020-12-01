const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/user-model');


// SIGNUP ROUTE
router.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.status(400).json({ message: 'Please provide username and password' });
      return;
    }
    User.findOne({ username }, (err, foundUser) => {
        if(err){
            res.status(500).json({message: "Username check went bad."});
            return;
        }
        if (foundUser) {
            res.status(400).json({ message: 'This username is already taken. Please choose another one.' });
            return;
        }
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
        

// NEED TO BE COMPLETED TOMORROW with other fields for our users:
        const aNewUser = new User({
            username:username,
            password: hashPass,

        });

        aNewUser.save(err => {
            if (err) {
                res.status(400).json({ message: 'Saving the new user to database went wrong.' });
                return;
            }

            res.status(200).json(aNewUser)
        });
    });
  });


module.exports = router;