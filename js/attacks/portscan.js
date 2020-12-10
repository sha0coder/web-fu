
(function() {

	portscan = {
		modname: 'portscan',
		ports: [80,81,311,443,598,620,1001,1085,1188,1278,1279,1559,1739,1772,1877,1963,2314,2339,2403,
		2534,2784,2837,2851,2907,2929,2930,2972,2973,3011,3012,3334,3342,4801,7015,8080,8081,8082,8083,
		8084,8085,8080,8088,8208,8443,9090,21845,22555], // only web ports
		host: '',
	};

	portscan.init = function() {
		o('btnPortScan').click(portscan.onScan);

		http.queued = portscan.ports.length;
		http.on('data',portscan.onOpen);
		http.on('err',portscan.onClosed);
		http.on('end',portscan.onEnd);

		chrome.extension.sendMessage({method:'attackReady',module: portscan.modname}, portscan.onComm);
	};

	portscan.getHost = function(url) {
		var spl = url.split('/');

		if (spl.length == 1)
			return spl[0];
		else if (spl.length < 3)
			return '';
		else
			return spl[2];

	};

	portscan.onComm = function(msg) {	
		if (msg.method == 'run') {
            if (msg.module == portscan.modname) {
                ap = msg.attackPlan;
                o('txtHost').set(portscan.getHost(ap.url));
            }
        }
	};

	portscan.onOpen = function(res) {
		if (res.code == 200)
			o('divHeader').appendHtml('<a href="'+res.url+'">'+res.url+'</a><br>');
	};

	portscan.onClosed = function(res) {
		//o('divHeader').appendHtml('closed: '+res.url+"");
	};

	portscan.onEnd = function() {
		alert('portscan finished');
	};

	portscan.onScan = function() {
		portscan.host = o('txtHost').get();
		portscan.ports.forEach(function(port) {
			http.asyncGet('http://'+portscan.host+':'+port+'/','','','','');
		});
	};


	portscan.init();

})();