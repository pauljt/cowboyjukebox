(function (exports) {
    var sensor = {};
    var pad;

    sensor.init = function (padDiv) {
        pad = padDiv;
    };

    sensor.start = function (e) {
        var x = e.pageX - pad.offsetLeft;
        var y = e.pageY - pad.offsetTop;

        player.instrument.pitch = ((x / 100) * 20)|0;
        player.instrument.tempo = 120+ ((y / 100) * 140);

        player.play();
        pad.addEventListener('mousemove', sensor.update);
        //pad.addEventListener('mouseout', sensor.stop);

        console.log("pitch:", player.instrument.pitch, "tempo:", player.instrument.tempo);
        console.log("x:", x, "y:", y);

    };

    sensor.update = function (e){
        var x = e.pageX - pad.offsetLeft;
        var y = e.pageY - pad.offsetTop;
        player.instrument.pitch = (x / 100 * 10) | 0;
        player.instrument.tempo = (y / 100 * 200);
    };

    sensor.stop = function (e) {
        player.stop();
        pad.removeEventListener('mousemove', sensor.update);
        //pad.removeEventListener('mouseout', sensor.stop);
    };

    exports.sensor = sensor;
})(this);

window.addEventListener('load', function() {
    //setup player
    var pad = document.getElementById('pad');
    sensor.init(pad);


    pad.addEventListener('mouseup', sensor.stop);
    pad.addEventListener('mousedown', sensor.start);



});