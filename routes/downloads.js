var express = require('express');
var router  = express.Router({mergeParams: true});
var Song = require("../models/songs");
var Mix = require("../models/mixes");
var middleware = require("../middleware");

router.get('/', middleware.isLoggedIn, (req,res)=>{
		   
	let id = req.params.id;
	let mix_id = req.params.mix_id;	
	let user_id = req.user._id;
		   
		   
		   });

//GET SONG OR MIX DOWNLOAD
router.post('/', middleware.isLoggedIn, (req,res)=>{
	
	let id = req.params.id;
	let mix_id = req.params.mix_id;	
	let user_id = req.user._id;
	
	if(mix_id)
		{
			id = mix_id;
			let songid = req.params.id;
			Mix.findById(id, function(err,foundMix){

				if(err)
				{
					console.log(err);
					redirect('back');
				}
				else
				{
					let link = foundMix.fileUrl;
					const file = __basedir + link;
					let downloads = foundMix.downloads;
					//console.log(file);
					//Check to see if user has already downloaded this
					//Serch downloads to see if this particualr song has this users id in the downloads
					//Song.countDocuments({downloads : { userid : {$in : user_id}}}, function (err, count){ 
					let found = downloads.indexOf(user_id);
					if(found !== -1)
					{
						console.log('Mix Already downloaded');				
					
					}else
					{
					
						console.log('Newly downloaded mix');
						foundMix.downloads.push(user_id);
						foundMix.save();	
						
						Song.findById(songid, function(err,foundSong){
							
							foundSong.downloads.push(user_id);
							foundSong.save();
						});
					} 
				res.download(file); 	
				}

			})
		}else
			
		{
			Song.findById(id, function(err,foundSong){
		
			if(err)
			{
				console.log(err);
				redirect('back');
			}
			else
			{
				let link = foundSong.fileUrl;
				const file = __basedir + link;
				let downloads = foundSong.downloads;
				//Check to see if user has already downloaded this
				//Serch downloads to see if this particualr song has this users id in the downloads
				//Song.countDocuments({downloads : { userid : {$in : user_id}}}, function (err, count){ 
				//console.log(downloads);
				let found = downloads.indexOf(user_id);
				//console.log("found is: " + found);
				if(found !== -1)
				{
					console.log('Song Already downloaded');
				
					
				}else
				{
					
					console.log('Newly downloaded');
					foundSong.downloads.push(user_id);
					foundSong.save();	
					
					
				}
				//Song.find({"downloads.userid" : user_id}, function (err, allDownloads){ 
				//if(allDownloads){
					
									
					
					
					//}
				//else
					//{
						//console.log("user_id - >" + user_id);
						
						
						
					//}
				//}); 
				res.download(file); 	
			}
		})
		
	}
});



module.exports = router;