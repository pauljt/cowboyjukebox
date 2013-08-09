window.addEventListener("devicemotion", function (e) {
  if (e.acceleration) {
    document.getElementById("acceleration-x").innerHTML = e.acceleration.x
    document.getElementById("acceleration-y").innerHTML = e.acceleration.y
    document.getElementById("acceleration-z").innerHTML = e.acceleration.z
  }

  if (e.accelerationIncludingGravity) {
    document.getElementById("acceleration-gravity-x").innerHTML = e.accelerationIncludingGravity.x
    document.getElementById("acceleration-gravity-y").innerHTML = e.accelerationIncludingGravity.y
    document.getElementById("acceleration-gravity-z").innerHTML = e.accelerationIncludingGravity.z
  }

  document.getElementById("interval").innerHTML = e.interval;

  if (e.rotationRate) {
    document.getElementById("rot-rate-alpha").innerHTML = e.rotationRate.alpha
    document.getElementById("rot-rate-beta").innerHTML = e.rotationRate.beta
    document.getElementById("rot-rate-gamma").innerHTML = e.rotationRate.gamma
  }
}, false);

window.addEventListener("deviceorientation", function (e) {
  if (e) {
    document.getElementById("orientation-alpha").innerHTML = e.alpha
    document.getElementById("orientation-beta").innerHTML = e.beta
    document.getElementById("orientation-gamma").innerHTML = e.gamma
  }
}, false);

window.addEventListener("compassneedscalibration", function (e) {
  document.getElementById("compassneedscalibration").innerHTML = "true";
}, false);


var id, target, option;

function success(pos) {
  var crd = pos.coords;

  document.getElementById("lat").innerHTML = crd.latitude
  document.getElementById("long").innerHTML = crd.longitude

  if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
    console.log('Congratulation, you reach the target');
    navigator.geolocation.clearWatch(id);
  }
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
  document.getElementById("lat").innerHTML='ERROR(' + err.code + '): ' + err.message;
  document.getElementById("long").innerHTML='ERROR(' + err.code + '): ' + err.message;
};

target = {
  latitude : 0,
  longitude: 0,
}

options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);