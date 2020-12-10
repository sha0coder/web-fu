/*
	Settings Pannel
	@sha0coder


	//TODO: abstraer

*/

(function() {
	
	settings = {
		obj: {}
	};

	settings.loadObjets = function() {
		settings.obj.cbScroll = document.getElementById('cbScroll');
		settings.obj.txtRFI = document.getElementById('txtRFI');
	};

	settings.initEvents = function() {
		settings.obj.cbScroll.onclick = function() {
			storage.setBool('autoScroll',settings.obj.cbScroll.checked);
		};
		settings.obj.txtRFI.onblur = function() {
			storage.set('rfiUrl',settings.obj.txtRFI.value);
		};
	};

	settings.init = function() {
		settings.loadObjets();
		settings.initEvents();
		settings.obj.cbScroll.checked = storage.getBool('autoScroll',true);
		settings.obj.txtRFI.value = storage.get('rfiUrl','');
	};

})();


settings.init();