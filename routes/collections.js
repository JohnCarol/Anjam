const express = require('express');
const router  = express.Router({mergeParams: true});
const Song = require("../models/songs");
const Collection = require("../models/collections");
const middleware = require("../middleware");

router.get("/new", async(req,res,next)=>{	
	
	res.render("collections/new");
	
});

router.post("/", middleware.isLoggedIn, async(req,res,next)=>{
	
	//console.log(req.body.collection);
	//return;
	Collection.create(req.body.collection,function(err,newlyCreated){
		if(err){
						console.log(err);
					}else{
						res.redirect('song/new');					
					}		
	})
})

module.exports = router;