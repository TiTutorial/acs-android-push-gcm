Titanium.UI.setBackgroundColor('#000');
var deviceToken;
var win = Ti.UI.createWindow({
	backgroundColor : '#ccc',
	title : 'Android Cloud Push Notification'
});

var CloudPush = require('ti.cloudpush');

//fetch device token
CloudPush.retrieveDeviceToken({
	success : function deviceTokenSuccess(e) {
		deviceToken = e.deviceToken;
		alert('Device Token: ' + deviceToken);
		Ti.API.info('Device Token: ' + e.deviceToken);
	},
	error : function deviceTokenError(e) {
		alert('Failed to register for push! ' + e.error);
	}
});

CloudPush.debug = true;
CloudPush.enabled = true;
CloudPush.showTrayNotificationsWhenFocused = true;
CloudPush.focusAppOnPush = false;

var Cloud = require('ti.cloud');
Cloud.debug = true;

var submit = Ti.UI.createButton({
	title : 'Register For Push Notification',
	color : '#000',
	height : '53dp',
	width : '200dp',
	top : '100dp'
});

win.add(submit);

submit.addEventListener('click', function(e) {
	loginDefault();
});

function loginDefault(e) {
	//Create a Default User in Cloud Console, and login with same credential
	Cloud.Users.login({
		login : 'push123',
		password : 'push123'
	}, function(e) {
		if (e.success) {
			alert("Login success");
			defaultSubscribe();
		} else {
			alert('Login error: ' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}

function defaultSubscribe() {
	Cloud.PushNotifications.subscribe({
		channel : 'alert2',//'alert' is channel name
		device_token : deviceToken,
		type : 'android' //here i am using gcm, it is recomended one
	}, function(e) {
		if (e.success) {
			alert('Subscribed for Push Notification!');
		} else {
			alert('Subscrib error:' + ((e.error && e.message) || JSON.stringify(e)));
		}
	});
}


CloudPush.addEventListener('callback', function(evt) {
	alert(evt.payload);
});
CloudPush.addEventListener('trayClickLaunchedApp', function(evt) {
	Ti.API.info('@@## Tray Click Launched App (app was not running)');
});
CloudPush.addEventListener('trayClickFocusedApp', function(evt) {
	Ti.API.info('@@## Tray Click Focused App (app was already running)');
});
win.open();
