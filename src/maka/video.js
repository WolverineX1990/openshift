'use strict';
var utils = require('./../utils');
var service = require('./service');
var URL = require('url');
var sign = require('./sign');
var crypto = utils.crypto;
var fileHost = 'http://res3.maka.im/';

/**
 * MAKA场景
 */
class Video {
	constructor(data) {
		if(typeof data == 'string') {
			this.dataUrl = data;
		} else {
			this.data = data;
		}
	}

	/**
	 * [user 设置用户]
	 * @param  {[type]} user [description]
	 * @return {[type]}      [description]
	 */
	set user(user) {
		this._user = user;
	}

	/**
	 * [user 获取用户]
	 * @return {[type]} [description]
	 */
	get user() {
		return this._user;
	}

	getJson() {
		return service.getPages(this.data.json_url).then(res=>{
			this.jsonData = JSON.parse(res);
			return this.jsonData;
		});
	}

	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	loadSuc(html) {
		var dataReg = /window.TEMPLATE_INFO[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)/;
        return utils.getPageData(html, dataReg).then(res => {
        	res = res.split('window')[0];
        	this.data = JSON.parse(res.trim());
        	return this.getJson();
        });
	}

	/**
	 * [save 保存]
	 * @return {[type]} [description]
	 */
	save() {
		if(this.ossSts2) {
			var code = this.data.id;
			var string = JSON.stringify(this.jsonData);
			var binary = new Buffer(string, 'utf8');
			var path = '/' + this.ossSts2.uploadPath +'/event/' + code + '/' + code + '_v2.json';
			var resource = '/' + this.ossSts2.bucket + path;
			var header = getOssHeader(this.ossSts2, binary, resource);
			var param = URL.parse(this.ossSts2.hostId);
			var url = param.protocol + '//' + this.ossSts2.bucket + '.' + param.host + path;
			return service.upload(url, binary, header).then(res=> service.saveTemplate(this.data.uid, code, {
				version: 2,
				p_version: 2,
				e_version: 3,
				thumb: this.data.thumb,
				title: this.data.title,
				content: this.data.content
			}));

		} else {
			return service.getOssStss(this.user.info.uid, this.user.info.token).then(res=>{
				this.ossSts2 = JSON.parse(res).data;
				return this.save();
			});
		}
	}

	copy(json) {
		let pdata = json.data.pdata;
		this.jsonData = {
			code: 200,
			data: {
				pdata: {
					json: pdata.json,
					menu: pdata.menu,
					music: pdata.music,
					version: 2
				}
			}
		};
		return this.save();
	}

	static getDef(id, uid, meta) {
		return	{
			'id': id,
			'uid': uid,
			'title': meta.title,
			'content': meta.content,
			'thumb': meta.thumb,
			'duration': meta.duration,
			'durationFormat': meta.durationFormat,
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

module.exports = Video;