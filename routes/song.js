const express = require('express');
const router  = express.Router({mergeParams: true});
const Song = require("../models/songs");
const Tags = require("../models/tags");
const middleware = require("../middleware");
const fileDownload = require("js-file-download");
const formidable = require("formidable");
const mp3Duration = require('mp3-duration')	
const {Howl, Howler} = require('howler');
let isAdmin = '';

router.post("/", middleware.isLoggedIn, function(req,res){	
	
	const fs =require("fs");	
	const form = new formidable({keepExtensions:true, multiples: true});	
	
	form.parse(req, (err,fields, files) =>{
		
		if(err){
			next(err);
			return;
		}	
	
	var name 		= fields.name;	
	var fileName 	= files.filetoupload.name;
	var filePath 	= files.filetoupload.path;
	var subgenre 	= fields.subgenre;
	var genre 		= fields.genre;
	var desc 		= fields.description;	
	var bpm 		= fields.bpm;
	var newSong		= {};	
	
	var author = {
		id: req.user._id,
		username : req.user.username		
	}
	
	//Create a folder in uploads with todays 	
	let destFolder = '/public/media/uploads/tracks/'+ fileName;
	
	fs.copyFile(filePath, __basedir + destFolder, (err) => { 
  		if (err) { 
    				console.log("Error Found:", err); 
  				}   				
	});		
		
	var len = mp3Duration(filePath, function (err, duration) {
		
		if (err){ return console.log(err.message);}			
		});
	len.then(function(value)
		{
			newSong = {name: name, bpm: bpm, length: toMinutes(value), fileUrl: destFolder, description: desc,genre:genre,subgenre:subgenre, author:author};
		
			Song.create(newSong,function(err,newlyCreated){
				if(err){
						console.log(err);
					}else{
						res.render('mixes/new', {song : newlyCreated});
					//res.redirect('/songs');
					}
			})
	//res.send(newSong);
		});		
	})		
});

router.get("/new", middleware.isLoggedIn, function(req,res){
	
	res.render("songs/new");
	
}); 

router.get("/:id", function(req,res){	
	
	let id = req.params.id;
	Song.findById(id).populate("mixes").exec(function(err,song){
		if(err || !song)
			{
				req.flash('error', 'Sorry, that song does not exist!');
            	return res.redirect('/songs/1');
			}
			else
			{
				//console.log(__basedir + song.fileUrl);
				//let track = new Howl({
					//src:[song.fileUrl]					
				//});
				
				 song.fileUrl = song.fileUrl.replace("/public", "");
				 if(req.xhr)
					 {
						 //console.log('ajax');
						 res.json(song); 
					 }else
					 {
						 if(req.user){
								let isAdmin = req.user.isAdmin;
							}else{
								let isAdmin = false;
								}
						 
						 //console.log('normal');
						 res.render("songs/show", {song:song, isAdmin: isAdmin});		
						
					 }				 
			}		
	})
});

//EDIT & UPDATE CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkAuthentication, function(req,res){
	
		res.render("songs/edit", {song: req.song});	
});

router.put("/:id", middleware.checkAuthentication, function(req,res){
	
	Song.findByIdAndUpdate(req.params.id, req.body.song, function(err, updatedSong){
		if(err){
			res.redirect("/songs/1");
		}else{			
			res.redirect("/song/" + req.params.id);
		}		
	})
});

//DELETE/DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkAuthentication, async(req,res) => {
	
	try{
		let foundSong = await Song.findById(req.params.id);	
		await foundSong.remove();
		console.log('deleted');
		res.redirect("/songs/1");
	}catch(error){
		console.log(error.message);
		res.redirect("/songs/1");
	}
});	

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function toMinutes(length){
	
	var minutes = Math.floor(length / 60);
	var seconds = Math.floor(length - minutes * 60);
	
	//console.log('secs->' + length);
	//console.log('mins->' + minutes);
	//console.log(': secs->' + seconds);
	
	return str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
	
}


module.exports = router;

