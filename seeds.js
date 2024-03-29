var mongoose = require("mongoose");
var Song = require("./models/songs");
var Tags   = require("./models/tags");
var Downloads = require("./models/downloads");
 
var data = [
    {
        name: "Kwaito song", 
        url: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        url: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        url: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   				//Remove all campgrounds
   				Song.remove({}, function(err){
        		if(err){
            		console.log(err);
        		}
        		console.log("removed songs!");
    Tags.remove({}, function(err) {
        if(err){
                console.log(err);
        }
        console.log("removed tags!");
	Downloads.remove({}, function(err) {
        if(err){
                console.log(err);
        }
        console.log("removed downloads!");	
		
             //add a few songs
		
            data.forEach(function(seed){
                Song.create(seed, function(err, song){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a song");
                        
						//create tags
                        
						Tags.create(
                            {
                                text: "kwaito, house, hip-hop, local"
                            }, function(err, tag){
                                if(err){
                                    console.log(err);
                                } else {
                                    song.tag.push(tag);
                                    song.save();
                                    console.log("Created new tags");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
});
}
module.exports = seedDB;