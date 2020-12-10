(function() {

	build = {
		modname: 'build',
		url: '',
		data: '',
		hdrs: [],
		http: null,
	};

	build.init = function() {
		build.http = new XMLHttpRequest();
		build.url = '';
		build.data = '';
		build.hdrs = [];

		o('btnClear').click(build.onClear);
		o('btnSend').click(build.onSend);
		o('btnAddHdr').click(build.onAddHdr);

		chrome.extension.sendMessage({method:'attackReady',module: build.modname}, build.onComm);
	};

	build.onComm = function(msg) {
		if (msg.method == 'run') {
            if (msg.module == build.modname) {
                ap = msg.attackPlan;
                o('txtUrl').set(ap.url);
            }
        }
	};

	build.setUrl = function(url) {
		build.url = url;
	};

	build.setPost = function(data) {
		build.data = data;
		build.http.open('POST',build.url,false);
	};

	build.setGet = function() {
		build.data = '';
		build.http.open('GET',build.url,false);
	};

	build.setHeader = function(key,value) {
		if (value == "[NULL]")
			build.http.setRequestHeader(key,null);
		else
			build.http.setRequestHeader(key,value);
	};

	build.launch = function() {
		build.http.setRequestHeader('Origin',null);
		build.http.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
		build.http.setRequestHeader('Connection', 'close');

		var times = parseInt(o('txtNum').get());

		try {
			for (var i=0; i<times; i++) {
				build.http.send(build.data);

				o('divResp').setHtml('code :'+build.http.status);

				o('divBody').appendHtml(build.http.getAllResponseHeaders().replace(/(\n|\r)/,'<br>')+"<br><br>");

				if (build.http.status == 200)
					o('divBody').appendHtml(build.http.responseText+"<br><br>")
			}

		} catch(e) {
			alert('bad request!');
		}
	};

	build.onClear = function() {
		//o('txtUrl').set('');
		o('txtPost').set('');
		o('divResp').setHtml('');
		o('divBody').setHtml('');
	};

	build.onAddHdr = function() {
		build.hdrs.push([o('txtHdrName').get(), o('txtHdrValue').get()]);
		o('txtHdrName').set('');
		o('txtHdrValue').set('');
	};

	build.onSend = function() {
		var resp;
		var url = o('txtUrl').get();
		var post = o('txtPost').get();

		build.setUrl(url);
		if (post.length>0)
			build.setPost(post);
		else
			build.setGet();

		build.hdrs.forEach(function(hdr) {
			build.setHeader(hdr[0],hdr[1]);
		});

		build.launch();

	};

	build.init();

})();

