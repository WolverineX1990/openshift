'use strict';

const config = require('./../config');
const rabConfig = config.rabbit;
const RabbitUser = require('./../user/rabbitUser');
const rabbitSevice = require('./../rabbit/service');

function getRabMoney() {
    const user = new RabbitUser(rabConfig.userName, rabConfig.userPwd);
    return user.login()
            .then(res=>{
                rabbitSevice.setHeaders({
                    Origin: rabConfig.origin, 
                    cookie: user.cookie
                });
                return user.getSession();
            })
            .then(res=>rabbitSevice.getUserInfo({'x-jwt-token': user.info.token}))
            .then(res=> {
                rabbitSevice.setHeaders({
                    Origin: rabConfig.origin, 
                    cookie: res.cookie
                });

                return rabbitSevice.getUserMoney();
            });
}

module.exports = getRabMoney;