'use strict';

module.exports = {
	createTemplate,
	getSso,
	getTicket,
	getSesion,
	getUserInfo,
	setHeaders,
	getTplData,
	getCmpId,
	createPoster,
	getVideoData,
	createVideo
};

var http = require('http');
var querystring= require('querystring');
var request = require('./../request');
var config = require('./../config').rabbit;
var serverHost = config.severHost;
var extend = require('./../utils').extend;

var _headers;

/**
 * [setHeaders 设置http header]
 * @param {[type]} headers [description]
 */
function setHeaders(headers) {
	_headers = headers;
}

function getSso(headers) {
	return request.get({
		url: serverHost + 'user/syncsso',
		headers: extend(headers, _headers)
	}, {getCookie: true});
}

function getTicket(url) {
	return request.get({
		url: url,
		headers: _headers
	}, {getCookie: true});
}

function getSesion() {
	return request.get({
		url: 'http://eps.rabbitpre.com/api/user/session?callback=undefined',
		headers: _headers
	}, {getCookie: true});
}

function getUserInfo(headers) {
	return request.get({
		url: serverHost + 'user/info',
		headers: extend(headers, _headers)
	}, {getCookie: true});
}

/**
 * [createTemplate description]
 * @return {[type]} [description]
 */
function createTemplate(data) {
	return request.post({
		url: serverHost + 'app',
		headers: _headers,
		data: querystring.stringify(data)
	});
}

/**
 * [createTemplate description]
 * @return {[type]} [description]
 */
function createPoster(data) {
	return request.post({
		url: serverHost + 'spa',
		headers: _headers,
		data: querystring.stringify(data)
	});
}

function createVideo() {
	return request.post({
		url: 'http://esee.rabbitpre.com/api/my/videos',
		headers: _headers,
		data: querystring.stringify(data)
	});
}

function getVideoData(id, uid) {
	return request.get({
		url: `http://store.rabbitpre.com/template?id=${id}&userId=${uid}`,
		headers: _headers
	});
	// &userId=04a5afec-80b2-447a-95d3-93c9e8e0f99f
}

/**
 * [getUploadToken ]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function getUploadToken(data) {
	var url = serverHost + 'upload/params';
	return request.get({
		url: url,
		headers: _headers,
		data: data
	});
}

/**
 * [upload 上传]
 * @param  {[type]} userToken [description]
 * @return {[type]}           [description]
 */
function upload(data) {
	var url = serverHost + 'upload/uploaded';
	return request.post({
		url: url,
		headers: _headers,
		data: querystring.stringify(data)
	});
}

function getTplData(id) {
	var url = serverHost + 'app/user/'+ id +'?isAjax=true';
	return request.get({
		url: url,
		headers: _headers
	});
}

function getCmpId(data) {
	return request.put({
		url: serverHost + 'cmp',
		headers: _headers,
		data: querystring.stringify(data)
	});
}