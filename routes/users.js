const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user");
//const sgMail = require('@sendgrid/mail');
const middleware = require("../middleware");
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

router.get('/', middleware.isLoggedIn, async(req,res,next)=>{
	
	try{
		const allUsers = await User.find({});				
		res.render('users/show', {users:allUsers});
	}catch(err)
	{			
		throw new Error(err);		
	}
});

router.post('/activate/:id', function(req,res){
	let type = req.body.type;
	let email = req.body.email;	
	let activate = 0;
	if(type == 'Activate')
		{
			activate = 1;
		}
	User.findByIdAndUpdate(req.params.id, {"isActivated": activate}, function(err,updated){
		
		if(err){
			console.log(err);
		}else{
			
			
			if(activate === 1){
			let mailOptions = {
			from: 'noreply@anjam.net',
			to: email,
			subject: 'Your ANJAM account has been activated',
			html:     'Hi there<br><br>Your account has been activated. Log In <a traget = "_blank" href = "http://www.anjam.net/login">here</a><br><br>Kind regards'		
	}
				
				
				/**sgMail.send({
        			to:       email,
					from:     'info@anjam.net',
					subject:  'Your Anjam.net account has been activated',
					html:     'Your Anjam account has been activated. You may now login <a href = "http://anjam.net/login"> here</a>.'
    			}, function(err, json) {
					//console.log('error');
        		if (err) { return console.error(err); }
				});**/
			}
			
			res.redirect('/users');
		}
	})
	
	
});



module.exports = router;