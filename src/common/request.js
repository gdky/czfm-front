/**
 * Created by ming on 2016/9/23.
 * Promise包装的ajax请求
 * 传入参数{method:'get/post/put/delete', type:'json', url:'url_string', data:{object}}
 */
'use strict';

import auth from './auth'
import request  from 'reqwest'

const func = async function (param = {method: 'get',type:'json'}) {
    let {url, method, data} = param;
    if(method != 'get') {
        data = JSON.stringify(data);
    }
    return await request({
        url:url,
        contentType:'application/json',
        method:method,
        type:'json',
        data:data,
        headers: {'x-auth-token': auth.getToken()}
    });
};
module.exports = func;