/*	
	Web-Fu
	wordlist - storage

	sha0()badchecksum.net
*/

(function() {
	wls = {};

	wls.tag = 'userWordlists';

	wls.def = [		// Default Wordlists
		'dirs.txt',
		'fuzz.txt',
		'users.txt',
		'users_big.txt',
		'pass.txt',
		'pass_small.txt',
		'params.txt',
		'unicode.txt',
		'numeric.txt',
		'exploit-db.txt',
	];

	wls.user = [];

	Array.prototype.exists = function(item) {
		for (var i=this.length-1; i>=0; --i)
 			if (this[i] == item)
 				return true;
		return false;
	};

	Array.prototype.toString = function() {
		var str = '';
		this.forEach(function(e) {
			str += e+'\n';
		});
		return str;
	};

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};

	wls._checkStorage = function() {
		if (storage)
			return true;

		console.log('Load storage previous to wls object');
		return false;
	};

	wls._sync = function() {
		if (wls._checkStorage())
			wls.user = storage.getArray(wls.tag);
	};

	wls.add = function(path) {
		if (wls.user.exists(path))
			return;

		wls._sync();
		wls.user.push(path);
		if (wls._checkStorage())
			storage.setArray(wls.tag, wls.user);
	};

	wls.getDef = function() {
		return wls.def;
	};

	wls.getUser = function() {
		wls._sync();
		return wls.user;
	};

	wls.del = function() {
		wls.user = [];
		storage.del(wls.tag);
	};

	wls.loadFile = function(file) {
	    var request = new XMLHttpRequest();
	    try {
	        request.open('GET', file, false);
	        request.send();
	        return request.responseText;

	    } catch (e) {
	    	return '';
	    }
	};

})();
