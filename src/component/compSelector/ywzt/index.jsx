/**
 * 业务报备状态下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorYWZT = React.createClass({
    render(){
        return <Select {...this.props} placeholder="业务状态" allowClear>
            <Option key="0">保存</Option>
            <Option key="1">报备</Option>
            <Option key="2">退回</Option>
            <Option key="3">已收费</Option>
            <Option key="4">作废</Option>
            <Option key="5">撤销</Option>
            <Option key="6">申请退回审批</Option>
            <Option key="7">申请撤销审批</Option>
            <Option key="8">申请启用审批</Option>
        </Select>
    }
});

module.exports = selectorYWZT;