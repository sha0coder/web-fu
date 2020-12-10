// sha0@badchecksum.net

(function() {

	analyzer = {
		name: 'urlAnalyze',
		url: '',
		post: '',
		isPost: false,
		hasParams: false,
		hasPost: false,
		lock: false,
		errors: ['ORA','TheJet','ODBC','error','bash: ','sh: 1: ','command not found','MongoError','MongooseError','eval()','.php(','unexpected ']
	};

	analyzer.commInit = function() {
        chrome.extension.sendMessage({method:'attackReady',module: analyzer.name}, analyzer.comm);
    };

    analyzer.test = function() {
    	analyzer.comm({
    		method:'run',
    		module:'urlAnalyze',
    		attackPlan: {url: analyzer.url }
    	});
    };

    analyzer.comm = function(msg) {
    	console.log('log: '+msg.method+' '+msg.module);

		if (msg.method == 'run') {
			if (msg.module == analyzer.name) {
				ap = msg.attackPlan;

				var spl = ap.url.split('##post##');
                analyzer.isPost = (spl.length>1);
                analyzer.url = spl[0];
                if (analyzer.isPost) 
                	analyzer.post = spl[1];

                o('txtUrl').set(analyzer.url);
                o('txtPost').set(analyzer.post);

                analyzer.hasParams = (analyzer.url.search(/\?/g)>=0);
                analyzer.hasPost = (analyzer.isPost && analyzer.post.search(/=/)>0);

                if (!analyzer.hasPost && !analyzer.hasParams)
                	return alert('no params to analyze');

                analyzer.start();
			}
		}
    };

	analyzer.init = function() {
		analyzer.commInit();
		console.log('Analyzer initialized!');
	};

	analyzer.log = function(msg) {
		if (analyzer.lock)
			return setTimeout(function() {analyzer.log(msg)},300);

		analyzer.lock = true;
		o('divStats').appendHtml(msg+" <br>\n");
		analyzer.lock = false;
	};

	analyzer.start = function() {
		o('divStats').appendHtml('Analyzing parameters ...<br>');
		if (analyzer.hasParams) {
			console.log('has params');
			var spl = analyzer.url.split('?')
			var qs = spl[1];
			var params = qs.split('&');

			params.forEach(function(p) {
				var nv = p.split('=');
				var n = nv[0];
				var v = nv[1];

				setTimeout(function() {
					analyzer.checkGet(n,v);	
				}, 2000);
			});

			// Parameter reductor
			analyzer.log(analyzer.url);
			var respWith = http.syncGet(analyzer.url).data.split(' ').length;
			var usedParams = '';
			var neededParams = [];
	
			for (var i=0; i<params.length; i++) {
				var trywithout = '';
				for (var j=0; j<params.length; j++) {
					if (i!=j)
						trywithout += '&'+params[j];
				}
                		var respWhitout = http.syncGet(spl[0]+'?'+trywithout).data.split(' ').length;
				if (respWhitout != respWith) {
					// al quitar el param cambia la respuesta, param necesario
					neededParams.push(params[i])
				}
			}

			analyzer.log('Reduced url: '+spl[0]+'?'+neededParams.join('&'));

			// Parameter Pollution check

		} else {
			console.log('no params :(');
		}

		/*
		if (analyzer.hasPost) {
			var qs = analyzer.post.split('?')[1];
			qs.split('&').forEach(function(p) {
				var nv = p.split('=');
				var n = nv[0];
				var v = nv[1];

				analyzer.checkGetPost(n,v);
			});
		}*/

	};

	analyzer.get = function(n,v,p) {
		var url;

		if (p==null) {
			url = analyzer.url; 
		} else {
			url = analyzer.url.replace(n+'='+v,n+'='+p); //TODO: possible param overlapping
		}

		var resp = http.syncGet(url);
		if (resp.data.search(' ')<0)
			resp.data = ' ';

		
		analyzer.errors.forEach(function(err) {
			if (resp.data.indexOf(err) >= 0) 
				console.log(' [*] Interesting error: '+err);
		});

		/*
		if (resp.code == 200) {
			if (resp.data.search(' ')<0)
				resp.data = ' ';
			return resp.data;
		}*/
		//console.log('this url crashes the get request: '+url);
		return resp;
	};

	analyzer.checkGet = function(n,v) {
		analyzer.log('==>checking param '+n+' = '+v);
		//http.get(analyzer.url+'')

		/*
			Chequeo de numéricos:
			- misma respuesta con cualquier numero y diferente respuesta con letras, indica la presencaia de un int($_GET[])
		*/

		var isNum = ((/^[0-9]$/.exec(v))!=null)
		var isDyn = false;

		var resNorm1  = analyzer.get(n,v,v).data.split(' ').length;
		var resNorm2  = analyzer.get(n,v,v).data.split(' ').length;
		if (resNorm1 != resNorm2) {
			analyzer.log(" [*] It seems dynamic");
			isDyn = true;
		}

		var res0 = analyzer.get(n,v,v).data.split(' ').length;
		var resNull = analyzer.get(n,v,null).data.split(' ').length;
		var resC = analyzer.get(n,v,'aa').data.split(' ').length;

		// Buscar conversiones a numericos, las cuales frenan los ataques
		if (isNum) {
			var resN = analyzer.get(n,v,'69').data.split(' ').length;

			if (res0 == resN && resN != resC) {
				analyzer.log(' [!] Possible int() conversion of the input '+n+'=int(x)');
				//return;
			}
		} 

		// Buscar eco
		var resE = analyzer.get(n,v,"webfu");
		if (resE.data.search('webfu')>=0) {
			analyzer.log(' [*] Eco detected on param '+n);

			var resX = analyzer.get(n,v,"webfu'\"</>webfu").data.split('webfu');
			if (resX.length >= 1) {
				//if (resX[1][0] == "'" || resX[1][1] == '"' || resX[1][2] ==)
				analyzer.log(" [?] potential XSS, this: &#146;&#148;&#060;/&#062; becomes: "+resX[1]);
			}
		}

		var resBT = analyzer.get(n,v,'a./a').data.split(' ').length;
		var resBTE = analyzer.get(n,v,'a%2e%2fa').data.split(' ').length;
		var resBI = analyzer.get(n,v,"0'0").data.split(' ').length;
		var resBIE = analyzer.get(n,v,"0%270").data.split(' ').length;
		var resBI = analyzer.get(n,v,"%25%25%25").data.split(' ').length;
		
		if (res0==resC && res0 == resBT && res0 == resBTE && res0 == resBI && res0 == resBIE && res0 == resBI) {
			if (isDyn)
				analyzer.log(' [?] Parameter '+n+' seems static');
			else 
				analyzer.log(' [!] Parameter '+n+' is static');
		
			//return;
		} 

		var resT = analyzer.get(n,v,'./'+v).data.split(' ').length;

		if (res0 == resT && resT != resBT) { // TODO: try encode attack
			analyzer.log(' [*] Potential traversal vulnerability on param '+n);
		}

		var resI1 = analyzer.get(n,v,"z'").data.split(' ').length;
		var resI2 = analyzer.get(n,v,"z''").data.split(' ').length;
		var resI3 = analyzer.get(n,v,"z'''").data.split(' ').length;
		var resI4 = analyzer.get(n,v,"z''''").data.split(' ').length;

		// ???
		if (resI1 != resI3 && resI1 != res0 && res0 != resBT) {
			analyzer.log(' [!] Random behavior on param '+n);
		}

		var oddDiffPair = (resI1 == resI3 && resI2 == resI4 && resI1 != resI2);
		if (oddDiffPair) 
			analyzer.log(' [*] Potential SQL Injection on param '+n+', different response between pair and odd');

		// Si es dinamico y con esto conserva su valor, es una concatenacion
		var resConcat = false;
		var resConcat1 = false;
		var resConcat2 = false;
		var resConcat3 = false;
		var concat = '';
		
		if (v.length >1) {
			resConcat1 = analyzer.get(n,v,v.substring(0,1)+"''"+v.substring(1)).data.split(' ').length;
			resConcat2 = analyzer.get(n,v,v.substring(0,1)+"'+'"+v.substring(1)).data.split(' ').length;
			resConcat3 = analyzer.get(n,v,v.substring(0,1)+"'||'"+v.substring(1)).data.split(' ').length;
		}

		if (isDyn) {
			resConcat = (resConcat1==res0 || resConcat2==res0 || resConcat3==res0);
		}

		if (resConcat) 
			analyzer.log(' [*] Potential SQL Injection on param '+n+', can concat with: '+concat);


		if (!isDyn)
			[']]>','</xml>'].forEach(function(tag) {
				var resXml = analyzer.get(n,v,tag).data.split(' ').length;
				if (resXml != res0 && resXml != resC)
					analyzer.log(' [*] Potential xml injection');
			});
		

		analyzer.log('checks on '+n+' done.');
	};

	analyzer.init();

})();
