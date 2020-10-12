var express = require('express');
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req,res){
	
	let id = req.params.id;
	Campground.findById(id, function(err,foundCamp){
		if(err){
			console.log(err);
		}else
		{
			res.render("comments/new", {campground : foundCamp});	
		}		
	})	
});

router.post("/", middleware.isLoggedIn, function(req, res){

	let id = req.params.id;
	Campground.findById(id,function(err,foundCamp){
		if(err)
			{
				console.log(err);
				res.redirect("/campgrounds");
			}else
			{
				 Comment.create(req.body.comment, function(err,comment){
					 if(err){
						 console.log(err);
					 }else{
						 let username = req.user.username;
						 comment.author.id = req.user._id;
						 comment.author.username = username;
						 comment.save();
						 
						 foundCamp.comments.push(comment);
						 foundCamp.save();
						 
						 res.redirect('/campgrounds/'+id);
					 }	 
				 })
			}
	});
});

//EDIT AND UPDATE
router.get('/:comment_id/edit', middleware.checkCommentOwner, function(req,res){
	
		res.render("comments/edit", {campground_id: req.params.id, comment: req.comment});	
})

router.put('/:comment_id', middleware.checkCommentOwner, function(req,res){
	
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
		if(err)
			{
				console.log(err);
				res.redirect('back');
			}else
			{
				res.redirect("/campgrounds/"+req.params.id)		;
			}
	})
	
})

//DELETE
router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
	
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err)
			{
				res.redirect('back');
			}else
			{
				res.redirect('/campgrounds/'+req.params.id);		
			}
	})
	
});


module.exports = router;