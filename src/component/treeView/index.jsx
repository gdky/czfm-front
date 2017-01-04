import React from 'react'
import {Tree} from 'antd'
import {jsonCopy} from 'common/utils'
const TreeNode = Tree.TreeNode;

const noop = function(){};

const comp = React.createClass({
    getDefaultProps(){
        return {
            checkedKeys:[],
            selectedKeys:[],
            data: [],
            onSelect:noop,
            onCheck:noop
        }
    },
    getInitialState(){
        return {
            checkedKeys:[]
        }
    },
    deflatten(data){
        var root = [], objMap = {}, list=jsonCopy(data);
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                var node = list[i];
                node.key = node.id;
                objMap[node.id] = node;
                if (node.pid !== 0) {
                    var parent = objMap[node.pid];
                    if (parent.children) {
                        parent.children.push(node)
                    } else {
                        parent.children = [];
                        parent.children.push(node)
                    }
                } else {
                    root.push(node);
                }
            }
        }
        return root;
    },
    genTree(gData){
        return gData.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.name} >
                        {this.genTree(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.name}/>;
        })
    },

    render(){
        let gData = this.deflatten(this.props.data);
        return (
            <Tree {...this.props}>
                {this.genTree(gData)}
            </Tree>)
    }
});

module.exports = comp;