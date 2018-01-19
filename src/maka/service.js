module.exports = {
	createTemplate: createTemplate,
	setHeaders: setHeaders,
	getTemplate: getTemplate,
	saveTemplate: saveTemplate,
	getViewData: getViewData
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').maka;
var serverHost = config.severHost;

var _headers;

/**
 * [setHeaders 设置http header]
 * @param {[type]} headers [description]
 */
function setHeaders(headers) {
	_headers = headers;
}

/**
 * [createTemplate description]
 * @return {[type]} [description]
 */
function createTemplate() {
	return request.post({
		url: serverHost + 'template',
		headers: _headers,
		data: ''
	});
}

/**
 * [getTemplate 获取模板信息]
 * @param  {[type]} code [description]
 * @return {[type]}      [description]
 */
function getTemplate(code) {
	var url = serverHost + 'v4/template/' + code + '?template_type=designer&data_type=base';
	return request.get({
		url: url,
		headers: _headers
	});
}

/**
 * [saveTemplate 保存模板版本]
 * @param  {[type]} code    [description]
 * @param  {[type]} version [description]
 * @return {[type]}         [description]
 */
function saveTemplate(code, data) {
	var url = serverHost + 'v4/template/' + code;
	return request.put({
		url: url,
		headers: _headers,
		data: querystring.stringify(data)
	});
}

function getViewData(uid, id, version) {
	// var url = 'http://res.maka.im/user/'+ uid +'/template/'+ id +'/'+ id +'_v'+ version +'.json';
	var url = `http://res.maka.im/user/${uid}/event/${id}/${id}_v${version}.json`;
	// console.log(url)
	return request.get({url: url});
}