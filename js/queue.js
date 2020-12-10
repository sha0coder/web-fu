/*
	Extend javascript objects
*/

Queue = function(init) {
	if (init)
		this.arr = init;
	else
		this.arr = [];
};

Queue.prototype.push = function(item) {
    if (typeof item === 'string') 
    	this.arr.push(item);
    else
        this.arr = this.arr.concat(item);
};

Queue.prototype.pushUniq = function(item) {
	if (this.exists(item))
		return;
	this.push(item);
};

Queue.prototype.pop = function() {
	var item = this.arr.pop();

	if (this.empty())
		this.clear();

	return item;
};

Queue.prototype.count = function() {
	return this.arr.length;
};

Queue.prototype.size = function() {
	return this.arr.length;
};

Queue.prototype.empty = function() {
	return (this.size() == 0);
};

Queue.prototype.exists = function(item) {
	for (var i=this.count()-1; i>=0; --i)
		if (this.arr[i] == item)
			return true;
	return false;
};

Queue.prototype.toString = function() {
	var str = '';
	this.forEach(function(e) {
		str += e+'\n';
	});
	return str;
};

Queue.prototype.clear = function() {
	delete this.arr;
	this.arr = [];
};

Queue.prototype.dummy = function(a) {
	console.log(a);
};

Queue.prototype.async = function(iter) {
	if (!iter)
		return;

	this.arr.forEach(function(item) {
		setTimeout(function() {
			iter(item);
		}.bind(item),0);
	});
};

Queue.prototype.forEach = function(fn) {
	this.arr.forEach(fn);
};

Queue.prototype.dump = function() {
	this.arr.forEach(function(item) {
		console.log(item);
	});
}


function test() {
	var q = new Queue([1,2]);
	q.push(3);
	q.async(function(v){console.log(v);}, function(){console.log('end')});
}




/*
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

Array.prototype.clear = function() {
	this = [];
};

Array.prototype.async = function(iter,end) {
	var i=0;
	if (!iter)
		return;

	//setTimeout
	for (var i=0; i<this.length; i++)
		setTimeout(function() {
			iter(i,this[i]);
			console.log('lala');	
		},0);

	if (end)
		end();
};*/

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
};
