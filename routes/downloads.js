const express = require('express');
const router  = express.Router({mergeParams: true});
const Song = require("../models/songs");
const Mix = require("../models/mixes");
const middleware = require("../middleware");
const https = require('https');
const request = require('request');
 
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
					const file = link;
					let name = foundMix.name;
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
				res.setHeader("content-disposition", "attachment; filename=" +name+".mp3");         
				request(link).pipe(res); 	
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
				let name = foundSong.name; 
				const file = link;
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
				console.log(link);
				res.setHeader("content-disposition", "attachment; filename=" +name+".mp3");         
				request(link).pipe(res);
				
				
			}
		})
		
	}
});



module.exports = router;