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
class Maka {
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
		return utils.getResource(this.data.json_url).then(res=>{
			this.jsonData = JSON.parse(res);
			this.page = this.jsonData.data.pdata.json;
			return this.jsonData;
		});
	}

	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	loadSuc(html) {
		// var dataReg = /window.projectVersion[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)/;
		var dataReg = /versionData[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)$/;
        return utils.getPageData(html, dataReg).then(res => {
        	var index = res.indexOf('window.loadJson');
        	res = res.substring(0, index);
        	this.data = JSON.parse(res);
        	// return this.loadViewPages();
        	var $ = cheerio.load(html);
        	this.data.cover = $('#thumb').attr('lazysrc');
        	return this.loadContent();
        }, error=>console.log(error));
	}

	loadViewPages(){
		return service.getViewData(this.data.uid, this.data.id, this.data.p_version).then(res=>{
			var data = JSON.parse(res).data.pdata;
			this.pages = data.json;
			this.data.music = data.music;
			return this;
		});
	}

	loadContent(){
		return service.getViewData(this.data.uid, this.data.id, this.data.p_version).then(res=>{
			var data = JSON.parse(res).data;
			this.pages = [data.content];
			this.data.music = data.music;
			this.data.height = data.canvasSize.height;
			this.data.background = data.background;
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
			var path = '/' + this.ossSts2.uploadPath +'template/' + code + '/' + code + '_v1.json';
			var resource = '/' + this.ossSts2.bucket + path;
			var header = getOssHeader(this.ossSts2, binary, resource, 'text/json');
			var param = URL.parse(this.ossSts2.hostId);
			var url = param.protocol + '//' + this.ossSts2.bucket + '.' + param.host + path;
			return service.upload(url, binary, header).then(res=> service.saveTemplate(code, {
				version: 1,
				thumb: this.data.thumb,
				title: this.data.title,
				content: this.data.content
			}));

		} else {
			return service.getOssSts2(this.user.info.token).then(res=>{
				this.ossSts2 = JSON.parse(res).data;
				return this.save();
			});
		}
	}

	copy(pages) {
		this.data.pages[0].deleted = true;
		for(var i = 0;i<pages.length;i++) {
			var page = pages[i];
			var json = {
				appid: this.data.id,
				row: page.row,
				col: page.col,
				in: page.in,
				out: page.out,
				bgcol: page.bgcol,
				bgimage: page.bgimage,
				bgserver: page.bgserver,
				bgleft: page.bgleft,
				bgtop: page.bgtop,
				cmps: page.cmps
			};
			this.data.pages.push(json);
		}
		return this.save();
	}
}


module.exports = Maka;