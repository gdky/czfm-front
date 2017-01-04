/**
 * 年检状态下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorXZ = React.createClass({
    render(){
        return <Select {...this.props} placeholder="性质" >
            <Option key="0">半年</Option>
            <Option key="1">全年</Option>
            
        </Select>
    }
});

module.exports = selectorXZ;