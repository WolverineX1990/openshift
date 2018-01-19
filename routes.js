'use strict';
const api = require('./src/api');
function routes(request, response) {	
	let method = request.pathname.replace('/api/', '');
	let promise;
	let params = request.params;

	switch (method) {
		case 'eqx':
			// promise = api.copyEqx(params.url);
			break;
		case 'maka':
			// promise = api.copyMaka(params.url);
			break;
		case 'rabbit':
			// promise = api.copyRabbit(params.url);
			break;
		default:
			break;
	}

	result();
	// process.then(result, fail);

	function result() {
		response.writeHead(200, {'Content-Type': 'application/json'});
		var json = {
			success: true,
			msg: ''
		};
    	response.end(JSON.stringify(json));
	}

	function fail(err) {
		response.writeHead(500, {'Content-Type': 'application/json'});
    	var json = {
			success: false,
			msg: '失败'
		};
    	response.end(JSON.stringify(json));
	}
}

module.exports = routes;


// var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/81c484c1-d700-40d6-b90a-6bde8e7ee5bc?mobile=1';
// var eqxUrl = 'http://h5.eqxiu.com/s/kBKEChRH';
// var makaUrl = 'http://u546504.zuodanye.maka.im/viewer/XTAMTBYF?ts=1503911876';
// api.makaToRabbitPoster(makaUrl)
// 	.then(()=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.makaToRabbit(makaUrl).then(res=>console.log('convert success'));
// api.rabToEqx(rabbitpreUrl)
// 	.then(res=>console.log('convert success'))
//     .catch(err=>console.log(err));
// api.eqxToRabbit(eqxUrl)
// 	.then(res=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.makaToEqx(makaUrl).then(res=>console.log('convert success'));
// api.eqxToMaka(eqxUrl)
// 	.then(res=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.copyRabbit(rabbitpreUrl).then(res=>console.log('copy success'));