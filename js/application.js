var playing = false,
    recording = false,
    videoDuration,
    totalDuration,
    camera=[],
    audio=[],
    audioSourceHTML ="";

//Firebase
var myDataRef = new Firebase("https://emuacademy.firebaseio.com/");

$('#messageInput').keypress(function (e) {
  if (e.keyCode == 13) {
  var name = $('#nameInput').val();
  var text = $('#messageInput').val();
  myDataRef.push({name: name, text: text});
  $('#messageInput').val('');
}
            });
            myDataRef.on('child_added', function(snapshot) {
              var message = snapshot.val();
              displayChatMessage(message.name, message.text);
            });
            function displayChatMessage(name, text) {
              $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
              $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
            }

var auth = new FirebaseSimpleLogin(myDataRef, function(error, user) {
    if (error) {
      // an error occurred while attempting login
      alert(error);
    } else if (user) {
      // user authenticated with Firebase
      alert('User ID: ' + user.name + ', Provider: ' + user.provider);
      if (user.provider == 'github'){
        $('#gh_login').html("Log out");
        $('#tw_login').html('');
        $('#nameInput').val(user.name);
      }else{
        $('#tw_login').html('Log out');
        $('#gh_login').html('');
      }
    } else {
      // user is logged out
    }
});

$("#gh_login").on("click", function(e){
	if ($(this).html() == "Github Login") {
		auth.login("github");
    $(this).html("Log out");
    $('#tw_login').html('');
    $('#nameInput').val(user.name);
	} else {
		auth.logout();
		$(this).html("Github Login");
    $('#tw_login').html('Twitter Login');
	}
});

$("#tw_login").on("click", function(e){
	if ($(this).html() == "Twitter Login") {
		auth.login('twitter');
    $(this).html("Log out");
    $('#gh_login').html('');
    $('#nameInput').val(user.name);
  } else {
		auth.logout();
		$(this).html("Twitter Login");
    $('#gh_login').html('Github Login');
	}
});



// end firebase


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
  
};

var seekTime = function(time){
  var currentMin = Math.floor(time/60);
  var currentSec = Math.floor(time % 60);

  if (currentSec < 10){
    $('#time').text(currentMin + ':0' + currentSec + " / " + totalDuration); 
  } else{
    $('#time').text(currentMin + ':' + currentSec + ' / ' + totalDuration);
  }  
  
};

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

$('.camSelect').click(function(){
  var cameras = flash.getCameras();
  for(var i=0; cameras.length > i ; i++){
    $('.camSelect').append('<option>'+cameras[i]+'</option>');
  }
  $(this).unbind();
});

$('.micSelect').click(function(){
  var microphones = flash.getMicrophones();
  for(var i=0; microphones.length > i ; i++){
    $('.micSelect').append('<option>'+microphones[i]+'</option>');
  }
  $(this).unbind();
});






