/*
	Interceptor windows
	sha0//badchecksum.net
*/


var interceptor = {};

interceptor.init = function() {
	// fill inputs
	o('txtUrl').set(opener.interceptor.msg.url);
	if (opener.interceptor.msg.requestBody)
		o('txtPost').set(interceptor.chrome2user(opener.interceptor.msg.requestBody.formData));

	// handle events
	o('btnSend').click(function() {
		if (opener.interceptor.msg.method == 'GET') {
			//opener.interceptor.ret = {redirectUrl: o('txtUrl').get()};
			winReq.get(o('txtUrl').get());
			opener.interceptor.ret = {cancel: true}
			window.close();
		} else {

			/*
			http.on('data', function(data) {
				opener.interceptor.ret = {redirectUrl: "data:text/html;base64," + btoa(data.data)};
				window.close();
			});

			http.asyncGet(o('txtUrl').get(), o('txtPost').get());
			*/

			var post = {};
			var spl = o('txtPost').get().split('&');

			spl.forEach(function(field) {
				var s = field.split('=');
				post[s[0]] = s[1];
			});

			winReq.post(o('txtUrl').get(), post);

			opener.interceptor.ret = {cancel: true}; //opener.interceptor.msg.requestBody};
			window.close();
		}
		
	});
	o('btnCancel').click(function() {
		opener.interceptor.ret = {cancel: true};
		window.close();
	});

	window.focus();	
};


interceptor.chrome2user = function(o) {
    var post = '';
    for (k in o) {
        post += k + '=' + o[k] + '&'
    }
    return post;
};


interceptor.init();

