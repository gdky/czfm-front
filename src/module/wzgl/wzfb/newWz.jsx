import React from 'react'
import {Input, Form, Row, Col, Button, Tooltip,message,Modal} from 'antd'
import Panel from 'component/compPanel'
import Rich from 'component/compWYSIHtml'
import req from 'common/request'
import config from 'common/configuration'
import {isEmptyObject} from 'common/utils'

const ToolBar = Panel.ToolBar;
const FormItem = Form.Item;
const createForm = Form.create;

let c = React.createClass({
    getDefaultProps(){
        return {
            url:config.URI_API_PROJECT  + `/newwz`,
        }
    },
    getInitialState(){
        return {
            modal:false
        }
    },
    fetchData() {
        req({
            url:this.props.url+'/'+this.props.id,
            method: 'get',
            data: params
        }).then(resp => {
            this.setState({ nodes: resp });
        }).catch(e => {
            notification.error({
                duration: 2,
                message: '数据读取失败',
                description: '网络访问故障，请尝试刷新页面'
            });
        })
    },
    handleSubmit(e){
        e.preventDefault();
        let values = {
            title : this.props.form.getFieldValue('title'),
            content:this.refs.editor.handleValue(),
            lmid:this.props.lmid
        };
        if(!values.title){
            Modal.error({
                title: '所需信息未正确填写',
                content: '文章标题未填写',
            });
            return
        }
        if(!values.content){
            Modal.error({
                title: '所需信息未正确填写',
                content: '文章正文未填写',
            });
            return
        }
        req({
            url:this.props.url,
            method:'post',
            data:values
        }).then(resp=>{
            message.success('发布成功', 5);
            this.props.onBack()
        }).catch(e=>{
            message.error('发布失败，请点击"提交按钮"重新发送',5)
        })
    },
    closeReciver(){
        this.setState({modal:false})
    },
    openReciver(){
        this.setState({modal:true})
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
        const {modal} = this.state;

        const titleProps =  getFieldProps('title', {
            rules: [
                {required: true, whitespace: true, message: '必填'}
            ]
        });
        return <Panel title="编辑新信息" toolbar={toolbar}>
          
            <Form horizontal onSubmit={this.handleSubmit}>
                <Row>
                    <FormItem
                        {...formItemLayout}
                        label="文章标题">
                        <Input placeholder="文章标题" {...titleProps}/>
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