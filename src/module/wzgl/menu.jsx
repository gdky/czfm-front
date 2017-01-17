import React from 'react'
import { Menu, Table, Row, Col, Button, Icon, notification, Alert } from 'antd'
import config from 'common/configuration'
import merge from 'lodash/merge';
import { isEmptyObject, jsonCopy } from 'common/utils'
import req from 'common/request';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const c = React.createClass({
    getInitialState() {
        return {
            current: '1',
        }
    },
    getDefaultProps() {
        return {
            //栏目名称
            title: '菜单'
        }
    },
    handleClick(e) {
        this.props.onClick(e)
    },
    getMenu(data) {
        return data.map(function (item) {
            let title;
            title = <span>{item.mc}</span>;
            if (item.children) {
                return <SubMenu key={item.key} title={title} children={this.getMenu(item.children)} />;
            } else {
                return <Menu.Item key={item.key}><span>{item.mc}</span></Menu.Item>
            }
        }, this);
    },
    getTreeData(arr) {
        let key = 0;
        var root = { text: null };
        if (arr.length > 0) {
            var objMap = {};
            root.items = [];
            arr.forEach(function (item) {
                var node = {
                    id: item.id,
                    pid: item.pid,
                    mc: item.mc,
                    key: key++
                };
                objMap[item.id] = node;
                if (item.pid == 0) {
                    root.items.push(node);
                } else {
                    var parent = objMap[item.pid];
                    if (parent["children"]) {
                        parent["children"].push(node);
                    } else {
                        parent["children"] = [];
                        parent["children"].push(node);
                    }
                }
            });
        } else {
            root.items = [];
        }
        return root.items;
    },
    render() {
        const data = this.props.data;
        if (data) {
            const menuData = this.getTreeData(data);
            let asideMenu = this.getMenu(menuData);
            return (
                <Menu onClick={this.handleClick}
                    onOpen={this.handleClick}
                    onClose={this.handleClick}
                    defaultOpenKeys={['sub1']}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                    >
                    {asideMenu}
                </Menu>
            );
        }
        return <div style={{ padding: '20px' }}>暂无数据</div>


    },
});
module.exports = c;