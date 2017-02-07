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
        title: '序号',
        dataIndex: 'xh',
        key: 'xh',
        render(text,record,index){
            return index+1;
        },
        width: 50
    },{
        title: '标题',
        dataIndex: 'BT',
        key: 'BT',
        width: 230
    },{
        title: '路径',
        dataIndex: 'URL',
        key: 'URL',
        width: 300
    },{
        title: '录入人',
        dataIndex: 'LRR',
        key: 'LRR',
        width: 100
    },{
        title: '录入日期',
        key: 'LRRQ',
        dataIndex: 'LRRQ',
        width:200
    },{
        title: '有效标志',
        key: 'YXBZ',
        dataIndex: 'YXBZ',
        width:80
    },{
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render(text,record){
            return <a onClick={()=> {openlink(record.URL)}}>试听</a>
        }
    },]
};

module.exports = model;