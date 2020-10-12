const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
	text: String	
});

module.exports = mongoose.model("Tag", tagSchema);