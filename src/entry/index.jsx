import '../common/lib';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHistory, createHashHistory } from 'history'
import App from '../component/App';
import Signin from 'module/signin';
import { home } from '../module/home';
import NotFound from 'module/404notfound'
import auth from 'common/auth'

//使用browserHistory需要预设basename
const history = useRouterHistory(createHashHistory)({
    basename: '/'
});

const Index = React.createClass({

    /*登录校验*/
    requireAuth(nextState, replace) {
        /*if (!auth.verifyPermission(nextState.location.pathname)) {
         replace({
         pathname: '/404',
         state: {nextPathname: nextState.location.pathname}
         })
         }*/
        if (!auth.verifyAuth()) {
            replace({
                pathname: '/signin',
                state: { nextPathname: nextState.location.pathname }
            })
        }
    },

    render() {
        /*路由配置*/
        const routes = [{
            path: '/',
            component: App,
            indexRoute: { component: home },
            ignoreScrollBehavior: true,
            breadcrumbName: '首页',
            onEnter: this.requireAuth,
            childRoutes: [
                /* 模块预加载方式
                 { path: '/gn1(/)', component: gn1 },
                 */


                //系统功能设置
                require('../module/xtgnsz/mkgl'),
                require('../module/xtgnsz/qxgl'),
                require('../module/xtgnsz/yhgl'),
                require('../module/xtgnsz/yhdljlb'),


                //站内短信
                require('../module/zndx'),

                //公用功能
                //修改密码
                require('../module/updatepass')
            ]
        }, {
            path: '/signin',
            component: Signin
        },{
            path: '*',
            component: NotFound
        }];
        return <Router history={history} routes={routes} />
    }
});
ReactDOM.render(<Index />, document.getElementById('app'));



