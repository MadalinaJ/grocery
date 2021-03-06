const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up");
  },

   create(req, res, next){

     let newUser = {
       email: req.body.email,
       password: req.body.password,
       passwordConfirmation: req.body.passwordConfirmation
     };

     userQueries.createUser(newUser, (err, user) => {
       if(err){
         req.flash("error", err);
         res.redirect("/users/sign_up");
       } else {

         passport.authenticate("local")(req, res, () => {
           req.flash("notice", "You've successfully signed in!");
           res.redirect("/");
         })
       }
     });
   },

   signInForm(req, res, next){
     res.render("users/sign_in");
   },

   signIn(req, res, next){
     passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
          req.flash("notice", "Login error. Did you enter the correct username and password?")
          return res.redirect("/users/sign_in");
        }
        req.flash("notice", "Login Success!");
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      })(req, res, next);
   },

   signOut(req, res, next){
   req.logout();
   req.flash("notice", "You've successfully signed out!");
   res.redirect("/");
 }
}