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
class SiglePage {
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

	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	loadSuc(html) {
		var dataReg = /versionData[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)/;
        return utils.getPageData(html, dataReg).then(res => {
        	res = res.split('window.loadJson')[0];
        	this.data = JSON.parse(res.trim());
        	return this.loadContent();
        });
	}

	loadContent(){
		return service.getViewData(this.data.uid, this.data.id, this.data.p_version).then(res=>{
			var data = JSON.parse(res).data;
			this.jsonData = data;
			return this;
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
			const size = this.jsonData.data.canvasSize;
			return service.upload(url, binary, header)
					.then(res=> service.setTag(this.data.uid, code, {
						type: 'danye',
						ids: 1
					}))
					.then(res=> service.saveSinglePage(this.data.uid, code, {
						version: 2,
						p_version: 2,
						editor_version: 3,
						page_width: size.width,
						page_height: size.height
					}));

		} else {
			return service.getOssStss(this.user.info.uid, this.user.info.token).then(res=>{
				this.ossSts2 = JSON.parse(res).data;
				return this.save();
			});
		}
	}

	copy(meta, json) {
		this.jsonData = {
			data: {
				background: json.background,
				canvasSize: json.canvasSize,
				content: json.content,
				editorVersion: 1,
				music: json.music,
				floatAD: json.floatAD,
				lastModified: Date.now(),
				version: 2
			}
		};
		return this.save()
					.then(res=>this.setCover(meta.thumb));
	}

	setCover(url) {
		return service.updateCover(this.data.id, {thumb: url});
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

module.exports = SiglePage;