import React from 'react'
import {Row,Col,Form,Button,Input,Modal,DatePicker,Select} from 'antd'
import {SelectorCS,SelectorYear} from 'component/compSelector'

const Option = Select.Option;
const FormItem = Form.Item;
const createForm = Form.create;

const SelectBoolean = React.createClass({
    render(){
        return <Select {...this.props} allowClear>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
        </Select>
    }
});

let searchForm = React.createClass({
    getDefaultProps(){
        return {
            onSubmit: {}
        }
    },
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    },
    handleSubmit(e){
        e.preventDefault();
        let value = this.props.form.getFieldsValue();
        this.props.onSubmit(value);
    },
    render(){
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        return <div className="search-form">
            <Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>
                <Row>
                    <Col span="6">
                        <FormItem
                            {...formItemLayout}
                            label="用户名">
                            <Input placeholder="用户名" {...getFieldProps('username')}/>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem
                            {...formItemLayout}
                            label="登录名">
                            <Input placeholder="登录名" {...getFieldProps('uname')}/>

                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem
                            {...formItemLayout}
                            label="账户描述">
                            <Input placeholder="账户描述" {...getFieldProps('names')}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6">
                        <FormItem
                            {...formItemLayout}
                            label="账户有效">
                            <SelectBoolean {...getFieldProps('accountEnabled')}/>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem
                            {...formItemLayout}
                            label="账户过期">
                            <SelectBoolean { ...getFieldProps('accountExpired')}/>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem
                            {...formItemLayout}
                            label="账户锁定">
                            <SelectBoolean { ...getFieldProps('accountLocked')}/>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem
                            {...formItemLayout}
                            label="密码过期">
                            <SelectBoolean { ...getFieldProps('credentialsExpired')}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="4" offset="20">
                        <Button type="primary" htmlType="submit" className="query">查询</Button>
                        <Button type="ghost" onClick={this.handleReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    }
});
searchForm = createForm()(searchForm);

module.exports = searchForm;