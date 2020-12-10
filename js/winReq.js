/*
	Open a window with a content of a post request
	@sha0coder
*/


(function() {

	winReq = {
		id: 'winreq',
		hndl: null
	};

	winReq.openWin = function(url) {
		winReq.id = 'winReq_'+Math.floor(Math.random()*10000,0);
		winReq.hndl = window.open(url,winReq.id);
	}

	winReq.get = function(url) {
		var html = '<form action="'+url+'" method="get" id="frm">';
		if (url.search(/\?/)>=0) {

			var params = url.split('?')[1];
			params.split('&').forEach(function(param) {
				var s = param.split('=');
				s[1] = s[1].replace('"','\\"');
				html += '<input type="hidden" name="'+s[0]+'" value="'+s[1]+'">';
			});
		}
		html += '</form><'+'s'+'cript>document.getElementById("frm").submit();</'+'script>';

		winReq.openWin(url);
		winReq.hndl.document.write(html);
	};

	winReq.post = function (url,post) {
		var html = '<form action="'+url+'" method="post" id="frm">';
		for (param in post) {
			if (param) {
				post[param] = post[param].replace('"','\\"');
				html += '<input type="hidden" name="'+param+'" value="'+post[param]+'">';
			}
		}
		html += '</form><'+'s'+'cript>document.getElementById("frm").submit();</'+'script>';
		
		winReq.openWin(url);
		winReq.hndl.document.write(html);
	};

	/*
	winReq.go2 = function(url,post) {
		winReq.id = 'winReq_'+Math.floor(Math.random()*10000,0);
		winReq.hndl = window.open(url,winReq.id);
		winReq.hndl.document.write('<form action="'+url+'" id="frm"><input type="hidden" name="" value="'+post+'" id="post"></form><'+'s'+'cript>document.getElementById("frm").submit();</'+'script>');
	};

	winReq.go3 = function(url,post) {
		winReq.id = 'winReq_'+Math.floor(Math.random()*10000,0);
		winReq.hndl = window.open(url,winReq.id);
		window.document.write('<form action="'+url+'" target="'+winReq.id+'" id="frm"><input type="hidden"  name="" value="'+post+'" id="post"></form><'+'s'+'cript>document.getElementById("frm").submit();</'+'script>');
	};*/

})();




