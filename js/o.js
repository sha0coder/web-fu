//sha0query ;)

o = function(id) {
	o.id = id;
	o.o = document.getElementById(o.id);
	if (o.o == null)
		return console.log('sha0query message: object '+o.id+' doesnt exist');

	o.getObj = function() {
		return o.o;
	};

	// style

	o.show = function() {
		o.o.style.visibility =  'visible';
	};

	o.hide = function() {
		o.o.style.visibility =  'hidden';
	};

	o.relative = function() {
		o.o.style.position = 'relative';
	};

	o.absolute = function() {
		o.o.style.position = 'absolute';
	};



	// data

	o.value = o.o.value;

	o.get = function(id) {
		if (typeof id === "undefined")
			return o.o.value;
		return o.o[id].value;
	};

	o.getText = function(id) {
		if (typeof id === "undefined") {

			if (typeof o.o.text === "undefined")
				return o.o[o.o.value].text;

			return o.o.text;

		}
		return o.o[id].text;
	};

	o.getSelectedText = function() {
		return o.o[o.o.selectedIndex].text;
	};

	o.getSelected = function() {
		return o.o.selectedIndex;
	};

	o.set = function(val) {
		o.o.value = val;
	};

	o.isChecked = function() {
		return o.o.checked;
	};

	o.check = function() {
		o.o.checked = true;
	};

	o.uncheck = function() {
		o.o.checked = false;
	};

	o.add = function(text,value) {
		var newOption = document.createElement('option');
		newOption.text = text;
		newOption.value = value;
		o.o.appendChild(newOption);
	};

	o.addAll = function(arr) {
		for (var i=0; i<arr.length; i++) {
			o.add(arr[i],i);
		}
	};

	o.getHtml = function() {
		return o.o.innerHTML;		
	};

	o.setHtml = function(data) {
		o.o.innerHTML = data;
	};

	o.appendHtml = function(data) {
		o.o.innerHTML += data;
	};

	o.setTarget = function(target) {
		o.o.target = target;
	};

	o.setAction = function(action) {
		o.o.action = action;
	};



	// actions

	o.submit = function(action) {
		if (action)
			o.o.action = action;
		o.o.submit();
	};


	// events

	o.click = function(cb) {
		o.o.onclick = cb;
	};

	o.mdown = function(cb) {
		o.o.onmousedown = cb;
	};

	o.blur = function(cb) {
		o.o.onblur = cb;
	};

	o.change = function(cb) {
		o.o.onchange = cb;
	};


	return o;
}

/*
	examples:
	o('btnFalsePositive').hide();
	o('btnStart').click(brute.onStart);
*/