/**
 * 机构下拉选择器
 */
import React from 'react'
import {Select} from 'antd'
import config from 'common/configuration'
import req from 'reqwest'
import auth from 'common/auth'

const Option = Select.Option;
const API_URL = config.HOST+config.URI_API_PROJECT + '/jgselect';

const selectorJg = React.createClass({
    getInitialState() { //初始化State状态，使用传入参数
    return {
            data: [],//用于主查询
            where:{},
      };
    },
    
    fetch_jg(params ={}) {
      req({
            url: API_URL,//默认数据查询后台返回JSON
            method: 'get',
            type: 'json',
            data: params,
          headers: {'x-auth-token': auth.getToken()},
            success: (result) => {
                      if (result.data.length!=0) {
                              this.setState({
                                      data: result.data,//传入后台获取数据，table组件要求每条查询记录必须拥有字段'key'
                               });
                    }else{//空数据处理
                         this.setState({data: []});
                    };
            },
            error: (err) =>{alert('api错误');}
          });
        },

    componentDidMount() { //REACT提供懒加载方法，懒加载时使用，且方法名必须为componentDidMount
      this.fetch_jg(); //异步调用后台服务器方法fetch_rycx
    },

    getJgOptions(){
        const data = this.state.data; 
        const options = data.map(item=><Option key={item.id} value={item.id}>{item.mc}</Option>);
        return options;
    },

    render(){
        const options=this.getJgOptions();
        return <Select {...this.props} showSearch placeholder={this.props.placeholder} optionFilterProp="children" notFoundContent="无法找到" allowClear>
            {options}
        </Select>
    }
});

module.exports = selectorJg;