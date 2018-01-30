'use strict';
const api = require('./src/api');
function routes(request, response) {	
	let method = request.pathname.replace('/api/', '');
	let promise;
	let params = request.params;
	if(!params) {
		fail('没有参数！')
		return;
	}
	console.log(params.url);
	switch (method) {
		case 'eqx':
			promise = api.copyEqx(params.url, params.toAccount);
			break;
		case 'maka':
			promise = api.copyMaka(params.url, params.toAccount, params.pwd);
			break;
		case 'rabbit':
			promise = api.copyRabbit(params.url, params.toAccount, params.pwd);
			break;
		case 'copyRabPoster':
			promise = api.copyRabPoster(params.url, params.toAccount, params.pwd);
			break;
		case 'copyRabVideo':
			promise = api.copyRabVideo(params.url, params.toAccount, params.pwd);
			break;
		case 'copyMakaVideo':
			promise = api.copyMakaVideo(params.url, params.toAccount, params.pwd);
			break;
		case 'copyMakaPoster':
			promise = api.copyMakaPoster(params.url, params.toAccount, params.pwd);
			break;
		case 'copyMakaSinglePage':
			promise = api.copyMakaSinglePage(params.url, params.toAccount, params.pwd);
		default:
			break;
	}

	promise.then(result, fail).catch(fail);

	function result(res) {
		response.writeHead(200, {'Content-Type': 'application/json'});
		var json = {
			success: true,
			msg: res
		};
    	response.end(JSON.stringify(json));
	}

	function fail(err) {
		response.writeHead(500, {'Content-Type': 'application/json'});
    	var json = {
			success: false,
			msg: err
		};
		console.log(err);
    	response.end(JSON.stringify(json));
	}
}

module.exports = routes;