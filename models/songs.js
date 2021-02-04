const mongoose = require("mongoose");
const Mix = require('./mixes');


const songSchema = new mongoose.Schema({
	name: String,
	description: String,
	genre: String,
	subgenre: String,
	length: String,
	fileUrl: String,
	fileDir: String,
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
    		type: String
		}
	],
	mixes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Mix"
		}		
	],
	downloads: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"	
			}			
		]
});

songSchema.pre('deleteOne', async function() {
	await Mix.deleteMany({
		_id: {
			$in: this.mixes
		}
	});
});

module.exports = mongoose.model("Song", songSchema);