const express = require('express');
const router  = express.Router({mergeParams: true});
const Song = require("../models/songs");
const Tags = require("../models/tags");
const Mix = require("../models/mixes");
const middleware = require("../middleware");
const formidable = require("formidable");
const mp3Duration = require('mp3-duration')

router.get('/new', middleware.checkAuthentication, (req,res)=>{
	
	let id = req.params.id;
	Song.findById(id, function(err,foundSong){
		if(err){
			console.log(err);
		}else
		{
			res.render("mixes/new", {song : foundSong});	
		}		
	})
	
});

router.post('/', middleware.checkAuthentication, (req,res)=>{
	
	const fs =require("fs");	
	const form = new formidable({keepExtensions:true, multiples: true});	
	let id = req.params.id;
	
	form.parse(req, (err,fields, files) =>{
		
		if(err){
			next(err);
			return;
		}	
	
	var name 		= fields.name;	
	var fileName 	= files.filetoupload.name;
	var filePath 	= files.filetoupload.path;	
	var desc 		= fields.description;	
	var newSong		= {};
	
	
		Song.findById(id,function(err,foundSong){
			if(err)
				{
					console.log(err);
					res.redirect("/songs/1");
				}else
				{
						let destFolder = foundSong.fileDir;

						fs.copyFile(filePath, __basedir + destFolder +fileName, (err) => { 
						if (err) { 
						console.log("Error Found:", err); 
							}   				
						});		

						var len = mp3Duration(filePath, function (err, duration) {

						if (err){ return console.log(err.message);}			
						});
						len.then(function(value)
						{				
							var mixLngth = toMinutes(value);
							newSong = {name: name, length: mixLngth, fileUrl: destFolder+fileName, description: desc};
							Mix.create(newSong, function(err,mix){
									 if(err){
										 console.log(err);
									 }else{										 							 
										 mix.save();

										 foundSong.mixes.push(mix);
										 foundSong.save();

										 res.render('mixes/new', {song : foundSong, file: fileName});
									 }	 
								 })
					//res.send(newSong);
			});


				}
		});	
	});
});

router.get('/:mix_id/', (req,res)=>{
	let id = req.params.mix_id;
	let songid = req.params.id;
	
	Mix.findById(id, function(err,foundMix){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.json(foundMix,id,songid); 			
		}			
		
	})
});

//Edit && Update
router.get('/:mix_id/edit', middleware.checkMixDetails, (req,res)=>{
	
	res.render("mixes/edit", {song_id: req.params.id, mix: req.mix});
});

router.put('/:mix_id', middleware.checkMixDetails, (req,res)=>{
	
	Mix.findByIdAndUpdate(req.params.mix_id, req.body.mix, function(err, updatedMix){
		if(err)
			{
				console.log(err);
				res.redirect('back');
			}else
			{
				res.redirect("/song/"+req.params.id)		;
			}
	})
});

//DELETE
router.delete('/:mix_id', middleware.checkMixDetails, (req,res)=>{
	Mix.findByIdAndRemove(req.params.mix_id, function(err, deleted){
		if(err)
			{
				console.log(err);
				res.redirect('back');
			}else
			{
				if(req.xhr)
					{
						console.log('here');
						res.json(deleted);	
					}
				else
					{
					 	conosle.log('Not ajax');
						res.redirect('/songs/'+req.params.id);				
					}
				
			}
	})	
})


function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function toMinutes(length){
	
	var minutes = Math.floor(length / 60);
	var seconds = Math.floor(length - minutes * 60);
	
	console.log('secs->' + length);
	console.log('mins->' + minutes);
	console.log(': secs->' + seconds);
	
	return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);	
}


module.exports = router;

