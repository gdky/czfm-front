/**
 * 年检状态下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorZT = React.createClass({
    render(){
        return <Select {...this.props} placeholder="状态" allowClear>
            <Option key="0">保存</Option>
            <Option key="1">提交</Option>
            
        </Select>
    }
});

module.exports = selectorZT;