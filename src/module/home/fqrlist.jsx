import React from 'react'
import {Table, Button, Icon} from 'antd'
import model from './modelFqr'

const list = React.createClass({
    getDefaultProps(){
        return {
            pageSize: 10,
            keyCol: 'id',
            columns: model.columns,
            data: []
        }
    },

    //初始化state
    getInitialState(){
        return {
            loading: false,
        }
    },
    getColWidth(model){
        let w = 0;
        model.columns.map(item=> {
            w = item.width ? w + item.width : w + 100;
        });
        return w;
    },
    render(){
        let {data,columns,keyCol} = this.props;
        return <Table columns={columns}
                      dataSource={data}
                      loading={this.state.loading}
                      rowKey={record => record[keyCol]}
                      pagination={false}
                      scroll={{x: this.getColWidth(model)}}
                      size="middle"/>
    }
});

module.exports = list;