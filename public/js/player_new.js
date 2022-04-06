$(function(){
	
	
	$('.play').on('click', function() {		
	
		  
	let playerName = "player_" + $(this).attr('name');   
	let fileName = 	$('#' + playerName).attr('src');
    let seekBar = "seekbar_" + $(this).attr('name');
	let wavesurfer = WaveSurfer.create({
    	container: '#waveform_' + $(this).attr('name')
	});
		
	//let i = 0;
	//let wavesurfer = [];
	
	//$(".player").each(function(){
		
	//	wavesurfer[i] = WaveSurfer.create({
    	//container: '#waveform_' + i
	//});
	//	i++;
		
	//})	
		
	

	wavesurfer.load(fileName);
	
		
	$(".mixbuttons").each(function(){			
			
		$(this).closest('.thumbnail').removeClass("playing");
			
	})
	i = 0;
	$(".player").each(function(){
		
		//$(".player")[i].pause();
		//wavesurfer[i].stop()
		//i++;
		
	})	
		
    //document.getElementById(playerName).play();
		wavesurfer.on('ready', function () {
    wavesurfer.play();
});
		
	$(this).closest('.thumbnail').addClass("playing");	
		
    $('#' + playerName).on('timeupdate', function() {
    $('#'+ seekBar).attr("value", this.currentTime / this.duration);
    
    //let progressBar = document.getElementById("seekbar");
		//console.log(seekBar);
    let progressBar = document.getElementById(seekBar);
	progressBar.addEventListener("click", seek);
    
    function seek(e) {      
		let percent = e.offsetX / this.offsetWidth;
		 //$(this).closest('li').addClass('active');
		document.getElementById(playerName).currentTime =  percent * document.getElementById(playerName).duration;
		progressBar.value = percent / 100;
		}    
	});
    
});

	$('.pause').on('click', function() {
			let name = "player_" + $(this).attr('name');
		document.getElementById(name).pause();
	});
	
	$('.stop').on('click', function() {
			let name = "player_" + $(this).attr('name');
		console.log(name);
		document.getElementById(name).pause();
		document.getElementById(name).currentTime = 0;
		wavesurfer.stop();
	});
});