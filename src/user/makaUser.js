'use strict';
var request = require('./../request');
var querystring = require('querystring');
var config = require('./../config').maka;
class MakaUser {
	constructor(name, pwd) {
		this.name = name;
		this.pwd = pwd;
		this.url = config.severHost + 'v1/sessions';
	}

	/**
	 * [login 登录]
	 * @return {[type]} [description]
	 */
	login() {
		var postData = querystring.stringify({
			username: this.name,
			password: this.pwd,
			type: 'form'
		});
		var that = this;
		var promise = new Promise(function(resolve, reject){
			request.post({
				url: that.url,
				data: postData,
				headers: {
					Origin: config.origin
				}
			}, {
				getCookie: true
			}).then(function(res) {
				that.cookie = [];
				for(let i =0; i< res.cookie.length; i++) {
					if(res.cookie[i].indexOf('delete') == -1) {
						that.cookie.push(res.cookie[i]);
					}
				}
				let result = JSON.parse(res.data);
				if(result.code != 200) {
					reject(result);
				} else {
					that.info = result.data;
					resolve(that.info);
				}
			}, function(err) {
				reject(err);
			});
		});
		return promise;
	}
}

module.exports = MakaUser;