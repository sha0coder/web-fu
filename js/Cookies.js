

function Cookies() {
	this.cookies = []
	this.url = '';
	this.editor = document.getElementById('editor');
	document.getElementById('reload').onclick = this.load.bind(this);
	document.getElementById('save').onclick = this.save.bind(this);
	document.getElementById('close').onclick = this.close.bind(this);
}
	
Cookies.prototype = {

	close: function() {
		window.close();
	},

	getCookies: function() {
		return this.editor.value.replace(/\n/g,'').replace(/\r/g,'');
	},

	setCookies: function(data) {
		this.editor.value = data.replace(/; */g,";\n");
	},

	load: function() {
		chrome.extension.sendMessage({method:'getUrl',module:'cookies'}, this.setUrl.bind(this));
	},

	setUrl: function(msg,sender,sendMessage) {
		if (msg.method != 'url')
			return;

		this.url = msg.url;
		chrome.cookies.getAll({url:this.url},this.loadCookies.bind(this));
		//chrome.extension.sendMessage({method:'getCookies',module:'cookies'}, this.loadCookies.bind(this));
	},

	loadCookies: function(cooks) {
		var strcook = '';
		for (var i=0; i<cooks.length; i++) {
			this.cookies.push(cooks[i].name);
			strcook += cooks[i].name+'='+cooks[i].value+';';
		}

		this.setCookies(strcook);
	},

	save: function() {
		var cook = this.getCookies();

		//Borrar todas las cookies
		for (var i=0; i<this.cookies.length; i++)
			chrome.cookies.remove({url:this.url, name:this.cookies[i]});

		//Crear las cookies que ya ha dejado el usuario
		var c = cook.split(';');
		for (var i=0; i<c.length; i++) {
			var n = c[i].split('=')[0];
			var v = c[i].split('=')[1];
			if (n != '') {
				chrome.cookies.set({
					url: this.url,
					name: n,
					value: v
				});
			}
			
		}
		
		//chrome.extension.sendMessage({method:'setCookies', module:'cookies', cookies:cook});
	}

};

var cook = new Cookies();
cook.load();
