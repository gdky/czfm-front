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
   if(!this.state.addUrl){
        message.error('请上传附件');
        return;
    }
   
    this.setState({
      visible: false,
    });
    this.props.uploadOk(this.state.addUrl)
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
        <Button size="large" onClick={this.showModal}>选择</Button>
      </ButtonGroup>
        <Modal title="上传附件"
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        ><div style={{textAlign:"center"}}>
          
          <Upload {...props}><Button >上传附件</Button></Upload>
          </div>
        </Modal>
      </div>
    );
  },
});
module.exports = uploadYY;