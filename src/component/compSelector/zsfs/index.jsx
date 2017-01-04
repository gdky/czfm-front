/**
 * 征收方式业务报备状态下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorZSFS = React.createClass({
    render(){
        return <Select {...this.props} placeholder="征收方式" allowClear>
            <Option key="0">查账征收</Option>
            <Option key="1">核定征收</Option>
        </Select>
    }
});

module.exports = selectorZSFS;