const express = require('express');
const router  = express.Router({mergeParams: true});
const user = require("../models/user");
const Songs = require("../models/songs");
const Mixes = require("../models/mixes");
let middleware = require("../middleware");

router.get('/', middleware.isLoggedIn, async(req,res,next)=>{
	
	let id = req.user._id;
	//console.log('heret');	
	
	/*Song.find({'downloads' : id}).populate('mixes').exec(function(err,allSongs){
		if(err || !allSongs)
			{
				console.log('not found');			
			}else
			{
				//words.filter(word => word.length > 6);
				let songMixes = allSongs;
				//allSongs.mixes = allSongs.mixes.downloads.filter(mix => )
				//console.log(allSongs.downloads);	
				//console.log(mixDownloads);
			}
		res.render('profile/show', {songs:allSongs});
	});*/
	try{
		const allSongs = await Songs.find({'downloads' : id}).populate({path: 'mixes', match:{'downloads' : id}})
		
		//const allMixes = await Mixes.find({'downloads' : id}).populate('mixes');
		
		
		res.render('profile/show', {songs:allSongs});
	}catch(err)
	{			
			throw new Error(err);		
	}
		   
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