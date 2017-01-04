/**
 * 短信类型代码选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selector = React.createClass({
    render(){
        return <Select {...this.props} placeholder="选择短信类型" allowClear>
            <Option key="1">一般信息</Option>
            <Option key="2">系统消息</Option>
            <Option key="3">缴费通知</Option>
        </Select>
    }
});

module.exports = selector;