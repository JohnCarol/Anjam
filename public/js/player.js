$(function(){
	
	const audios = [];
	let i = 0;
	let wavesurfer;
	
	$(".player").each(function(){
		
		//$(".player")[i].pause();
		//wavesurfer[i].stop()
		
		 wavesurfer = WaveSurfer.create({
    		container: '#waveform_' +i,
			waveColor: '#D9DCFF',
    		progressColor: '#4353FF',
    		cursorColor: '#4353FF',
    		barWidth: 3,
    		barRadius: 3,
    		cursorWidth: 1,
    		height: 200,
    		barGap: 3,
			plugins: [WaveSurfer.cursor.create({
				showTime: true,
            	opacity: 1,
            	customShowTimeStyle: {
                'background-color': '#000',
                color: '#fff',
                padding: '2px',
                'font-size': '10px'
            			}
					})
				]});
		
		audios.push(wavesurfer);
		i++;
		
	})	
	
	
	
	//console.log(audios);
	
	
	$('.play').on('click', function() {		
	
		  
	let playerName = "player_" + $(this).attr('name');   
	let fileName = 	$('#' + playerName).attr('src');
    let seekBar = "seekbar_" + $(this).attr('name');
	let wavesurfer = audios[$(this).attr('name')];	

	wavesurfer.load(fileName);
	
		
	$(".mixbuttons").each(function(){			
			
		$(this).closest('.thumbnail').removeClass("playing");
			
	})
	
		//console.log($(this).attr('name'));
		$("#waveform_"+$(this).attr('name')).show();
		wavesurfer.on('ready', function () {
    	wavesurfer.play();
		
		
	});		
	
		
		
	i = 0;
	$(".player").each(function(){
		
		//$(".player")[i].pause();
		//wavesurfer[i].stop()
		//i++;
		if(audios[i].isPlaying()){			
			
			audios[i].stop();
			$("#waveform_"+i).hide();
		}
		i++;
	})	
		
    //document.getElementById(playerName).play();
		
		
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
		let wavesurfer = audios[$(this).attr('name')];
		wavesurfer.playPause();

	});
	
	$('.stop').on('click', function() {
			let name = "player_" + $(this).attr('name');
		//console.log(name);
		document.getElementById(name).pause();
		document.getElementById(name).currentTime = 0;
		let wavesurfer = audios[$(this).attr('name')];		
		$("#waveform_"+$(this).attr('name')).hide();
		wavesurfer.stop();
	});
});