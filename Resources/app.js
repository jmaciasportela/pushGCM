var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.push = require("push");

Alloy.Globals.push.init();

Alloy.Globals.tts = require("jp.isisredirect.tts");

var tts = require("jp.isisredirect.tts");

tts.addEventListener(Alloy.Globals.tts.TTS_INITOK, function() {});

Alloy.Globals.tts.addEventListener(Alloy.Globals.tts.TTS_UTTERANCE_COMPLETE, function(e) {
    "spoken Hello" == e.utteranceid && Alloy.Globals.tts.speak("world");
});

Alloy.Globals.tts.initTTS();

Alloy.createController("index");