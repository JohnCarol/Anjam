const express = require('express');
const router  = express.Router({mergeParams: true});
const Song = require("../models/songs");
const Collection = require("../models/collections");
const Tags = require("../models/tags");
const middleware = require("../middleware");
//const fileDownload = require("js-file-download");
//const formidable = require("formidable");
const mp3Duration = require('mp3-duration')	
//const {Howl, Howler} = require('howler');
const multer = require('multer');
const{storage} = require('../cloudinary');
const upload = multer({storage});
let isAdmin = '';


router.post("/", middleware.isLoggedIn,upload.single('filetoupload', {resource_type: "video"}), function(req,res){
	//console.log(req.body);
	//console.log(req.file);
	//res.send(req.body.collectionName);
	
	const name 			= req.body.name;	
	const fileName 		= req.file.originalname;
	const filePath 		= req.file.path;
	const subgenre 		= req.body.subgenre;
	const genre 		= req.body.genre;
	const desc 			= req.body.description;	
	const collection	= req.body.collection;	
	const collName 		= req.body.collectionName;
	const bpm 			= req.body.bpm;
	const tags			= req.body.tags.split(", ");		
	let newSong		= {};
	
	const author = {
		id: req.user._id,
		username : req.user.username		
	}	
	
	newSong = {name: name, bpm: bpm, fileDir: fileName, fileUrl: filePath, description: desc,genre:genre,subgenre:subgenre, author:author, tags:tags};
	
	Song.create(newSong,function(err,newlyCreated){
				if(err){
						console.log(err);
					}else{						
						
						Collection.findByIdAndUpdate(collection, {$set: {songs: newlyCreated._id}},{new:true}, function(err, updatedCollection){
						
						if(err){
							res.redirect("/song/new");
						}else{
							
							res.render('mixes/new', {song : newlyCreated});
						 }

	
						});
					}
				}
			)
	})
				
					

/*router.post("/", middleware.isLoggedIn,upload.single('filetoupload'), function(req,res){		
	
	const fs = require("fs");
	const form = new formidable({keepExtensions:true, multiples: true});	
	
	form.parse(req, (err,fields, files) =>{
		
		if(err){
			next(err);
			return;
		}	
	
	let name 		= fields.name;	
	let fileName 	= files.filetoupload.name;
	let filePath 	= files.filetoupload.path;
	let subgenre 	= fields.subgenre;
	let genre 		= fields.genre;
	let desc 		= fields.description;	
	let collection 	= fields.collection;	
	let collName 	= fields.collectionName;
	let bpm 		= fields.bpm;
	let tags		= fields.tags.split(" ");		
	let newSong		= {};
		
	
	let author = {
		id: req.user._id,
		username : req.user.username		
	}		
			
		
	let len = mp3Duration(filePath, function (err, duration) {
		
		if (err){ return console.log(err.message);}			
		});
	len.then(function(value)
		{
			collName = collName.replace(" ","");
			const songName = name.replace(" ","");
			//Create a folder in uploads with collection name.
			const dirToCreate = '/public/media/uploads/tracks/'+collName+'/'+songName+'/';
			const destFolder = dirToCreate + fileName;
		
			//tags = tags.trim();
		
			newSong = {name: name, bpm: bpm, length: toMinutes(value), fileDir: dirToCreate, fileUrl: destFolder, description: desc,genre:genre,subgenre:subgenre, author:author, tags:tags};
		
			Song.create(newSong,function(err,newlyCreated){
				if(err){
						console.log(err);
					}else{						
						
						Collection.findByIdAndUpdate(collection, {$set: {songs: newlyCreated._id}},{new:true}, function(err, updatedCollection){
						
						if(err){
							res.redirect("/song/new");
						}else{
							
							/*fs.mkdir(
									  __basedir + dirToCreate,
									  {
										recursive: true,
										mode: 0o77
									  },
									  err => {
										if (err) {
										  throw err;
										}
										console.log("Directory created!");
										fs.copyFile(filePath, __basedir + dirToCreate + fileName, (err) => { 
										if (err) { 
											console.log("Error Found:", err); 
											}   				
										}); 
									  }
									); */
							
							//const createDir = ()
							//res.render('mixes/new', {song : newlyCreated});
						//}		
	//})
						
						
					//res.redirect('/songs');
					//}
			//})
	//res.send(newSong);
		//});		
	//})		
//});*/


router.get("/new", middleware.isLoggedIn, async(req,res,next)=>{	
	
	try{		
		const allCollections = await Collection.find({}).sort( {name: 1});	
		const countCollections = await Collection.countDocuments({});
		
		res.render("songs/new",{collections: allCollections, numCollections: countCollections});
	}catch(err)
	{
		throw new Error(err);
	}
	
	
});
	


router.get("/:id", function(req,res){	
	
	let id = req.params.id;
	Song.findById(id).populate("mixes").exec(function(err,song){
		if(err || !song)
			{
				req.flash('error', 'Sorry, that song does not exist!');
            	res.redirect('/songs/1');
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
								isAdmin = req.user.isAdmin;
							}else{
								isAdmin = false;
								}
						 
						 //console.log('normal');
						 res.render("songs/show", {song:song, isAdmin: isAdmin});		
						
					 }				 
			}		
	})
});

//EDIT & UPDATE SONG ROUTE
router.get('/:id/edit', middleware.checkAuthentication, function(req,res){
		
	
	    let tagsString = req.song.tags.toString();
		
		req.song.tags = tagsString.replace(/,/gi,', ');
	
		res.render("songs/edit", {song: req.song});	
});

router.put("/:id", middleware.checkAuthentication, function(req,res){	
	
	let tagsArray = req.body.song.tags.split(", ");
	req.body.song.tags =  tagsArray;		
	
	Song.findByIdAndUpdate(req.params.id, req.body.song, function(err, updatedSong){
		if(err){
			res.redirect("/songs/1");
		}else{			
			res.redirect("/song/" + req.params.id);
		}		
	})
});

//DELETE/DESTROY SONG ROUTE
router.delete('/:id', middleware.checkAuthentication, async(req,res) => {
	
	try{
		let foundSong = await Song.findById(req.params.id);	
		await foundSong.deleteOne();
		
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

