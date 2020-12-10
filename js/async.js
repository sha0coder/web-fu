/*
	Web-Fu	
	async paralel computing
	
	sha0()badchecksum.net
*/


(function () {
	
	async = {};
	async.delay = 0;
	async.prevDelay = 0;

	async.setDelay = function(d) {
		async.prevDelay = async.delay;
		async.delay = d;
	};

	async.getDelay = function() {
		return async.delay;
	};

	async.restoreDelay = function() {
		async.delay = async.prevDelay;
	};

	async.nextTick = function(fn) {
		setTimeout(fn,async.delay);
	};

	async._checkCB = function(cb) {
		return (cb && cb instanceof Function);
	};

	async.each = function(arr, it, cb) {
	 	var total = arr.length;

	 	if (!async._checkCB(it))
	 		return;

	 	arr.forEach(function(e) {
			async.nextTick(function() {
 				it(e);
 				if (--total == 0 && async._checkCB(cb))
 					cb();
 			});
	 	});

	};

	async.funcEach = function(fn) {
		async.each(fn,function(f) {
			f();
		});
	}

	async.forEach = async.each;

})();
