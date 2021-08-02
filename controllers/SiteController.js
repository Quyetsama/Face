const AccountSchema = require("../models/account");
const ImageSchema = require("../models/image");
const jwt = require('jsonwebtoken');

//passport
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');
const saltRounds = 10;





passport.use(new LocalStrategy(
    function(username, password, done) {
        AccountSchema.findOne({
            username: username
        })
        .then(user => {
            if(!user) done(null, false);
            bcrypt.compare(password, user.password, function(err, result) {
                console.log(result);
                if(result){
                    done(null, user);
                }
                else{
                    console.log(err);
                    done(null, false);
                }
            });
        })
        .catch(error => {
            done(error);
        })
    }
));





class SiteController{

    // [GET] /
    home(req, res, next){
        // console.log(req.session.user);
        res.render("home");
    }

    // [GET] /register
    register(req, res, next){
        res.render("register");
    }

    // [POST] /register
    registerSubmit(req, res, next){
        AccountSchema.find({
            $or : [
                {email: req.body.email},
                {username: req.body.username}
            ]
        })
            .then(data => {
                if(data.length > 0){
                    res.json("Email or Username exists");
                }
                else{
                    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                        console.log(hash);
                        AccountSchema.create
                        ({
                            email: req.body.email,
                            username: req.body.username,
                            password: hash
                        })
                        .then(() => res.redirect("back"))
                    });
                }
            })
            .catch(next);

    }

    // [GET] /login
    login(req, res, next){
        res.render("login");
    }

    // [POST] /login
    loginSubmit(req, res, next){
        AccountSchema.findOne({
            username: req.body.username,
            password: req.body.password
        })
        .then(user => {
            // console.log(user);
            if(user){
                // req.session.user = user._id;
                var token = jwt.sign({_id: user._id}, "quyetdaica")

                res.json({
                    message: 'login success',
                    token: token
                });
            }
            else{
                res.status(400).json("Account not exist");
            }
        })
        .catch(next);
    }


    loginPassport(req, res, next) {
        passport.authenticate('local', function(err, user) {
          if (err) { return res.status(500).json('loi server!') }
          if (!user) { return res.json('username or password incorrect!'); }
            
          jwt.sign(user.toObject(), "quyetdaica", function(error, token){
              
              if(error) return res.status(500).json('loi server')
              console.log(token);
              return res.json({
                    message: 'login success',
                    token: token,
                    username: user.toObject().username
            });
          })
        })(req, res, next);
      }


    logout(req, res, next){
        var cookie = req.cookies;
        for (var prop in cookie) {
            if (!cookie.hasOwnProperty(prop)) {
                continue;
            }    
            res.cookie(prop, '', {expires: new Date(0)});
        }
        res.redirect('/');
    }


}

module.exports = new SiteController;