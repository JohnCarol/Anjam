let express = require('express');
let router  = express.Router({mergeParams: true});
let user = require("../models/user");
let Song = require("../models/songs");
let middleware = require("../middleware");

router.get('/', middleware.isLoggedIn, function(req,res){
	
	let id = req.user._id;
	//console.log('heret');	
	
	Song.find({'downloads' : id}).populate('mixes').exec(function(err,allSongs){
		if(err || !allSongs)
			{
				console.log('not found');			
			}else
			{
				//words.filter(word => word.length > 6);
				let mixDownloads = allSongs;
				//allSongs.mixes = allSongs.mixes.downloads.filter(mix => )
				//console.log(allSongs.downloads);	
				//console.log(mixDownloads);
			}
		res.render('profile/show', {songs:allSongs});
	});
	
	
		   
		   });

router.put("/:id", middleware.isLoggedIn, function(req,res){	
	
	user.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
		if(err){
			req.flash('error', 'There was an error updating your profile.');
			res.redirect("/profile");
		}else{	
			req.flash('success', 'Details updated.');
			res.redirect("/profile");
		}		
	})
});

module.exports = router;