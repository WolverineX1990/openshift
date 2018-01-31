'use strict';

var MakaSiglePage = require('./../maka/siglePage');
var MakaUser = require('./../user/makaUser');
var makaService = require('./../maka/service');
var config = require('./../config');
var makaConfig = config.maka;
const url = require('url');

function copyMakaSinglePage(target, toAccount, pwd) {
	let pathname = url.parse(target).pathname;
	let codes = pathname.substr(1).split('_');
	let targetUrl = `http://u${codes[1]}.zuodanye.maka.im/pcviewer/${codes[0]}`;
	var user = new MakaUser(toAccount, pwd);
	var oriMaka = new MakaSiglePage(targetUrl);
	return oriMaka.loadData().then(res=>user.login().then(loginSuccess));

	function loginSuccess(res) {
		makaService.setHeaders({
			Origin: makaConfig.origin, 
			cookie: user.cookie
		});
		return makaService.createSinglePage()
				.then(res=>res.split('danyeeditor?id=')[1].split('&')[0])
				.then(code=>{
					let json = MakaSiglePage.getDef(code, user.info.uid, oriMaka.data);
					let siglePage = new MakaSiglePage(json);
					siglePage.user = user;
					return siglePage;
				})
				.then(maka=> maka.copy(oriMaka.data, oriMaka.jsonData));
	}
}

module.exports = copyMakaSinglePage;