/**
 * 是否改制
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorISGZ = React.createClass({
    render(){
        return <Select {...this.props}  >
            <Option key="1" value={3}>改制</Option>
            <Option key="2" value={4}>否</Option>
        </Select>
    }
});

module.exports = selectorISGZ;