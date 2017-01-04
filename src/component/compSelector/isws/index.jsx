/**
 *  业务备案是否外省下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorISWS = React.createClass({
    render(){
        return <Select {...this.props}  defaultValue="N" >
            <Option key="N" >省内</Option>
            <Option key="Y" >省外</Option>
            
        </Select>
    }
});

module.exports = selectorISWS;