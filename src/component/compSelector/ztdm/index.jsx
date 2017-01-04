/**
 * 年检状态下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorZTDM = React.createClass({
    render(){
        return <Select {...this.props} placeholder="选择状态" allowClear>
            <Option key="0">退回</Option>
            <Option key="1">保存</Option>
            <Option key="2">自检</Option>
            <Option key="3">年检</Option>
        </Select>
    }
});

module.exports = selectorZTDM;