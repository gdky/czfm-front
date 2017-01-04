import React from 'react'
import {Table, Row, Col, Button, Icon, notification, Alert} from 'antd'
import Panel from 'component/compPanel'
import req from 'common/request';
import merge from 'lodash/merge';
import config from 'common/configuration'
import {isEmptyObject,jsonCopy} from 'common/utils'
import Query from './queryForm'

const ToolBar = Panel.ToolBar;
const ButtonGroup = Button.Group;

const list = React.createClass({
    //初始化默认参数
    getDefaultProps(){
        return {
            //接收的json数据中用来充当key的字段名
            keyCol: 'id',
            //默认每页显示数量
            pageSize: 10,
            //数据来源api
            apiUrl: config.URI_API_FRAMEWORK  + `/sendbox`,
            //初始搜索条件
            defaultWhere:{},
            //栏目名称
            title:'发件箱'
        }
    },
    //初始化state
    getInitialState(){
        return {
            loading: false,
            data: [],
            entity: {},
            where: this.props.defaultWhere,
            searchToggle: false,
            selectedRowKeys:[],
            pagination: {
                current: 1,
                showSizeChanger: true,
                pageSize: this.props.pageSize,
                showQuickJumper: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal (total) {
                    return `共 ${total} 条`
                }
            }
        }
    },
    //通过API获取数据
    fetchData(params = {page: 1, pagesize: this.props.pageSize}){
        this.setState({loading: true});
        const {apiUrl,defaultWhere} = this.props;
        let where = merge(jsonCopy(defaultWhere),params.where);
        if(!isEmptyObject(where)){
            params.where = encodeURIComponent(JSON.stringify(where))
        }
        req({
            url: apiUrl,
            method: 'get',
            data: params,
        }).then(resp=> {
            const p = this.state.pagination;
            p.current = params.page;
            p.pageSize = params.pagesize;
            p.total = resp.total > 1000 ? 1000 : resp.total;
            p.showTotal = total => {
                return `共 ${resp.total} 条，显示前 ${total} 条`
            };
            this.setState({data: resp.data, pagination: p, loading: false,where:where})
        }).catch(e=> {
            this.setState({loading: false});
            notification.error({
                duration: 2,
                message: '数据读取失败',
                description: '网络访问故障，请尝试刷新页面'
            });
        })
    },

    //改变页码
    handleChange(pagination, filters, sorter){
        let param = {
            page: pagination.current,
            pagesize: pagination.pageSize,
            where:this.state.where
        };
        this.fetchData(param)
    },

    //查询提交
    handleSearchSubmit(values){
        const p = this.state.pagination;
        const param = {
            page: 1,
            pagesize: p.pageSize,
            where: values
        };
        this.fetchData(param);
    },
    //添加
    handleNew(){
        this.props.onNew();
    },

    //刷新按钮
    handleRefresh(){
        const p = this.state.pagination;
        this.fetchData({page:1, pagesize: p.pageSize});
    },
    //刷新当前页
    refreshCurrent(){
        const p = this.state.pagination;
        this.fetchData({page: p.current, pagesize: p.pageSize});
    },
    //查询按钮开关
    queryToggle(){
        this.setState({query: !this.state.query})
    },

    //查询提交
    handleQuery(values){
        const p = this.state.pagination;
        const param = {
            page: 1,
            pagesize: p.pageSize,
            where: values
        };
        this.fetchData(param);
    },

    //组件加载时读取数据
    componentDidMount(){
        if(isEmptyObject(this.props.stateShot)){
            this.fetchData();
        }else{
            this.setState({...this.props.stateShot})
        }
    },
    //unmount时记录目前状态
    componentWillUnmount(){
        this.props.grabState(this.state)
    },
    //行点击处理
    handleRowClick(record){
        this.state.entity = record;
        this.setState({entity:record})
    },
    //表格中的复选框勾选
    handleSelectedRowChange(selectedRowKeys){
        this.setState({selectedRowKeys: selectedRowKeys})
    },
    render(){
        const {title,scrollx,keyCol,columns} = this.props;
        let toolbar = <ToolBar>
            <ButtonGroup>
                <Button  onClick={this.handleRefresh}><Icon type="reload"/>刷新</Button>
                <Button onClick={this.queryToggle}>
                    <Icon type="search"/>查询
                    { this.state.searchToggle ? <Icon className="toggle-tip" type="circle-o-up"/> :
                        <Icon className="toggle-tip" type="circle-o-down"/>}
                </Button>
            </ButtonGroup>
        </ToolBar>;
        const rowSelection = {
            type: 'checkbox',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.handleSelectedRowChange
        };
        return  <Panel title={title} toolbar={toolbar}>
            {this.state.query && <Query onQuery={this.handleQuery}/>}
            <Table columns={columns}
                   dataSource={this.state.data}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleChange}
                   size="middle"
                   rowSelection={rowSelection}
                   rowKey={record => record[keyCol]}
                   rowClassName={(record)=>{return record.id==this.state.entity.id?'row-selected':''}}
                   onRowClick={this.handleRowClick} scroll={{x: scrollx}} className='bg-wh'/>
        </Panel>
    }
});

module.exports = list;