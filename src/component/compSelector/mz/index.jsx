/**
 * 民族下拉选择器
 */
import React from 'react'
import {Select} from 'antd'
import data from './model.js'

const Option = Select.Option;

const selectorMZ = React.createClass({
    render(){
        const options = data.map(item=><Option key={item.id} value={item.id}>{item.mc}</Option>)
        return <Select {...this.props} placeholder="选择民族" showSearch optionFilterProp='children' disabled={this.props.disabled}>
            {options}
        </Select>
    }
});

module.exports = selectorMZ;