
var express = require('express');
var bodyParser = require('body-parser');
var Alpha = require("./Alpha/api");
var postalCodeService = require('./services/postalCodeService');

var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('hello world');
});

app.post('/alpha/', function(req, res){
    var session = req.body.session;
    var request = req.body.request;
    if(request.intent == 'Alpha.CancelIntent') {
        res.send(Alpha.noticeText('退出'));
    } else if(request.intent == 'Alpha.HelpIntent') {
        res.send(Alpha.welcome('您需要提供地区名称或邮政编码进行查询'));
    } else {
        postalCodeService.getCode(request.original)
                .then(code=>{
                    if(code) {
                        res.send(Alpha.welcome(code));
                    } else {
                        res.send(Alpha.welcome('没有查询到结果，请您重新查询'));
                    }
                });
    }
});

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.listen(port || 3000);