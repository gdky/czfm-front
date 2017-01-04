import React from 'react'
import {Icon} from 'antd'
import './style.css'

const AppLogo = React.createClass({
    render(){
        return <div className="app-logo">
            <a href="/" className="logo-icon"><Icon type="solution" />&nbsp;税务师信息化系统</a>
            <span className="logo-small">ta.gd</span>
            </div>
    }
})

module.exports = AppLogo;