// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};


// Require in the module
Alloy.Globals.push = require('push');
Alloy.Globals.push.init();


Alloy.Globals.tts = require("jp.isisredirect.tts");

var tts = require("jp.isisredirect.tts");
tts.addEventListener(Alloy.Globals.tts.TTS_INITOK, function(e) {
    //Alloy.Globals.tts.speak("Arrancando motores...");
});

Alloy.Globals.tts.addEventListener(Alloy.Globals.tts.TTS_UTTERANCE_COMPLETE, function(e) {
    if (e.utteranceid == "spoken Hello") {
        Alloy.Globals.tts.speak("world");
    }
});
Alloy.Globals.tts.initTTS();