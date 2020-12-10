/*
	Logs Pannel
	@sha0coder

*/

(function() {
	
	logs = {
		refreshTime: 10000,
		out: null,
		btn: {}
	};

	logs.refresh = function() {
		var log = storage.getArray('log');
		logs.out.innerHTML = log.join('\n');
	};

	logs.del = function() {
		storage.del('log');
		logs.refresh();
	};

	logs.save = function() {
		//TODO: export data ...
	};

	logs.initEvents = function() {
		logs.btn.save.onclick = logs.save;
		logs.btn.del.onclick = logs.del;
	};

	logs.loadObjects = function() {
		logs.out = document.getElementById('txtLogs');
		logs.btn.save = document.getElementById('btnSave');
		logs.btn.del = document.getElementById('btnDelete');
	};

	logs.init = function() {
		logs.loadObjects();
		logs.initEvents();

		logs.refresh();
		setInterval(logs.refresh, logs.refreshTime);
	};



})();

logs.init();
