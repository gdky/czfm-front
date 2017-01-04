/**
 * 性别下拉选择器
 */
import React from 'react'
import {Select} from 'antd'
const Option = Select.Option;

const selector = React.createClass({
    render(){
        return <Select {...this.props} placeholder="选择性别" disabled={this.props.disabled}  >
            <Option key="1" >男</Option>
            <Option key="2" >女</Option>
        </Select>
    }
});

module.exports = selector;