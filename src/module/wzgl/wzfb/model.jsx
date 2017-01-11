/**
 * Created by ming on 2016/4/11.
 */
import React from 'react'
function openlink(record){

}
const model = {
    setfunc(func){
        openlink = func
    },
    columns: [{
        title: '时间',
        dataIndex: 'createtime',
        key: 'createtime',
        width: 130
    },{
        title: '发布人',
        dataIndex: 'sender',
        key: 'sender',
        width: 130
    },{
        title: '文章标题',
        dataIndex: 'title',
        key: 'title',
        width: 300,
        render(text,record){
            return <a onClick={()=> {openlink(record)}}>{text}</a>
        }
    },{
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100
    }]
};

module.exports = model;