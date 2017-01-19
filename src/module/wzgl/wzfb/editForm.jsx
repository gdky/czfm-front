import React from 'react'
import { Input, Form, Row, Col, Button, Tooltip, message, Modal } from 'antd'
import Panel from 'component/compPanel'
import Rich from 'component/compWYSIHtml'

const FormItem = Form.Item;
const createForm = Form.create;

let c = React.createClass({
    getDefaultProps() {
        return 
    },
    commit() {
        const {getFieldsValue} = this.props.form;
        this.props.onCommit(getFieldsValue(),this.refs.editor.handleValue(),);

    },
    save() {
        const {getFieldsValue} = this.props.form;
        this.props.onSave(getFieldsValue());

    },
    render() {
        
        const {getFieldProps} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 }
        };

        const titleProps = getFieldProps('title', {
            rules: [
                { required: true, whitespace: true, message: '必填' }
            ]
        });
        return <Form horizontal onSubmit={this.handleSubmit}>
                <Row>
                    <FormItem
                        {...formItemLayout}
                        label="文章标题">
                        <Input  placeholder="文章标题" {...titleProps} />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem
                        {...formItemLayout}
                        label="正文">
                        <Rich  {...getFieldProps('content') } ref="editor" value={this.props.data.content} />
                    </FormItem>
                </Row>
                <Row>
                    <Col span="2" offset={22}>
                        <Button type="primary" htmlType="submit" className="query"
                            onClick={this.commit}>提交</Button>
                    </Col>
                </Row>
            </Form>
    }
});

c = createForm({
    mapPropsToFields(props) {
        let result = {};
        for (let prop in props.data){
            result[prop] = {value:props.data[prop]}
        }
        return result
    }

})(c);
module.exports = c;