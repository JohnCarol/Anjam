const mongoose = require("mongoose");
const Song = require('./songs');


const collectionSchema = new mongoose.Schema({
	name: String,
	description: String,		
	songs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Song"
		}		
	],	
});

collectionSchema.pre('remove', async function() {
	await Song.remove({
		_id: {
			$in: this.songs
		}
	});
});

module.exports = mongoose.model("Collection", collectionSchema);