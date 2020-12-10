

var interceptor = {
	enabled: false,
	handled: false,
};

interceptor.init = function() {
	o('btnIntercept').click(interceptor.start);
	o('btnInterceptorSend').click(interceptor.send);
	o('btnInterceptorCancel').click(interceptor.cancel);
};

interceptor.start = function() {
	interceptor.enabled = true;
	interceptor.initHandler();
};

interceptor.stop = function() {
	interceptor.enabled = false;
	chrome.webRequest.onBeforeRequest.removeListener(null);
	interceptor.handled = false;
};

interceptor.initHandler = function() {
	if (interceptor.handled)
		return;

	interceptor.handled = true;
	chrome.webRequest.onBeforeRequest.addListener(interceptor.handle,{urls: ["*://*/*"]},  ["blocking","requestBody"]);
};

interceptor.int2user = function(o) {
    var post = '';
    for (k in o) {
        post += k + '=' + o[k] + '&'
    }
    return post;
};

interceptor.user2int = function(o) {
    var post = '';
    for (k in o) {
        post += k + '=' + o[k] + '&'
    }
    return post;
};

interceptor.handle = function(obj) {

	o('txtInterceptUrl').set(obj.url);

 	if (obj.requestBody)
        o('txtInterceptPost').set(interceptor.int2user(ojb.requestBody.formData));

    
    
    var retmsg = {cancel: false}; 

    return retmsg;
};

interceptor.clearForm = function() {
	o('txtInterceptUrl').set('');
	o('txtInterceptPost').set('');
};

interceptor.send = function() {
	interceptor.clearForm();
};

interceptor.cancel = function() {
	interceptor.clearForm();
};


interceptor.init();