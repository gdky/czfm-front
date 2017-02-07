import React from 'react'
import { Input, Form, Row, Col, Button, Tooltip, message, Modal } from 'antd'
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
            url: config.URI_API_PROJECT + `/newwz`,
        }
    },
    getInitialState() {
        return { data: {} }
    },
    back() {
        this.props.onBack()
    },
    //保存
    handleSave(values) {
        const {url} = this.props;
        values.ztbj = 0;
        this.setState({ loading: true });
        req({
            method: 'post',
            url: url,
            data: values
        }).then(resp => {
            this.setState({ loading: false, scr: 'success', successType: 'save' })
        }).catch(e => {
            this.setState({ loading: false });
            if (e.status == 403) {
                let res = JSON.parse(e.response);
                notification.error({
                    duration: 3,
                    message: '操作失败',
                    description: res.text
                });
            } else {
                notification.error({
                    duration: 3,
                    message: '操作失败',
                    description: '报表数据保存失败，请稍后再尝试'
                });
            }
        });
    },

    handleCommit(values, contenet,audio,uploadUrl) {
        let datas = {
            title: values.title,
            content: contenet,
            lmid: this.props.lmid,
            audioid:audio.key,
            uploadUrl:uploadUrl
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
            url: this.props.url,
            method: 'post',
            data: datas
        }).then(resp => {
            message.success('发布成功', 5);
            this.props.onBack()
        }).catch(e => {
            message.error('发布失败，请点击"提交按钮"重新发送', 5)
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