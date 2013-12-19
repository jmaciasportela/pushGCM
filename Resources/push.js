Ti.API.debug("PUSHGCM - ACS - Loading module for push notification");

var ACSStatus = "stopped";

var Cloud = require("ti.cloud");

Cloud.debug = true;

Cloud.useSecure = true;

var pushDeviceToken = null;

var retry = 0;

var ACSpushUser = null;

var ACSpushUserPassword = null;

exports.ACSStatus = function() {
    return ACSStatus;
};

exports.init = function() {
    if (Titanium.Network.online) ACS_retrieveDeviceToken(); else {
        setTimeout(exports.init, 6e4);
        retry++;
    }
};

exports.close = function() {
    ACSStatus = "stopped";
    ACS_unsuscribeChannel();
};

var getAndroidPushModule = function() {
    try {
        return require("ti.cloudpush");
    } catch (err) {
        Ti.API.debug("PUSHGCM - ACS - ANDROID - Unable to require the ti.cloudpush module for Android!");
        return;
    }
};

var ACS_retrieveDeviceToken = function() {
    Ti.API.debug("PUSHGCM - ACS - ANDROID - Retrieving deviceToken (on Android)");
    var androidPushModule = require("ti.cloudpush");
    Ti.API.debug("PUSHGCM - ACS - ANDROID - Enable Push Module: " + androidPushModule.getEnabled());
    androidPushModule.enabled = true;
    androidPushModule.debug = true;
    Ti.API.debug("PUSHGCM - ACS - ANDROID - Enable Push Module: " + androidPushModule.getEnabled());
    androidPushModule.retrieveDeviceToken({
        success: function(e) {
            pushDeviceToken = e.deviceToken;
            Ti.API.debug("PUSHGCM - ACS - ANDROID - Push notification deviceToken is: " + pushDeviceToken);
            ACSStarted = "started";
            androidPushModule.debug = true;
            Ti.API.debug("PUSHGCM - ACS - ANDROID - Enable Push Module: " + androidPushModule.getEnabled());
            androidPushModule.setEnabled(true);
            Ti.API.debug("PUSHGCM - ACS - ANDROID - Enable Push Module: " + androidPushModule.getEnabled());
            Ti.API.debug("PUSHGCM - ACS - ANDROID - Register Android callback push handler");
            androidPushModule.addEventListener("callback", receivePush);
            androidPushModule.showTrayNotification = true;
            Ti.API.debug("PUSHGCM - ACS - ANDROID - showTrayNotification:" + androidPushModule.showTrayNotification);
            androidPushModule.showAppOnTrayClick = true;
            Ti.API.debug("PUSHGCM - ACS - ANDROID - showAppOnTrayClick:" + androidPushModule.showAppOnTrayClick);
            androidPushModule.showTrayNotificationsWhenFocused = true;
            Ti.API.debug("PUSHGCM - ACS - ANDROID - showTrayNotificationsWhenFocused:" + androidPushModule.showTrayNotificationsWhenFocused);
            androidPushModule.focusAppOnPush = false;
            Ti.API.debug("PUSHGCM - ACS - ANDROID - focusAppOnPush:" + androidPushModule.focusAppOnPush);
            ACS_suscribeChannel();
        },
        error: function(e) {
            ACSStarted = "error";
            Ti.API.debug("PUSHGCM - ACS - ANDROID - Error retrieving deviceToken: " + e.error);
            setTimeout(exports.init, 6e4);
            retry++;
        }
    });
};

var ACS_suscribeChannel = function() {
    Cloud.PushNotifications.subscribeToken({
        channel: "pushGCM",
        device_token: pushDeviceToken,
        type: "android"
    }, function(e) {
        if (e.success) {
            ACSStatus = "started";
            retry = 0;
            Ti.API.debug("PUSHGCM - ACS - Channel PUSHGCM subscribed OK:" + JSON.stringify(e));
        } else Ti.API.debug("PUSHGCM - ACS - Channel subscribed NOK:" + JSON.stringify(e));
    });
};

var ACS_unsuscribeChannel = function() {
    Cloud.PushNotifications.unsubscribeToken({
        channel: "pushGCM",
        device_token: Ti.App.Properties.getString("ACSdeviceToken")
    }, function(e) {
        e.success && Ti.API.debug("PUSHGCM - ACS - Sucess Logout on PUSH platform: " + JSON.stringify(e));
    });
};

var receivePush = function(e) {
    Ti.API.debug("PUSHGCM - ACS - PUSH Received:" + JSON.stringify(e));
    var payload = JSON.parse(e.payload);
    alert(e.payload);
    Alloy.Globals.tts.speak(payload.custom.message);
};