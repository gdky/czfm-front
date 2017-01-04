/**
 * 空白包裹框组件
 * @props.data {Object} 实体数据集
 */
import React from 'react'
import './style.css'

const c = React.createClass({

    render(){
        let className = this.props.className + " comp-container";
        return <div className={className}>
            {this.props.children}
        </div>
    }
});

module.exports = c;