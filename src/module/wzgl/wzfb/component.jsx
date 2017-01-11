import React from 'react'
import { Button, Icon, Alert, Col, Row, Form, notification, Modal } from 'antd'
import Toolbar from 'component/toolbar'
import config from 'common/configuration'
import req from 'common/request'
import LmMenu from '../menu'
import model from './model'
import cloneDeep from 'lodash/cloneDeep';
import NewWz from './newWz'
import List from './list'
import Panel from 'component/compPanel'
import { jsonCopy, isEmptyObject } from 'common/utils'
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
            title: '文章发布'
        }
    },
    getInitialState() {
        return {
            nodes: '', currentNode: '', mode: '', view: 'list', listState: '', detail: '',entity: {},
        }
    },
    fetchData(params = { lx: 'yx' }) {
        const {apiUrl} = this.props;
        req({
            url: apiUrl,
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
            currentNode: currentNode
        })
    },
    /*计算column里定义的width总和，没有定义width的列宽按100(px)计算*/
    getColWidth(model) {
        let w = 0;
        model.columns.map(item => {
            w = item.width ? w + item.width : w + 100;
        });
        return w;
    },
    newMsg() {
        let view = this.state.view;
        const lmid = this.state.currentNode.id;
        if (view == 'list') {
            if (!lmid) {
                Modal.error({
                    title: '未选择栏目',
                    content: '未选择栏目信息！',
                });
                return
            } else {
                view = 'newWz'
            }

        } else {
            view = 'list'
        }
        this.setState({
            view: view,
            mode:'new'
        })
    },
    //返回list视图
    async backToList() {
        await this.setState({ view: 'list' });
        await this.refreshList()
    },
    openDetail(record){
        this.setState({entity: record,
            mode:'read'})
    },
    render() {
        /*设置列表组件的参数 */
        const m = cloneDeep(model);
        const actColWidth = 100;
        m.setfunc(this.openDetail);

        /*设置列表组件的参数 */
        const listSetting = {
            //列表可滚动区间的宽度，一般使用getcolwidth计算即可
            scrollx: this.getColWidth(model) - actColWidth,
            //列表需使用的columns定义
            columns: m.columns,
            //记录list组件被切换时状态值的方法
            grabState: this.grabListState,
            //list组件重新挂载时恢复状态用的历史状态数据
            stateShot: this.state.listState,
            lmid: this.state.currentNode.id
        };
        /* 设置新建信息组件参数*/
        const newWzSetting = {
            onBack: this.backToList,
            lmid: this.state.currentNode.id

        };

        return <div className="mksz">
            <div className="wrap">
                {this.state.view == 'list' ?
                    <Panel >
                        <Row>
                            <Col span="5" className="tree-box">
                                <Row>
                                    <LmMenu data={this.state.nodes} onClick={this.handleClick} ref="Menu" />
                                </Row>
                            </Col>
                            <Col span="19" className="tree-node-edit">
                                <Toolbar>
                                    <Button type="primary" onClick={this.newMsg}><Icon type="message" />发布文章</Button>
                                    <Button type="primary" onClick={this.newMsg}><Icon type="message" />删除文章</Button>
                                </Toolbar>
                                <List {...listSetting} ref="list" />
                            </Col>
                        </Row>


                    </Panel> :
                    <NewWz  {...newWzSetting} />
                }

            </div>

        </div>
    }

});
module.exports = c;