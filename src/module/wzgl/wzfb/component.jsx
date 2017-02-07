import React from 'react'
import { Button, Icon, Alert, Col, Row, Form, notification, Modal } from 'antd'
import Toolbar from 'component/toolbar'
import config from 'common/configuration'
import req from 'common/request'
import LmMenu from '../menu'
import model from './model'
import cloneDeep from 'lodash/cloneDeep';
import NewWz from './newWz'
import EditWz from './editWz'
import ReadWz from './readWz'
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
            deleleWzUrl: config.URI_API_PROJECT + `/deletewz`,
            releaseWzUrl:config.URI_API_PROJECT + `/releasewz`,
            cancelWzUrl:config.URI_API_PROJECT + `/cancelwz`,
            //初始搜索条件
            defaultWhere: {},
            //栏目名称
            title: '文章发布'
        }
    },
    getInitialState() {
        return {
            nodes: '', currentNode: '', mode: '', view: 'list', listState: '', detail: '', entity: {},
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
        this.refs.list.flushData(currentNode.id);
    },
    /*计算column里定义的width总和，没有定义width的列宽按100(px)计算*/
    getColWidth(model) {
        let w = 0;
        model.columns.map(item => {
            w = item.width ? w + item.width : w + 100;
        });
        return w;
    },
    newWz() {
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
            view: view
        })
    },
    //返回list视图
    async backToList() {
        const lmid = this.state.currentNode.id;
        await this.setState({ view: 'list' });
        await this.refs.list.flushData(lmid);
    },
    openDetail(record) {
        this.setState({
            entity: record,
            view: 'readWz'
        })
    },
    editWz(record) {
        this.setState({
            entity: record,
            view: 'editWz'
        })
    },
    delWz() {
        let row = this.refs.list.onSelect();
        const {deleleWzUrl} = this.props;
        const lmid = this.state.currentNode.id;
        if (row) {
            req({
                url: deleleWzUrl,
                method: 'delete',
                data: row
            }).then((resp) => {
                this.refs.list.flushData(lmid);
            }).catch(e => {
                notification.error({
                    duration: 2,
                    message: '数据删除失败',
                    description: '网络访问故障，请尝试刷新页面'
                });
            });
        }
    },
    releaseWz(){
         let row = this.refs.list.onSelect();
        const {releaseWzUrl} = this.props;
        const lmid = this.state.currentNode.id;
        if (row) {
            req({
                url: releaseWzUrl,
                method: 'put',
                data: row
            }).then((resp) => {
                this.refs.list.flushData(lmid);
            }).catch(e => {
                notification.error({
                    duration: 2,
                    message: '数据修改失败',
                    description: '网络访问故障，请尝试刷新页面'
                });
            });
        }
    },
    cancelWz(){
         let row = this.refs.list.onSelect();
        const {cancelWzUrl} = this.props;
        const lmid = this.state.currentNode.id;
        if (row) {
            req({
                url: cancelWzUrl,
                method: 'put',
                data: row
            }).then((resp) => {
                this.refs.list.flushData(lmid);
            }).catch(e => {
                notification.error({
                    duration: 2,
                    message: '数据修改失败',
                    description: '网络访问故障，请尝试刷新页面'
                });
            });
        }
    },
    render() {
        /*设置列表组件的参数 */
        const m = cloneDeep(model);
        const actColWidth = 100;
        m.setfunc(this.openDetail, this.editWz);

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
            lmid: this.state.currentNode.id,
            mode: this.state.mode,
            id: this.state.entity.id

        };
        const readWzSetting = {
            onBack: this.backToList,
            lmid: this.state.currentNode.id,
            mode: this.state.mode,
            id: this.state.entity.id

        };
        const editWzSetting = {
            onBack: this.backToList,
            lmid: this.state.currentNode.id,
            mode: this.state.mode,
            id: this.state.entity.id

        };
        const view = {
            list: <Panel >
                <Row>
                    <Col span="5" className="tree-box">
                        <Row>
                        <div className = 'menu'>
                            <LmMenu data={this.state.nodes} onClick={this.handleClick} ref="Menu" />
                        </div>
                        </Row>
                    </Col>
                    <Col span="19" className="tree-node-edit">
                        <Toolbar>
                            <Button type="primary" onClick={this.newWz}><Icon type="message" />新增文章</Button>
                            <Button type="primary" onClick={this.releaseWz}><Icon type="message" />发布文章</Button>
                            <Button type="primary" onClick={this.cancelWz}><Icon type="message" />作废文章</Button>
                            <Button type="primary" onClick={this.delWz}><Icon type="message" />删除文章</Button>
                        </Toolbar>
                        <List {...listSetting} ref="list" />
                    </Col>
                </Row>


            </Panel>,
            newWz: <NewWz {...newWzSetting} />,
            editWz: <EditWz {...editWzSetting} />,
            readWz: <ReadWz {...readWzSetting} />
        };
        return <div className="mksz">
            <div className="wrap">
                {view[this.state.view]}

            </div>

        </div>
    }

});
module.exports = c;