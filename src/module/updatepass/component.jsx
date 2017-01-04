import React from 'react'
import req from 'reqwest'
import config from 'common/configuration'
import {Form, Col, Row, Button, Input, Alert, notification} from 'antd'
import Panel from 'component/compPanel'
import auth from 'common/auth'

const FormItem = Form.Item;
const createForm = Form.create;

const token = auth.getToken();
const URL = config.HOST + config.URI_API_FRAMEWORK + '/password/';

let form = React.createClass({
    getInitialState(){
        return {
            success: false,
            error:false,
            errorMsg:''
        }
    },
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            req({
                url: URL,
                type: 'json',
                contentType: 'application/json',
                method: 'put',
                data: JSON.stringify(values),
                headers: {'x-auth-token': token}
            }).then(resp=> {
                this.setState({success: true,error:false})
            }).fail(e=> {
                let r = JSON.parse(e.responseText);
                if(e.status != '403'){
                    r.text = '无法更新，请稍后再试'
                }
                this.setState({error:true,errorMsg:r.text,success:false})
            })
        });
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
        return <div className="update-pass">
            <div className="wrap">
                <Panel title="修改密码">
                    {this.state.success && <Alert message="操作成功"
                                                  description="密码已成功修改，请退出系统使用新密码登录"
                                                  type="success"
                    />}
                    {this.state.error && <Alert message="操作失败"
                                                  description={this.state.errorMsg}
                                                  type="error"
                    />}
                    <Form horizontal onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span="24">
                                <FormItem
                                    labelCol={{span: 6}} wrapperCol={{span: 6}}
                                    label="输入原密码"
                                    required>
                                    <Input autoComplete="off"
                                           type="password" {...getFieldProps('password')}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem
                                    labelCol={{span: 6}} wrapperCol={{span: 6}}
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
                                    labelCol={{span: 6}} wrapperCol={{span: 6}}
                                    label="确认密码">
                                    <Input placeholder="再次输入密码"
                                           autoComplete="off"
                                           type="password" {...rePasswdProps}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="2" offset="8">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{width: '100%'}}
                                    size="large"
                                    loading={this.state.updating}>保存</Button>
                            </Col>
                        </Row>
                    </Form>
                </Panel>
            </div>
        </div>

    }
});
form = createForm()(form);
module.exports = form;