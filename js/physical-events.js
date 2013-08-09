var GPSwatch=0;

function distance(a, lat, lon) {
  var R = 6371; // km

  return Math.acos(Math.sin(a.latitude)*Math.sin(lat) +
                   Math.cos(a.latitude)*Math.cos(lat) *
                   Math.cos(lon-a.longitude)) * R;
}

// -28.228853527113206, 153.2699418067932

var id = getID();

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
  document.getElementById("lat").innerHTML = crd.latitude;
  document.getElementById("long").innerHTML = crd.longitude;
  document.getElementById("dist").innerHTML = distance(crd, -28.228853527113206, 153.2699418067932);

  // Share your location with everyone else.
  sendLocation(crd);

  // Get the locations of all the other band members.
  var xhr = new XMLHttpRequest();
  var uri = "http://cowboyjukebox.herokuapp.com/?rand=" + Math.random();
  xhr.open("GET", uri, true);
  xhr.send();

  // Use the locations of all the other band members to synthesize the sound of the instrument.
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      console.log(JSON.parse(xhr.responseText));
      // UPdate sound levels.
    }
  }
}

function toggleGPS() {
	if (!GPSwatch) {
		navigator.geolocation.getCurrentPosition(updateAudio);
		GPSwatch = navigator.geolocation.watchPosition(updateAudio);
	} else {
		navigator.geolocation.clearWatch(watchID);
	}
}

window.addEventListener('load',function(){
	document.getElementById('play1').addEventListener('click',SoundManager.handle);
	document.getElementById('play2').addEventListener('click',SoundManager.handle);
  document.getElementById('phoneid').textContent=id;
});
