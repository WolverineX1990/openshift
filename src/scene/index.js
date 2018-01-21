'use strict';
var utils = require('./../utils');
var services = require('./services');
var fileHost = 'http://res.eqh5.com/';
/**
 * 易企秀场景
 */
class Scene {
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

	/**
	 * [propertys 设置属性信息]
	 * @param  {[type]} pro [description]
	 * @return {[type]}     [description]
	 */
	set propertys(pro) {
		for(var key in pro) {
			this.data[key] = pro[key];
		}
	}

	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	loadSuc(res) {
		var dataReg = /var[\s|\w]*scene[\s|\w]*=[\s|\w]*{([\s|\w|\W]+);/;
        return utils.getPageData(res, dataReg).then(res => {
        	this.data = eval("("+res+")");
        	return this.loadViewPages();
        }, error=>console.log(error));
	}

	loadViewPages() {
		return services.getViewData(this.data.id, this.data.code).then(res=>{
			this.pages = JSON.parse(res).list;
			return this;
		});
	}

	/**
	 * [loadPages 加载场景的所有页面数据]
	 * @return {[type]} [description]
	 */
	loadPages() {
		return services.getPages(this.data.id).then(res => {
			this.pages = JSON.parse(res).list;
			this.currentPage = this.pages[0];
			return this;
		});
	}

	/**
	 * [savePage 保存一页]
	 * @param  {[type]} json [description]
	 * @return {[type]}      [description]
	 */
	savePage(json) {
		return services.savePage(json);
	}

	/**
	 * [insertPage 插入一页]
	 * @return {[type]} [description]
	 */
	insertPage() {
		return services.createPage(this.currentPage.id).then(res => {
			this.currentPage = JSON.parse(res).obj;
			this.pages.push(this.currentPage);
			return this;
		});
	}

	copy(pages) {
		var page = pages.shift();
		if(page) {
			return this.copyPage(page).then(res=> this.copy(pages));	
		} else {
			return this.publish();
		}
	}

	copyPage(page) {
		if(this.currentPage) {
			return this.insertPage().then(res1=>{
				this.currentPage.elements = page.elements;
			    return this.savePage(this.currentPage);
			});
		} else {
			return this.loadPages().then(res1=>{
				this.currentPage.elements = page.elements;
				return this.savePage(this.currentPage);
			});
		}
	}

	transfer(account) {
		console.log(1)
		var promise = new Promise(function(resolve, reject) {
			resolve();
		});

		return promise;
	}

	/**
	 * [publish 保存设置并发布]
	 * @return {[type]} [description]
	 */
	publish() {
		return services.saveSetting(this.data).then(res=>{
			return services.publish(this.data.id);
		});
	}
}

module.exports = Scene;