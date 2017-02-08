var isLogin = false;
var info = document.querySelector("#info");
var btn = document.querySelector("#btn");

if (isSupportWebPushAPI()) {
	regServiceWorker();
	btn.addEventListener('click', function() {
		if (isLogin) {
			unSubscribe().then(function() {
				info.textContent = '';
				btn.textContent = 'Login';
				isLogin = false;
			});
		} else {
			subscribe().then(function(subscription) {
				info.textContent = JSON.stringify(subscription);
				btn.textContent = 'Logout';
				isLogin = true;
			});
		}
	});
} else {
	info.textContent = 'unsupport';
	btn.disabled = true;
}

info.textContent = navigator.userAgent;
