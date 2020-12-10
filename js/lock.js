/*
	Locks
	@sha0coder
*/


Lock = function() {
	this.locked = false;	
};

Lock.prototype.lock = function() {
	this.locked = true;
};

Lock.prototype.unlock = function() {
	this.locked = false;
};

Lock.prototype.isLocked = function() {
	return this.locked;
}