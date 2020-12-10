/*
	tab switcher by @sha0coder
*/

(function() {

	tabs = {
		selected: 0,
		divNames: [
			'divHome',
			'divLogs',
			'divLogger',
			//'divInteceptor',
			'divWordlists',
			'divSearch',
			'divSettings',
			'divAbout'
		],
		div: [],
		liNames: [
			'liHome',
			'liLogs',
			'liLogger',
			//'liInterceptor',
			'liWordlists',
			'liSearch',
			'liSettings',
			'liAbout'
		],
		li: []

	};


	tabs.load = function(ids,objs) {
		ids.forEach(function(id) {
			objs.push(document.getElementById(id));
		});
	};

	tabs.show = function(id) {
		//console.log(tabs.divNames[id]+': '+tabs.div[id].style.visibility);
		tabs.div[id].style.position = 'absolute';
		tabs.div[id].style.top = '40px';
		tabs.div[id].style.visibility = 'visible';
		tabs.li[id].class = 'active';
	};

	tabs.hide = function(id) {
		//console.log(tabs.divNames[id]+': '+tabs.div[id].style.visibility);
		tabs.div[id].style.visibility = 'hidden';
		tabs.li[id].class = '';
	};

	tabs.select = function(id) {
		for (var i=0; i<tabs.div.length; i++) {
			if (i === id)
				tabs.show(i);
			else
				tabs.hide(i);
		}
	};

	tabs.installEvents = function() {
		for (var i=0; i<tabs.li.length; i++) {
			tabs.li[i].value = i;
			tabs.li[i].onclick = function() {
				tabs.select(this.value);
			};
		}
	};

	tabs.init = function() {
		tabs.load(tabs.divNames, tabs.div);
		tabs.load(tabs.liNames, tabs.li);
		tabs.installEvents();
		tabs.select(0);
	};


	tabs.init();

})();

