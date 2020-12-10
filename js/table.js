/*
	Table(), html table dynamic control
	sha0()badchecksumn.net
*/

Array.prototype.exists = function(item) {
	for (var i=this.length-1; i>=0; --i)
			if (this[i] == item)
				return true;
	return false;
};

Table = function(name) {
	this.obj = document.getElementById(name);
};

Table.prototype.addRow = function(data) {
	var tr = this.obj.insertRow(-1);
	var td;

	for (var i=0; i<data.length; i++) {
		td = tr.insertCell(i);
		td.innerHTML = data[i];
	}
};

Table.del = function() {
	while (this.obj.hasChildNodes()) {
		this.obj.removeChild(this.obj.firstChild);
	}
};
