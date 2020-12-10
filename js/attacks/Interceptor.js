// sha0()badchecksum.net

function Interceptor() {
	this.pannel = document.getElementById('pannel');
	this.btnYes = document.getElementById('yes');
	this.btnNo = document.getElementById('no');
	this.colors = {
            '2':'34ff0c', //ok
            '3':'ffae00', //redirection
            '4':'ed0e0e', //no access
        };
    this.veredict = 0;
}

Interceptor.prototype = {
	
	write: function(msg) {
		this.pannel.innerHTML += msg+'<br>';
	},

	clickYes: function() {
		this.veredict = 1;
	},

	clickNo: function() {
		this.veredict = -1;
	},

	onBeforeRequest: function (d) {
		this.veredict = 0;
		var url = document.getElementById('url');
		var post = document.getElementById('post');

		url.innerHTML = d.url;

		/*
		var pk = d.requestBody.formData.keys();
		for (var i=0; i<pk.length; i++) {
			post.innerHTML += pk+' = '+d.requestBody.formData[pk][0];
		}
		post.innerHTML = d.requestBody.formData;*/

		d.url = url.innerHTML;
		url.innerHTML = '';
		while (this.veredict == 0);

		//this.write(ah.getLink(d.url,this.colors[2]));

		return {cancel: (this.veredict == -1)};
	},

	run: function() {
		this.write('Interceptor running');

		this.btnYes.onclick = this.clickYes.bind(this);
		this.btnNo.onclick = this.clickNo.bind(this);
		chrome.webRequest.onBeforeRequest.addListener(this.onBeforeRequest.bind(this),{urls: ["<all_urls>"]},["blocking"]);
	},

};


var ah = new AttackHelper();
var interceptor = new Interceptor();
interceptor.run();
