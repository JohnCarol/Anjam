const mongoose = require("mongoose");

const mixSchema = new mongoose.Schema({
	name: String,
	description: String,	
	length: String,	
	fileUrl: String,
	downloads: [{
				userid : {
					
					type : mongoose.Schema.Types.ObjectId,
					ref : 'User'
				},
				username : String				
				}]
});

module.exports = mongoose.model("Mix", mixSchema);