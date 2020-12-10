/*
	Web-Fu
	sha0()badchecksum.net

	Mass HTTP Object
	async -> http -> sync ajax
*/

(function() {
	http = {
        queued: 0,
        debug: false,
        obj: null,
        img: null,
        filter: false,
        isPost: false,
        onEnd: null,
        onErr: null
    };

	http.on = function(evt,cb) {
		if (cb && cb instanceof Function) {
			switch (evt) {
				case 'data':
					http.onData = cb; // each http response
					break;

				case 'end':
					http.onEnd = cb; // when last attack end
					break;

				case 'err':
					http.onErr = cb; // when error happens
			}
		}
	};

	http.segDebub = function(dbg) {
		http.debug = dbg;
	};

	http.log = function(msg) {
		if (http.debug)
			console.log(msg);
	}

	http.syncGet = function(url) {
        try {
            http.obj = http.obj || new XMLHttpRequest(); // reuse

            http.obj.open('GET', url, false);
            http.obj.send();
            return {
            	url: url,
            	stat: http.obj.readyState, 
            	code: http.obj.status,
            	data: http.obj.responseText
            };

        } catch (e) {
            return {
            	url: url,
            	stat: 0,
            	code:404,
            	data: ''
            };
        }
	};

	http.asyncGet = function(url,data,user,password,tag) {
    	var obj = new XMLHttpRequest();
        http.isPost = (data && data != '');

		obj.onreadystatechange = function() {
            if (obj.readyState == 4) {
                    http.onData({
                    	url: url,
                        post: (http.isPost?data:''),
                    	stat: obj.readyState,
                    	code: obj.status,
                    	data: obj.responseText,
                        tag: tag
                    });

                    if (--http.queued == 0)
                        if (http.onEnd)
    					   http.onEnd();

    				delete obj;
            }
        }

        obj.onerror = function () {
                http.onData({
                	url: url,
                	stat:-1,
                	code: 404,
                	data:'',
                    tag: tag
                });

                if (--http.queued == 0)
                    if (http.onEnd)
    				    http.onEnd();

    			delete obj;
        }

        try {

            if (user && password)
                obj.open((http.isPost?'POST':'GET'), url, true, user, password);
            else
                obj.open((http.isPost?'POST':'GET'), url, true);

            if (http.isPost)
                obj.send(data);
            else
                obj.send();
        
        } catch(e) {

            console.log('error at http, posible cross-origin or cross-domain');

            http.onData({
                url: url,
                stat:-1,
                code: 500, //cross origin
                data:''
            });

            if (--http.queued == 0)
                http.onEnd();

            delete obj;
        }
	};
   
    http.imgAsyncGet = function (url,cb) {
        http.img  = http.img || new Image();

        http.img.onload = function() {
            cb({
                url: url,
                code: 200,
                data: ''
            });

            if (--http.queued == 0)
                http.onEnd();

            //delete img;
        };

        http.img.onerror = function() {
            cb({
                url: url,
                code: 404,
                data:''
            });
            if (--http.queued == 0)
                http.onEnd();

            //delete img;
        };

        http.img.src = url;
    };

})();

