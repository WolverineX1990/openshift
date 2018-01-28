var config = require('./../config');
var rabConfig = config.rabbit;
var Video = require('./../rabbit/video');
var RabbitUser = require('./../user/rabbitUser');
var rabbitSevice = require('./../rabbit/service');

function copyRabVideo(target, toAccount, pwd) {
	var user = new RabbitUser(toAccount, pwd);
	var oriPoster = new Video(target.split('#')[1]);
	// var json = '{"name":"兔展一页作品","desc":"这是我制作的兔展一页作品，快来看看！","height":504,"width":320,"imgurl_path":"https://oss3.rabbitpre.com/spa/default.png","templateid":"","imgurl":"","pages":[{"bgcol":"#fff","bgimage":null,"col":1000,"cmps":"[]"}],"app_material":""}';
	return user.login()
		.then(res=> {
			rabbitSevice.setHeaders({
				Origin: rabConfig.origin, 
				cookie: user.cookie
			});
			oriPoster.user = user;
		})
		.then(()=>oriPoster.loadData())
		.then(()=>rabbitSevice.createVideo(data))
		.then(res=>{

		});
	// return oriPoster.loadData().then(res=>user.login().then(loginSuccess));

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
						json.height = oriData.height;
						var poster = new Poster(json);
						return poster.copy(oriData.pages);
					});
	}
}

module.exports = copyRabVideo;