'use strict';

var GPSwatch=0;
var id = getID();
var bmId = 0;
var sounds = new Array();

sounds[0] = {freq: 700.0, lat: -28.22885825351606, lon: 153.2699418067932};
sounds[1] = {freq: 900.0, lat: -28.22872591415725, lon: 153.269724547863};
sounds[2] = {freq: 400.0, lat: -28.228978776717906, lon: 153.26967492699623};
// sounds[3] = {freq: 900.0, lat: -28.228721187748544, lon: 153.269724547863};
// sounds[4] = {freq: 1100.0, lat: -28.228722369350738, lon: 153.2699780166149};

function distance(a_lat, a_lon, b_lat, b_lon) {
  var R = 6371; // km

  return Math.acos(Math.sin(a_lat)*Math.sin(b_lat) +
                   Math.cos(a_lat)*Math.cos(b_lat) *
                   Math.cos(b_lon-a_lon)) * R;
}

function getID() {
	if (!localStorage.phone_id) {
		localStorage.phone_id = Math.random() + "";
	}

	return localStorage.phone_id;
}

function sendLocation(crd) {
  var xhr = new XMLHttpRequest();
  var uri = "http://cowboyjukebox.herokuapp.com/update?imei=" + id + "&lat=" + crd.latitude + "&lon=" + crd.longitude;

  xhr.open("GET", uri, true);
  xhr.send();
}

function updateAudio(imei, id, lat, lon, sound) {
    //update pitch of synth
    console.log(sound);
    var dist = distance(lat, lon, sound.lat, sound.lon);
    var afreq = dist * sound.freq;
    alterFreq(id, afreq);

    // update UI.
    document.getElementById(id).getElementsByClassName('phoneid')[0].textContent = imei;
    document.getElementById(id).getElementsByClassName('lat')[0].textContent = lat;
    document.getElementById(id).getElementsByClassName('lon')[0].textContent = lon;
    document.getElementById(id).getElementsByClassName('bfreq')[0].textContent = sound.freq;
    document.getElementById(id).getElementsByClassName('afreq')[0].textContent = afreq;
    document.getElementById(id).getElementsByClassName('dist')[0].textContent = dist;
}

function updatePosition(pos) {
  var crd = pos.coords;

  // If we know what our band member ID, we can perform a live update.
  updateAudio(id, bmId, crd.latitude, crd.longitude, sounds[bmId]);

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

      for (var j = 0; j < bm.length; j++) {
        if (bm[j].imei === id) {
          bmId = j;
        } else {
          updateAudio(bm[j].imei, j, bm[j].lat, bm[j].lon, sounds[j]);
        }
      }
    }
  }
}

function powerOn() {
	if (!GPSwatch) {
		start();
		navigator.geolocation.getCurrentPosition(updatePosition);
		GPSwatch = navigator.geolocation.watchPosition(updatePosition);
	} else {

	}
}

function powerOff() {
  stop();
  //navigator.geolocation.clearWatch(watchID);
}

var freqnode;
window.addEventListener('load', function() {;
  document.getElementById('play').addEventListener('click', powerOn);
  document.getElementById('stop').addEventListener('click', powerOff);
});
