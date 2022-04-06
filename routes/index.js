const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");
//const sgMail = require('@sendgrid/mail');
//sgMail.setApiKey(process.env.SENDGRIDAPI);
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
	host: "smtp.anjam.net",
	port: "587",
	secure: false,	
	auth:{
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASWD
	},
	tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});


router.get("/", function(req,res){
	
	res.render("landing");
	//res.redirect("/songs/1")
	
});

router.get('/register', function(req,res){
	
	res.render('register');
	
})

router.post('/register', function(req,res){
	
	//var newUser = new User({username: req.body.username});
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email;	
	
	User.register(new User({ email : email, username : username, isAdmin : false, isActivated: false}), password, function(err, user) {
      if (err) {
		req.flash("error", "That Email Address already exists.");  
        return res.redirect("back");
      }
		
	//var authenticationURL = 'https://infinite-atoll-58349.herokuapp.com/verify?authToken=' + user.authToken;
	let authenticationURL = 'http://www.anjam.net/verify?authToken=' + user.authToken;
	let mailOptions = {
		from: 'noreply@anjam.net',
		to: email,
		subject: 'Please confirm your ANJAM account',
		html: 'Hi there<br><br>You are recieving this email because you have successfully registered on the ANJAM Music Library website. If you did not register, please igonre this email. If you would like to confirm registration please click the link below.<br><br><a target=_blank href=\"' + authenticationURL + '\">Confirm your email</a><br><br>Kind regards'		
	}
	
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Email sent: ' + info.response)
			req.flash("success", "Thank you for registering. Please check your email for a verification link");
			res.redirect("/login");
		}		
	});
    /*sgMail.send({
        to:       user.email,
        from:     'info@anjam.net',
        subject:  'Please confirm your ANJAM account',
        html:     '<a target=_blank href=\"' + authenticationURL + '\">Confirm your email</a>'
    }, function(err, json) {
        if (err) { return console.error(err.body); }
		
		req.flash("success", "Thank you for registering. Please check your email for a verification link");
		res.redirect("/login");	
		});*/
		
		
	});
});

 router.get('/verify', function(req, res) {
      User.verifyEmail(req.query.authToken, function(err, existingAuthToken) {
        if(err) console.log('err:', err);
		  
		let mailOptions = {
		from: 'noreply@anjam.net',
		to: 'info@anjam.net',
		subject: 'New User Registration on ANJAM',
		html: 'Hi there<br><br>A user has just registered on the ANJAM Music Library website.<br><br>Please login to review/activate the new account.<br><br>Kind Regards'		
	}  
		transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Email sent: ' + info.response);
			
			req.flash("success", "Thank you for verifying your email address. You will receive an email once your account is activated.");
		res.redirect("/login");			
		}})
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
			//var authenticationURL = 'https://infinite-atoll-58349.herokuapp.com/reset_password?email=' + foundUser.email + '&authToken=' + foundUser.authToken;
			var authenticationURL = encodeURIComponent('http://www.anjam.net/reset_password?email=' + foundUser.email + '&authToken=' + foundUser.authToken);	
			authenticationURL = decodeURIComponent(authenticationURL);
			let mailOptions = {
			from: 'noreply@anjam.net',
			to: foundUser.email,
			subject: 'Please confirm your ANJAM account password reset',
			html:     'Hi there<br><br>We have received a request to reset the password for your ANJAM Music Library account. To reset your password, simply click on the link below.<br><br><a target=_blank href=\"' + authenticationURL + '\">Confirm Password Reset</a><br><br>Kind regards'		
	}
			transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Email sent: ' + info.response)
			req.flash("success", "A password reset confirmation link has been sent to '"+ foundUser.email + "'.");
			res.redirect("/login");
		}		
	});
			
			/**sgMail.send({
        	to:       foundUser.email,
        	from:     'info@anjam.net',
        	subject:  'ANJAM Password Reset',
        	html:     'We received a request to reset the password for your ANJAM account. To reset your password, simply click on the link below.<br><br><a target=_blank href=\"' + authenticationURL + '\">Confirm Password Reset</a>'
    		}, function(err, json) {
        	if (err) { return console.error("err" + err); }
		
			req.flash("success", "A password reset confirmation link has been sent to '"+ foundUser.email + "'.");
			res.redirect("/login");
	 	});	**/
		
		
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
		successRedirect: "/songs/1",
		failureRedirect: "/login",
		failureFlash: "Invalid Email Address or Password."
	}), function(req, res){
	
});

router.get("/logout", function(req,res){
	
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/songs/1");
	
});

module.exports = router;