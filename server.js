var url = require("url");
var http = require('http');
var fs = require('fs');
var routes = require('./routes');
var manageReq = require('./manageReq');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    if(pathname.startsWith('/api')) {
    	manageReq(request, response, routes);
    } else {
    	if(pathname === '/') {
    		pathname = 'index.html';
    	}
    	readFileAndResponse(`dist/${pathname}`, response);
      // response.writeHead(200, {'Content-Type': 'text/plain'});
      // response.end('test api');
    }
}).listen(port);


function readFileAndResponse(pathname,response){
	//判断文件是否存在
	fs.readFile(pathname, '', function(err, data){
		//文件不存在或读取错误返回404，并打印page not found
		if(err){
			response.writeHead(404);
			response.end('page not found');
		}
		else{
			//读取成功返回相应页面信息
			response.end(data);
		}
	});
}

console.log('server start');

module.exports = app;