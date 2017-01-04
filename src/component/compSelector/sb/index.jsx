/**
 *  国税或地税下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorSB = React.createClass({
    render(){
        return <Select {...this.props}  defaultValue="1"  >
            <Option key="1">国税</Option>
            <Option key="2">地税</Option>
            
        </Select>
    }
});

module.exports = selectorSB;