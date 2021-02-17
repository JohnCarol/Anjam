const Song = require("../models/songs");
const Tag = require("../models/tags");
const Mix = require("../models/mixes");

let middlewareObj = {};

middlewareObj.checkAuthentication = function(req,res,next)
{
	
	if(req.isAuthenticated())
		{
			Song.findById(req.params.id, function(err, foundSong){
			if(err || !foundSong){
				req.flash('error', 'Sorry, that song does not exist!');
				res.redirect("/songs");
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
				res.redirect("/songs");
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

middlewareObj.isLoggedIn = function(req, res, next){
	
	if(req.isAuthenticated())
		{
			return next();
		}
	req.flash("error", "Please Login First!")
	res.redirect("/login");	
}

module.exports = middlewareObj;