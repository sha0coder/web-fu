// sha0()badchecksum.net

(function() {

	logger = {
		enabled: true,
		listening: false,
		pannel: null,
		geturls: [],

		pannel: document.getElementById('pannel'),

		write: function(msg) {
			logger.pannel.innerHTML += msg;
		},

		writeln: function(msg) {
			logger.write(msg+'<br>');
		},

		coloredParams: function(pparams) {
			var params = new RegExp(/([^?&]*)=([^&]*)/g);
 			var strparams = '';

            while (1) {
                var p = params.exec(pparams);
                if (!p)
                    break;

                strparams += ah.gct(p[1], colors.green)+'='+ah.gct(p[2], colors.red)+'&';
            }

            return strparams;
		},

		coloredUrl: function(durl) {
			var strparams = '';
			var spl = durl.split('?');
			var url = '';
			if (spl.length > 1)
	            url = ah.gct(spl[0],colors.dark)+'?'+logger.coloredParams(spl[1]);

	        if (url == '')
	        	url = durl;

	        return url;
		}

	};


	logger.comm = function(msg) {
		if (!msg.url)
			return;

		if (!msg.data && msg.url.search(/\?/)<0)
			return;

		if (msg.url.search(/\.(gif|swf|png|jpeg|jpg|htm|html)\?/)>=0)
			return;

		if (msg.url in logger.geturls) // too slow ...
			return;

		var line = '';
		if (!msg.data) {
			line = 'GET '+ah.getLink2(msg.url, logger.coloredUrl(msg.url));
			logger.geturls.push(msg.url);
		} else {
			line = 'POST '+ah.getLink2(msg.url+'##post##'+msg.data, logger.coloredUrl(msg.url)+' &nbsp; '+logger.coloredParams(msg.data));
		}

		logger.pannel.appendHtml(line+'<br>');
	};

	logger.btnStart = function() {
		logger.enabled = true;
	};

	logger.btnStop = function() {
		logger.enabled = false;
	};

	logger.btnClear = function() {
		logger.geturls = [];
		logger.pannel.setHtml('');
		chrome.extension.sendMessage({method: 'clearCrawler'});
	};

	logger.btnAudit = function() {
		chrome.extension.sendMessage({
			method:'doAudit',
			urls:logger.geturls
		});
	};

	logger.init = function() {
		o('btnStart').click(logger.btnStart);
		o('btnStop').click(logger.btnStop);
		o('btnClear').click(logger.btnClear);
		o('btnAudit').click(logger.btnAudit);
		logger.pannel = o('divLoggerPannel');

		chrome.extension.onMessage.addListener(function(msg,sender,send) {
			if (logger.enabled && msg.method == 'httphook')
				logger.comm(msg);
		});
		console.log('logger initialized!');
	};

	var ah = new AttackHelper();
	logger.init();

})();