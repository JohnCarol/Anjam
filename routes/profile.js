let express = require('express');
let router  = express.Router();
let user = require("../models/user");
let Song = require("../models/songs");
let middleware = require("../middleware");

router.get('/', middleware.isLoggedIn, function(req,res){
	
	let id = req.user._id;
	//console.log('heret');
	
	Song.find({'downloads' : id}, function(err,allSongs){
		if(err || !allSongs)
			{
				console.log('not found');			
			}else
			{
				
				console.log(allSongs.downloads);	
			}
		res.render('profile/show', {songs:allSongs});
	});
	
	
		   
		   });

router.post('/', middleware.isLoggedIn, function(req,res){
		
	
	
	
});

module.exports = router;