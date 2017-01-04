/**
 * 行业下拉选择器
 */
import React from 'react'
import {Select} from 'antd'
import data from './model.js'

const Option = Select.Option;

const selectorLogRole = React.createClass({
    render(){
        const options = data.map(item=><Option key={item.mc}>{item.mc}</Option>)
        return <Select {...this.props} placeholder="选择要查找的角色" allowClear>
            {options}
        </Select>
    }
});

module.exports = selectorLogRole;