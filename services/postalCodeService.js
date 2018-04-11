/*
* @Author: zhengchangjun
* @Date:   2018-03-16 15:58:38
* @Last Modified by:   zhengchangjun
* @Last Modified time: 2018-04-10 19:20:05
*/
var http = require('http');
var iconv = require('iconv-lite');

function baiduCrawler(str) {
    var url = `http://opendata.baidu.com/post/s?wd=${str}&p=mini&rn=20`;
    var promise = new Promise(function(resolve, reject){
        http.get(url, (res) => {
            console.log(`status code: ${res.statusCode}`)
            var html = ''
            res.on('data', (chunk) => {
                html += iconv.decode(chunk, 'GBK')
            })
            res.on('end', () => {
                resolve(html);
            })
        }).on('error', (e) => {
            console.log(`http error: ${e.message}`);
        });
    });

    return promise;
}

var znReg = /[\u4e00-\u9fa5]/g;

function getCode(str) {
    //中文进行gbk编码
    var isZn = false;
    if(znReg.test(str)) {
        isZn = true;
        str = str.replace(znReg, function(s) {
            var buffer = iconv.encode(s, 'GBK');
            return '%' + buffer[0].toString('16')+ '%' + buffer[1].toString(16);
        });
    }

    return baiduCrawler(str)
    .then(function(res) {
        if(isZn) {
            var reg = /<td>([\d]{6})/;
            if(!reg.test(res)) {
                return;
            }
            return '邮编是'+res.match(reg)[1];
        } else {
            var reg = /region-data[^\:]*?\<\/article/;
            if(!reg.test(res)) {
                return;
            }

            var result = res.match(reg)[0];
            return '地区是'+result.match(znReg).join("");
        }
    });
}

module.exports = {
    getCode
};