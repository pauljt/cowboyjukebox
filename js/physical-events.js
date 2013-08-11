'use strict';

var GPSwatch=0;
var can_send = true;

var myInstrument;
var instruments=[];
var mySource;
var sources={};

//UI Elements
var statusNode;

//polling
var polling;

function distance(a_lat, a_lon, b_lat, b_lon) {
  var R = 6371; // km

  return Math.acos(Math.sin(a_lat)*Math.sin(b_lat) +
                   Math.cos(a_lat)*Math.cos(b_lat) *
                   Math.cos(b_lon-a_lon)) * R;
}

function getID() {
	if (!localStorage.phone_id) {
		localStorage.phone_id = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                            s4() + '-' + s4() + s4() + s4()
	}

	return localStorage.phone_id;
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function registerInstrument(e) {
  statusNode.textContent='got geolocation';

  //Add our own instrument.
  var imei=getID();
  myInstrument={ imei : imei,
    slat:e.coords.latitude,
    slon:e.coords.longitude,
    lat:e.coords.latitude,
    lon:e.coords.longitude
  }

  createSource(myInstrument);
  modifySource(myInstrument);
  polling = setInterval(syncInstruments, 1000);

  //tell the server about us
  statusNode.textContent='Registering...';
  var xhr = new XMLHttpRequest();
  var uri = "http://cowboyjukebox.herokuapp.com/mk-instrument?imei=" + imei + "&slat=" + myInstrument.slat+ "&slon=" + myInstrument.slon + "&lat=" + myInstrument.lat+ "&lon=" + myInstrument.lon;
  xhr.open("GET", uri);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      statusNode.textContent= 'Registered';
    }
  }
  xhr.onerror=function(e) {
    statusNode.textContent= 'Error registering device:'+e.message;
  }
  navigator.geolocation.clearWatch(GPSwatch);
  GPSwatch = navigator.geolocation.watchPosition(updatePosition);
}

function updatePosition(e) {
  //update local instrument
  myInstrument.lat = e.coords.latitude;
  myInstrument.lon = e.coords.longitude;
  modifySource(myInstrument);
  updateInstrumentUI();

  navigator.geolocation.clearWatch(GPSwatch);
  setTimeout(function() {GPSwatch = navigator.geolocation.watchPosition(updatePosition);}, 1000);
}

function createSource(instrument) {
  //sources[instrument.imei]=T("sin").play();
  sources[instrument.imei] = {}
  sources[instrument.imei].step = 0;
  sources[instrument.imei].interval = 500;
  sources[instrument.imei].osc = T("osc");
  sources[instrument.imei].env = T("perc", {a:50, r:2500});
  sources[instrument.imei].oscenv = T("OscGen", {osc:sources[instrument.imei].osc, env:sources[instrument.imei].env , mul:0.15}).play();

  sources[instrument.imei].tune=T("interval", {interval:sources[instrument.imei].interval}, function(count) {
    var noteNum  = 69 + [0, 2, 4, 7, 9, 12,14,16,19,21][sources[instrument.imei].step % 10];
    var velocity = 64 + (count % 64);
    sources[instrument.imei].oscenv.noteOn(noteNum, velocity);
  }).start();
}

function modifySource(instrument) {
  // todo update instrument based on lat and lon
  var source=sources[instrument.imei];

  var lat=~~(distance(instrument.slat,0,instrument.lat,0)*10);
  var lon=~~(distance(0,instrument.slon,0,instrument.lon)*10);
  var dist=distance(instrument.slat,instrument.slon,instrument.lat,instrument.lon);

  console.log(dist,lat,lon);

  //do some cool shit yo
  //source.set({freq:300+(dist*400),phase:lat});

  sources[instrument.imei].tune.set({'interval':Math.abs(2000 - (~~(dist*50)))})
  sources[instrument.imei].step=lat;

}


function createInstrumentHTML(instrument) {
  var ul=document.createElement('ul');

  var li1=document.createElement('li');
  li1.textContent="Phone ID:"+instrument.imei;

  var li2=document.createElement('li');
  li2.textContent="lat:"+instrument.lat;

  var li3=document.createElement('li');
  li3.textContent="lon:"+instrument.lon;

  var li4=document.createElement('li');
  li4.textContent="dist:"+distance(instrument.slat,instrument.slon,instrument.lat,instrument.lon);

  ul.appendChild(li1);
  ul.appendChild(li2);
  ul.appendChild(li3);
  ul.appendChild(li4);

  return ul
}

function updateInstrumentUI() {
  var div = document.getElementById('instruments');
  div.innerHTML = '';
  div.appendChild(createInstrumentHTML(myInstrument));

  for (var i = 0; i < instruments.length; i++) {
    div.appendChild(createInstrumentHTML(instruments[i]));
  }
}



//once we register ourselves, we start polling the server for other intruments
function syncInstruments() {
  //send out position to server
  if (can_send) {
    document.getElementById('transmit').textContent = "SENDING";
    can_send = false;

    // Get the locations of all the band members (including yourself).
    var xhr = new XMLHttpRequest();
    var uri = "http://cowboyjukebox.herokuapp.com/update?imei=" + myInstrument.imei + "&lat=" + myInstrument.lat + "&lon=" + myInstrument.lon+"&rand="+Math.random();
    xhr.open("GET", uri);
    xhr.send();

    // Use the locations of all the other band members to synthesize the sound of the instrument.
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        can_send = true;
        statusNode.textContent = 'Recieved update ('+new Date()+')';
        document.getElementById('transmit').textContent = "RECEIVED";
        instruments = JSON.parse(xhr.responseText);

        updateInstrumentUI();

        for (var i = 0; i < instruments.length; i++) {
          if (instruments[i].imei &&!(instruments[i].imei in sources)) {
            console.log('adding instrument:'+instruments[i].imei)
            createSource(instruments[i]);
          }

          modifySource(instruments[i]);
        }
      }
    }
  }
}

function powerOn() {
    GPSwatch = navigator.geolocation.watchPosition(registerInstrument);
    statusNode.textContent='Looking for geolocation...';
}

function powerOff() {
   // stop listening to GPS events
  navigator.geolocation.clearWatch(GPSwatch);
  clearInterval(polling);

  sources[myInstrument.imei].tune.pause();

  for (var i = 0; i < instruments.length; i++) {
    sources[instruments[i].imei].tune.pause();
  }

  sources = {};

  myInstrument = null;
  instruments = null;


}

window.addEventListener('load', function() {
  document.getElementById('imei').textContent = getID();
  document.getElementById('play').addEventListener('click', powerOn);
  document.getElementById('stop').addEventListener('click', powerOff);

  statusNode=document.getElementById('status');
});
