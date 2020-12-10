/*
	Visual Crawler

*/


(function() {

	crawler = {
		enabled: false,

		start: function() {
			crawler.enabled = true;
		},
		stop: function() {
			crawler.enabled = false;
		},
		init: function() {
			chrome.extension.sendMessage({method: 'crawlerGiveMeUrl'},function(data) {
				console.log(data);
			});
		}
	};


	crawler.init();

})();
