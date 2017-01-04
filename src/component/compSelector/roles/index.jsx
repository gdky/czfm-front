/**
 * 人员类别下拉选择器
 */
import React from 'react'
import {Select} from 'antd'

const Option = Select.Option;



const genOptions = (data) =>{
    return data.map(item=><Option key={item.id}>{item.description}</Option>)
};

const selectorRoles = React.createClass({

    render(){
        const defaultOptions = [
            <Option key="3">广东事务所正常用户</Option>,
            <Option key="4">广东事务所设立用户</Option>,
            <Option key="11">广东省级咨询科</Option>,
            <Option key="12">广东省注册管理科</Option>,
            <Option key="13">广东省综合管理科</Option>,
            <Option key="14">广东省执业检查科</Option>,
            <Option key="15">广东省考试培训科</Option>,
            <Option key="17">事务所分所用户</Option>,
            <Option key="18">事务所外省分所用户</Option>
        ];

        const options = this.props.data?genOptions(this.props.data):defaultOptions;
        return <Select {...this.props} placeholder="选择角色分类" allowClear showSearch>
            {options}
        </Select>
    }
});

module.exports = selectorRoles;