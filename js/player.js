(function (exports) {
    var player = {};

    player.init = function () {
        player.instrument = new Instrument();
        player.globalPitch = 0;
        player.globalTempo = 120;
    };

    player.play = function () {
        player.instrument.play();
    };

    player.stop = function () {
        player.instrument.stop();
    };

    exports.player = player;
})(this);

window.addEventListener('load', function () {
    //setup player
    player.init();

    //hookup buttons
    document.getElementById('player_play').addEventListener('click', player.play);
    document.getElementById('player_stop').addEventListener('click', player.stop);

    document.getElementById('player_pitchup').addEventListener('click', function () {
        player.instrument.pitch = (++player.globalPitch);
    });
    document.getElementById('player_pitchdown').addEventListener('click', function () {
        player.instrument.pitch = (--player.globalPitch);
    });

    document.getElementById('player_tempoup').addEventListener('click', function () {
        player.globalTempo += 25;
        player.instrument.tempo = player.globalTempo;
    });

    document.getElementById('player_tempodown').addEventListener('click', function () {
        player.globalTempo -= 25;
        player.instrument.tempo = player.globalTempo;
    });
});