import React from 'react'
import {Modal, Tabs, Radio} from 'antd'
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const c = React.createClass({
    getDefaultProps(){
        return {
            data: {
                '3': '省内事务所',
                '114': '外省事务所（无省内分所）',
                '0':'全部事务所'
            }
        }
    },
    getInitialState(){
        return {
            value: '3'
        }
    },
    handleChange(e){
        this.setState({value: e.target.value})
    },
    handleOk(){
        const {onOk, data} = this.props;
        onOk({key: this.state.value, label: data[this.state.value]})
    },

    getRadios(){
        const {data} = this.props;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };
        let result = [];
        for (let prop in data) {
            result.push(<Radio style={radioStyle} key={prop} value={prop}>{data[prop]}</Radio>)
        }
        return result
    },

    render(){

        return <Modal {...this.props} onOk={this.handleOk}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="群组" key="1">
                    <RadioGroup onChange={this.handleChange} value={this.state.value}>
                        {this.getRadios()}
                    </RadioGroup>
                </TabPane>
            </Tabs>
        </Modal>
    }
});

module.exports = c;