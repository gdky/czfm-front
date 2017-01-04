import React from 'react'
import LoginForm from './loginForm'
import req from 'reqwest'
import config from 'common/configuration'
import store from 'store2'
import {withRouter} from 'react-router'
import {Alert,Icon} from 'antd'
import auth from 'common/auth'

const API_URL = config.HOST + config.URI_API_FRAMEWORK + '/auth';

const signin = withRouter(React.createClass({
    getInitialState(){
        return {
            loading: false,
            authFail: false,
            authFailMes: ''
        }
    },
    handleLogin(param){
        this.props.onLogin(param)
    },

    handleSubmit(value){
        this.setState({loading: true});
        req({
            url: API_URL,
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify(value)
        }).then(resp=> {
            auth.setToken(resp.token, resp.tokenhash, value.isRemember);
            auth.setAuthorization({
                jgId: resp.jgId,
                menu: resp.menu,
                role: resp.lo,
                names:resp.names
            });
            const { location } = this.props;
            if (location.state && location.state.nextPathname) {
                this.props.router.replace(location.state.nextPathname)
            } else {
                this.props.router.replace('/')
            }

        }).fail((e)=> {
            let errMsg;
            if (e.status == 401 || e.status == 403) {
                errMsg = JSON.parse(e.response).text
            } else {
                errMsg = "登录失败";
            }
            this.setState({
                loading: false,
                authFail: true,
                authFailMes: errMsg
            });
        })

    },
    componentWillMount(){
        if (auth.getToken()) {
            this.props.router.replace('/')
        }
    },
    render(){
        return <div className="sign-in">
            <div className="header">
                <div className="logo">
                    <h1>
                        <Icon type="area-chart"/>
                        广东省税务师行业管理信息化系统
                    </h1>
                </div>
            </div>
            <LoginForm onSubmit={this.handleSubmit} loading={this.state.loading}/>
            <div className="feedback">
                {this.state.authFail &&
                <Alert
                  message={this.state.authFailMes}
                  type="error" showIcon/>}
            </div>
            <div className="footer">
                <div className="copyright"><span>广东科溢 © 2016  内测版ver.0.9</span></div>
            </div>
        </div>
    }
}));


module.exports = signin;