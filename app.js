const mongoose = require("mongoose");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Song = require("./models/songs");
var Tag = require("./models/tags");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var songRoutes = require('./routes/songs'),	
	indexRoutes = require('./routes/index'),
	mixesRoutes = require('./routes/mixes'),
	downloadsRoutes = require('./routes/downloads'),
	profileRoutes = require('./routes/profile');


/*mongoose.connect("mongodb://localhost/yelp_camp", {
	useNewUrlParser: true,
	useUnifiedTopology: true	
})
.then(()=> console.log('Connected to DB'))
.catch(error => console.log(error.message));*/

//console.log(process.env.DATABASEURL);

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
app.use("/songs", songRoutes);
app.use("/songs/:id/mixes", mixesRoutes);
app.use("/songs/:id/downloads", downloadsRoutes);
app.use("/songs/:id/mixes/:mix_id/downloads", downloadsRoutes);
app.use("/profile", profileRoutes);
//app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;

app.listen(port, ()=>{
	console.log("Anjam server has started");	
});

