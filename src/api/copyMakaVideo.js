'use strict';

var MakaVideo = require('./../maka/video');
var MakaUser = require('./../user/makaUser');
var makaService = require('./../maka/service');
var config = require('./../config');
var makaConfig = config.maka;

function copyMakaVideo(target, toAccount, pwd) {
	var user = new MakaUser(toAccount, pwd);
	var oriMaka = new MakaVideo(target);
	return oriMaka.loadData().then(res=>user.login().then(loginSuccess));

	function loginSuccess(res) {
		makaService.setHeaders({
			Origin: makaConfig.origin, 
			cookie: user.cookie
		});
		return makaService.createVideo()
				.then(res=>res.split('videoeditor?id=')[1].split('&')[0])
				.then(code=>{
					let json = MakaVideo.getDef(code, user.info.uid, oriMaka.data);
					let makaVideo = new MakaVideo(json);
					makaVideo.user = user;
					return makaVideo;
				})
				.then(maka=> maka.copy(oriMaka.jsonData));
	}
}

module.exports = copyMakaVideo;