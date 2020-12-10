// node.js rocks 
var http = require('http');
var qs = require('querystring');

var port = 8850;

function server(req,res) {

    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
        	console.log(body);
            responder(req,res,qs.parse(body));
        });
    } else
    	responder(req,res,null);
}

function responder(req,res,post) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	console.log(req.url);

	switch (req.url) {
		case '/':
			res.end('<html><form action="/login" method=post>user:<input type=text name=user><br>pass:<input type=password name=passw><br><input type=submit></form></html>')
			break;

		case '/login':
			if (post.user == 'pepe' && post.passw == 'pepa')
				res.end('<html>bien</html>');
			else
				res.end('<html>mal</html>');
			
			break;

		default:
			res.end('<html></html>');
	}
}

http.createServer(server).listen(port);
console.log('HTTP up & running at '+port+'/tcp');