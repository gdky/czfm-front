import React from 'react'
import { Col,Row,Input,Form,Button,Icon,message,Tooltip,Checkbox,Alert } from 'antd'

const FormItem = Form.Item;

let c = React.createClass({
    handleSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.props.form.getFieldsValue())
    },
    render(){
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        return <Form horizontal onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="模块名称：">
                <Input placeholder="名称"
                  {...getFieldProps('mc')}/>
            </FormItem>
           
            < FormItem
              {...formItemLayout}
              label={<span> </span>}>
                <label>
                    <Checkbox {...getFieldProps('yxbz', {valuePropName: 'checked'})}/>有效标志
                </label>
            </FormItem>
            <Row>
                <Col offset="8"><Button type="primary" htmlType="submit">保存修改</Button></Col>
            </Row>
        </Form>
    }
})
c = Form.create({
    mapPropsToFields(props) {
        let result = {};
        for (let prop in props.data) {
            result[prop] = {value: props.data[prop]}
        }
        return result;
    }
})(c);
module.exports = c;