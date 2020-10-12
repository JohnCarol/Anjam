const mongoose = require("mongoose");

const downalodSchema = new mongoose.Schema({	
	user: {
		  id : {			  
			type:mongoose.Schema.Types.ObjectId,
			ref : "User"
		  },	
	}
	
});

module.exports = mongoose.model("Downloads", downalodSchema);