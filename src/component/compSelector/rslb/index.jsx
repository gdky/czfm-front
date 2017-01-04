/**
 * 入所类别
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorRSLB = React.createClass({
    render(){
        return <Select {...this.props}  >
            <Option key="1" value={1}>跨省转籍</Option>
            <Option key="2" value={2}>非执业转执业</Option>
            <Option key="3" value={3}>考试合格</Option>
        </Select>
    }
});

module.exports = selectorRSLB;