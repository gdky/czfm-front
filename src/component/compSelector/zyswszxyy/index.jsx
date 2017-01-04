/**
 * 执业税务师注销原因下拉选择器
 */
import React from 'react'
import {Select} from 'antd'
const Option = Select.Option;

const selectorMZ = React.createClass({
    render(){
        return <Select {...this.props} placeholder="选择注销原因" disabled={this.props.disabled}  >
            <Option key="1" value={1}>违纪违法</Option>
            <Option key="2" value={2}>年检</Option>
            <Option key="3" value={3}>离职办所</Option>
            <Option key="4" value={4}>死亡</Option>
            <Option key="5" value={5}>其它</Option>
        </Select>
    }
});

module.exports = selectorMZ;