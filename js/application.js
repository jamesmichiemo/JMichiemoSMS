var flashReady = function() {
played();
function played(){

  $('.play').click(function(){
    var par = $(this).parent();
    flash.connect('rtmp://localhost/SMSServerTwo');
    $(this).remove();
    $(par).prepend("<li><img class='stop' src='img/stop.png' alt='stop' height='20' width='20'></li>");
    paused();
  });
}
function paused(){
  $('.stop').click(function(){
    var par = $(this).parent();
    flash.playPause();
    $(this).remove();
    $(par).prepend("<img class='play' src='img/play.png' alt='play' height='20' width='20'>");
    played();
  });
}
};



var connected = function(success,error){
  if(success){
    flash.startPlaying("hobbit_vp6.flv");
  } 
};



