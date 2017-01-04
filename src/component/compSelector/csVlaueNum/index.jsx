/**
 * 城市下拉选择器值为Num
 */
import React from 'react'
import {Select} from 'antd'
import data from './model.js'

const Option = Select.Option;

const selectorCS = React.createClass({
    render(){
        const options = data.map(item=><Option key={item.id} value={item.id}>{item.mc}</Option>);
        return <Select placeholder="选择城市"
                       showSearch optionFilterProp="children"
                       notFoundContent="无法找到"
                       disabled={this.props.disabled} {...this.props}>
            {options}
        </Select>
    }
});

module.exports = selectorCS;