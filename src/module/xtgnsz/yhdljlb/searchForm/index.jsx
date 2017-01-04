import React from 'react'
import {Row,Col,Form,Button,Input,Modal,DatePicker} from 'antd'
import {SelectorZT,SelectorYear,SelectorXZ,SelectorLogRole} from 'component/compSelector'

import './style.css'

const FormItem = Form.Item;
const createForm = Form.create;
const RangePicker = DatePicker.RangePicker;

let searchForm = React.createClass({
    getDefaultProps(){
        return {
            onSubmit: {}
        }
    },
    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    },
    handleSubmit(e){
        e.preventDefault();
        let value = this.props.form.getFieldsValue();
        this.props.onSubmit(value);
    },
 disabledStartDate(rule, value, callback) {//日期校验规则方法
     const form = this.props.form;
     if (value && value.getTime() >= Date.now()) {
      callback(new Error('这是个将来的时间'));
    } else if (form.getFieldValue('dlsj2')) {
       if (value.getTime() > form.getFieldValue('dlsj2').getTime() ) {
      callback(new Error('最小时间大于最大时间'));
    } else {
      callback();
    }
     }else {
      callback();
    };
 
  },
  disabledEndDate(rule, value, callback) {//日期校验规则方法
    const form = this.props.form;
    if (form.getFieldValue('dlsj')) {
       if (value&&value.getTime() < form.getFieldValue('dlsj').getTime() ) {
      callback(new Error('最大时间小于最小时间'));
    }else {
      callback();
    }
    }else {
      callback();
    };
  },



    render(){
        const { getFieldProps } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const formItemLayout2 = {//表单样式2
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const dlsj = getFieldProps('dlsj', {//设置日期输入组件校验规则
      rules: [
        { 
           require:true,  type: 'date',message:"请选择一个时间"  
         },{
          validator: this.disabledStartDate,
        }
      ]
    });
       const dlsj2 = getFieldProps('dlsj2', {//设置日期输入组件校验规则
      rules: [
        {
        require:true,  type: 'date',message:"请选择一个时间" 
           },
        { validator: this.disabledEndDate, }
      ]
    });


        return <div className="search-form">
            <Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>
                <Row>
                   
                   
                    <Col span="8">
                        <FormItem
                          {...formItemLayout}
                          label="用户名：">
                            <Input { ...getFieldProps('name')} placeholder='请输入要查找的用户名：'/>
                        </FormItem>
                    </Col>
                     <Col span="8">
                        <FormItem
                          {...formItemLayout}
                          label="登录IP：">
                            <Input { ...getFieldProps('ACCESS_IP')} placeholder='请输入要查找的登录ip：'/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem
                          {...formItemLayout}
                          label="角色：">
                            <SelectorLogRole { ...getFieldProps('DESCRIPTION')}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
               <Col span="16">
                        <FormItem
                              label="登陆时间："
                              {...formItemLayout2}>
                                <Col span="8">
                                <FormItem>
                                <DatePicker id="clsj1"  placeholder="请选择日期" {...dlsj} /></FormItem>
                                </Col>
                                <Col span="2">
                                  <p className="ant-form-split">至</p>
                                </Col>
                                <Col span="8">
                                 <FormItem>
                                    <DatePicker id="clsj2" placeholder="请选择日期"  {...dlsj2} /></FormItem>
                                </Col>
                            </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="2" offset="20"><Button type="primary" htmlType="submit">查询</Button></Col>
                    <Col span="2"><Button type="ghost" onClick={this.handleReset}>重置</Button></Col>
                </Row>
            </Form>
        </div>
    }
});
searchForm = createForm()(searchForm);

module.exports = searchForm;