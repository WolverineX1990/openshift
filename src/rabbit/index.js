'use strict';
var utils = require('./../utils');
var service = require('./service');
/**
 * 兔展场景对象
 */
class Rabbit {
	constructor(data) {
		if(typeof data == 'string') {
			this.dataUrl = data;
		} else {
			this.data = data;
		}
	}

	/**
	 * [loadData 加载url中数据]
	 * @return {[type]} [description]
	 */
	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	/**
	 * [loadSuc loadData的回调处理]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	loadSuc(res) {
		if(res.indexOf('Moved Temporarily') > -1) {
	        var reg = /Moved Temporarily. Redirecting to[\s]*([\w|\s|\W]+)/;
	        return utils.getHtml(res.match(reg)[1]).then(res=>this.loadSuc(res));
	    } else {
	    	var dataReg = /var[\s|\w]*pageData[\s|\w]*=([\W|\w]+)/;
	        return utils.getPageData(res, dataReg).then(res => {
				res = utils.base64.decode(res.split('"')[1]);
	        	this.data = JSON.parse(res);
	        	this.pages = this.data.pages;
	        	return res;
	        });
	    }
	}

	save() {
		this.data.publish = true;
		var data = {
			data: JSON.stringify(this.data),
			isAjax: true
		};
		return service.createTemplate(data);
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

module.exports = Rabbit;