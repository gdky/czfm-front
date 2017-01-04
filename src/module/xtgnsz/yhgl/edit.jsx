import React from 'react'
import Panel from 'component/compPanel'
import {Button,Icon,Form,Input,notification,Select,Row,Col,Switch,Spin} from 'antd';
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
            loading: true,
            jgModal: false,
            updating: false,
            jgDisplay:false,
            uname:''
        }
    },
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            if (this.state.uname != values.uname) {
                values.unameChange=1
            }
            if (values.roleId != 3 && values.roleId != 17 && values.roleId != 18 && values.roleId != 114) {
                values.jgId = null
            }

            values = utils.transEmpty2Null(values);
            values.accountEnabled = values.accountEnabled ? 1 : 0;
            values.accountExpired = values.accountExpired ? 1 : 0;
            values.accountLocked = values.accountLocked ? 1 : 0;
            this.setState({updating: true});
            req({
                url: USER_URL + '/' + this.props.userId,
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify(values),
                headers: {'x-auth-token': token}
            }).then(resp=> {
                this.setState({updating: false});
                notification.success({
                    duration: 4,
                    message: '操作成功',
                    description: resp.text + '客户信息已更新'
                });
                this.props.refreshData();
            }).fail(e=> {
                this.setState({updating: false});
                let r = JSON.parse(e.responseText);
                if (e.status == 403) {
                    notification.error({
                        duration: 3,
                        message: '操作失败',
                        description: r.text
                    });
                } else {
                    notification.error({
                        duration: 3,
                        message: '操作失败',
                        description: '可能网络访问原因，请稍后尝试'
                    });
                }
            });
        })
    },
    componentDidMount(){
        req({
            url: USER_URL + '/' + this.props.userId,
            method: 'get',
            type: 'json',
            headers: {'x-auth-token': token}
        }).then(resp=> {
            let jgDisplay = resp.roleId  == 3 || resp.roleId  == 17 || resp.roleId  == 18 || resp.roleId  == 114;
            this.setState({loading: false,jgDisplay:jgDisplay,uname:resp.uname});
            this.props.form.setFieldsValue({
                jgMc: resp.jgMc,
                jgId: resp.jgId,
                phone: resp.phone,
                userName: resp.username,
                uname: resp.uname,
                names: resp.names,
                idcard: resp.idcard,
                accountEnabled: resp.accountEnabled,
                accountExpired: resp.accountExpired,
                accountLocked: resp.accountLocked,
                roleId: resp.roleId
            });
        }).fail(e=> {
            this.setState({loading: false});
            notification.error({
                duration: 3,
                message: '操作失败',
                description: '可能网络访问原因，请稍后尝试'
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
    //当角色代码为3/17/18/114时出现事务所分配框
    handleRoleChange(value){
        if (value == 3 || value == 17 || value == 18 || value == 114) {
            this.setState({jgDisplay: true})
        } else {
            this.setState({jgDisplay: false})
        }
    },
    render(){
        let {title} = this.props;
        const { getFieldProps } = this.props.form;
        const unameProps = getFieldProps('uname', {
            rules: [
                {required: true, whitespace: true, message: '登录名不能为空'},
                {validator: this.checkUname}
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

        if(this.props){

        }

        const panelBar = <PanelBar>
            <Button onClick={this.back}>
                <Icon type="rollback"/>返回用户管理

            </Button>
        </PanelBar>;


        return <Panel title={title} toolbar={panelBar}>
            <Spin spinning={this.state.loading}>
                <Jg visible={this.state.jgModal}
                    closable
                    style={{top:'200px',height:'400px'}}
                    onOk={this.handleOk}
                    onCancel={this.closeJg}/>

                <div className="new-form">
                    <Form horizontal onSubmit={this.handleSubmit}>
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
                            <Col span="24">
                                <FormItem
                                  labelCol={{span: 6}} wrapperCol={{span: 6}}
                                  label="账户有效">
                                    <Switch {...getFieldProps('accountEnabled', {valuePropName: 'checked'})} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem
                                  labelCol={{span: 6}} wrapperCol={{span: 6}}
                                  label="账户已过期">
                                    <Switch {...getFieldProps('accountExpired', {valuePropName: 'checked'})} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem
                                  labelCol={{span: 6}} wrapperCol={{span: 6}}
                                  label="账户已锁定">
                                    <Switch {...getFieldProps('accountLocked', {valuePropName: 'checked'})} />
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
            </Spin>
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