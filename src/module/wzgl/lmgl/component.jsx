import React from 'react'
import { Button, Icon, Alert, Col, Row, Form, notification } from 'antd'
import Detail from 'component/msgDetail'
import config from 'common/configuration'
import req from 'common/request'
import LmMenu from '../menu.jsx'
import Toolbar from './compToolbar'
import MenuEdit from './menuEdit'
import Panel from 'component/compPanel'
import { jsonCopy, isEmptyObject } from 'common/utils'
import cloneDeep from 'lodash/cloneDeep';
import './style.css'


const c = React.createClass({
    getDefaultProps() {
        return {
            //接收的json数据中用来充当key的字段名
            keyCol: 'id',
            //数据来源api
            apiUrl: config.URI_API_PROJECT + `/wzglmenu`,
            //初始搜索条件
            defaultWhere: {},
            //栏目名称
            title: '栏目管理'
        }
    },
    getInitialState() {
        return {
            nodes: '', currentNode: '', alert: ''
        }
    },
    fetchData() {
        const {apiUrl} = this.props;
        req({
            url: apiUrl,
            method: 'get',
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
    componentDidMount() {
        if (isEmptyObject(this.props.stateShot)) {
            this.fetchData();

        } else {
            this.setState({ ...this.props.stateShot })
        }
    },
    handleClick(e) {
        let currentNode = ''
        let key = e.key;
        if (key.length > 0) {
            currentNode = this.state.nodes[key];
            currentNode.key = key;
        }

        this.setState({
            currentNode: currentNode,
            alert: ''
        })
    },
    addNode() {
        const {apiUrl} = this.props;
        let pid = 0;
        if (this.state.currentNode) {
            pid = this.state.currentNode.id;
        }
        let newNode = { pid: pid, mc: '新模块' };
        req({
            url: apiUrl,
            method: 'post',
            data: newNode
        }).then(resp => {
            ({ id: newNode.id } = resp);
            let tmpArr = this.state.nodes.slice(0);
            tmpArr.push(newNode);
            this.setState({ nodes: tmpArr })
        }).catch(e => {
            notification.error({
                duration: 2,
                message: '数据读取失败',
                description: '网络访问故障，请尝试刷新页面'
            });
        })
    },
    removeNode() {
        const {apiUrl} = this.props;
        req({
            url: apiUrl + '/' + this.state.currentNode.id,
            method: 'delete'
        }).then((resp) => {
            this.setState({ nodes: resp });
        }).catch(e => {
            notification.error({
                duration: 2,
                message: '数据读取失败',
                description: '网络访问故障，请尝试刷新页面'
            });
        });
    },
    handleSubmit(value) {
        const {apiUrl} = this.props;
        let submitNode = value;
        ({ id: submitNode.id, pid: submitNode.pid } = this.state.currentNode);//解构赋值
        submitNode.visble = value.visble ? 1 : 0;
        req({
            url: apiUrl + '/' + submitNode.id,
            method: 'put',
            data: submitNode
        }).then(resp => {
            let tmpArr = this.state.nodes.slice(0);
            tmpArr[this.state.currentNode.key] = submitNode;
            this.setState({ alert: '修改成功', nodes: tmpArr,currentNode:submitNode })
        }).catch(e => {
            notification.error({
                duration: 2,
                message: '数据读取失败',
                description: '网络访问故障，请尝试刷新页面'
            });
        })
    },
    render() {

        return <div className="mksz">
            <div className="wrap">
                <Panel >
                    <Row>
                        <Col span="6" className="tree-box">
                            <Row>
                                <Toolbar addNode={this.addNode} removeNode={this.removeNode} />
                                <LmMenu data={this.state.nodes} onClick={this.handleClick} ref="Menu" />
                            </Row>
                        </Col>
                        <Col span="18" className="tree-node-edit">
                            <Row><Col><MenuEdit data={this.state.currentNode} onSubmit={this.handleSubmit} ref="menuEdit" /></Col>
                            </Row>
                            {this.state.alert ?
                                <Row><Col><Alert message={this.state.alert} type="success" showIcon /></Col></Row> : ''}


                        </Col>
                    </Row>


                </Panel>

            </div>
        </div>
    }

});
module.exports = c;