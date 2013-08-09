var GPSwatch=0;

function distance(a, lat, lon) {
  var R = 6371; // km

  return Math.acos(Math.sin(a.latitude)*Math.sin(lat) +
                   Math.cos(a.latitude)*Math.cos(lat) *
                   Math.cos(lon-a.longitude)) * R;
}

// -28.228853527113206, 153.2699418067932

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
	document.getElementById('phoneid').textContent=window.location;

});



