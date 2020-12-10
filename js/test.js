/*
	Web-Fu
	sha0()badchecksum.net

	Testing object

*/

(function() {
	test = {
		initTime: null,
		endTime: null,
		duration: 0,

		now: function() {
			return new Date().getTime();
		},

		init: function() {
			test.initTime = test.now();
			test.endTime = null;
			test.duration = 0;
		},

		end: function() {
			test.endTime = test.now();
			test.duration = test.endTime-test.initTime;
			console.log('Duration: '+test.duration+' ms.');
		},

		fill: function(sz) {
			var arr = [];
			while (--sz > 0) {
				arr.push(sz);
			}
			return arr;
		},

		check: function(cb) {
			test.init();
			cb();
			test.end();
		}
	};
})();