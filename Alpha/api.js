/*
* @Author: zhengchangjun
* @Date:   2018-03-16 15:58:55
* @Last Modified by:   zhengchangjun
* @Last Modified time: 2018-03-16 15:59:19
*/
function noticeText(text) {
    var obj = {
      "response": {
        "output": {
          "text": text,
          "type": "PlainText"
        }
      },
      "shouldEndSession": true,
      "intent": "CarQuery",
      "version": "1.0"
    };
    return JSON.stringify(obj);
}

function welcome(text) {
    var obj = {
      "response": {
        "output": {
          "text": text,
          "type": "PlainText"
        }
      },
      "shouldEndSession": false,
      "intent": "CarQuery",
      "version": "1.0"
    };
    return JSON.stringify(obj);
}

module.exports = {
    noticeText,
    welcome
}