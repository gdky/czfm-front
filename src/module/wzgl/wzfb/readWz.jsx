import React from 'react'
import { Input, Form, Row, Col, Button, Tooltip, notification, message, Modal } from 'antd'
import Panel from 'component/compPanel'
import Rich from 'component/compWYSIHtml'
import req from 'common/request'
import config from 'common/configuration'
import { isEmptyObject } from 'common/utils'
import Editfrom from './editForm'
import './style.css'

const ToolBar = Panel.ToolBar;

let c = React.createClass({
    getDefaultProps() {
        return {
            geturl: config.URI_API_PROJECT + `/getwz`
        }
    },
    getInitialState() {
        return { data: {} }
    },
    back() {
        this.props.onBack()
    },
    fetchData() {
        const {id} = this.props;
        req({
            url: this.props.geturl + '/' + id,
            method: 'get'
        }).then(resp => {
        console.log(resp)
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
            this.setState({...this.props.stateShot })
        }
    },
render() {
    let data = this.state.data;
    let toolbar = <ToolBar>
        <Tooltip title="返回">
            <Button type="ghost" shape="circle-outline" icon="double-left" onClick={this.back} />
        </Tooltip>
    </ToolBar>;


    return <Panel title={data.title} toolbar={toolbar}>
    
        <   div className="zw" dangerouslySetInnerHTML={{ __html: data.content }}/>
        <div>
        <audio src={data.url} controls="controls"> 您的浏览器不支持 audio 标签。
          </audio><br/>
          <a href={data.attachment} target="_blank">附件下载</a>
        </div>
    </Panel>
}
});

module.exports = c;