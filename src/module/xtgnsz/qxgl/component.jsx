import './style.css'
import React from 'react'
import {Table,Col,Row,Tree,Tabs,Modal,Button,Spin,notification} from 'antd'
import Panel from 'component/compPanel'
import config from 'common/configuration'
import model from './model.jsx'
import req from 'reqwest'
import assign from 'object-assign'
import {jsonCopy} from 'common/utils.js'
import TreeView from 'component/treeView'
import RoleDialog from './roleDialog.jsx'
import EditDialog from './editDialog.jsx'
import auth from 'common/auth'

const TabPane = Tabs.TabPane;
const ToolBar = Panel.ToolBar;
const ButtonGroup = Button.Group;

const ROLE_URL = config.HOST + config.URI_API_FRAMEWORK + '/roles';
const MENU_URL = config.HOST + config.URI_API_FRAMEWORK + '/asidemenu';
const Privileges_URL = config.HOST + config.URI_API_FRAMEWORK + '/privileges';

const isParent = (nodeId, nodeList)=> {
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].pid == nodeId) {
            return true
        }
    }
    return false
};

//权限管理
const qxgl = React.createClass({
    getInitialState(){
        return {
            roles: [],
            center: [],
            client: [],
            currentIndex: '',
            currentEntity: '',
            privileges: [],
            privilegesLoading: false,
            pageLoading: true,
            addDialog: false,
            editDialog: false
        }
    },

    componentDidMount(){
        this.fetchData().then(resp=> {
            this.setState({
                pageLoading: false,
                roles: resp.roles,
                center: resp.center,
                client: resp.client
            })
        }).catch(e=> {
            this.setState({pageLoading: false});
            Modal.error({
                title: '数据获取错误',
                content: (
                    <div>
                        <p>无法从服务器返回数据，需检查应用服务工作情况</p>
                        <p>Status: {e.status}</p>
                    </div>  )
            });
        })
    },
    //处理角色列表点击
    handleRowClick(record){
        this.setState({currentIndex: record.id, currentEntity: record, privilegesLoading: true});
        req({
            url: Privileges_URL + '/' + record.id,
            type: 'json',
            method: 'get',
            headers: {'x-auth-token': auth.getToken()}
        }).then(resp=> {
            let privileges = [];
            for (let i = 0; i < resp.length; i++) {
                if (!isParent(resp[i].menuId, this.state.center) && !isParent(resp[i].menuId, this.state.client)) {
                    privileges.push(resp[i].menuId + '');
                }
            }
            this.setState({privileges: privileges, privilegesLoading: false})
        });

    },
    //处理列表中的单选框点击
    handleSelect(record){
        this.setState({currentIndex: record.id, currentEntity: record, privilegesLoading: true});
        req({
            url: Privileges_URL + '/' + record.id,
            type: 'json',
            method: 'get',
            headers: {'x-auth-token': auth.getToken()},
        }).then(resp=> {
            let privileges = [];
            for (let i = 0; i < resp.length; i++) {
                if (!isParent(resp[i].menuId, this.state.center) && !isParent(resp[i].menuId, this.state.client)) {
                    privileges.push(resp[i].menuId + '');
                }
            }
            this.setState({privileges: privileges, privilegesLoading: false})
        });
    },
    //处理树节点勾选
    handleTreeCheck(checkedKeys){
        this.setState({
            privileges: checkedKeys
        });
    },
    //权限修改提交
    handleTreeSubmit(){
        this.setState({privilegesLoading: true});
        if (!this.state.currentIndex) {
            Modal.error({
                title: '操作失败',
                content: (
                    <div>
                        <p>请先选择角色</p>
                    </div>  )
            });
            this.setState({privilegesLoading: false});
            return false
        }
        let param = {
            roleId: this.state.currentIndex,
            privileges: this.state.privileges
        };
        req({
            url: Privileges_URL,
            type: 'json',
            method: 'put',
            contentType: 'application/json',
            data: JSON.stringify(param),
            headers: {'x-auth-token': auth.getToken()},
        }).then(()=> {
            notification.success({
                duration: 2,
                message: '操作成功',
                description: '访问允许列表已更新'
            });
            this.setState({privilegesLoading: false})
        }).fail(e=> {
            this.setState({privilegesLoading: false});
            Modal.error({
                title: '更新失败',
                content: (
                    <div>
                        <p>更新权限失败，需检查应用服务工作情况</p>
                        <p>Status: {e.status}</p>
                    </div>  )
            })
        })

    },
    //添加角色按钮
    handleAdd(){
       this.setState({addDialog: true})
    },
    //删除角色按钮
    handleDel(){
        let currentEntity = this.state.currentEntity;
        let that = this;
        if (currentEntity) {
            Modal.confirm({
                title: '您是否确认要删除这项内容',
                content: [
                    <p key="1">角色名称：{currentEntity.name}</p>,
                    <p key="2">描述：{currentEntity.description}</p>
                ],
                onOk(){
                    return that.delRole().then(resp=> {
                        that.setState({roles: resp, currentEntity: '', currentIndex: '', privileges: []})
                    })
                },
                onCancel() {
                }
            });
        }
    },

    //对话框确定
    handleDialogOk(value){
        this.addRole(value)
            .then(resp=> {
                this.setState({addDialog: false, roles: resp, currentEntity: '', currentIndex: '', privileges: []})
            }).catch(e=> {
            this.setState({addDialog: false});
            Modal.error({
                title: '操作失败',
                content: (
                    <div>
                        <p>添加角色失败，需检查应用服务工作情况</p>
                        <p>Status: {e.status}</p>
                    </div>  )
            })
        })
    },
    //对话框取消
    handleDialogCancel(){
        this.setState({addDialog: false})
    },
    //编辑对话框
    editDialogOpen(){
        this.setState({editDialog:true});
    },
    //更新角色
    handleUpdateRole(value){
        let entity = jsonCopy(this.state.currentEntity);
        entity = assign(entity,value);
        function update() {
            return req({
                url: ROLE_URL,
                type: 'json',
                method: 'put',
                contentType: 'application/json',
                data: JSON.stringify(entity),
                headers: {'x-auth-token': auth.getToken()},
            })
        }
        let process = async ()=>{
            let rs = await update();
            rs = await this.fetchRole();
            return rs
        };
        process().then(resp=>{
            this.setState({roles:resp,editDialog:false,currentEntity:entity})
        })
    },
    editDialogClose(){
      this.setState({editDialog:false})
    },
    //获取菜单树数据
    fetchMenu(lx){
        return req({
            url: MENU_URL + (lx == 'A' ? '?l=A' : '?l=B') + '&q=all',
            type: 'json',
            method: 'get',
            headers: {'x-auth-token': auth.getToken()},
        })
    },
    //获取角色列表
    fetchRole(){
        return req({
            url: ROLE_URL,
            type: 'json',
            method: 'get',
            headers: {'x-auth-token': auth.getToken()},
        })
    },
    //删除角色操作
    async delRole(){
        let rs = await req({
            url: ROLE_URL + '/' + this.state.currentEntity.id,
            method: 'delete',
            type: 'json',
            contentType: 'application/json',
            headers: {'x-auth-token': auth.getToken()},
        });
        rs = await this.fetchRole();
        return rs;
    },
    //异步获取管理端、客户端、角色数据
    async fetchData(){
        let [center, client,roles] = await Promise.all([this.fetchMenu('A'), this.fetchMenu('B'), this.fetchRole()]);
        return {center: center, client: client, roles: roles}
    },
    //新增角色操作
    async addRole(value){
        let rs = await req({
            url: ROLE_URL,
            method: 'post',
            type: 'json',
            contentType: 'application/json',
            data: JSON.stringify(value),
            headers: {'x-auth-token': auth.getToken()},
        });
        rs = await this.fetchRole();
        return rs;
    },


    render(){

        //中心端权限表
        const centerPrivileges = <TreeView
            defaultExpandAll
            checkable
            data={this.state.center}
            onCheck={this.handleTreeCheck}
            checkedKeys={this.state.privileges}/>;

        //客户端权限表
        const clientPrivileges = <TreeView
            defaultExpandAll
            checkable
            data={this.state.client}
            onCheck={this.handleTreeCheck}
            checkedKeys={this.state.privileges}/>;

        const rowSelection = {
            type: 'radio',
            selectedRowKeys: [this.state.currentIndex],
            onSelect: this.handleSelect
        };
        const toolbar = <ToolBar>
            <ButtonGroup>
                <Button onClick={this.handleAdd}>添加</Button>
                <Button onClick={this.handleDel}>删除</Button>
            </ButtonGroup>
        </ToolBar>;

        model.handleEdit(this.editDialogOpen);

        return <div className="qxgl">
            <EditDialog title="编辑角色资料"
                        width="420"
                        data={this.state.currentEntity}
                        visible={this.state.editDialog}
                        onOk={this.handleUpdateRole}
                        onCancel={this.editDialogClose}/>
            <RoleDialog
                title="编辑角色资料"
                width="420"
                visible={this.state.addDialog}
                onOk={this.handleDialogOk}
                onCancel={this.handleDialogCancel}/>
            <div className="wrap">
                <Spin spinning={this.state.pageLoading}>
                    <Row>
                        <Col span="12">
                            <Panel title="角色管理" toolbar={toolbar}>
                                <Table className="outer-border"
                                       columns={model.columns}
                                       dataSource={this.state.roles}
                                       pagination={model.pagination}
                                       rowKey={record => record.id}
                                       rowSelection={rowSelection}
                                       onRowClick={this.handleRowClick}
                                       rowClassName={(record)=>{return record.id==this.state.currentIndex?'row-selected':''}}
                                />
                            </Panel>
                        </Col>
                        <Col span="12" style={{paddingLeft:'16px'}}>
                            <Panel title="权限分配" className="qxfp">
                                <Spin spinning={this.state.privilegesLoading}>
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab="中心端" key="1">{centerPrivileges}</TabPane>
                                        <TabPane tab="客户端" key="2">{clientPrivileges}</TabPane>
                                    </Tabs>
                                    <div className="bar">
                                        <Button type="primary" size="large" onClick={this.handleTreeSubmit}>确认</Button>
                                    </div>
                                </Spin>
                            </Panel>
                        </Col>
                    </Row>
                </Spin>
            </div>
        </div>
    }
});

module.exports = qxgl;