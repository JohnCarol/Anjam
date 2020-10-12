var express = require('express');
var router  = express.Router({mergeParams: true});
var Song = require("../models/songs");
var Mix = require("../models/mixes");
var middleware = require("../middleware");

router.get('/', (req,res)=>{
		   
		   //
		   
		   
		   });

//GET SONG OR MIX DOWNLOAD
router.post('/', middleware.isLoggedIn, (req,res)=>{
	
	let id = req.params.id;
	let mix_id = req.params.mix_id;	
	let user_id = req.user._id;
	
	if(mix_id)
		{
			let id = mix_id;
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
					//console.log(file);
					//Check to see if user has already downloaded this
					//Serch downloads to see if this particualr song has this users id in the downloads
					//Song.countDocuments({downloads : { userid : {$in : user_id}}}, function (err, count){ 
					Mix.countDocuments({"downloads.userid" : user_id}, function (err, count){ 
					if(count>0){
						//console.log(count);
						console.log('Mix Already downloaded');
						}
					else
						{
							//console.log("user_id - >" + user_id);
							console.log('Newly downloaded');
							foundMix.downloads.push({userid : user_id, username : req.user.username});
							foundMix.save();	
						}
					}); 
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
				//Check to see if user has already downloaded this
				//Serch downloads to see if this particualr song has this users id in the downloads
				//Song.countDocuments({downloads : { userid : {$in : user_id}}}, function (err, count){ 
				Song.countDocuments({"downloads.userid" : user_id}, function (err, count){ 
				if(count>0){
					console.log(count);
					console.log('Song Already downloaded');
					}
				else
					{
						console.log("user_id - >" + user_id);
						console.log('Newly downloaded');
						foundSong.downloads.push({userid : user_id, username : req.user.username});
						foundSong.save();	
					}
				}); 
				res.download(file); 	
			}
		
			})
			
		}
	
	
});



module.exports = router;