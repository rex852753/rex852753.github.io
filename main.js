var isLogin = false;
var info = document.querySelector("#info");
var btn = document.querySelector("#btn");

if (isSupportWebPushAPI()) {
	regServiceWorker();
	btn.addEventListener('click', function() {
		if (isLogin) {
			unSubscribe().then(function(successful) {
				info.textContent = successful;
				btn.textContent = 'Login';
				isLogin = false;
			}).catch(function(error) {
				info.textContent = error;
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
