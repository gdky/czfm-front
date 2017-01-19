import React from 'react'
import { Input, Form, Row, Col, Button, Tooltip,notification, message, Modal } from 'antd'
import Panel from 'component/compPanel'
import Rich from 'component/compWYSIHtml'
import req from 'common/request'
import config from 'common/configuration'
import { isEmptyObject } from 'common/utils'
import Editfrom from './editForm'

const ToolBar = Panel.ToolBar;

let c = React.createClass({
    getDefaultProps() {
        return {
            geturl: config.URI_API_PROJECT + `/getwz`,
            editurl: config.URI_API_PROJECT + `/editwz`,
        }
    },
    getInitialState() {
        return {data:{}}
    },
    back() {
        this.props.onBack()
    },
    fetchData() {
        const {id} = this.props;
        req({
             url: this.props.geturl+'/'+id,
            method: 'get'
        }).then(resp => {

            this.setState({ data: resp });
        }).catch(e => {
            console.log(e)
            notification.error({
                duration: 2,
                message: '数据读取失败',
                description: '网络访问故障，请尝试刷新页面'
            });
        })
    },
    componentDidMount() {
        if (isEmptyObject(this.props.stateShot)) {
            this.fetchData();
        } else {
            this.setState({ ...this.props.stateShot })
        }
    },
    handleCommit(values,contenet,audio) {
        const {id} = this.props;
        let datas = {
            title: values.title,
            content: contenet,
            lmid: this.props.lmid,
            id:id,
            audioid:audio.key
        };
        if (!values.title) {
            Modal.error({
                title: '所需信息未正确填写',
                content: '文章标题未填写',
            });
            return
        }
        if (!content) {
            Modal.error({
                title: '所需信息未正确填写',
                content: '文章正文未填写',
            });
            return
        }
        req({
            url: this.props.editurl+'/'+datas.id,
            method: 'put',
            data: datas
        }).then(resp => {
            message.success('修改成功', 5);
            this.props.onBack()
        }).catch(e => {
            message.error('修改失败，请点击"提交按钮"重新发送', 5)
        })
    },
    render() {
        const data = this.state.data;
        let toolbar = <ToolBar>
            <Tooltip title="返回">
                <Button type="ghost" shape="circle-outline" icon="double-left" onClick={this.back} />
            </Tooltip>
        </ToolBar>;


        return <Panel title="编辑新信息" toolbar={toolbar}>
            <Editfrom data={data}
                onCommit={this.handleCommit}
                onSave={this.handleSave}
                />
        </Panel>
    }
});

module.exports = c;