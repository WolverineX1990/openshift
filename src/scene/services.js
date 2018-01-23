'use strict';

module.exports = {
	createScene: createScene,
	createPage: createPage,
	savePage: savePage,
	getPages: getPages,
	publish: publish,
	getViewData: getViewData,
	setHeaders: setHeaders,
	getSceneDetail: getSceneDetail,
	saveSetting: saveSetting,
	setBgAudio: setBgAudio,
	transfer
};

var http = require('http');
var querystring= require('querystring');
var httpRequest = require('./../request');
var config = require('./../config').eqx;
var serverHost = config.eqxSeverHost;
var vserverHost = config.eqxVSeverHost;
var s1Host = config.eqxS1Host;
var _headers;

/**
 * 拦截器，对request进行拦截，统一处理
 */
const request = {};

request.post = function(...params) {
	return httpRequest.post(...params)
			.then(res=>{
				let json = JSON.parse(res);
				if(json.success) {
					return json;
				} else {
					console.log(json);
					throw json;
				}
			});
}

request.get = function(...params) {
	return httpRequest.get(...params)
			.then(res=>{
				let json = JSON.parse(res);
				if(json.success) {
					return json;
				} else {
					throw json.mess;
				}
			});
}

/**
 * [setHeaders 设置http header]
 * @param {[type]} headers [description]
 */
function setHeaders(headers) {
	_headers = headers;
}

/**
 * [createScene 创建场景]
 * @return {[type]} [description]
 */
function createScene() {
	var data = {
		type: 101,
		pageMode: 0
	};
	return request.post({
		data: querystring.stringify(data),
		url: serverHost + 'm/scene/create',
		headers: _headers
	});
}

/**
 * [getSceneDetail 获取场景详情]
 * @param  {[type]} sceneId [description]
 * @return {[type]}         [description]
 */
function getSceneDetail(sceneId) {
	return request.get({
		url: serverHost + 'm/scene/detail/' + sceneId,
		headers: _headers
	});
}

/**
 * [createPage 创建页]
 * @param  {[type]} pageId [description]
 * @return {[type]}        [description]
 */
function createPage(pageId) {
	return request.get({
		url: serverHost + 'm/scene/createPage/' + pageId,
		headers: _headers
	});
}

/**
 * [savePage 保存页]
 * @param  {[type]} page [description]
 * @return {[type]}      [description]
 */
function savePage(page) {
	var url = vserverHost + 'm/scene/save';
	var data = {
		data: JSON.stringify(page),
		url: url,
		headers: _headers
	};
	data.headers['Content-Type'] = 'text/plain; charset=UTF-8';
	return request.post(data);
}

/**
 * [publish 发布]
 * @return {[type]} [description]
 */
function publish(sceneId, checkType) {
	var url = serverHost + 'm/scene/publish?id=' + sceneId;
    if (checkType) {
        url += (/\?/.test(url) ? '&' : '?') + 'checkType=' + checkType;
    }
    url += '&?time='+Date.now();
    return request.get({
		url: url,
		headers: _headers
	});
}

/**
 * [saveSetting 场景设置]
 * @param  {[type]} meta [description]
 * @return {[type]}      [description]
 */
function saveSetting({autoFlip, autoFlipTime, cover, description, forbidHandFlip, id, name, pageMode, shareDes, slideNumber, triggerLoop, type}) {
	let meta = {
		autoFlip,
		autoFlipTime,
		cover,
		description,
		forbidHandFlip,
		id,
		name,
		pageMode,
		shareDes,
		slideNumber,
		triggerLoop,
		type
	};
	var url = vserverHost + 'm/scene/setting/save';
	var data = {
		data: querystring.stringify(meta),
		url: url,
		headers: _headers
	};
	data.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	return request.post(data);
}

function setBgAudio({bgAudio, id}) {
	var url = serverHost + 'm/scene/audio/set';
	var data = {
		data: querystring.stringify({id, bgAudio}),
		url: url,
		headers: _headers
	};
	data.headers['Content-Type'] = 'application/x-www-form-urlencoded';

	return request.post(data);
}

/**
 * [getPages 获取页面数据]
 * @param  {[type]} sceneId [description]
 * @return {[type]}         [description]
 */
function getPages(sceneId) {
	var url = serverHost + 'm/scene/pages/' + sceneId;
	return request.get({
		url: url,
		headers: _headers
	});
}

function getViewData(sceneId, sceneCode) {
	var url = s1Host + 'eqs/page/'+sceneId+'?code='+sceneCode;
	return request.get({url: url});
}

function transfer(loginName, id, platform) {
	var url = serverHost + 'm/scene/transfer';

	var data = {
		loginName,
		id,
		platform
	};
	// data.headers['Content-Type'] = 'text/plain; charset=UTF-8';
	return request.post({
		data: querystring.stringify(data),
		url: url,
		headers: _headers
	});
}