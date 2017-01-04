import React from 'react'
import {Icon,Popconfirm} from 'antd'

let handleEdit = function (record) {
    console.log('edit',record)
};
let handleDel = function (record) {
    console.log('del',record)
};
let resetPass = function(){};

module.exports = {
    setEdit: function (func) {
        handleEdit = func;
    },
    setDel: function (func) {
        handleDel = func;
    },
    setPass:function(func){
        resetPass = func;
    },
    columns: [
        {title: '用户名', dataIndex: 'username', key: 'username',width: 240},
        {title: '登录名', dataIndex: 'uname', key: 'uname',width: 100},
        {title: 'Email', dataIndex: 'email', key: 'email'},
        {
            title: '有效',
            dataIndex: 'accountEnabled',
            key: 'accountEnabled',
            width: 50,
            render(text){
                if (text == 1) {
                    return <Icon type="check-circle" style={{color:'#60BE29'}}/>
                } else {
                    return <Icon type="info-circle" style={{color:'#E01515'}}/>
                }
            }

        }, {
            title: '过期',
            dataIndex: 'accountExpired',
            key: 'accountExpired',
            width: 50,
            render(text){
                if (text == 1) {
                    return <Icon type="info-circle" style={{color:'#E01515'}}/>
                } else {
                    return <Icon type="check-circle" style={{color:'#60BE29'}}/>
                }
            }
        }, {
            title: '锁定',
            dataIndex: 'accountLocked',
            key: 'accountLocked',
            width: 50,
            render(text){
                if (text == 1) {
                    return <Icon type="info-circle" style={{color:'#E01515'}}/>
                } else {
                    return <Icon type="check-circle" style={{color:'#60BE29'}}/>
                }
            }
        },
        {title: '账户描述', dataIndex: 'names', key: 'names',width: 240},
        {title: '创建时间', dataIndex: 'createTime', key: 'createTime'},
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 150,
            render: (text, record) => {
                return <span>
                    <a onClick={()=>handleEdit(record)}>编辑</a> &nbsp;&nbsp;
                    <Popconfirm title="确定要删除吗？" placement="left" onConfirm={()=>handleDel(record)}>
                        <a>删除</a>
                    </Popconfirm>&nbsp;&nbsp;
                    <a onClick={()=>resetPass(record)}>重置密码</a>
                </span>
            }
        }
    ]
};