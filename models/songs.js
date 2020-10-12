const mongoose = require("mongoose");
const Mix = require('./mixes');


const songSchema = new mongoose.Schema({
	name: String,
	description: String,
	genre: String,
	subgenre: String,
	length: String,
	fileUrl: String,
	bpm: String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username: String		
	},
	tags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tag"		
	}],
	mixes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Mix"
		}		
	],
	downloads: 
		[{
			userid:{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"	
			},
			username: String
		}]	
});

songSchema.pre('remove', async function() {
	await Mix.remove({
		_id: {
			$in: this.mixes
		}
	});
});

module.exports = mongoose.model("Song", songSchema);