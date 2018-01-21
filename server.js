var url = require("url");
var http = require('http');
var routes = require('./routes');
var manageReq = require('./manageReq');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    if(pathname.startsWith('/api')) {
      manageReq(request, response, routes);
    } else {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('test api');
    }
}).listen(port);

console.log('server start');

module.exports = app;