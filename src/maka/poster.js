'use strict';
var utils = require('./../utils');
var service = require('./service');
var URL = require('url');
var sign = require('./sign');
var crypto = utils.crypto;
var fileHost = 'http://res3.maka.im/';
var Maka = require('./');

/**
 * MAKA场景
 */
class Poster extends Maka {
	constructor(data) {
		super(data);
	}

	loadSuc(html) {
		var dataReg = /window.TEMPLATE_INFO[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)/;
        return utils.getPageData(html, dataReg).then(res => {
        	res = res.split('window')[0];
        	this.data = JSON.parse(res.trim());
        	return this.getJson();
        });
	}

	static getDef(id, uid, meta) {
		return	{
			'id': id,
			'uid': uid,
			'title': meta.title,
			'content': meta.content,
			'thumb': meta.thumb,
			'version': '2',
			'e_version': '3',
			'template_id': '',
			'default_event_pid': '',
			'status': '0',
			'promotehot': '1',
			'promote': '1',
			'firstImg': 'assets\/poster\/maka-default-cover.png',
			'function_id': '0',
			'industry_id': '0',
			'collection_count': '0',
			'category_id': '0',
			'page_width': '640',
			'page_height': '1008',
			'lct': '0',
			'event_type': 'maka',
			'create_time': '2018-01-25 17:11:36',
			'update_time': '2018-01-25 17:11:36',
			'lite_used_count': '0',
			'is_buyed_template': '1',
			'duration': '1000',
			'json_url': `http:\/\/res.maka.im\/user\/${uid}\/event\/${id}\/${id}_v2.json`,
			'json_folder': `user\/${uid}\/event\/${id}\/`,
			'video_url': '',
			'viewer_url': `http:\/\/u${uid}.viewer.maka.im\/k\/${id}`,
			'enable_edit': 1,
			'corner': 'normal'
		}
	}
}

function getOssHeader(token, data, resource) {
	var credentials = token.token.Credentials;
	var ContentMD5 = crypto.md5(data, 'base64');
	var header = {
		method: 'PUT',
		'Content-MD5': ContentMD5,
		'Content-Type': 'text/json',
		'x-oss-date': (new Date()).toUTCString(),
		'x-oss-security-token': credentials.SecurityToken,
		'x-sdk-client': ''
	}

	var signature = sign(credentials, header, resource);
	var auth = 'OSS ' + credentials.AccessKeyId + ':' + signature;
	header.Authorization = auth;

	return header;
}

module.exports = Poster;