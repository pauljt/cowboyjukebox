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

function update() {
  var xhr = new XMLHttpRequest();
  var uri = "http://cowboyjukebox.herokuapp.com/update?imei=" + id + "&lat=" + 2.4 + "&lon=" + 2.4;
  console.log(uri);

  xhr.open("GET", uri, true);
  xhr.send();
}

function success(pos) {
  var crd = pos.coords;
  document.getElementById("lat").innerHTML = crd.latitude;
  document.getElementById("long").innerHTML = crd.longitude;
  document.getElementById("dist").innerHTML = distance(crd, -28.228853527113206, 153.2699418067932);
};

function toggleGPS(){
	if(!GPSwatch){
		navigator.geolocation.getCurrentPosition(success);
		GPSwatch=navigator.geolocation.watchPosition(success);
	}else{
		navigator.geolocation.clearWatch(watchID);
	}
}

window.addEventListener('load',function(){
	document.getElementById('play1').addEventListener('click',SoundManager.handle);
	document.getElementById('play2').addEventListener('click',SoundManager.handle);
  document.getElementById('phoneid').textContent=id;
});



