!function(t){function e(n){if(r[n])return r[n].exports;var a=r[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var r={};e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,r){"use strict";function n(){s.show(),setTimeout(function(){s.hide()},2e3)}function a(){var t=u.val(),e=p[t],r=c.val();if(!r)return alert("请填写模板地址！"),!1;var n=i.val();if(!n)return alert("请填写账号！"),!1;var a=f.val();return 1==t||a?{url:r,method:e,toAccount:n,pwd:a}:(alert("请填写密码！"),!1)}var o=$("#submit"),u=$("#type"),c=$("#url"),i=$("#account"),l=$("#pwd-con").hide(),f=$("#pwd"),s=$("#toast"),p={1:"eqx",2:"rabbit",3:"rabPoster",4:"maka",5:"makaSinglePage",6:"makaVideo",7:"makaPoster"};u.on("change",function(t){1==t.target.value?l.hide():l.show()}),o.on("click",function(t){var e=a();e&&$.ajax({type:"POST",url:"/api/"+e.method,data:$.param(e),success:function(t,e,r){n()},error:function(t,e,r){alert(r)}})})}]);