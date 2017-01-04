/**
 * 性别下拉选择器
 */
import React from 'react'
import {Select} from 'antd'
const Option = Select.Option;

const selectorMZ = React.createClass({
    render(){
        return <Select {...this.props} placeholder="请选择" disabled={this.props.disabled}  >
            <Option key="1" value={1}>是</Option>
            <Option key="2" value={2}>否</Option>
        </Select>
    }
});

module.exports = selectorMZ;