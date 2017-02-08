'use strict';

self.addEventListener('push', function(event) {
	var title = 'Synology Community';
	var options = {
		body: '',
		icon: 'push-icon.jpg',
		data: {
			url: 'https://forum.synology.com/enu/'
		}
	};

	if (event.data) {
		var jsonData = {};

		try {
			jsonData = event.data.json();
		} catch(e) {
			console.log(e);
		}

		if (jsonData.hasOwnProperty('event_category')) {
			title = jsonData.event_category;
		}

		if (jsonData.hasOwnProperty('raw_data')) {
			options.body = jsonData.raw_data;
		}

		// TODO: Switch icon by category

		if (jsonData.hasOwnProperty('notify_url')) {
			options.data.url = jsonData.notify_url;
		}
	}

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();

	event.waitUntil(clients.openWindow(event.notification.data.url));
});

