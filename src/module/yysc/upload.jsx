import { Modal, Button,Upload,Input,Row, Col,message,notification } from 'antd';
import req from 'common/request';
import React from 'react';
import auth from 'common/auth';
const ButtonGroup = Button.Group;
const uploadYY = React.createClass({
  getDefaultProps(){
      return {

      };
  },
  getInitialState() {
    return {
      visible: false,
      visibleTest: false,
      addUrl:false,
      recURL:''
    };
  },
  showModal() {
    this.setState({
      visible: true,
    });
  },
  showModalTest() {
    this.setState({
      visibleTest: true,
    });
  },
  handleOkTest() {
    this.setState({
      recURL: this.refs.test.refs.input.value,
    });
  },
  handleOk() {
    const bt=this.refs.addBt.refs.input.value;
    if(!bt){
        message.error('填写标题');
        return;
    }else if(!this.state.addUrl){
        message.error('请上传语音文件');
        return;
    }
    let ls={};
    ls.bt=bt;
    ls.url=this.state.addUrl;
    this.setState({
      confirmLoading: true,
    });
    req({
            url: this.props.posUrl,
            method: 'post',
            data: {bt:bt,url:this.state.addUrl},
        }).then(resp=> {
            notification.success({
                message: '文件上传成功',
            });
            this.refs.addBt.refs.input.value=null;
            this.setState({visible: false,confirmLoading: false,addUrl:false})
        }).catch(e=> {
            this.setState({confirmLoading: false});
            notification.error({
                duration: 2,
                message: '数据读取失败',
                description: '网络访问故障，请尝试刷新页面'
            });
        })
  },
  handleCancel() {
    this.setState({
      visible: false,
      visibleTest: false,
      addUrl:false,
      recURL:''
    });
  },
  render() {
    var that=this;
      const props = {
            showUploadList: true,
            name: 'file',
            action: '/api/upload',
            headers: {'x-auth-token': auth.getToken()},
            onChange(info) {
               if (info.file.status == 'uploading') {
                    // that.setState({letValues:that.refs.addValues.getFieldsValue()});
                }
                if (info.file.status == 'done') {
                    that.setState({addUrl:info.file.response.text});
                } else if (info.file.status == 'error') {
                    Modal.error({
                        title: '上传失败',
                        content: (<p>{info.file.name}文件上传失败</p>)
                    });
                }
            },
            beforeUpload(file) {
                console.log("uploading...");
                // if (file.type.indexOf('image')<0) {
                //     message.error('只能上传图片类型文件');
                //     return false;
                // }
                // if (file.size>3145728) {
                //     message.error('文件大小不能超过3M');
                //     return false;
                // }
                return true;
            }
        };
    return (
      <div>
      <ButtonGroup>
        <Button type="primary" onClick={this.showModal}>上传语音</Button>
      </ButtonGroup>
        <Modal title="上传新语音"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        ><div style={{textAlign:"center"}}>
          <Row>
            <Col span={6} style={{textAlign:"right",padding:"10px"}}>标题：</Col>
            <Col span={18} style={{textAlign:"left"}}><Input ref="addBt" style={{width:"80%"}} /></Col>
          </Row>
          <Upload {...props}><Button >上传语音文件</Button></Upload>
          </div>
        </Modal>
        <Modal title="测试语音"
          visible={this.state.visibleTest}
          onOk={this.handleOkTest}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        ><div style={{textAlign:"center"}}>
          <Row>
            <Col span={6} style={{textAlign:"right",padding:"10px"}}>语音路径：</Col>
            <Col span={18} style={{textAlign:"left"}}><Input ref="test" style={{width:"80%"}} /></Col>
          </Row>
          <audio src={this.state.recURL} controls="controls">
          您的浏览器不支持 audio 标签。
          </audio>
          </div>
        </Modal>
      </div>
    );
  },
});
module.exports = uploadYY;