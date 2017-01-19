import React from 'react'
import { Button, Icon, Alert, Col, Row, Form, notification } from 'antd'
import Detail from 'component/msgDetail'
import config from 'common/configuration'
import req from 'common/request'
import Panel from 'component/compPanel'
import { jsonCopy, isEmptyObject } from 'common/utils'
import cloneDeep from 'lodash/cloneDeep';
import './style.css'

const c = React.createClass({
      getDefaultProps() {
        return {
            //接收的json数据中用来充当key的字段名
            keyCol: 'id',
            //数据来源api
            apiUrl:  config.URI_API_PROJECT+`/test`,
            //初始搜索条件
            defaultWhere: {},
            //栏目名称
            title: '文章发布'
        }
    },
    getInitialState() {
        return {
            data:''
        }
    },
    fetchData() {
        const {apiUrl} = this.props;
      
        req({
            url: apiUrl,
            method: 'GET',
        }).then(resp => {
          
			this.setState({ data: resp });
        
        }).catch(e => {
            notification.error({
                duration: 2,
                message: '数据读取失败',
                description: '网络访问故障，请尝试刷新页面'
            });
        })
    },
    componentDidMount() {
            this.fetchData();
       
    },
    render() {
        return <div className="mksz">
        <audio
            src={this.state.data}></audio>
        </div>
    }

});
module.exports = c;