var playing = false,
    recording = false,
    videoDuration,
    totalDuration,
    camera=[],
    audio=[],
    audioSourceHTML ="";



var flashReady = function() {
  flash.connect('rtmp://localhost/SMSServerTwo');
};

$('.play').click(function(e){
  if(!playing){
    flash.playPause();
    $('.play img').attr('src', 'img/play.png');
    playing = true;
  } else{
    flash.playPause();
    $('.play img').attr('src', 'img/stop.png');
    playing = false;
  }
  e.preventDefault();
  return false;
});

$('.rec').on('click', function(e){
  if(!recording){
    flash.startRecording('movie', 0, 0);
    recording = true;
  } else {
    flash.stopRecording();
    flash.startPlaying('hobbit_vp6.flv');
    recording = false;
  }
  e.preventDefault();
  return false;
});
  
var connected = function(success,error){
  if(success){
    audio = flash.getMicrophones();
    
    flash.startPlaying("hobbit_vp6.flv");
    $('.play img').attr('src', 'img/stop.png');

    loadSources();
  } 
};


var getDuration = function(time){
  videoDuration = time;
  var videoDurationMin = Math.floor(time/60);
  var videoDurationSec = Math.floor(time % 60);
  $('#time').text(totalDuration = videoDurationMin + ':' + videoDurationSec);
  console.log('get duration');
  
}

var seekTime = function(time){
  var currentMin = Math.floor(time/60);
  var currentSec = Math.floor(time % 60);

  if (currentSec < 10){
    $('#time').text(currentMin + ':0' + currentSec + " / " + totalDuration); 
  } else{
    $('#time').text(currentMin + ':' + currentSec + ' / ' + totalDuration);
  }  
  
}

$('.seekbar').on('click', function(e){
  var left = e.pageX - $(this).offset().left;
  var perc = left / $('.seekbar').width();
  var time = perc * videoDuration;

  $('.seek_cursor').css('margin-left', left+'px');

  flash.setTime(time);

  e.preventDefault();
  console.log(perc);
  return false;

});

$('.volbar').on('click', function(e){
  var left = e.pageX - $(this).offset().left;
  var perc = left / $('.volbar img').width();
  $('.volbar img').css('margin-left', left+'px');
  flash.setVolume(perc);
});


$('.mic').mouseenter(function(){
  $('.mic div').html('<select>' + audioSourceHTML + "</select>").fadeIn();
}); 
     
$('select').mouseleave(function(){
  $(this).fadeOut();
});

var loadSources = function(){
  for(var i = 0, max = cameras.length; i<max; i++) {
    audioSourceHTML += '<option><a href="#">'+ audio[i] + '</a></option>';
  };
};
