const express = require('express');
const router  = express.Router({mergeParams: true});
const Song = require("../models/songs");
const Collection = require("../models/collections");
const middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, async(req,res,next)=>{
	try{
		const allCollections = await Collection.find({},null,{sort:{name: 1}}).populate({path: 'songs'})
				
		res.render("collections/show", {collections:allCollections});
	}catch(err)
	{			
			throw new Error(err);		
	}
	
	//res.render("collections/show");
	
});

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

router.get('/:id/edit', middleware.isLoggedIn, async(req,res,next)=>{	
	try{
		const collection = await Collection.findById(req.params.id);
		res.render('collections/edit', {collection:collection});
		
	}catch(err){
		throw new Error(err)
	}
})

router.put('/:id', middleware.isLoggedIn, async(req,res,next)=>{	
	
	Collection.findByIdAndUpdate(req.params.id, req.body.collection, function(err, updatedCollection){
		if(err){
			res.redirect("/collections");
		}else{	
			req.flash('success', 'Collection updated.');
			res.redirect("/collections");
		}
	})
})

module.exports = router;