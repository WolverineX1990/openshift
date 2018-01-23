'use strict';
const config = require('./../config');
const eqxConfig = config.eqx;
const Scene = require('./../scene');
const sceneService = require('./../scene/services');
const EqxUser = require('./../user/eqxUser');

function copyEqx(url, toAccount) {
	if(!url || !toAccount) {
		let promise = new Promise((resolve, reject)=>{
			reject('参数不正确');
		});

		return promise;
	}
	let eqxUser = new EqxUser(eqxConfig.eqxName, eqxConfig.eqxPwd);
	let oriScene = new Scene(url);
	return oriScene.loadData().then(res=>eqxUser.login().then(loginSuccess));

	function loginSuccess() {
		let scene;
		sceneService.setHeaders({Origin: eqxConfig.eqxOrigin, cookie: eqxUser.cookie});
		return sceneService.createScene().then(res=>sceneService.getSceneDetail(res.obj))
						.then(res => {
							let json = res.obj;
							let originData = oriScene.data;
							json.bgAudio = JSON.stringify(originData.bgAudio);
							json.property = JSON.stringify(originData.property);
							json.name = originData.name;
							json.cover = originData.cover;
							json.description = originData.description;
							json.pageMode = originData.pageMode;
							scene = new Scene(json);
							scene.user = eqxUser;
						 	return scene.copy(oriScene.pages);
						})
						.then((res)=>scene.transfer(toAccount));
	}
}

module.exports = copyEqx;