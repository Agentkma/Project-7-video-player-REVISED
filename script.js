$(document).ready(function () {
	$('h1').hide().slideDown(1000);

});

var supports_video = !!document.createElement('video').canPlayType;
if (supports_video) {


window.onload = function() {

	// Video
	var video 							= document.getElementById("video");
  var track 							= document.getElementById("track");
  var total_time 					= document.getElementById('total-time');
  var current_Time				=	document.getElementById('current-time');

	// Buttons
	var playButton 					= document.getElementById("play-pause");
	var muteButton 					= document.getElementById("mute");
	var fullScreenButton 		= document.getElementById("full-screen");
  var closedCaptionButton = document.getElementById("captions");

	// Sliders
	var seekBar 						= document.getElementById("seek-bar");
	var volumeBar 					= document.getElementById("volume-bar");

  // General Variables
  var timeRounder = {};
  var play_clicked = '<img src="icons/play-icon.png" alt="play video" />';
	var pause_clicked = '<img src="icons/pause-icon.png" alt="pause video" />';
	var mute_clicked= '<img src="icons/volume-off-icon.png" alt="mute video" />';
	var unmute_clicked = '<img src="icons/volume-on-icon.png" alt="unmute video" />';
  var transcript_area = document.getElementById('transcript');

  // Transcirpt array with start and finish times and text

	var transcript_array = [
		{"start": "0.00",
			"fin": "7.535",
			"text": "Now that we've looked at the architecture of the internet, let's see how you might connect your personal devices to the internet inside your house."},
		{"start": "7.536",
			"fin": "13.960",
			"text": "Well there are many ways to connect to the internet, and most often people connect wirelessly."},
		{"start": "13.961",
			"fin": "17.940",
			"text": "Let's look at an example of how you can connect to the internet.<br><br>"},
		{"start": "17.941",
			"fin": "30.920",
			"text": "If you live in a city or a town, you probably have a coaxial cable for cable Internet, or a phone line if you have DSL, running to the outside of your house, that connects you to the Internet Service Provider, or ISP.<br><br>"},
		{"start": "32.100",
			"fin": "41.190",
			"text": "If you live far out in the country, you'll more likely have a dish outside your house, connecting you wirelessly to your closest ISP, or you might also use the telephone system.<br><br>"},
		{"start": "42.350",
			"fin": "53.760",
			"text": "Whether a wire comes straight from the ISP hookup outside your house, or it travels over radio waves from your roof, the first stop a wire will make once inside your house, is at your modem."},
		{"start": "53.761",
			"fin": "57.780",
			"text": "A modem is what connects the internet to your network at home."},
		{"start": "57.781",
			"fin": "59.000",
			"text": "A few common residential modems are DSL or--"}
	];


// Function to round time to 2 decimals
timeRounder.round = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;

};



// Skip video to the time specified in span ID
  function play_to_text(e) {
  	video.currentTime = e.target.id;
  	video.play();
  }

  // Place text inside the #transcript with appropriate span and id
  	function create_transcript() {
  		var temp;
  		for (var i = 0; i < transcript_array.length; i++) {
  			// create a span element
  			temp = document.createElement('span');

  			// put the text to the span element
  			temp.innerHTML = transcript_array[i].text + ' ';

  			// set the id to the time of start of the cue
  			temp.setAttribute('id', transcript_array[i].start);

  			// append the element to transcript area
  			transcript_area.appendChild(temp);

  			// attach event listener that will run function play_to_text when span is clicked
  			temp.addEventListener('click', play_to_text);
  		}
  	}

//Call Function: create_transcipt to insert transcipt into html

create_transcript();

// set the total time of the video
	video.addEventListener('loadedmetadata', function() {
	   	total_time.innerHTML = video.duration;
	});

	// Event listener for the play/pause button
	playButton.addEventListener("click", function() {
		if (video.paused === true) {
			// Play the video
			video.play();

			// Update the button text to 'Pause'
			playButton.innerHTML = pause_clicked;
		} else {
			// Pause the video
			video.pause();

			// Update the button text to 'Play'
			playButton.innerHTML = play_clicked;
		}
	});


	// Event listener for the mute button
	muteButton.addEventListener("click", function() {
		if (video.muted === false) {
			// Mute the video
			video.muted = true;

			// Update the button text
			muteButton.innerHTML = unmute_clicked;
		} else {
			// Unmute the video
			video.muted = false;

			// Update the button text
			muteButton.innerHTML = mute_clicked;
		}
	});


	// Event listener for the full-screen button
	fullScreenButton.addEventListener("click", function() {
		if (video.requestFullscreen) {
			video.requestFullscreen();
		} else if (video.mozRequestFullScreen) {
			video.mozRequestFullScreen(); // Firefox
		} else if (video.webkitRequestFullscreen) {
			video.webkitRequestFullscreen(); // Chrome and Safari
		}
	});


	// Event listener for the seek bar
	seekBar.addEventListener("change", function() {
		// Calculate the new time
		var time = video.duration * (seekBar.value / 100);

		// Update the video time / time has too many decimals places....
		video.currentTime = time;

	});


	// Update the seek bar as the video plays
	video.addEventListener("timeupdate", function() {
		// Calculate the slider value
		var value = (100 / video.duration) * video.currentTime;

		// Update the slider value
		seekBar.value = value;


		// Update the seek bar value
		seekBar.value = value;


		// update current-time value;
		current_Time.innerHTML = timeRounder.round(video.currentTime,2);



		// highlight the appropriate transcript span
		for (var i = 0; i < transcript_array.length; i++)
      {

			// remove .highlight from all span elements first, and then
			document.getElementById(transcript_array[i].start).classList.remove('highlight');

			// find the span element with the correct id
			if (video.currentTime >= transcript_array[i].start && video.currentTime <= transcript_array[i].fin)
        {
				// append .highlight to the correct span
				document.getElementById(transcript_array[i].start).classList.add('highlight');
			  }
		  }

	});

	// Update video playback when seek bar is clicked anywhere
	seekBar.addEventListener('click', function(e) {
	   var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
	   video.currentTime = pos * video.duration;
	});



	// Pause the video when the seek handle is being dragged
	seekBar.addEventListener("mousedown", function() {
		video.pause();
	});

	// Play the video when the seek handle is dropped
	seekBar.addEventListener("mouseup", function() {
		video.play();
	});

	// Event listener for the volume bar
	volumeBar.addEventListener("change", function() {
		// Update the video volume
		video.volume = volumeBar.value;
	});



// Closed Caption Button Click Event

closedCaptionButton.addEventListener("click", function()
    {
    if (video.textTracks[0].mode == "showing"  )
    //show Closed Captions
    {video.textTracks[0].mode = "hidden";}
    //if Captions already showing then hide them
    else { video.textTracks[0].mode = "showing"; }

    });
  };
}
