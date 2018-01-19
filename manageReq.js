'use strict';
const querystring = require('querystring');
const url = require('url');

function manageReq(req, res, callback) {
	let request = {request: req};
	let pathname = url.parse(req.url).pathname;
	if(pathname.endsWith('/')) {
        pathname = pathname.substr(0, pathname.length - 1);
    }

    request.pathname = pathname;
    request.method = req.method;

	if(req.method == 'GET') {
		// request.params = 
		callback(request, res);
	} else if(req.method == 'POST') {
		let data = '';
	    req.on('data', function (chunk) {
	        // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
	        data += chunk;
	    });

	    req.on('end', function () {
	        data = decodeURI(data);
	        request.params = querystring.parse(data);
	    	callback(request, res);    
	    });
	} else {
		callback(request, res);
	}
}

module.exports = manageReq;