window.Raptor = {
    buffers: {},
    context: new (window.AudioContext || window.webkitAudioContext),
    loadAudio: function () {
        var self = this;

        $.each(this.samples, function (command, filename) {
            var request = new XMLHttpRequest();

            request.open('GET', '/sounds/' + filename, true);
            request.responseType = 'arraybuffer';

            // Decode asynchronously
            request.onload = function() {
                self.context.decodeAudioData(request.response, function(buffer) {
                    self.buffers[command] = buffer;
                }, function (e) { console.log(e) });
            }
            request.send();
        });
    },
    playAudioFile: function (command) {
        var source = this.context.createBufferSource(),
            buffer = this.buffers[command.trim()];

        if (!buffer) return;
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start(0);
    },
    recognition: new webkitSpeechRecognition(),
    samples: {
        ''           : 'Roboraptor_0x180.wav',
        ''           : 'Roboraptor_0x186.wav',
        ''           : 'Roboraptor_0x187.wav',
        ''           : 'Roboraptor_0x188.wav',
        'stop'       : 'Roboraptor_0x18E.wav',
        ''           : 'Roboraptor_0x191.wav',
        ''           : 'Roboraptor_0x192.wav',
        ''           : 'Roboraptor_0x193.wav',
        ''           : 'Roboraptor_0x194.wav',
        'guard mode' : 'Roboraptor_0x1B0.wav',
        'free roam'  : 'Roboraptor_0x1B1.wav',
        'cautious'   : 'Roboraptor_0x1B2.wav',
        'playful'    : 'Roboraptor_0x1B3.wav',
        'hunt'       : 'Roboraptor_0x1B4.wav',
        'demo'       : 'Roboraptor_0x1D0.wav',
        'bite'       : 'Roboraptor_0x1D1.wav',
        'sniff'      : 'Roboraptor_20msBeam_LoopSending.wav'
    }
}

window.onload = function () {
    Raptor.recognition.continuous     = true;
    Raptor.recognition.interimResults = true;
    Raptor.recognition.onresult = function (event) {
        var results    = event.results,
            transcript = event.results[results.length - 1][0].transcript,
            $display   = $('#voice-command-display');

        $display.html(transcript);
        Raptor.playAudioFile(transcript);
    }
    Raptor.loadAudio();
    Raptor.recognition.start();
}
