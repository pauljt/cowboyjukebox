'use strict';

var GPSwatch=0;
var id = getID();

var can_send = true;

var sources= {}

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

function updateAudio(phoneid, sid, lat, lon, sound) {
    // first add the source if it doesn't exist
    if(!(phoneid in sources)){
    	var src = T("sin").play();
    	sources[phoneid]={lat:0,lon:0,audio:src};
    }

    // modify source
    var dist = distance(lat, lon, sound.lat, sound.lon);
    var afreq = dist * sound.freq;
    sources[phoneid].audio.set({freq:afreq});
    //alterFreq(id, afreq);

    // update UI.
    //document.getElementById(sid).getElementsByClassName('phoneid')[0].textContent = imei;
    //document.getElementById(sid).getElementsByClassName('lat')[0].textContent = lat;
    //document.getElementById(sid).getElementsByClassName('lon')[0].textContent = lon;
    //document.getElementById(sid).getElementsByClassName('bfreq')[0].textContent = sound.freq;
    //document.getElementById(sid).getElementsByClassName('afreq')[0].textContent = afreq;
    //document.getElementById(sid).getElementsByClassName('dist')[0].textContent = dist;
}

function updatePosition(pos) {
  var crd = pos.coords;

  // If we know what our band member ID, we can perform a live update.
  updateAudio(id, bmId, crd.latitude, crd.longitude, sounds[bmId]);

  if (can_send) {
    document.getElementById('transmit').textContent = "SENDING";
    can_send = false;
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
        can_send = true;
        document.getElementById('transmit').textContent = "RECEIVED";
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
}

function powerOn() {

	if (!GPSwatch) {
		//start();

		//add our source
		var src = T("sin").play();
		sources[id]={lat:0,lon:0,audio:src};
		sources[id].audio.set({freq:400});

		navigator.geolocation.getCurrentPosition(updatePosition);
		GPSwatch = navigator.geolocation.watchPosition(updatePosition);
	} else {

	}
}

function powerOff() {
  stop();
  delete sources[id];
  //navigator.geolocation.clearWatch(watchID);
}

var freqnode;
window.addEventListener('load', function() {
  document.getElementById('id').textContent = id;
  document.getElementById('play').addEventListener('click', powerOn);
  document.getElementById('stop').addEventListener('click', powerOff);
});
