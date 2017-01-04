/**
 * 全国省市下拉选择器
 */
import React from 'react'
import {Cascader} from 'antd'
var data = require('./model.js');
const s = React.createClass({
    render(){
        return <Cascader {...this.props} options={data} expandTrigger="hover" />
    }
});

module.exports = s;