/*
用户登录记录表
*/
import React from 'react'
import {Table, Modal, Row, Col, Button, Icon, Alert, Select, Form} from 'antd'
import Panel from 'component/compPanel'
import {columns} from './model'
import req from 'reqwest';
import config from 'common/configuration'
import {entityFormat} from 'common/utils'
import SearchForm from './searchForm'
import auth from 'common/auth'



const API_URL = config.HOST + config.URI_API_PROJECT + '/yhdljlb';
const ToolBar = Panel.ToolBar;
const ButtonGroup = Button.Group;


const yhdljlb = React.createClass({
    getInitialState() {
        return {
            data: [],
            pagination: {
                current: 1,
                showSizeChanger: true,
                pageSize: 5,
                showQuickJumper: true,
                pageSizeOptions: ['5', '10', '20'],
                alert: ''

            },
            searchToggle: false,
            detailViewToggle: false,
            where: '',
            helper: false,
            entity: '',

            detailHide: true,
            add: true,
            update: true,

        }
    },

    //改变页码
    handleChange(pagination, filters, sorter) {
        const pager = this.state.pagination;
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
        this.setState({ pagination: pager });

        this.fetchData({
            pagenum: pager.current,
            pageSize: pager.pageSize,
            where: encodeURIComponent(JSON.stringify(this.state.where))
        })
    },

    //查询按钮
    handleSearchToggle() {
        this.setState({ searchToggle: !this.state.searchToggle });
    },

    //刷新按钮
    handleRefresh() {
        const pager = this.state.pagination;
        pager.current = 1;
        this.setState({ pagination: pager, where: '' });
        this.fetchData();
    },

    //帮助按钮
    handleHelper() {
        this.setState({ helper: !this.state.helper })
    },
    //手动关闭帮助提示
    handleHelperClose() {
        this.setState({ helper: false })
    },

    //提交条件查询
    handleSearchSubmit(value) {
       
         for (var key in value) {
            if(Object.prototype.toString.call(value[key])=="[object Undefined]"){
                value[key]=null;
         }}
        const pager = this.state.pagination;
        
        pager.current = 1;
        const params = {
            pagenum: 1,
            pageSize: pager.pageSize,
            where: encodeURIComponent(JSON.stringify(value))
        };
        this.setState({ pagination: pager, where: value });
        this.fetchData(params);
        this.setState({ searchToggle: false })
    },

    //点击某行
    handleRowClick(record) {
        req({
            url: API_URL + '/' + record.id,
            type: 'json',
            method: 'get',
            headers: {'x-auth-token': auth.getToken()},
        }).then(resp => {
            let entity = entityFormat(resp, entityModel);
            this.setState({ entity: entity, detailHide: false });
        }).fail(err => {
            Modal.error({
                title: '数据获取错误',
                content: (
                    <div>
                        <p>无法从服务器返回数据，需检查应用服务工作情况</p>
                        <p>Status: {err.status}</p>
                    </div>)
            });
        })
    },
    //明细表关闭
    handleDetailClose() {
        this.setState({ detailHide: true })
    },


    //通过API获取数据
    fetchData(params = { pagenum: 1, pageSize: this.state.pagination.pageSize }) {
        this.setState({ loading: true });
        req({
            url: API_URL,
            type: 'json',
            method: 'get',
            data: params,
            contentType: 'application/json',
            headers: {'x-auth-token': auth.getToken()},
        }).then(resp => {
            const p = this.state.pagination;
            p.total = resp.total > 1000 ? 1000 : resp.total;
            p.showTotal = total => {
                return `共 ${resp.total} 条，显示前 ${total} 条`
            };
            this.setState({
                data: resp.data,
                pagination: p,
                loading: false
            })
        }).fail(err => {
            this.setState({ loading: false });
            Modal.error({
                title: '数据获取错误',
                content: (
                    <div>
                        <p>无法从服务器返回数据，需检查应用服务工作情况</p>
                        <p>Status: {err.status}</p>
                    </div>)
            });
        })
    },

    componentDidMount() {
        this.fetchData();
    },


    render() {


        //定义工具栏内容
        let toolbar = <ToolBar>
            { this.state.add && <Button onClick={this.handleSearchToggle}>
                <Icon type="search"/>查询
                { this.state.searchToggle ? <Icon className="toggle-tip" type="circle-o-up"/> :
                    <Icon className="toggle-tip" type="circle-o-down"/>}
            </Button>}
        </ToolBar>

        return <div className="yhdljlb">
            <div className="wrap">

                <Panel title="用户登录记录表" toolbar={toolbar}>



                    {this.state.searchToggle && <SearchForm
                        onSubmit={this.handleSearchSubmit}/>}
                    <div className="h-scroll-table">
                        <Table columns={columns}
                            dataSource={this.state.data}
                            pagination={this.state.pagination}
                            loading={this.state.loading}
                            rowKey={record => record.id}
                            onChange={this.handleChange}

                            />
                    </div>
                </Panel>

            </div>
        </div>
    }
});

module.exports = yhdljlb;
