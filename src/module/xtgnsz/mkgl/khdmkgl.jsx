/*
 * 客户端模块管理
 */

import React from 'react'
import {Tree,Col,Row,Input,Form,Button,Icon,message,Tooltip,Checkbox,Alert} from 'antd'
import Toolbar from './compToolbar'
import req from 'reqwest'
import {getTreeData} from 'common/utils'
import config from 'common/configuration'
import auth from 'common/auth'

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const URL = config.HOST + config.URI_API_FRAMEWORK + '/asidemenu';

/*const json = [{"id": 1, "pid": 0, "name": "系统管理", "href": null, "orderNo": 1, "path": "000", "visble": "Y"},
 {
 "id": 2,"pid": 0, "name": "模块设置", "href": 'xtgl/mksz', "orderNo": 2, "path": "000", "visble": "Y"},
 {
 "id": 3, "pid": 1, "name": "机构管理", "href": null, "orderNo": null, "path": "000-001", "visble": "Y"
 }]
 const data  = utils.getTreeData(json)*/
/**
 *  树节点组件，内部节点结构按照给定的JSON对象数组生成
 *  @props.data {Array}  展示数据
 *  @props.onSelect 处理select的回调函数
 */
const TreeView = React.createClass({
    getDefaultProps(){
        return {
            data: ''
        }
    },
    handleSelect(key){
        this.props.onSelect(key)
    },
    getTreeNodes(data){
        let res = data.map((item) => {
            if (item.children) {
                return <TreeNode title={item.name+' - '+item.orderNo} key={item.key}
                                 disableCheckbox>{this.getTreeNodes(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.name+' - '+item.orderNo} key={item.key} isLeaf={true} disableCheckbox/>;
        });
        return res;
    },
    render(){
        const data = this.props.data;
        if (data) {
            const treeNodes = this.getTreeNodes(data)
            return <div>
                <Tree onSelect={this.handleSelect}
                      defaultExpandAll
                      checkable>
                    {treeNodes}
                </Tree>
            </div>
        }
        return <div style={{padding:'20px'}}>暂无数据</div>
    }
})

/**
 *  表单组件，显示所选树节点的信息
 *  @props.data {Array}
 *  @props.onSubmit 处理提交动作的回调函数
 */
let TreeNodeEdit = React.createClass({
    handleSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.props.form.getFieldsValue())
    },
    render(){
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        return <Form horizontal onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="模块名称：">
                <Input placeholder="名称"
                  {...getFieldProps('name')}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="链接地址：">
                <Input placeholder="URL..."
                  {...getFieldProps('href')}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="排序号：">
                <Input placeholder="用于排序的号码"
                  {...getFieldProps('orderNo')}/>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="图标：">
                <Input placeholder="图标代号"
                  {...getFieldProps('icon')}/>
            </FormItem>
            < FormItem
              {...formItemLayout}
              label={<span> </span>}>
                <label>
                    <Checkbox {...getFieldProps('visble', {valuePropName: 'checked'})}/>默认显示
                </label>
            </FormItem>
            <Row>
                <Col offset="8"><Button type="primary" htmlType="submit">保存修改</Button></Col>
            </Row>
        </Form>
    }
})
TreeNodeEdit = Form.create({
    mapPropsToFields(props) {
        let result = {};
        for (let prop in props.data) {
            result[prop] = {value: props.data[prop]}
        }
        return result;
    }
})(TreeNodeEdit);

//模块设置
const khdmkgl = React.createClass({
    getInitialState(){
        return {
            nodes: '',
            currentNode: '',
            alert: ''
        }
    },
    handleSelect(key){
        let currentNode = ''
        if (key.length > 0) {
            currentNode = this.state.nodes[key];
            currentNode.key = key;
        }
        this.setState({
            currentNode: currentNode,
            alert: ''
        })
    },
    handleSubmit(value){
        let submitNode = value;
        ({id: submitNode.id, pid: submitNode.pid, path: submitNode.path} = this.state.currentNode);//解构赋值
        submitNode.visble = value.visble ? 1 : 0;
        req({
            url: URL + '/' + submitNode.id,
            type: 'json',
            method: 'put',
            data: JSON.stringify(submitNode),
            contentType: 'application/json',
            headers: {'x-auth-token': auth.getToken()},
        }).then(resp=> {
            let tmpArr = this.state.nodes.slice(0);
            tmpArr[this.state.currentNode.key] = submitNode;
            this.setState({alert: '修改成功', nodes: tmpArr})
        }).fail(err => {
            message.error('Status Code:' + err.status + '  api错误 ')
        })
    },
    addNode(){
        let pid = 0;
        if (this.state.currentNode) {
            pid = this.state.currentNode.id;
        }
        //新建节点，并赋予基本默认属性
        //可见:是,名字:新模块,排序:空,pid:上级节点id,模块类型:A A-中心端,B-客户端
        let newNode = {pid: pid, name: '新模块', orderNo: '', visble: 1, lx: 'B'};

        req({
            url: URL + '?',
            type: 'json',
            method: 'post',
            data: JSON.stringify(newNode),
            contentType: 'application/json',
            headers: {'x-auth-token': auth.getToken()},
        }).then(resp=> {
            ({id: newNode.id, path: newNode.path} = resp);
            let tmpArr = this.state.nodes.slice(0);
            tmpArr.push(newNode);
            this.setState({nodes: tmpArr})
        }).fail(err=> {
            message.error('Status Code:' + err.status + '  api错误 ')
        })
    },
    removeNode(){
        req({
            url: URL + '/' + this.state.currentNode.id+'?l=B',
            type: 'json',
            method: 'delete',
            contentType:'application/json',
            headers: {'x-auth-token': auth.getToken()},
        }).then((resp)=> {
            this.setState({nodes: resp});
        }).fail(err=> {
            message.error('Status Code:' + err.status + '  api错误 ')
        });
    },
    componentDidMount(){
        req({
            url: URL + '?q=all&l=B',
            type: 'json',
            method: 'get',
            headers: {'x-auth-token': auth.getToken()},
        }).then(resp => {
            this.setState({nodes: resp});
        }).fail((err, msg)=> {
            message.error('Status Code:' + err.status + '  api错误 ')
        });
    },

    render(){
        const data = getTreeData(this.state.nodes);
        return <div className="zxdmkgl">
            <Row>
                <Col span="8" className="tree-box">
                    <Row>
                        <Toolbar addNode={this.addNode} removeNode={this.removeNode}/>
                        <TreeView data={data} onSelect={this.handleSelect}/>
                    </Row>
                </Col>
                <Col span="10" offset="5" className="tree-node-edit">
                    <Row><Col><TreeNodeEdit data={this.state.currentNode} onSubmit={this.handleSubmit}/></Col>
                    </Row>
                    {this.state.alert ?
                      <Row><Col><Alert message={this.state.alert} type="success" showIcon/></Col></Row> : ''}

                </Col>
            </Row>

        </div>
    }
})

module.exports = khdmkgl;