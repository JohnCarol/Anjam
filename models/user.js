var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var passportLocalMongooseEmail = require("passport-local-mongoose-email");


var UserSchema = new mongoose.Schema({	
	username: String,	
	isAdmin: Boolean					
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.plugin(passportLocalMongooseEmail,{
	usernameField: 'email',
	
});

module.exports = mongoose.model("User", UserSchema);