import React from 'react'
import { Button, Icon, Alert, Col, Row, Form, notification } from 'antd'
import Detail from 'component/msgDetail'
import config from 'common/configuration'
import req from 'reqwest'
import Panel from 'component/compPanel'
import { jsonCopy, isEmptyObject } from 'common/utils'
import cloneDeep from 'lodash/cloneDeep';
import './style.css'
import auth from 'common/auth'

const c = React.createClass({
    getInitialState() {
        return {
            access_token: ''
        }
    },
    fetchData() {
       // const {apiUrl, grant_type, client_id, client_secret} = this.props;
        let apiUrl= 'http://tsn.baidu.com/text2audio';
        let params = {
           tex: '许发森',
            lan: 'zh',
            tok: '24.169f669ce58e2817c507abdb8f436fd4.2592000.1487317967.282335-9217047',
            ctp:'1',
            cuid:'xfs'
        }
        
        req({
            url: apiUrl,
            method: 'post',
            data: encodeURI(encodeURI(JSON.stringify(params))),
            headers: {'x-auth-token': auth.getToken()}
        }).then(resp => {
            console.log(resp)
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
        </div>
    }

});
module.exports = c;