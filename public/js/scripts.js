$(function(){
	
	navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
	
	
	const mixdata = [];
	let fileName = "";
	let isPlaying = [];
	let isAdmin;
	
	
	
	$(".mixbuttons").each(function(){
				
				fileName = $(this).attr("id");
				let file = fileName.replace("/public/media/uploads/tracks/", "");
				file = file.replace(".mp3", "");
		
			    mixdata.push({
				fileName: fileName,
				file: file,
				sound: new Howl({
						src:[$(this).attr("id").replace("/public", "")]					
					})
					
			});		
	})
	
	/*let ctx = Howler.ctx;
	let analyser = Howler.ctx.createAnalyser();
	
	Howler.masterGain.connect(analyser);
	analyser.connect(Howler.ctx.destination);
	
	analyser.fftSize = 256;
	let bufferLength = analyser.frequencyBinCount;
	console.log(bufferLength);
	let dataArray = new Uint8Array(bufferLength);
	
	canvasCtx.clearRect(0,0, WIDTH, HEIGHT);
	
	function draw(){
		
		drawVisual = requestAnimationFrame(draw);
		analyser.getByteFrequencyData(dataArray);
		canvasCtx.fillStyle = 'rgb(0,0,0)';
		canvasCtx.fillRect(0,0,WIDTH,HEIGHT);
	
	
	let barWidth = (WIDTH / bufferLength) * 2.5;
	let barHeight;
	var x = 0;
	
	for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]/2;

        canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

        x += barWidth + 1;
      }
	}*/
    
	
	//console.log(mixdata);
	
	
   /*let src = $("#url");
	//console.log(src[0].innerHTML);
	
	let track = new Howl({
		src: [src[0].innerHTML]		
	})*/ 
	
	
	$(".play").on("click", function(){
		
		Object.keys(mixdata).forEach(function(key) {
    		mixdata[key].sound.pause();
		});
		$(".mixbuttons").each(function(){
			
			
			$(this).closest('.thumbnail').removeClass("playing");
			
		})
		
		let id = $(this).attr("name");
		
		$(this).closest('.thumbnail').addClass("playing");
		
		mixdata[id].sound.play();
		
		
		//if(mixdata[id]){			
				//mixdata[id].sound.playing() ? mixdata[id].sound.pause() : mixdata[id].sound.play();
				//}	
		
	});

	 $(".pause").on("click", function(){
		 
		let id = $(this).attr("name");
		
		if(mixdata[id]){
			
			mixdata[id].sound.pause();
		}
	});

	$(".stop").on("click", function(){
		
		let id = $(this).attr("name");
		
		if(mixdata[id]){
			
			mixdata[id].sound.stop();
		}
	});

	$(".volup").on("click", function(){
		
		let id = $(this).attr("name");
		
		if(mixdata[id]){
			
			var vol = mixdata[id].sound.volume();
			vol += 0.1;
			if (vol > 1) {
				vol = 1;
			}
			mixdata[id].sound.volume(vol);	
		}
	});

	$(".voldown").on("click", function(){
		
		let id = $(this).attr("name");
		
		if(mixdata[id]){
			
		
			var vol = mixdata[id].sound.volume();
			vol -= 0.1;
			if (vol < 0) {
				vol = 0;
			}
		}	
		mixdata[id].sound.volume(vol);
	});	
});

	