import React from 'react'

let foo = function(){};
module.exports = {
    handleEdit:function(func){
        foo = func;
    },
    columns: [
        {title: '角色名称', dataIndex: 'name', key: 'name'},
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description'

        }, {
            title: '操作',
            key: 'operation',
            render:(text, record) =>{
                return <span> <a onClick={()=>foo(record)}>修改</a></span>
            }
        }
    ],
    pagination: {
        pageSize: 10
    }

};