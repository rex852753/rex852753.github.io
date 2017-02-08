var isLogin = false;
var info = document.querySelector("#info");
var btn = document.querySelector("#btn");

if (isSupportWebPushAPI()) {
	regServiceWorker();
	btn.addEventListener('click', function() {
		if (isLogin) {
			navigator.serviceWorker.ready.then(function(reg) {
  reg.pushManager.getSubscription().then(function(subscription) {
    subscription.unsubscribe().then(function(successful) {
				info.textContent = successful;
				btn.textContent = 'Login';
				isLogin = false;
    }).catch(function(e) {
	info.textContent = error;
    })
  })        
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
