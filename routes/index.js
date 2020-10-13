var express = require('express');
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRIDAPI);



router.get("/", function(req,res){
	
	res.render("landing");
	
});

router.get('/register', function(req,res){
	
	res.render('register');
	
})

router.post('/register', function(req,res){
	
	//var newUser = new User({username: req.body.username});
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;	
	
	User.register(new User({ email : email, username : username, isAdmin : false}), password, function(err, user) {
      if (err) {
		req.flash("error", "That Email Address already exists.");  
        return res.redirect("back");
      }
		
	var authenticationURL = 'https://infinite-atoll-58349.herokuapp.com/verify?authToken=' + user.authToken;
    sgMail.send({
        to:       user.email,
        from:     'jcbukenya@gmail.com',
        subject:  'Please confirm your ANJAM account',
        html:     '<a target=_blank href=\"' + authenticationURL + '\">Confirm your email</a>'
    }, function(err, json) {
        if (err) { return console.error(err.body); }
		
		req.flash("success", "Thank you for registering. Please check your email for a verification link");
		res.redirect("/login");
	
	/*User.register(newUser, password, function(err,user){
		if(err){
  				req.flash("error", err.message);
  				return res.redirect("/register");
				}else{
				passport.authenticate("local")(req,res, function(){
				req.flash("success", "Welcome to Anjam "+ user.username);	
				res.redirect('/songs');				
			});
		}
	})*/	
		});
	});
});

 router.get('/verify', function(req, res) {
      User.verifyEmail(req.query.authToken, function(err, existingAuthToken) {
        if(err) console.log('err:', err);

        req.flash("success", "Thank you for verifying your email address. You may now log in.");
		res.redirect("/login");
      });
  });

router.get('/forgot_password', function(req,res){
	
	res.render("forgot_password");
	
	
})

router.post('/forgot_password', function(req,res){
	
	 var username = req.body.username;
	
	User.find({ email: username}, null, { limit: 1 }, function(err, foundUser)
	{
		
		if(err)
			{
				console.log(err);
			}else
			{
				console.log(foundUser[0].email);
			}
		
			foundUser = foundUser[0];
			var authenticationURL = 'https://infinite-atoll-58349.herokuapp.com/reset_password?email=' + foundUser.email + '&authToken=' + foundUser.authToken;
				
			sgMail.send({
        	to:       foundUser.email,
        	from:     'jcbukenya@gmail.com',
        	subject:  'ANJAM Password Reset',
        	html:     'We received a request to reset the password for your ANJAM account. To reset your password, simply click on the link below.<br><br><a target=_blank href=\"' + authenticationURL + '\">Confirm Password Reset</a>'
    		}, function(err, json) {
        	if (err) { return console.error("err" + err); }
		
			req.flash("success", "A password reset confirmation link has been sent to '"+ foundUser.email + "'.");
			res.redirect("/login");
	 	});	
	});
	
	 //User.find({email: username},null,limit function(err, foundUser){
		
		 	
    		
	}); 

	

 router.get('/reset_password', function(req, res) {	 
	 
      User.verifyEmail(req.query.authToken, function(err, existingAuthToken) {
        if(err) console.log('err:', err);
		
		let email =  req.query.email;
        res.render("reset_password", {email:email});
      });
  });

router.post('/reset_password', function(req,res){	
	
	var username = req.body.username;	
	var password = req.body.password;	
	
	User.find({ email: username}, null, { limit: 1 }, function(err, foundUser)
	{
	if(err) console.log(err);
		
		let id = foundUser[0]._id;
		
		User.findById(id,function(err,foundUser){
			 console.log(foundUser.username);
			console.log(foundUser._id);
			
			foundUser.setPassword(password, function(err, user){
			if(err) console.log('err:', err);
				
				user.save();
				user.resetPasswordToken = undefined;

			req.flash("success", "Password successfully updated.");
			res.redirect('/login');
			})
		});
	})
});

//===================================
//LOGIN ROUTES
//========================================

router.get('/login', function(req,res){	
	res.render('login');	
});

router.post("/login", passport.authenticate("local", 
	{	
		successRedirect: "/songs",
		failureRedirect: "/login",
		failureFlash: "Invalid Email Address or Password."
	}), function(req, res){
	
});

router.get("/logout", function(req,res){
	
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/songs");
	
});

module.exports = router;