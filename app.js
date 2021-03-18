if(process.env.NODE_ENV !== "production")
	{
		require("dotenv").config();
	}

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Song = require("./models/songs");
const Tag = require("./models/tags");
const seedDB = require("./seeds");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const methodOverride = require("method-override");
const flash = require("connect-flash");

const 	collectionRoutes = require('./routes/collections'),
		songRoutes = require('./routes/song'),
		songsRoutes = require('./routes/songs'),
		indexRoutes = require('./routes/index'),
		mixesRoutes = require('./routes/mixes'),
		downloadsRoutes = require('./routes/downloads'),
	  	usersRoutes = require('./routes/users'),
		profileRoutes = require('./routes/profile');

const url = process.env.DATABASEURL || "mongodb://localhost/anjam";

global.__basedir = __dirname;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true	
})
.then(()=> console.log('Connected to DB'))
.catch(error => console.log(error.message));

mongoose.set('useFindAndModify', false);

//seedDB(); -- Seed Database

//PASSPORT CONFIG
app.use(require("express-session")({	
	secret: "We are creating the best Library!",
	resave: false,
	saveUninitialized: false	
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//METHOD OVERRIDE CONFIG
app.use(methodOverride("_method"));

//CONNECT FLASH
app.use(flash());

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.use(function(req,res, next){	
	res.locals.currentUser = req.user;	
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();	
})

app.use(indexRoutes);
app.use("/collections", collectionRoutes);
app.use("/song", songRoutes);
app.use("/songs", songsRoutes);
app.use("/song/:id/mixes", mixesRoutes);
app.use("/song/:id/downloads", downloadsRoutes);
app.use("/song/:id/mixes/:mix_id/downloads", downloadsRoutes);
app.use("/users", usersRoutes);
app.use("/profile", profileRoutes);

var port = process.env.PORT || 3000;

app.listen(port, ()=>{
	console.log("Anjam server has started");	
});

