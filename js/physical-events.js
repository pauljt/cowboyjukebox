
function distance(a, b) {
  var R = 6371; // km

  return Math.acos(Math.sin(a.coords.latitude)*Math.sin(b.coords.latitude) +
                   Math.cos(a.coords.latitude)*Math.cos(b.coords.latitude) *
                   Math.cos(b.coords.longitude-a.coords.longitude)) * R;
}

var id, target, option;

function success(pos) {
  var crd = pos.coords;
  document.getElementById("lat").innerHTML = crd.latitude
  document.getElementById("long").innerHTML = crd.longitude
};

setInterval(function(e){
  navigator.geolocation.getCurrentPosition(success)
},1000);

