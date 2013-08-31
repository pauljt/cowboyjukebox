(function (exports) {

    function Instrument() {
        this.init();
    }

    //Timbre instance to generate noise.
    var source = {};
    var _pitch = 0;
    var _tempo = 120;

    Instrument.prototype = {
        constructor: Instrument,

        init: function () {
            source.osc = T("osc");
            source.env = T("perc", {a: 50, r: 500});
            source.oscenv = T("OscGen", {osc: source.osc, env: source.env, mul: 0.15}).play();
            source.tune = T("interval", {interval: 60000 / _tempo}, function (count) {
                var noteNum = 69 + [0, 2, 4, 7, 9, 12, 14, 16, 19, 21][_pitch % 10];
                var velocity = 128;
                source.oscenv.noteOn(noteNum, velocity);
            });
        },

        set pitch(x) {
            _pitch = Math.abs(x);
        },

        get pitch() {
            return _pitch;
        },

        set tempo(x) {
            if (x != 0) {
                //covert from BPM to millis delay
                _tempo =  x;
                console.log(_tempo)
            }
            //convert tempo a millis delay and update current tune;
            source.tune.set({'interval': 60000 / _tempo});
        },

        get
            tempo() {
            return _tempo;
        },

        play: function () {
            source.tune.start();
        },

        stop: function () {
            source.tune.stop();
        }
    };

    exports.Instrument = Instrument;
})(this);