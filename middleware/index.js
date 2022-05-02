const Song = require("../models/songs");
const Tag = require("../models/tags");
const Mix = require("../models/mixes");
const User = require("../models/user");

let middlewareObj = {};

middlewareObj.checkAuthentication = function(req,res,next)
{
	
	if(req.isAuthenticated())
		{
			Song.findById(req.params.id, function(err, foundSong){
			if(err || !foundSong){
				req.flash('error', 'Sorry, that song does not exist!');
				res.redirect("/songs/1");
			}else{
				
				if(req.user.isAdmin || foundSong.author.id.equals(req.user._id))
					{
						//console.log(foundSong.tags);
						req.song = foundSong;
						next();			
					}
				else{
					req.flash('error', 'You don\'t have permission to do that!');
					res.redirect("back");					
				}				
			}
		})	 
			
		}else
		{
			res.redirect("back");
		}	
}

middlewareObj.checkMixDetails = function(req,res,next)
{
	
	if(req.isAuthenticated())
		{
			Mix.findById(req.params.mix_id, function(err, foundMix){
			if(err || !foundMix){
				console.log(err);
				req.flash('error', 'Sorry, that mix does not exist!');
				res.redirect("/songs/1");
			}else{					
					req.mix = foundMix;
					next();	
			}
		})	 
			
		}else
		{
			res.redirect("back");
		}	
}

middlewareObj.isActivated = function(req,res,next){
	if(req.userId)
	{
		let userId = req.user._id;
		User.findById(userId, function(err, foundUser){
			console.log(foundUser.isActivated);
			return next();
		})
	}else{
		return next();
	}
	}

middlewareObj.isLoggedIn = function(req, res, next){
	
	if(req.isAuthenticated())
		{
			return next();
		}
	req.flash("error", "Please Login First!")
	res.redirect("/login");	
}

module.exports = middlewareObj;