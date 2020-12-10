var all_the_links = document.getElementsByTagName("a");
var all_the_urls = [];
for (var i=0; i<all_the_links.length && i<10; i++)
	all_the_urls.push(all_the_links[i].href);

chrome.extension.sendMessage({method:"getAllTheLinks", links:all_the_urls});

