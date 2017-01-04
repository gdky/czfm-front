import React from 'react'
import {Modal, Form, Col, Row, Button, Input,notification} from 'antd'
import req from 'reqwest'
import config from 'common/configuration'
import auth from 'common/auth'

const FormItem = Form.Item;
const createForm = Form.create;

const URL = config.HOST + config.URI_API_FRAMEWORK + '/password/';

let modal = React.createClass({
    getInitialState(){
        return {
            loading:false
        }
    },
    handleSubmit(){
        const token = auth.getToken();
        const {validateFields,setFieldsValue} = this.props.form;
        validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            this.setState({loading:true});
            req({
                url:URL+this.props.userId,
                type:'json',
                method:'put',
                contentType:'application/json',
                data: JSON.stringify(values),
                headers: {'x-auth-token': token}
            }).then(resp=>{
                setFieldsValue({'password1':null,'password2':null});
                this.setState({loading:false});
                this.props.onClose();
            }).fail(e=>{
                setFieldsValue({'password1':null,'password2':null});
                this.setState({loading:false});
                notification.error({
                    duration: 3,
                    message: '操作失败',
                    description: '可能网络访问原因，请稍后尝试'
                });
                this.props.onClose();
            })
        })

    },
    handleClose(){
        this.props.form.setFieldsValue({'password1':null,'password2':null});
        this.props.onClose();
    },
    //检查密码
    checkPass(rule, value, callback) {
        const {validateFields} = this.props.form;
        if (value) {
            validateFields(['password2'], {force: true});
        }
        callback();
    },
    checkPass2(rule, value, callback) {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('password1')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    },
    render(){
        const {getFieldProps} = this.props.form;
        const passwdProps = getFieldProps('password1', {
            rules: [
                {required: true, whitespace: true, min: 6, message: '密码至少6位字符'},
                {validator: this.checkPass}
            ]
        });
        const rePasswdProps = getFieldProps('password2', {
            rules: [
                {required: true, whitespace: true, message: '请再次输入密码'},
                {validator: this.checkPass2}
            ]
        });
        return <Form horizontal>
            <Modal {...this.props}
                   style={{top: '100px'}}
                   title="重置该用户密码"
                   confirmLoading={this.state.loading}
                   okText="保存" onOk={this.handleSubmit} onCancel={this.handleClose}>
                <Row>
                    <Col span="24">
                        <FormItem
                            labelCol={{span: 6}} wrapperCol={{span: 12}}
                            label="密码">
                            <Input placeholder="6位以上"
                                   autoComplete="off"
                                   type="password" {...passwdProps}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem
                            labelCol={{span: 6}} wrapperCol={{span: 12}}
                            label="确认密码">
                            <Input placeholder="再次输入密码"
                                   autoComplete="off"
                                   type="password" {...rePasswdProps}/>
                        </FormItem>
                    </Col>
                </Row>
            </Modal>
        </Form>
    }
});
modal = createForm()(modal);
module.exports = modal;