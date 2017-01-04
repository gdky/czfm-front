import './style.css'
import React from 'react'
import {Tabs} from 'antd'
import Panel from 'component/compPanel'
import Khdmkgl from './khdmkgl.jsx';
import Zxdmkgl from './zxdmkgl.jsx';

const TabPane = Tabs.TabPane;

//模块设置
const mksz = React.createClass({
    render(){
        return <div className="mksz">
            <div className="wrap">
                <Panel >
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="中心端" key="1"><Zxdmkgl /></TabPane>
                        <TabPane tab="客户端" key="2"><Khdmkgl /></TabPane>
                    </Tabs>
                </Panel>

            </div>
        </div>
    }
})

module.exports = mksz;