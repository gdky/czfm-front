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
        dataIndex: 'create_time',
        key: 'create_time',
        width: 130
    },{
        title: '发送人',
        dataIndex: 'sender',
        key: 'sender',
        width: 130
    },{
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 300,
        render(text,record){
            return <a onClick={()=> {openlink(record)}}>{text}</a>
        }
    },{
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 100
    },{
        title: '收件人',
        key: 'reciver',
        dataIndex: 'reciver',
        width:200
    }]
};

module.exports = model;