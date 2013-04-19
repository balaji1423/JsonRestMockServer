var http = require('http');
var url  = require('url');

http.createServer(function (req, res) {
    var urlParts = url.parse(req.url, true);    
    if (urlParts.pathname !== "/favicon.ico"){
	inputRequestHandler(req,res,urlParts,'POST',201);
	inputRequestHandler(req,res,urlParts,'PUT',200);
	inputRequestHandler(req,res,urlParts,'DELETE',200);
	inputRequestHandler(req,res,urlParts,'OPTIONS',200);
	outputRequestHandler(req,res,urlParts);
    }
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/\n');


function inputRequestHandler(req,res,urlParts,methodIn,statusOut){
    var body = '';

    if (req.method === methodIn){
	console.log('------------------' + methodIn + ' Start ---------------------\n');
	console.log(methodIn + ' request path -> ' + urlParts.pathname + "\n");
	console.log(methodIn + ' request search -> ' + urlParts.search + "\n");
	
        req.on('data', function (data) {
            body += data;
            console.log("Number of chars read from request body: " + body.length);
        });

        req.on('end', function () {
            console.log(methodIn + ' request body -> ' + body + "\n");
        });
	res.writeHead(statusOut, {'Access-Control-Allow-Origin': '*'});
	res.end();
    }
}

function outputRequestHandler(req,res,urlParts){
    var filename;

    if (req.method === 'GET'){
	res.writeHead(200, {'Content-Type': 'application/json',
			    'Access-Control-Allow-Origin': '*'});
	
	console.log('------------------GET Start ---------------------\n');

	console.log('GET request path -> ' + urlParts.pathname + "\n");
	console.log('GET request search -> ' + urlParts.search + "\n");
	filename = urlParts.pathname
	    .replace(/^\//g,"")	    
	    .replace(/\//g,"##")
	    .replace(/\?/g,"#AND");
	try{
	    part = require('./' + filename);
	    res.write(JSON.stringify(part));
	    console.log('GET response body -> ' + JSON.stringify(part) + "\n");
	    res.end();
	}catch (e){
	    console.log('ERROR :' + e)
	}
    }
}

