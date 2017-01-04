import React from 'react'
import Panel from 'component/compPanel'
import {Button,Icon,Form,Input,notification,Select,Row,Col} from 'antd';
import {SelectorRoles} from 'component/compSelector'
import config from 'common/configuration'
import auth from 'common/auth'
import req from 'reqwest'
import utils from 'common/utils'
import Jg from './jg.jsx'

const PanelBar = Panel.ToolBar;
const FormItem = Form.Item;
const createForm = Form.create;

const token = auth.getToken();
const USER_URL = config.HOST + config.URI_API_FRAMEWORK + '/users';

let editForm = React.createClass({
    getInitialState(){
        return {
            loading: false,
            jgDisplay: false,
            jgModal: false,
            updating:false
        }
    },
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            values = utils.transEmpty2Null(values);
            this.setState({updating:true});
            req({
                url: USER_URL,
                method: 'post',
                contentType: 'application/json',
                data: JSON.stringify(values),
                headers: {'x-auth-token': token}
            }).then(resp=>{
                this.setState({updating:false});
                notification.success({
                    duration: 4,
                    message: '操作成功',
                    description: resp.text + '客户信息已更新'
                });
                this.props.refreshData();
            }).fail(e=>{
                this.setState({updating:false});
                let r = JSON.parse(e.responseText);
                if(e.status == 403){
                    notification.error({
                        duration: 3,
                        message: '操作失败',
                        description: r.text
                    });
                }else{
                    notification.error({
                        duration: 3,
                        message: '操作失败',
                        description: '可能网络访问原因，请稍后尝试'
                    });
                }
            });
        })
    },
    //退回用户管理界面
    back(){
        this.props.onBack();
    },
    //检查登录名
    checkUname(rule, value, callback){
        if (!value || value.trim().length < 5) {
            callback("登录名长度至少5个字符")
        } else if (!/^[a-z0-9]+$/.test(value.trim())) {
            callback("必须是字母或汉字")
        } else {
            callback()
        }
    },
    //检查用户名
    checkUserName(rule, value, callback){
        if (!value || value.trim().length < 5) {
            callback("用户名长度至少5个字符")
        } else {
            callback()
        }
    },
    //检查密码
    checkPass(rule, value, callback) {
        const { validateFields } = this.props.form;
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
    //当角色代码为3/17/18/114时出现事务所分配框
    handleRoleChange(value){
        if (value == 3 || value == 17 || value == 18 || value == 114) {
            this.setState({jgDisplay: true})
        } else {
            this.setState({jgDisplay: false})
        }
    },
    getJg(){
        this.setState({jgModal: true})
    },
    closeJg(){
        this.setState({jgModal: false})
    },
    handleOk(entity){
        this.setState({
            jgModal: false
        });
        this.props.form.setFieldsValue({
            jgMc: entity.jgMc,
            jgId: entity.jgId
        })
    },
    render(){
        let {title} = this.props;
        const { getFieldProps } = this.props.form;
        const usernameProps = getFieldProps('userName', {
            rules: [
                {required: true, min: 5, whitespace: true, message: '用户名不能为空'},
                {validator: this.checkUserName}
            ]
        });
        const unameProps = getFieldProps('uname', {
            rules: [
                {required: true, whitespace: true, message: '登录名不能为空'},
                {validator: this.checkUname}
            ]
        });
        const passwdProps = getFieldProps('password1', {
            rules: [
                {required: true, whitespace: true, min:6,message: '密码至少6位字符'},
                {validator: this.checkPass}
            ]
        });
        const rePasswdProps = getFieldProps('password2', {
            rules: [
                {required: true, whitespace: true, message: '请再次输入密码'},
                {validator: this.checkPass2}
            ]
        });
        const roleProps = getFieldProps('roleId', {
            rules: [
                {required: true, whitespace: true, message: '选择用户所属角色'}
            ]
        });
        const phoneProps = getFieldProps('phone', {
            rules: [
                {required: true, whitespace: true, message: '输入联系电话'}
            ]
        });
        const namesProps = getFieldProps('names', {
            rules: [
                {required: true, whitespace: true, message: '输入账户的描述信息'}
            ]
        });
        const panelBar = <PanelBar>
            <Button onClick={this.back}>
                <Icon type="rollback"/>返回用户管理

            </Button>
        </PanelBar>;


        return <Panel title={title} toolbar={panelBar}>
            <Jg visible={this.state.jgModal}
                closable
                style={{top:'200px',height:'400px'}}
                onOk={this.handleOk}
                onCancel={this.closeJg}/>

            <div className="new-form">
                <Form horizontal onSubmit={this.handleSubmit} >
                    <Row>
                        <Col span="24">
                            <FormItem
                              labelCol={{span: 6}} wrapperCol={{span: 6}}
                              label="用户名">
                                <Input placeholder="可以是字母或汉字，长度5位以上" {...usernameProps}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem
                              labelCol={{span: 6}} wrapperCol={{span: 6}}
                              label="登录名">
                                <Input placeholder="只能是字母或数字，长度5位以上" {...unameProps}/>
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
                                <Input placeholder="重复输入密码一遍"
                                       autoComplete="off"
                                       type="password" {...rePasswdProps}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem
                              labelCol={{span: 6}} wrapperCol={{span: 6}}
                              label="用户描述信息">
                                <Input placeholder="描述信息"
                                        {...namesProps}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem
                              labelCol={{span: 6}} wrapperCol={{span: 6}}
                              label="身份证号">
                                <Input placeholder="身份证号码" {...getFieldProps('idcard')}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem
                              labelCol={{span: 6}} wrapperCol={{span: 6}}
                              label="联系电话">
                                <Input placeholder="移动电话/固定电话" {...phoneProps}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem
                              labelCol={{span: 12}} wrapperCol={{span: 12}}
                              label="选择用户所属角色">
                                <SelectorRoles
                                  style={{width:'100%'}}
                                  data={this.props.roles}
                                  optionFilterProp="children"
                                  onSelect={this.handleRoleChange}
                                  {...roleProps}/>
                            </FormItem>
                        </Col>
                        {this.state.jgDisplay && <Col span="12">
                            <FormItem
                              labelCol={{span: 6}} wrapperCol={{span: 14}}
                              label="选择所属事务所">
                                <Input style={{width:'70%'}} disabled {...getFieldProps('jgMc')}/> &nbsp;
                                <Button type="ghost" onClick={this.getJg}>查询</Button>
                            </FormItem>
                            <FormItem style={{display:'none'}}>
                                <Input disabled {...getFieldProps('jgId')}/>
                            </FormItem>
                        </Col>}

                    </Row>
                    <Row>
                        <Col span="2" offset="8">
                            <Button
                              type="primary"
                              htmlType="submit"
                              style={{width:'100%'}}
                              size="large"
                              loading={this.state.updating}>保存</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Panel>
    }
});

editForm = createForm({
    mapPropsToFields(props) {
        let result = {};
        for (let prop in props.data) {
            result[prop] = {value: props.data[prop]}
        }
        return result;
    }
})(editForm);

module.exports = editForm;