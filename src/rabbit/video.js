'use strict';
var utils = require('./../utils');
var service = require('./service');
/**
 * 兔展场景对象
 */
class Video {
	constructor(id) {
		this.id = id;
	}

	/**
	 * [loadData 加载url中数据]
	 * @return {[type]} [description]
	 */
	loadData() {
		return service.getVideoData(this.id, this.user.info.user_id)
				.then(res=> {
					const data = JSON.parse(res);
					if(data.success) {
						this.data = data.data;
						return data.data;
					} else {
						throw data.errormsg;
					}
				});
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
	        	this.data = JSON.parse(res.substr(1).split('</script>')[0]);
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
		return service.createPoster(data);
	}

	copy(pages) {
		let copyPage = pages[0];
		let json = {
			bgcol: copyPage.bgcol,
			bgimage: copyPage.bgimage,
			col: copyPage.col,
			cmps: JSON.stringify(copyPage.cmps)
		};

		this.data.pages = [json];
		return this.save();
	}
}

module.exports = Video;