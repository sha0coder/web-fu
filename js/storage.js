/*	
	Web-Fu
	storage abstraction

	sha0()badchecksum.net
*/

(function() {
	
	storage = {};

	storage.get = function(tag,defVal) {
		var item = window.localStorage.getItem(tag);
		if (item)
			return item;
		return defVal;
	};

	storage.set = function(tag,val) {
		window.localStorage.setItem(tag,val);
	};

	storage.del = function(tag) {
		window.localStorage.removeItem(tag);
	};

	storage.getBool = function(tag,defVal) {
		var val = storage.get(tag,defVal);
		if (val) {
			if (val == '1')
				return true;
			if (val == '0')
				return false;
		}
		storage.setBool(tag,defVal);
		return defVal;
	};

	storage.setBool = function(tag,val) {
		if (val)
			storage.set(tag,'1');
		else
			storage.set(tag,'0');
	};

	storage.getArray = function(tag) {
		var str = storage.get(tag);
		if (!str)
			return [];

		return str.split('|||');
	};

	storage.setArray = function(tag,arr) {
		storage.set(tag,arr.join('|||'));
	};

	storage.push = function(tag,msg) {
		var arr = storage.getArray(tag);
		arr.push(msg);
		storage.setArray(tag,arr);
	};

	storage.pop = function(tag) {
		var arr = storage.getArray(tag);
		var item = arr.pop();
		storage.setArray(tag,arr);
		return item;
	};

	storage.log = function(msg) {
		var dt = new Date();
		storage.push('log',dt+' '+msg);
	};

	console.log('storage loaded.');

})();