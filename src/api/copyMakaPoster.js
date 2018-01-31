'use strict';

var MakaPoster = require('./../maka/poster');
var MakaUser = require('./../user/makaUser');
var makaService = require('./../maka/service');
var config = require('./../config');
var makaConfig = config.maka;

function copyMakaPoster(target, toAccount, pwd) {
	var user = new MakaUser(toAccount, pwd);
	var oriMaka = new MakaPoster(target);
	return oriMaka.loadData().then(res=>user.login().then(loginSuccess));

	function loginSuccess(res) {
		makaService.setHeaders({
			Origin: makaConfig.origin, 
			cookie: user.cookie
		});
		return makaService.createPoster()
				.then(res=>res.split('postereditor?id=')[1].split('&')[0])
				.then(code=>{
					let json = MakaPoster.getDef(code, user.info.uid, oriMaka.data);
					let makaPoster = new MakaPoster(json);
					makaPoster.user = user;
					return makaPoster;
				})
				.then(maka=> maka.copy(oriMaka.jsonData));
	}
}

module.exports = copyMakaPoster;