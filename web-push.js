'use strict';

const swURL = 'sw.js';
const VAPIDPublicKey = 'BNNrb5X1IgNzTZnM5N9XGeLYmbGn3ZGC982Gf8lRJR2jGBoKbfNpGvfLoXXVg-IRE7---edADIEZixFdD0thJ4k';

function getBrowserInfo()
{
	var ua = navigator.userAgent, tem,
	M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

	if(/trident/i.test(M[1])) {
		tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE '+(tem[1] || '');
	}

	if(M[1]=== 'Chrome') {
		tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
		if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	}

	M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	if((tem= ua.match(/version\/(\d+)/i))!= null)
		M.splice(1, 1, tem[1]);

	return M.join('_');
}

function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}

	return outputArray;
}

function isSupportWebPushAPI() {
	var info = getBrowserInfo().split('_');

	var name = info[0];
	var version = info[1];

	if (location.protocol != "https:") {
		return false;
	}

	if (!('serviceWorker' in navigator)) {
		// Service Worker basic support IE: X, Safari: X, Chrome: 40.0+, Firefox: 44.0+
		return false;
	}

	if (((name != 'Chrome') && (name != 'Firefox')) ||
		((name == 'Chrome') && (version < 52)) ||
		((name == 'Firefox') && (version < 46))) {
		return false;
	}

	return true;
}

function regServiceWorker() {
	return new Promise(function(resolve, reject) {
		if (('serviceWorker' in navigator) && ('PushManager' in window)) {
			navigator.serviceWorker.register(swURL).then(function(swReg) {
				resolve(swReg);
			}).catch(function(error) {
				reject(error);
			});
		} else {
			reject('Push notification is not supported');
		}
	});
}

function subscribe() {
	return new Promise(function(resolve, reject) {
		navigator.serviceWorker.ready.then(function(swReg) {
			return swReg.pushManager.getSubscription();
		}).then(function(subscription) {
			if (null == subscription) {
				return doSubscribe()
			} else {
				return pairSubscriptionWithServer(subscription);
			}
		}).then(function(subscription) {
			resolve(subscription);
		}).catch(function(error) {
			reject('Error during subscribe()');
		});
	});
}

function doSubscribe() {
	return new Promise(function(resolve, reject) {
		navigator.serviceWorker.ready.then(function(swReg) {
			var subscribeParam = {
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(getVAPIDPublicKey())
			};
			return swReg.pushManager.subscribe(subscribeParam);
		}).then(function(subscription) {
			return pairSubscriptionWithServer(subscription);
		}).then(function(subscription) {
			resolve(subscription);
		}).catch(function(error) {
			reject();
		});
	});
}

function getVAPIDPublicKey() {
	return VAPIDPublicKey;
}

function unSubscribe() {
	return new Promise(function(resolve, reject) {
		navigator.serviceWorker.ready.then(function(swReg) {
			return swReg.pushManager.getSubscription();
		}).then(function(subscription) {
			return subscription.unsubscribe();
		}).then(function(successful) {
			resolve(successful);
		}).catch(function(error) {
			reject(error);
		});
	});
}

function pairSubscriptionWithServer(subscription) {
	return new Promise(function (resolve, reject) {
		resolve(subscription);
	});
}

function unpairSubscriptionWithServer(endpoint) {
	return new Promise(function (resolve, reject) {

				resolve();

	});
}
