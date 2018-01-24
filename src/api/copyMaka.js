var Maka = require('./../maka');
var MakaUser = require('./../user/MakaUser');
var makaSevice = require('./../maka/service');
var config = require('./../config');
var makaConfig = config.maka;
const url = require('url');

function copyMaka(target, toAccount, pwd) {
	let pathname = url.parse(target).pathname;
	let targetUrl = 'http://viewer.maka.im/k/' + pathname.split('/')[3] + '?mode=storeTemplate&TempAdmode=true';
	var user = new MakaUser(toAccount, pwd);
	var maka = new Maka(targetUrl);
	return maka.loadData().then(res=>user.login().then(loginSuccess));

	function loginSuccess(res) {
		makaService.setHeaders({
			Origin: makaConfig.origin, 
			cookie: user.cookie
		});
		// return makaService.createTemplate();
	}
}

module.exports = copyMaka;