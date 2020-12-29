const mongoose = require("mongoose");

const mixSchema = new mongoose.Schema({
	name: String,
	description: String,	
	length: String,	
	fileUrl: String,
	downloads: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"	
			}			
		]
});

module.exports = mongoose.model("Mix", mixSchema);