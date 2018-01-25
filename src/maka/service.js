'use strict';

module.exports = {
	createTemplate,
	setHeaders,
	getTemplate,
	saveTemplate,
	getViewData,
	getPages,
	upload,
	getOssSts2
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').maka;
var serverHost = config.severHost;
var host = config.origin;

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
	return request.get({
		url: host + '/h5editor/choose?source=maka',
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
function saveTemplate(uid, code, data) {
	// http://maka.im/api/v1/users/4132367/events/5ZAHOPP9
	var url = `${serverHost}v1/users/${uid}/events/${code}`;
	return request.put({
		url: url,
		headers: _headers,
		data: querystring.stringify(data)
	});
}

/**
 * [getOssSts2 获取阿里云token]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function getOssSts2(userToken) {
	var url = serverHost + 'ossSts2?token=' + userToken;
	return request.get({
		url: url,
		headers: _headers
	});
}

/**
 * [upload 上传]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function upload(path, data, headers) {
	return request.put({
		url: path,
		headers: headers,
		data: data
	});
}

function getViewData(uid, id, version) {
	// var url = 'http://res.maka.im/user/'+ uid +'/template/'+ id +'/'+ id +'_v'+ version +'.json';
	var url = `http://res.maka.im/user/${uid}/template/${id}/${id}_v${version}.json`;
	return request.get({url: url});
}

function getPages(url) {
	return request.get({url: url});
}