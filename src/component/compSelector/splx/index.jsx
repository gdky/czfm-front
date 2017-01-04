/**
 * 审批类型下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;

const selectorYWLX = React.createClass({
    render(){
        return <Select {...this.props} placeholder="选择审批类型" >
            <Option key="1">事务所设立</Option>
            <Option key="2">事务所变更审批</Option>
            <Option key="3">事务所合并审批</Option>
            <Option key="4">事务所注销审批</Option>
            <Option key="11">事务所年检</Option>
            <Option key="5">执业税务师备案审批</Option>
            <Option key="6">执业税务师信息变更审批</Option>
            <Option key="7">执业注册税务师转非执业审批</Option>
            <Option key="8">执业税务师转籍审批</Option>
            <Option key="9">执业税务师转所审批</Option>
            <Option key="38">执业注册税务师转出</Option>
            <Option key="39">执业注册税务师转入</Option>
            <Option key="10">执业税务师注销审批</Option>
            <Option key="12">执业注册税务师年检 </Option>
            <Option key="20">非执业税务师备案</Option>
            <Option key="13">非执业注册税务师转执业</Option>
            <Option key="14">非执业注册税务师转籍</Option>
            <Option key="15">非执业税务师注销审批</Option>
            <Option key="18">非执业注册税务师信息变更审批</Option>
            <Option key="46">非执业注册税务师转执业(事务所端)</Option>
            <Option key="44">其他从业人员转执业</Option>
            <Option key="41">其他从业人员转籍</Option>
            <Option key="42">其他从业人员信息变更</Option>
            <Option key="43">其他从业人员注销</Option>
        </Select>
    }
});

module.exports = selectorYWLX;