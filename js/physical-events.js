

var id, target, option;

function success(pos) {
  var crd = pos.coords;
  document.getElementById("lat").innerHTML = crd.latitude
  document.getElementById("long").innerHTML = crd.longitude
};


setInterval(function(e){
  navigator.geolocation.getCurrentPosition(success)
},1000);
