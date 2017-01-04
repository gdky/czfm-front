import React from 'react'
import {Input, Form, Row, Col, Button, Tooltip,message,Modal} from 'antd'
import Panel from 'component/compPanel'
import Rich from 'component/compWYSIHtml'
import Reciver from './reciver'
import req from 'common/request'
import config from 'common/configuration'
import {isEmptyObject} from 'common/utils'

const ToolBar = Panel.ToolBar;
const FormItem = Form.Item;
const createForm = Form.create;

let c = React.createClass({
    getDefaultProps(){
        return {
            url:config.URI_API_FRAMEWORK  + `/messages`,
        }
    },
    getInitialState(){
        return {
            modal:false,
            reciver:{}
        }
    },
    handleSubmit(e){
        e.preventDefault();
        let values = {
            title : this.props.form.getFieldValue('title'),
            content:this.refs.editor.handleValue(),
            reciver:this.state.reciver,
            type:2, //类型2为系统消息，暂时从本界面发送的消息都默认为系统消息
            groupsend:true
        };
        if(isEmptyObject(values.reciver)){
            Modal.error({
                title: '所需信息未正确填写',
                content: '未选择收件人',
            });
            return
        }
        if(!values.title){
            Modal.error({
                title: '所需信息未正确填写',
                content: '信息标题未填写',
            });
            return
        }
        if(!values.content){
            Modal.error({
                title: '所需信息未正确填写',
                content: '信息正文未填写',
            });
            return
        }
        req({
            url:this.props.url,
            method:'post',
            data:values
        }).then(resp=>{
            message.success('短信息发送成功', 5);
            this.props.onBack()
        }).catch(e=>{
            message.error('短信息发送失败，请点击"发送按钮"重新发送',5)
        })
    },
    closeReciver(){
        this.setState({modal:false})
    },
    openReciver(){
        this.setState({modal:true})
    },
    getReciver(obj){
        this.setState({reciver:obj});
        this.closeReciver()
    },

    back(){
        this.props.onBack()
    },
    render(){
        let toolbar = <ToolBar>
            <Tooltip title="返回">
                <Button type="ghost" shape="circle-outline" icon="double-left" onClick={this.back}/>
            </Tooltip>
        </ToolBar>;
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 22}
        };
        const {getFieldProps} = this.props.form;
        const {modal,reciver} = this.state;

        const titleProps =  getFieldProps('title', {
            rules: [
                {required: true, whitespace: true, message: '必填'}
            ]
        });
        return <Panel title="编辑新信息" toolbar={toolbar}>
            <Reciver visible={modal} onCancel={this.closeReciver} onOk={this.getReciver}/>
            <Form horizontal onSubmit={this.handleSubmit}>
                <Row>
                    <FormItem
                        labelCol={{span: 2}} wrapperCol={{span: 10}}
                        label="收件人" required>
                        {reciver.label}
                        <Button  onClick={this.openReciver}>选择</Button>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem
                        {...formItemLayout}
                        label="标题">
                        <Input placeholder="标题" {...titleProps}/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem
                        {...formItemLayout}
                        label="正文">
                        <Rich  {...getFieldProps('content')} ref="editor" />
                    </FormItem>
                </Row>
                <Row>
                    <Col span="2" offset={22}>
                        <Button type="primary" htmlType="submit" className="query"
                                onClick={this.handleSubmit}>提交</Button>
                    </Col>
                </Row>
            </Form>
        </Panel>
    }
});

c = createForm()(c);
module.exports = c;