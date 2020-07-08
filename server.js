var express = require("express");
var GitHubStrategy = require('passport-github').Strategy;
var passport = require('passport')
passport.use(new GitHubStrategy({
    clientID: process.env["7b5235c21d2f080de6ee"],
    clientSecret: process.env["489579aba11175e9122f5f38f6392b2131ef66dd"],
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

var PORT = process.env.PORT || 8080;

var app = express();

// define routes
// app.get('/',
//   passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  app.get('/',
  function(req, res) {
    res.render('index', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/github',
  passport.authenticate('github'));

// app.get('/return', 
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

// app.get('/profile',
//   require('connect-ensure-login').ensureLoggedIn(),
//   function(req, res){
//     res.render('profile', { user: req.user });
//   });


// Serve static content for the app from the "public" directory in the application directory.
// app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});