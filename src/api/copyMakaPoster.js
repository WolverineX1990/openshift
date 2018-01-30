'use strict';

var MakaPoster = require('./../maka/poster');
var MakaUser = require('./../user/makaUser');
var makaService = require('./../maka/service');
var config = require('./../config');
var makaConfig = config.maka;
const url = require('url');

function copyMakaPoster(target, toAccount, pwd) {
	let pathname = url.parse(target).pathname;
	let targetUrl = 'http://viewer.maka.im/k/' + pathname.split('/')[3] + '?mode=storeTemplate&TempAdmode=true';
	var user = new MakaUser(toAccount, pwd);
	var oriMaka = new MakaPoster(targetUrl);
	return oriMaka.loadData().then(res=>user.login().then(loginSuccess));

	function loginSuccess(res) {
		makaService.setHeaders({
			Origin: makaConfig.origin, 
			cookie: user.cookie
		});
		return makaService.createTemplate()
				.then(res=>res.split('h5editor?id=')[1].split('&')[0])
				.then(code=>{
					let json = MakaPoster.getDef(code, user.info.uid, oriMaka.data);
					let MakaPoster = new MakaPoster(json);
					maka.user = user;
					return maka;
				})
				.then(maka=> maka.copy(oriMaka.jsonData));
	}
}

module.exports = copyMakaPoster;