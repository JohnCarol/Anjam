const express = require('express');
const router  = express.Router({mergeParams: true});
const Song = require("../models/songs");
const Tags = require("../models/tags");
const middleware = require("../middleware");

router.get("/:page", middleware.isActivated, async(req,res,next)=>{

	const foundTags = await Tags.find({});
	const resPerPage = 9;
	const page = req.params.page;
	let isAdmin = '';
	
	if(req.user){
		isAdmin = req.user.isAdmin;
			}else{
		isAdmin = false;
		}
	if(page)
		{
		try{
				if(req.query.search)
				{				
						//console.log('search');
					const searchQuery = req.query.search;
					const searchArr = searchQuery.split(" ");
					regex = new RegExp(escapeRegex(searchQuery), 'gi');
					
					const capitalised = searchArr.map(tag => capitalize(tag));
					//const capitalise = lowerCased.map(tags => tag.charAt(0).toUpperCase + tag.slice(1));
					
					const tags = capitalised;
					
					//{ $or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }] },
					//{ tags: { $in: ["appliances", "school"] } },
					//const allSongs = await Song.find({$or : [{tags:{$in:[searchArr]}}, {genre: regex}, {name:regex}, {subgenre:regex}]}).skip((resPerPage * page) - resPerPage).sort({"name":1,"_id":-1}).limit(resPerPage);
					
					const allSongs = await Song.find({$or : [{tags:{$all:tags}}, {genre: regex}, {name:regex}, {subgenre:regex}]}).skip((resPerPage * page) - resPerPage).sort({"name":1,"_id":-1}).limit(resPerPage);
					
					//console.log(allSongs)
					
					//db.inventory.find( { tags: { $all: ["red", "blank"] } } )

					//const numOfSongs = await Song.countDocuments({$or : [{tags:{$in:[regex]}}, {genre: regex},{name:regex}, {subgenre:regex}]});
					const numOfSongs = await Song.countDocuments({$or : [{tags:{$all:tags}}, {genre: regex}, {name:regex}, {subgenre:regex}]});

					if(numOfSongs < 1)
					{						

						req.flash('error', 'Sorry, your search did not return any results.');
						return res.redirect('/songs/1');
					}else{						
					
						res.render("songs/index",{songs:allSongs, tags:foundTags, isAdmin:isAdmin, numSongs: numOfSongs, currPage: page, searchVal:searchQuery, searchTags:tags.toString(), pages: Math.ceil(numOfSongs / resPerPage)});			
					}
				}else
				{	
					//console.log('normal');
					const allSongs = await Song.find({}).skip((resPerPage * page) - resPerPage).sort({"name":1,"_id":-1}).limit(resPerPage);

					const numOfSongs = await Song.countDocuments({});
					let searchTags;

					if(numOfSongs < 1)
					{						

						//req.flash('error', 'Sorry, that search returned no results...!');
						res.render("songs/index",{songs:"",isAdmin:isAdmin,tags:foundTags,numSongs: numOfSongs, currPage: page, pages: 			Math.ceil(numOfSongs / resPerPage)});
						
					}else{						

					res.render("songs/index",{songs:allSongs,tags:foundTags,searchVal:"", searchTags: searchTags, isAdmin:isAdmin, numSongs: numOfSongs, currPage: page, pages: 			Math.ceil(numOfSongs / resPerPage)});			
					}				
				}		
			}
			catch(err)
			{			
				throw new Error(err);		
			}
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

function capitalize(word) {
  						return word[0].toUpperCase() + word.slice(1).toLowerCase();
					}


module.exports = router;

