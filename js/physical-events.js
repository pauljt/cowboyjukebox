'use strict';

var GPSwatch=0;
var id = getID();
var sounds = new Array();
sounds[0] = {lat: -28.228853527113206, lon: 153.2699418067932};

function distance(a_lat, a_lon, b_lat, b_lon) {
  var R = 6371; // km

  return Math.acos(Math.sin(a_lat)*Math.sin(b_lat) +
                   Math.cos(a_lat)*Math.cos(b_lat) *
                   Math.cos(b_lon-a_lon)) * R;
}

function getID() {
  var id = window.location.toString();
  id = id.substring(id.indexOf("//") + 2, id.length - 1);
  id = id.substring(0, id.indexOf("/"));

  return id;
}

function sendLocation(crd) {
  var xhr = new XMLHttpRequest();
  var uri = "http://cowboyjukebox.herokuapp.com/update?imei=" + id + "&lat=" + crd.latitude + "&lon=" + crd.longitude;

  xhr.open("GET", uri, true);
  xhr.send();
}

function updateAudio(pos) {
  var crd = pos.coords;

  // Update the UI with details of your current position.
  document.getElementById("lat").textContent = crd.latitude;
  document.getElementById("lon").textContent = crd.longitude;

  // Share your location with everyone else.
  sendLocation(crd);

  // Get the locations of all the band members (including yourself).
  var xhr = new XMLHttpRequest();
  var uri = "http://cowboyjukebox.herokuapp.com/?rand=" + Math.random();
  xhr.open("GET", uri, true);
  xhr.send();

  // Use the locations of all the other band members to synthesize the sound of the instrument.
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var bm = JSON.parse(xhr.responseText);

      for (var i = 0; i < bm.length; i++) {
        for (var j = 0; j < sounds.length; j++ ) {
          var d = distance(bm[i].lat, bm[i].lon, sounds[j].lat, sounds[j].lon);
          console.log(d);
        }
      }
    }
  }

  //update pitch of synth
  var dist=distance(crd.latitude,crd.longitude,sounds[0].lat,sounds[0].lon);
  alterFreq(0, dist*400.0);
  document.getElementById("dist").textContent = dist;
}

function powerOn() {
	if (!GPSwatch) {
		start();
		navigator.geolocation.getCurrentPosition(updateAudio);
		GPSwatch = navigator.geolocation.watchPosition(updateAudio);
	} else {

	}
}

function powerOff() {
  stop();
  navigator.geolocation.clearWatch(watchID);
}

var freqnode;
window.addEventListener('load', function() {;
  document.getElementById('play').addEventListener('click', powerOn);
  document.getElementById('stop').addEevntListener('click', powerOff);

  document.getElementById('phoneid').textContent=id;
  freqnode=document.getElementById("freq")
});
