import React from 'react'
import { Modal, Tabs, Radio } from 'antd'
import config from 'common/configuration'
import { isEmptyObject } from 'common/utils'
import req from 'common/request'

const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const c = React.createClass({
    getDefaultProps() {
        return {
            url: config.URI_API_PROJECT + `/getaudio`
        }
    },
    getInitialState() {
        return {
            value: '',
            data: []
        }
    },
    fetchData() {
        req({
            url: this.props.url,
            method: 'get'
        }).then(resp => {
            this.setState({ data: resp,value:resp[0].ID });
        }).catch(e => {
            console.log(e)
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
    handleChange(e) {
        this.setState({ value: e.target.value })
    },
    handleOk() {
        const {onOk} = this.props;
        let data = this.state.data;
        let value = this.state.value;
        let label ;
         data.forEach(function (prop) {
               if(prop.ID==value)
               label=prop.BT;
            })
        onOk({key: value, label:label})
    },

    getRadios() {
        let data = this.state.data;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };
        let result = [];
        if (data.length > 0) {
            data.forEach(function (prop) {
                result.push(<Radio style={radioStyle} key={prop.ID} value={prop.ID}>{prop.BT}</Radio>)
            })
        }

        return result
    },

    render() {

        return <Modal {...this.props} onOk={this.handleOk}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="音频列表" key="1">
                    <RadioGroup onChange={this.handleChange} value={this.state.value}>
                        {this.getRadios()}
                    </RadioGroup>
                </TabPane>
            </Tabs>
        </Modal>
    }
});

module.exports = c;