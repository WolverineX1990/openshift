/*
* @Author: zhengchangjun
* @Date:   2018-02-06 16:12:40
* @Last Modified by:   zhengchangjun
* @Last Modified time: 2018-02-06 18:05:15
*/
let $submit = $('#submit');
let $type = $('#type');
let $url = $('#url');
let $account = $('#account');
let $pwdCon = $('#pwd-con').hide();
let $pwd = $('#pwd');
let $toast = $('#toast');

const methods = {
	1: 'eqx',
	2: 'rabbit',
	3: 'rabPoster',
	4: 'maka',
	5: 'makaSinglePage',
	6: 'makaVideo',
	7: 'makaPoster',
};

$type.on('change', e=> {
	if(e.target.value == 1) {
		$pwdCon.hide();
	} else {
		$pwdCon.show();
	}
});

$submit.on('click', e=> {
	var data = validate();
	if(data) {
		$.ajax({
        	type: 'POST',
        	url: '/api/' + data.method,
        	data: $.param(data),
        	success: (data, status, xhr)=> {
        		showToast();
        	},
        	error: (xhr, errorType, error)=> {
        		alert(error);
        	}
        });
	}
});

function showToast() {
	$toast.show();
    setTimeout(function () {
        $toast.hide();
    }, 2000);
}

function validate() {
	let typeVal = $type.val();
	let method = methods[typeVal];
	let url = $url.val();
	if(!url) {
		alert('请填写模板地址！');
		return false;
	}
	let toAccount = $account.val();
	if(!toAccount) {
		alert('请填写账号！');
		return false;
	}
	let pwd = $pwd.val();
	if(typeVal != 1 && !pwd) {
		alert('请填写密码！');
		return false;
	}

	return {
		url,
		method,
		toAccount,
		pwd
	};
}