const express = require('express');
const router  = express.Router({mergeParams: true});
const Tags = require('../models/tags');
const Song = require('../models/songs');
const User = require('../models/user');
const middleware = require("../middleware");

router.get('/edit', async(req,res)=>{
	
	//const allTags = Song.find({});
	const allSongs = await Song.find({}, {tags:1})
	const selectedTags = await Tags.find({});	
		
	const tags = allSongs;
	
	//console.log(tags);
	const tagsArr=[];
	
	tags.forEach(function(tag){
		
		//console.log(tag.tags.toString());
		tagsArr.push(tag.tags.toString());		
	})
	const filtered = tagsArr.filter(function(value, index, arr){ 
        return value !== "" && value !== null;	});	
	
	let str = filtered.toString().replace(/ /g,'');
	
	str = str.replace(',,',',');
	
	const cleanArray = str.split(",");
	
	let finalTags = cleanArray.filter((v, i, a) => a.indexOf(v) === i);
	
	res.render('tags/edit', {tags:finalTags, selectedTags:selectedTags, savedTags: JSON.stringify(selectedTags)});
})

router.post('/:tag', async(req,res)=>{
	
	const tag = req.params.tag;
	//console.log('We are here'+tag);
	const foundTags = await Tags.find({"tag":tag});
	
	//console.log("result:" + foundTags.length);
	if(foundTags.length > 0)
		{
			//console.log("remove "+tag);
			const result = await Tags.deleteOne({tag: tag});
			//console.log(result.deletedCount);
			
		}else
		{
			//console.log("add");
			Tags.create({tag: tag})	
		}
	
	
})

module.exports=router;