/*
	Web-Fu
	sha0()badchecksum.net

	Attack Engine
	async <- engine -> http
*/


(function() {

	engine = {};
	engine.delay = 0;
	engine.isPersonalizedURL  = false;
	engine.isPersonalizedPost = false;
	engine.sent = 0;
	engine.isCombo = false;
	engine.wordlists = [];
	engine.engine = null;
	engine.url = '';
	engine.post = '';
	engine.isPost = false;

	engine.on = function(evt,cb) {
		if (cb && cb instanceof Function) {
			switch (evt) {
				case 'url':
					engine.onUrl = cb; // url builder
					break;

				case 'data':
					http.onData = cb; // each http response
					break;

				case 'end':
					engine.onEnd = cb; // when last attack end
					break;

				case 'err':
					http.onErr = cb; // when error happens
			}
		}
	};

	engine.setComboMode = function() {
		engine.isCombo = true;
	};

	engine.setDelay = function(d) {
		engine.delay = d;
	};

	engine.getDelay = function() {
		return engine.delay;
	};

	engine.setUrl = function(url) {
		engine.url = url;
		engine.isPost = false;
	};

	engine.setPost = function(post) {
		engine.post = post;
		engine.isPost = true;
	};

	engine.clean = function(word) {
    	return (typeof(word) == 'undefined'?' ':word); //OPTIMIZATION: delete this
    };

    engine.defaultUrlBuilder = function(url,word) {
    	if (engine.isPersonalizedURL)
    		return url.replace(/##/g,word);
    	else 
    		if (url.search(/\?/) >= 0) {
    			var x = url.replace(/=[^&]+/g,'='+word);
    			return x;
    		} else
    			return url+word;
    };


    engine.splitWordlist = function(words) {
        var limit = 1000; // max wordlist 1000 words
        var len = words.length; // total
        var sub_wordlists = parseInt(len / limit);
        var extra_wordlist = len - (limit * sub_wordlists);
        var split = [];
        for (var i=0; i<sub_wordlists && (i*limit)<len; i++) {
            split.push([]);
            split[i] = words.slice(i*limit,(i+1)*limit);
        }
        if (extra_wordlist>0) {
        	split.push([]);
        	split[i] = words.slice(i*limit,(i*limit)+extra_wordlist);
        }
        return split;
    };

    /*
	engine.lowPriorityGet = function(url,words) {
		
			wps: ~10
			cpu: 8%
			ram: 30M
			ctrl: 50%
		

		engine.isPersonalizedURL = (url.search('##') >= 0);
		http.queued = words.length;
		engine.sent = 0;

		async.setDelay(http.delay);
		async.each(
			words,
			function(word) {
				word = engine.clean(word);
				http.onData(http.syncGet(engine.onUrl(url,word)));
				http.queued--;
				engine.sent++;
			},
			http.onEnd
		);
		async.restoreDelay();

	};*/

	/*
	engine.superGet = function(url,words) {
		
			wps: 60-100
			cpu: 60%
			ram: 70M
			ctrl: 0%
		

		http.queued = words.length;
		engine.sent = 0;
		engine.isPersonalizedURL = (url.search('##') >= 0);		// never.forEach(function() {});
		for (var i=words.length-1; i>=0; --i) { 
			http.asyncGet(url.replace(/##/g,word), engine.clean(words[i]));
			engine.sent++;
		}
	};*/

	/*
	engine.hyperGet = function(url,words) {
		
			wps: 70-200
			cpu: 0%
			ram: 38M
			ctrl: 99%
		

		http.queued = words.length;
		engine.isPersonalizedURL = (url.search('##') >= 0);
		engine.sent = 0;
		engine.interval = setInterval(function() {
			if (words.length == 0) {
				clearInterval(engine.interval);
				delete words;
				return;
			}
			var w = words.pop();
			http.asyncGet(engine.onUrl(url, engine.clean(w)));
			engine.sent++;
			delete w;
		}, http.delay);
	};*/


	/*
	Rediseñar:
		definir evento http.on('end',check)
		el check revisa si hay más wordlists a popear
		si no, se invoca el engine.onEnd();
		entonces ngSuperGet han de ser 2 métodos:
			- el método de entrada que splita las worlists
			- el método de continuacioń invocado desde check

		solución elegante:
			- setEngine() para elegir la funcion de check y auto inyección de words
			- start() para splitar, instalar evento http.onEnd() y para lanzar el engine

	*/


	http.on('end',function() {
		if (engine.wordlists.length==0)
			return engine.onEnd();

		if (engine.isPost)
			engine.ngSuperPost();
		else
			engine.ngSuperGet();

	});


	engine.setWordlist = function(wordlist) {
		engine.wordlists = engine.splitWordlist(wordlist);
		delete wordlist;
	};

	engine.start = function() {
		engine.sent = 0;
		engine.isPersonalizedURL = (engine.url.search('#') >= 0);

		if (!engine.isPost) {
			engine.on('url', engine.defaultUrlBuilder);
			engine.ngSuperGet();
		} else {
			engine.isPersonalizedPost = (engine.post.search('#') >= 0);
			engine.on('url', engine.postUrlBuilder);
			engine.ngSuperPost();
		}
	};

	engine.ngSuperGet = function() {
		var url = engine.url;
		var words = engine.wordlists.pop();

		http.queued = words.length;
		
		if (!engine.isPersonalizedURL) {
			if (url.search(/\?/) >= 0) 
    			url = url.replace(/=[^&]+/g,'=##');
    		else
    			url += '##';
		}

		while (words.length>0) {
			var w = words.pop();
			var u = url;

			if (engine.isCombo) {
				spl = w.split(':');
				for (var i=0; i<spl.length; i++) 
					u = u.replace('#'+(i+1)+'#',spl[i]);
			} else 
				u = url.replace(/##/g,w); // use engine.clean(w)

			http.asyncGet(u);
			engine.sent++;
		}

		delete words;

	};

	engine.ngSuperPost = function() {
		var url = engine.url;
		var data = engine.post;
		var words = engine.wordlists.pop();

		
		http.queued = words.length;

		
		while (words.length>0) {
			var w = words.pop();
			var tUrl = url;
			var tPost = data;

			if (engine.isCombo) {
				spl = w.split(':');
				for (var i=0; i<spl.length; i++) {
					tUrl = tUrl.replace('#'+(i+1)+'#',spl[i]);
					tPost = tPost.replace('#'+(i+1)+'#',spl[i]);
				}
			} else {
				tUrl  = (engine.isPersonalizedURL?url.replace(/##/g,w):url);
				tPost = (engine.isPersonalizedPost?data.replace(/##/g,w):data);
			}

			http.asyncGet(tUrl, tPost);
			engine.sent++;
		}
		delete words;
	};

	/*
	engine.insaneGet = function(url,words) {
		http.queued = words.length;
		engine.sent = 0;
		engine.isPersonalizedURL = (url.search('##') >= 0);
		async.each(
			words,
			function(w) {
				w  = engine.clean(w);
				url = engine.onUrl(url,w);
				http.asyncGet(url);
			},
			function() {console.log('end async');}
		);
	};*/

	//TODO: pipeline && wordlist reuse
})();