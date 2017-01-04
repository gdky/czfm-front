import React from 'react'
import {Button, Form, Input, Modal} from 'antd'

const FormItem = Form.Item;

let dialog = React.createClass({
    handleSubmit(){
        this.props.onOk(this.props.form.getFieldsValue())
    },
    render(){
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        return <Modal {...this.props} onOk={this.handleSubmit}>
            <div className="qxgl-dialog">
                <Form horizontal >
                    <FormItem {...formItemLayout} label="名称">
                        <Input  {...getFieldProps('name')}  />
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        <Input  {...getFieldProps('description')}  />
                    </FormItem>
                </Form>
            </div>
        </Modal>
    }
});
dialog = Form.create()(dialog);

module.exports = dialog;


