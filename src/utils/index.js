'use strict';
var crypto = require('./crypto');
let extend = require('./extend');
let base64 = require('./base64');

module.exports = {
	getHtml: getHtml,
	getPageData: getPageData,
	crypto: crypto,
	extend,
	base64
};

var http = require('http');
var URL = require('url');

function getHtml(targetUrl) {
	var promise = new Promise(function(resolve, reject){
		var param = URL.parse(targetUrl);
		var options = {
			host: param.host,
			path: param.path,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
			}
		};
	    var req = http.get(options, function (response) {
		    response.setEncoding('utf-8');  //二进制binary
            var data = '';
		    response.on('data', function (res) {    //加载到内存
		        data += res;
		    }).on('end', function () {
		        resolve(data);
		    });
		});
		req.on('error', function(err) {
	    	reject(err);
	    });
	});
	return promise;
}

function getPageData(html, dataReg) {
	let promise = new Promise(function(resolve, reject) {
        let scripts = html.split('<script>');
		let isContains = false;
		let res;
        scripts.forEach(function(context, index) {
			if(dataReg.test(context)) {
                res = '{' + context.match(dataReg)[1];
                isContains = true;
				return false;
			}
        });
        
        if(isContains) {
            resolve(res);
        } else {
            reject('not found');
        }
	});

	return promise;
}