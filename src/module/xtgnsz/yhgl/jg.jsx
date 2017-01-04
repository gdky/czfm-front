import React from 'react'
import {Modal,Input,Button,Spin,Radio} from 'antd'
import config from 'common/configuration.js'
import req from 'reqwest'
import auth from 'common/auth.js'

const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

const JG_URL = config.HOST + config.URI_API_PROJECT + '/jgs';
const token = auth.getToken();

const jg = React.createClass({
    getInitialState() {
        return {
            value: '',
            loading: false,
            data: [],
            entity:{}
        };
    },
    handleSelect(record){
        this.setState({entity:record})
    },
    handleInputChange(e) {
        this.setState({
            value: e.target.value
        });
    },
    handleSearch(){
        this.setState({loading: true});
        let value = {dwmc: this.state.value};
        req({
            url: JG_URL,
            method: 'get',
            type: 'json',
            data: {where: encodeURIComponent(JSON.stringify(value)), pagenum: 1, pagesize: 50},
            headers: {'x-auth-token': token}
        }).then(resp=>{
            this.setState({loading: false, data: resp.data})
        })
    },
    handleOk(){
      this.props.onOk(this.state.entity);
    },
    handleRadioChange(e){
        let i = e.target.value;
        let entity = this.state.data;
        this.setState({entity:{jgId:entity[i].id,jgMc:entity[i].dwmc}})
    },
    render(){
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };
        const radios = this.state.data.map((d,i) => <Radio style={radioStyle} key={i} value={i}>{d.dwmc}</Radio>);
        return <Modal {...this.props} title="查找需要的事务所" width="350" onOk={this.handleOk}>
            <div className="ant-search-input-wrapper" style={{ width:'100%' }}>
                <InputGroup className="ant-search-input">
                    <Input placeholder="输入名称查询"
                           onChange={this.handleInputChange}
                           onPressEnter={this.handleSearch}/>
                    <div className="ant-input-group-wrap">
                        <Button icon="search" className="ant-search-btn" onClick={this.handleSearch}/>
                    </div>
                </InputGroup>
            </div>

            <Spin spinning={this.state.loading}>
                <RadioGroup onChange={this.handleRadioChange}>
                    {radios}
                </RadioGroup>
            </Spin>
        </Modal>
    }
});

module.exports = jg;