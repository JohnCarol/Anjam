const express = require('express');
const router  = express.Router({mergeParams: true});
const Song = require("../models/songs");
const middleware = require("../middleware");

let isAdmin = '';

router.get("/:page", async(req,res,next)=>{

	const resPerPage = 1;
	const page = req.params.page;	
	
	try{
			if(req.query.search)
			{				
					console.log('search');
				const searchQuery = req.query.search,
   				regex = new RegExp(escapeRegex(req.query.search), 'gi');
				
				const allSongs = await Song.find({genre: regex}).skip((resPerPage * page) - resPerPage).limit(resPerPage);
				
				const numOfSongs = await Song.countDocuments({genre: regex});
				
				if(numOfSongs < 1)
				{						

					req.flash('error', 'Sorry, that search returned no results...!');
					return res.redirect('/songs/1');
				}else{
			
					if(req.user){
						 isAdmin = req.user.isAdmin;
					}else{
						 isAdmin = false;
					}
			
				res.render("songs/index",{songs:allSongs, isAdmin:isAdmin, numSongs: numOfSongs, currPage: page, searchVal:req.query.search, pages: 			Math.ceil(numOfSongs / resPerPage)});			
				}
			}else
			{	
					console.log('normal');
				const allSongs = await Song.find({}).skip((resPerPage * page) - resPerPage).limit(resPerPage);
				
				const numOfSongs = await Song.countDocuments({});
				
				if(numOfSongs < 1)
				{						

					req.flash('error', 'Sorry, that search returned no results...!');
					return res.redirect('/songs/1');
				}else{
			
					if(req.user){
						 isAdmin = req.user.isAdmin;
					}else{
						 isAdmin = false;
					}
			
				res.render("songs/index",{songs:allSongs, searchVal:"", isAdmin:isAdmin, numSongs: numOfSongs, currPage: page, pages: 			Math.ceil(numOfSongs / resPerPage)});			
				}				
			}		
		}
		catch(err)
		{			
			throw new Error(err);		
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

