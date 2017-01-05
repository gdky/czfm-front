/**
 * 机构性质下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorJGXZ = React.createClass({
    render(){
        return <Select {...this.props} placeholder="选择机构性质" >
            <Option key="1" value={1}>合伙事务所</Option>
            <Option key="2" value={2}>有限公司</Option>
            <Option key="3" value={3}>无</Option>
        </Select>
    }
});

module.exports = selectorJGXZ;