// Object.assign=require('object-assign');
var http = require('http');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// var db = null,
//     dbDetails = new Object();

// app.listen(port, ip);



app = http.createServer(function (request, response) {

    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // 发送响应数据 "Hello World"
    response.end('Hello World\n');
}).listen(port);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');

module.exports = app ;