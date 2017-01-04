/**
 * Created by admin on 2016/11/4.
 */
'use strict'

var model = require('./model.json')
var obj = [];
for (var prop in model){
    let children = [];
    let province = '';
    let length = model[prop].length;
    for(var i = 0; i<length;i++){
        children.push({key:model[prop][i].id,label:model[prop][i].name})
        province = model[prop][i].province;
    }
    obj.push({key:prop,label:province,children:children})
}
console.log(JSON.stringify(obj));

