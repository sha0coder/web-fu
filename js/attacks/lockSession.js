var refreshURL = window.location.href;
var fingerprint = '';
var antiFlood = false;

function asyncHTTP(id, url, callback, post, user, password) {
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            callback({'id':id, 'url':url,'stat':request.readyState, 'code':request.status, 'data':request.responseText});
        }
    }
    request.onerror = function () {
        callback({'id':id, 'url':url,'stat':-1, 'code':404, 'data':''}); //TODO: err siempre es 404??
    }

    if (user && password)
        request.open('GET',url,true,user,password);
    else
        request.open('GET', url, true);

    if (post && post != '')
        request.send(post);
    else
        request.send();
}


function lockSession() {
	try {
		console.log('Ping  '+refreshURL+' ');
		asyncHTTP(0, refreshURL, function(resp) {
			var words = resp.data.split(' ').length;
			console.log('Pong '+resp.code+', '+words+' words, '+resp.data.length+' bytes.');

			var fp = '['+resp.code+','+words+']';

			if (fingerprint == '')
				fingerprint = fp;

			else if (fingerprint != fp) {
				console.log('Sesion expired??');
				if (!antiFlood) {
					chrome.extension.sendMessage({method:'display', title:'Session Locker', body:'Session Expired!'});
					antiFlood = true;
				}

			} else
				console.log('Session Ok.');
			
		});

	} catch (e) {
		console.log('lockSession() err.');
	}
}

lockSession();
setInterval(lockSession, 60000);


