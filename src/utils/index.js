'use strict';
var crypto = require('./crypto');
module.exports = {
	getHtml: getHtml,
	getPageData: getPageData,
	each: each,
	getResource: getResource,
	crypto: crypto,
	randomStr: randomStr,
	toInt: toInt
};

var http = require('http');
var URL = require('url');
var cheerio = require('cheerio');

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
            // console.log(response.statusCode);
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
	var promise = new Promise(function(resolve, reject) {
		var $ = cheerio.load(html);
		var context;
		$('script').each(function(index, script) {
			context = $(script).html();
			if(dataReg.test(context)) {
				var res = '{' + context.match(dataReg)[1];
				resolve(res);
				return false;
			}
		});
		if(!context) {
			reject('not found');	
		}
	});

	return promise;
}

/**
 * [getBase64 获取文件的base64数据]
 * @param  {[type]} url [description]
 * @return {[type]}        [description]
 */
function getResource(url) {
    var param = URL.parse(url);
    var promise = new Promise(function(resolve, reject){
        var options = {
            host: param.host,
            path: param.path,
            headers: {
                'Referer': 'http://h5.eqxiu.com/s/kBKEChRH',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
            }
        };
        var req = http.get(options, function (response) {
            response.setEncoding('binary');
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

function each(object, iterFunction) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var ret = iterFunction.call(this, key, object[key]);
            // if (ret === ALY.util.abort)
            //     break;
        }
    }
}

/**
 * [randomStr 随机串]
 * @param  {[type]} len [description]
 * @return {[type]}     [description]
 */
function randomStr(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function toFixed(int, n) {
    if (typeof int !== 'number') {
        int = parseFloat(int);
    }
    return parseFloat(int.toFixed(n))
}

function toInt(int) {
    return toFixed(int, 0);
}