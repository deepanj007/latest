const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const booking= require('../models/book');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  console.log(newUser.password);

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

// Dashboard
router.get('/dashboard', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Game.getAllGames((err, user) => {
    if(err){
      console.log(err);
    } else {
      //console.log("users "+ user);
      res.json({users: user});
    }
  })
});

// Match
router.post('/match', (req, res, next) =>{
     console.log("req.body : "+req.body.route);
     let bookDetails = {
         "route":req.body.route,
         "pickup":req.body.pickup,
         "dest":req.body.destination,
         "doj":req.body.doj,
         "truckOption":req.body.truckOption,
         "licenseNo":req.body.licenseNo,
         "truckType":req.body.truckType,
         "truckNo":"T1",
         "user":req.body.user,
         "size":req.body.spacesRequired
     }
     booking.matchRide(bookDetails, function(result){
        console.log("booking status: "+result);
        res.send({status:result});
     })
})

module.exports = router;
