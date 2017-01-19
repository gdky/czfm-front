import React from 'react'
import { Table, Row, Col, Button, Icon, notification, Alert } from 'antd'
import Panel from 'component/compPanel'
import req from 'common/request';
import merge from 'lodash/merge';
import config from 'common/configuration'
import { isEmptyObject, jsonCopy } from 'common/utils'

const ToolBar = Panel.ToolBar;
const ButtonGroup = Button.Group;

const list = React.createClass({
    //初始化默认参数
    getDefaultProps() {
        return {
            //接收的json数据中用来充当key的字段名
            keyCol: 'id',
            //默认每页显示数量
            pageSize: 10,
            //数据来源api
            apiUrl: config.URI_API_PROJECT + `/wzinfo`,
            //初始搜索条件p-
            defaultWhere: {},
            //栏目名称
            title: '文章列表'
        }
    },
    //初始化state
    getInitialState() {
        return {
            loading: false,
            data: [],
            lmid: this.props.lmid,
            entity: {},
            where: this.props.defaultWhere,
            searchToggle: false,
            selectedRowKeys: [],
            pagination: {
                current: 1,
                showSizeChanger: true,
                pageSize: this.props.pageSize,
                showQuickJumper: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal(total) {
                    return `共 ${total} 条`
                }
            }
        }
    },

    //通过API获取数据
    flushData(lmid) {
        const params = { page: 1, pagesize: this.props.pageSize, lmid: lmid };
        this.setState({ loading: true });
        const {apiUrl, defaultWhere} = this.props;
        let where = merge(jsonCopy(defaultWhere), params.where);
        if (!isEmptyObject(where)) {
            params.where = encodeURIComponent(JSON.stringify(where))
        }
        req({
            url: apiUrl,
            method: 'get',
            data: params,
        }).then(resp => {
            const p = this.state.pagination;
            p.current = params.page;
            p.pageSize = params.pagesize;
            p.total = resp.total > 1000 ? 1000 : resp.total;
            p.showTotal = total => {
                return `共 ${resp.total} 条，显示前 ${total} 条`
            };
            this.setState({ data: resp.data, pagination: p, loading: false, where: where })
        }).catch(e => {
            this.setState({ loading: false });
            notification.error({
                duration: 2,
                message: '数据读取失败',
                description: '网络访问故障，请尝试刷新页面'
            });
        })
    },
    //组件加载时读取数据
    componentDidMount() {
        if (isEmptyObject(this.props.stateShot)) {
            //this.fetchData();
        } else {
            this.setState({ ...this.props.stateShot })
        }
    },
    onSelect() {
        return this.state.selectedRowKeys;
    },
    onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    },
    render() {
        const {lmid, title, scrollx, keyCol, columns} = this.props;
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onChange: this.onSelectChange,

        };
        return <Table columns={columns}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            loading={this.state.loading}
            size="middle"
            rowSelection={rowSelection}
            rowKey={record => record[keyCol]}
            rowClassName={(record) => { return record.id == this.state.entity.id ? 'row-selected' : '' } }
            scroll={{ x: scrollx }} className='bg-wh' />
    }
});

module.exports = list;