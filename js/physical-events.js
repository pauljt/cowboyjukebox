
function distance(a, lat, lon) {
  var R = 6371; // km

  return Math.acos(Math.sin(a.latitude)*Math.sin(lat) +
                   Math.cos(a.latitude)*Math.cos(lat) *
                   Math.cos(lon-a.longitude)) * R;
}

// -28.228853527113206, 153.2699418067932

var id, target, option;

function success(pos) {
  var crd = pos.coords;
  document.getElementById("lat").innerHTML = crd.latitude;
  document.getElementById("long").innerHTML = crd.longitude;
  document.getElementById("dist").innerHTML = distance(crd, -28.228853527113206, 153.2699418067932);
};

navigator.geolocation.getCurrentPosition(success);

// setInterval(function(e){
navigator.geolocation.watchPosition(success);
// },1000);

