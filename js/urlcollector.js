/*
	basic urlcollector

	TODO: submit forms
*/

urlcollector = {

	getDomain: function(url) {
		return url.split('/')[2];
	},

	crawl: function() {
		var url = document.location.href;
		var domain = urlcollector.getDomain(url);

		links = document.getElementsByTagName('a');
		var urls = [];

		for (var i=0; i<links.length; i++) {
			var u = links[i].href.replace(/#.*/,'');
			if (urlcollector.getDomain(u) == domain) {
				//if (!(u in urls) && u.search('logout')<0 && u.search('descone')<0)
				if (u.search('logout')<0 && u.search('descone')<0)
					urls.push(u);
			}
		}

		urlcollector.sendToLogger(urls);
	},

	sendToLogger: function(urls) {
		chrome.extension.sendMessage({
			method:'massLogger', 
			module:'urlcollector', 
			urls:urls,
		});
		console.log('urls sent in a message massLogger');
	}
};

console.log('collecting ...');
urlcollector.crawl();
console.log('collected :)');

