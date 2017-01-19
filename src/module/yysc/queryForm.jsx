import React from 'react'
import {Row, Col, Form, Button, Input,DatePicker} from 'antd'
import Container from 'component/container'
import {SelectorMsgType} from 'component/compSelector'
import './untils.js'
const FormItem = Form.Item;
const createForm = Form.create;


let queryForm = React.createClass({
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
        let commitValues = this.props.form.getFieldsValue();
        //首先处理搜索表单提交的信息，将字符串去首尾空格，将空值的搜索条件丢弃
        const values = {};
        for (let prop in commitValues) {
            if (commitValues[prop]) {
                if (typeof commitValues[prop] == 'string' && !!commitValues[prop].trim()) {
                    values[prop] = commitValues[prop].trim()
                }else if(Object.prototype.toString.call(commitValues[prop])=="[object Date]"){//时间格式化
                        values[prop] = commitValues[prop].Format("yyyy-MM-dd");
                    } else {
                    values[prop] = commitValues[prop]
                }
            }
        }
        //加工各提交字段的值
        if (values.sdtime && !values.sdtime[0]) {
            delete values.sdtime
        }
        this.props.onQuery(values);
    },
    render(){
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };

        return <Container className="search-form">
            <Form horizontal onSubmit={this.handleSubmit}>
                <Row>
                    <Col span="8">
                        <FormItem
                            {...formItemLayout}
                            label="标题">
                            <Input  {...getFieldProps('bt')}/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem
                          {...formItemLayout}
                          label="录入日期">
                            <DatePicker  {...getFieldProps('lrrq')}/>
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
        </Container>
    }
});
queryForm = createForm()(queryForm);

module.exports = queryForm;