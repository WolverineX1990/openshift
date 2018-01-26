var config = require('./../config');
var rabConfig = config.rabbit;
var Poster = require('./../rabbit/poster');
var RabbitUser = require('./../user/rabbitUser');
var rabbitSevice = require('./../rabbit/service');

function copyRabSpa(target, toAccount, pwd) {
	var user = new RabbitUser(toAccount, pwd);
	const url = 'http://www.rabbitpre.com/template/preview/spa/template/' + target.split('#')[1] + '?mobile=1';
	var oriPoster = new Poster(url);
	var json = '{"name":"兔展一页作品","desc":"这是我制作的兔展一页作品，快来看看！","height":504,"width":320,"imgurl_path":"https://oss3.rabbitpre.com/spa/default.png","templateid":"","imgurl":"","pages":[{"bgcol":"#fff","bgimage":null,"col":1000,"cmps":"[]"}],"app_material":""}';
	return oriPoster.loadData().then(res=>user.login().then(loginSuccess));

	function loginSuccess(res) {
		rabbitSevice.setHeaders({
			Origin: rabConfig.origin, 
			cookie: user.cookie
		});
		var data = {
			data: json,
			isAjax: true
		};
		return user.getSession().then(res=>rabbitSevice.getUserInfo({'x-jwt-token': user.info.token}))
					.then(res=> rabbitSevice.setHeaders({
							Origin: rabConfig.origin, 
							cookie: res.cookie
						}))
					.then(res=>rabbitSevice.createPoster(data))
					.then(res=> {
						var json = JSON.parse(res).result;
						var oriData = oriPoster.data;
						json.name = oriData.name;
						json.desc = oriData.desc;
						json.publish = true;
						json.in = oriData.in;
						json.imgurl_path = oriData.imgurl_path;
						json.imgurl = oriData.imgurl;
						var poster = new Poster(json);
						return poster.copy(oriData.pages);
					});
	}
}

module.exports = copyRabSpa;