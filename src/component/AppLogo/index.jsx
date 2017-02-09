import React from 'react'
import {Icon} from 'antd'
import './style.css'

const AppLogo = React.createClass({
    render(){
        return <div className="app-logo">
            <a href="/" className="logo-icon"><Icon type="solution" />&nbsp;税务之声后台管理</a>
            </div>
    }
})

module.exports = AppLogo;