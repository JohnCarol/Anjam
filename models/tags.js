const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
	tag: String	
});

module.exports = mongoose.model("Tag", tagSchema);