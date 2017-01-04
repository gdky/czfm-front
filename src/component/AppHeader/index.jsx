import React from 'react';
import {Icon} from 'antd';
import CompUserPanel from '../CompUserPanel';
import AppLogo from '../AppLogo'
import './style.css';
const AppHeader = React.createClass({
    render() {
        let className = 'app-header box-shadow '+ (this.props.className ||'');
        return (
            <header className={className}>
                <AppLogo/>
                <CompUserPanel data={this.props.data}/>
            </header>
        );
    }
});
module.exports = AppHeader;