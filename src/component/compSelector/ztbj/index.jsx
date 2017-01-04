/**
 * 法规代码下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorZTBJ = React.createClass({
    render(){
        return <Select {...this.props} placeholder="选择状态" allowClear>
            <Option key="0">保存</Option>
            <Option key="1">提交</Option>
            <Option key="2">通过</Option>
            <Option key="3">退回</Option>
        </Select>
    }
});

module.exports = selectorZTBJ;